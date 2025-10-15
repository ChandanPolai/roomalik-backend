// controllers/dashboardController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');

// ✅ Home Dashboard Data
const getDashboardData = asyncHandler(async (req, res) => {
  const adminId = req.admin._id;
  
  // Get all plots owned by admin
  const plots = await model.Plot.find({ ownerId: adminId });
  const plotIds = plots.map(plot => plot._id);

  // Get all rooms in these plots
  const rooms = await model.Room.find({ plotId: { $in: plotIds } });
  const roomIds = rooms.map(room => room._id);

  // Get tenants
  const tenants = await model.Tenant.find({ 
    plotId: { $in: plotIds },
    roomId: { $in: roomIds }
  });

  // Current date
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  // Next 7 days
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  // Today's due rents
  const todaysRents = await model.Rent.find({
    dueDate: { $gte: todayStart, $lte: todayEnd },
    status: { $in: ['pending', 'partial'] },
    roomId: { $in: roomIds }
  }).populate('tenantId roomId');

  // Upcoming rents (next 7 days)
  const upcomingRents = await model.Rent.find({
    dueDate: { $gt: todayEnd, $lte: nextWeek },
    status: 'pending',
    roomId: { $in: roomIds }
  }).populate('tenantId roomId');

  // Overdue rents
  const overdueRents = await model.Rent.find({
    dueDate: { $lt: todayStart },
    status: { $in: ['pending', 'partial'] },
    roomId: { $in: roomIds }
  }).populate('tenantId roomId');

  // Recent payments
  const recentPayments = await model.Payment.find({ 
    tenantId: { $in: tenants.map(t => t._id) }
  })
  .sort({ createdAt: -1 })
  .limit(5)
  .populate('tenantId');

  // Notifications
  const notifications = await model.Notification.find({ 
    userId: adminId 
  })
  .sort({ createdAt: -1 })
  .limit(10);

  // Dashboard statistics
  const totalPlots = plots.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
  const availableRooms = rooms.filter(room => room.status === 'available').length;

  // Current month rents summary
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const currentMonthRents = await model.Rent.find({
    dueDate: { $gte: currentMonthStart, $lte: currentMonthEnd },
    roomId: { $in: roomIds }
  });

  const totalRentDue = currentMonthRents.reduce((sum, rent) => sum + rent.totalAmount, 0);
  const totalRentCollected = currentMonthRents.reduce((sum, rent) => sum + rent.paidAmount, 0);
  const pendingRent = totalRentDue - totalRentCollected;

  const dashboardData = {
    overview: {
      totalPlots,
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalTenants: tenants.length,
    },
    finances: {
      totalRentDue,
      totalRentCollected,
      pendingRent,
      totalOverdue: overdueRents.reduce((sum, rent) => sum + rent.pendingAmount, 0),
      collectionRate: totalRentDue > 0 ? ((totalRentCollected / totalRentDue) * 100).toFixed(2) : 0,
    },
    todaysRents: todaysRents.map(rent => ({
      _id: rent._id,
      tenantName: rent.tenantId.name,
      roomNumber: rent.roomId.number,
      dueDate: rent.dueDate,
      totalAmount: rent.totalAmount,
      paidAmount: rent.paidAmount,
      pendingAmount: rent.pendingAmount,
      status: rent.status,
    })),
    upcomingRents: upcomingRents.map(rent => ({
      _id: rent._id,
      tenantName: rent.tenantId.name,
      roomNumber: rent.roomId.number,
      dueDate: rent.dueDate,
      totalAmount: rent.totalAmount,
      daysLeft: Math.ceil((rent.dueDate - today) / (1000 * 60 * 60 * 24)),
    })),
    overdueRents: overdueRents.map(rent => ({
      _id: rent._id,
      tenantName: rent.tenantId.name,
      roomNumber: rent.roomId.number,
      dueDate: rent.dueDate,
      totalAmount: rent.totalAmount,
      pendingAmount: rent.pendingAmount,
      overdueDays: Math.ceil((today - rent.dueDate) / (1000 * 60 * 60 * 24)),
    })),
    recentActivities: recentPayments.map(payment => ({
      type: 'payment',
      tenantName: payment.tenantId.name,
      amount: payment.amount,
      date: payment.createdAt,
      status: payment.status,
    })),
    notifications: notifications.map(notif => ({
      _id: notif._id,
      type: notif.type,
      message: notif.message,
      date: notif.createdAt,
      read: notif.read,
    })),
  };

  return sendResponse(res, HTTP_STATUS.OK, dashboardData, 'Dashboard data retrieved successfully');
});

module.exports = {
  getDashboardData,
};