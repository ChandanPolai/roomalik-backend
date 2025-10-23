const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const moment = require('moment');

// Normalize file path
const normalizePath = (p) => (
    p
        ? String(p)
            .replace(/\\/g, '/')
            .replace(/^\.*\/*/, '')
        : ''
);

// ✅ Dashboard API - Shows upcoming rent payments (EMI style)
const getDashboard = asyncHandler(async (req, res) => {
  // Get all plots owned by admin
  const plots = await model.Plot.find({ ownerId: req.admin._id });
  const plotIds = plots.map(p => p._id);

  // Get all tenants from these plots
  const tenants = await model.Tenant.find({ plotId: { $in: plotIds } })
    .populate('roomId')
    .populate('plotId');

  const dashboardData = [];

  // Group tenants by plot
  for (const plot of plots) {
    const plotTenants = tenants.filter(t => t.plotId._id.toString() === plot._id.toString());
    
    if (plotTenants.length === 0) {
      continue; // Skip plots with no tenants
    }

    const roomsData = {};
    
    // Group tenants by room
    for (const tenant of plotTenants) {
      const agreementStart = moment(tenant.agreement.start);
      const agreementEnd = moment(tenant.agreement.end);
      const currentMonth = moment();
      
      // Only show tenants whose agreement is active
      if (currentMonth.isAfter(agreementEnd) || currentMonth.isBefore(agreementStart)) {
        continue;
      }

      const roomId = tenant.roomId._id.toString();
      
      // Initialize room if not exists
      if (!roomsData[roomId]) {
        roomsData[roomId] = {
          room: {
            id: tenant.roomId._id,
            number: tenant.roomId.number,
            type: tenant.roomId.type,
            rent: tenant.roomId.rent,
          },
          tenant: null,
        };
      }

      // Generate rent schedule for remaining months
      const rentSchedule = [];
      let checkMonth = currentMonth.isBefore(agreementStart) ? agreementStart : currentMonth;
      
      while (checkMonth.isSameOrBefore(agreementEnd)) {
        const monthKey = checkMonth.format('YYYY-MM');
        const dueDate = checkMonth.clone().date(1); // First day of the month
        
        // Check if payment already exists
        const existingPayment = await model.Payment.findOne({
          tenantId: tenant._id,
          month: monthKey
        });

        const paymentStatus = existingPayment ? existingPayment.status : 'pending';

        // Only show upcoming payments (not yet paid)
        if (paymentStatus === 'pending' || paymentStatus === 'overdue') {
          rentSchedule.push({
            month: monthKey,
            monthName: checkMonth.format('MMMM YYYY'),
            dueDate: dueDate.toDate(),
            amount: tenant.finances.rent,
            status: paymentStatus,
            paymentId: existingPayment ? existingPayment._id : null,
          });
        }

        checkMonth.add(1, 'month');
      }

      // Only include tenant if there are pending payments
      if (rentSchedule.length > 0) {
        roomsData[roomId].tenant = {
          tenant: {
            id: tenant._id,
            name: tenant.name,
            mobile: tenant.mobile,
            email: tenant.email,
          },
          agreement: {
            start: tenant.agreement.start,
            end: tenant.agreement.end,
          },
          rentSchedule: rentSchedule,
          totalPending: rentSchedule.reduce((sum, item) => sum + item.amount, 0),
        };
      }
    }

    // Only add plot if it has rooms with tenants having pending payments
    const roomsArray = Object.values(roomsData).filter(room => room.tenant !== null);
    
    if (roomsArray.length > 0) {
      dashboardData.push({
        plot: {
          id: plot._id,
          name: plot.name,
          address: plot.address,
        },
        rooms: roomsArray,
      });
    }
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    totalPlots: plots.length,
    totalTenants: tenants.length,
    dashboard: dashboardData,
  }, 'Dashboard data retrieved successfully');
});

// ✅ Update Payment Status (mark as paid)
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId, paymentMode, remarks } = req.body;

  // Validate payment exists
  const payment = await model.Payment.findById(paymentId);
  if (!payment) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Payment not found');
  }

  // Verify ownership
  const plot = await model.Plot.findById(payment.plotId);
  if (plot.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Handle payment proof image upload
  let paymentProof = payment.paymentProof;
  if (req.files && req.files.paymentProof && req.files.paymentProof[0]) {
    paymentProof = normalizePath(req.files.paymentProof[0].path);
  }

  // Update payment status
  payment.status = 'paid';
  payment.paymentDate = new Date();
  payment.paymentMode = paymentMode || 'cash';
  payment.paymentProof = paymentProof;
  if (remarks) payment.remarks = remarks;
  payment.updatedAt = new Date();

  await payment.save();

  return sendResponse(res, HTTP_STATUS.OK, payment, 'Payment status updated successfully');
});

// ✅ Generate Payment Records (Auto-generate for all tenants)
const generatePayments = asyncHandler(async (req, res) => {
  const plots = await model.Plot.find({ ownerId: req.admin._id });
  const plotIds = plots.map(p => p._id);

  const tenants = await model.Tenant.find({ plotId: { $in: plotIds } });

  let created = 0;
  let updated = 0;

  for (const tenant of tenants) {
    const agreementStart = moment(tenant.agreement.start);
    const agreementEnd = moment(tenant.agreement.end);
    const currentMonth = moment();
    
    // Skip if agreement not active
    if (currentMonth.isAfter(agreementEnd) || currentMonth.isBefore(agreementStart)) {
      continue;
    }

    // Generate payments for all months
    let checkMonth = agreementStart.clone();
    
    while (checkMonth.isSameOrBefore(agreementEnd)) {
      const monthKey = checkMonth.format('YYYY-MM');
      const dueDate = checkMonth.clone().date(1);
      
      // Check if already exists
      const existingPayment = await model.Payment.findOne({
        tenantId: tenant._id,
        month: monthKey
      });

      if (existingPayment) {
        // Update due date if needed
        if (!existingPayment.dueDate) {
          existingPayment.dueDate = dueDate.toDate();
          await existingPayment.save();
          updated++;
        }
        checkMonth.add(1, 'month');
        continue;
      }

      // Create new payment record
      const payment = new model.Payment({
        tenantId: tenant._id,
        roomId: tenant.roomId,
        plotId: tenant.plotId,
        amount: tenant.finances.rent,
        month: monthKey,
        dueDate: dueDate.toDate(),
        status: 'pending',
      });

      await payment.save();
      created++;
      checkMonth.add(1, 'month');
    }
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    created,
    updated,
    message: 'Payment records generated successfully'
  }, 'Payments generated');
});

// ✅ Get Earnings Report
const getEarnings = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  
  const plots = await model.Plot.find({ ownerId: req.admin._id });
  const plotIds = plots.map(p => p._id);

  // Build query
  const query = { plotId: { $in: plotIds }, status: 'paid' };

  if (month && year) {
    query.month = `${year}-${month.padStart(2, '0')}`;
  } else if (year) {
    query.month = new RegExp(`^${year}-`);
  }

  const payments = await model.Payment.find(query)
    .populate('tenantId', 'name mobile email')
    .populate('roomId', 'number type')
    .populate('plotId', 'name');

  // Calculate total earnings
  const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Group by plot
  const earningsByPlot = {};
  payments.forEach(payment => {
    const plotId = payment.plotId._id.toString();
    if (!earningsByPlot[plotId]) {
      earningsByPlot[plotId] = {
        plot: payment.plotId.name,
        rooms: {},
        total: 0,
      };
    }

    const roomId = payment.roomId._id.toString();
    if (!earningsByPlot[plotId].rooms[roomId]) {
      earningsByPlot[plotId].rooms[roomId] = {
        room: payment.roomId.number,
        type: payment.roomId.type,
        tenant: null,
        total: 0,
      };
    }

    const tenantId = payment.tenantId._id.toString();
    
    // Set tenant info if not already set
    if (!earningsByPlot[plotId].rooms[roomId].tenant) {
      earningsByPlot[plotId].rooms[roomId].tenant = {
        tenant: payment.tenantId.name,
        mobile: payment.tenantId.mobile,
        payments: [],
        total: 0,
      };
    }

    earningsByPlot[plotId].rooms[roomId].tenant.payments.push({
      month: payment.month,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMode: payment.paymentMode,
    });

    earningsByPlot[plotId].rooms[roomId].tenant.total += payment.amount;
    earningsByPlot[plotId].rooms[roomId].total += payment.amount;
    earningsByPlot[plotId].total += payment.amount;
  });

  // Convert to array format
  const earningsData = Object.values(earningsByPlot).map(plot => ({
    plot: plot.plot,
    rooms: Object.values(plot.rooms).map(room => ({
      room: room.room,
      type: room.type,
      tenant: room.tenant ? {
        tenant: room.tenant.tenant,
        mobile: room.tenant.mobile,
        payments: room.tenant.payments,
        total: room.tenant.total,
      } : null,
      total: room.total,
    })),
    total: plot.total,
  }));

  return sendResponse(res, HTTP_STATUS.OK, {
    totalEarnings,
    earnings: earningsData,
    totalPayments: payments.length,
  }, 'Earnings retrieved successfully');
});

module.exports = {
  getDashboard,
  updatePaymentStatus,
  generatePayments,
  getEarnings,
};

