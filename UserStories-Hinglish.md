hey meri baat ko dhyan se suno thik henaa 
me ek project banan rahah hu jiksa name he roomalik samamj gayenaa mene apko
--> model , controller , routes share kiya he ki me kese code likhta hu smamaj agyenaa bhai pplease 
mera project complete hone ko a raha he bas kuch hi kam baki he samamaj gayenaa please meri henaa aap help kardo 
sayad kuch hi apis lagenengi thik he samamj gayenaa please help kardo api dedo 
and may be sayad kuch models bagera add hogi to kardena smamaj gayenaa 


my main focus jo ki mene kardiya he 
-> plots , rooms , tenets ka crud add update sab kuch ho chuka he thik he abhio apko kya karna he samamjlo meri baat ko thik h naa 


1) jaise me he naa mobile apk banan rahah hu 
dashboad section ke liye api chaiye jaise ki sayayd 2 apis se ho jayega smamaj gayenaa jaise ki 


menetents ko add kardiya uska aggrent details bhi dal diya he start dat eenddate aap dkh sakte ho smamaj gayenaa bhai 
ab kiya he naa jab mene wo date ad kardi us dun se uska room chalu ho jayega forir wahi date jab next month ayega naa tab he naa uska yaar bahahda dena rkahgea jaise ki mali emi ki tahaha sysyatem smamaj agyenaa sare month ke kitna kitna b ahda dena date ke sath details a jayegi smamaj gayenaa bhai 


data kesa chaiye : {
   plot ka name 
   {uske anandr ka romm fir uske anandr ka jo tents higa uska detail me name bahda dene ki date add bahahda smamaj agyenaa }
}

{
   plot :{
      room :{
         temts:
      }
   },
   senoc plot when that is avavik,e when evevre is lote ka roomme agagr koi badha wlal ho uska date ho to karo msmaj gayena 
   moments.js ka use karlo ok please 
}

main points :
-----------------
sabhi ka esa hi ayega smamj gyenaa simple bas itna sa kam he aur ek api banangei jaise ki me status update karu usne agag rpay kardiay he to uska ekphtho daldu and usne konsa payemnt odelkiya aur status update kardunga ki is month ka usne pay kardiya he smmajagayenaa simple.

main chij he naa mere dash baord ke api ke lakr henaa manli usne is month ka pay kardiya he to usak agagle moth ka data show hona choye agagle moth uska itna pay karna he smmaj gayenaa emi jaise syaytem smamaj gayenaa 



ek earning ka bhi henaa screen bana raha hu samamaj gayenaa mere bhai usme henaa 
jiaseis moth me kitna eeraing hua mighe konse plots ke konse room me se konse tents se kitna mila he totoal amont is mahine kitna auya uska data wo dek paye smamaj gayenaa please ek api se ho jaega may be admin kohe naa kuch bhi nahi karna he auto matilly bakcend se henaa sab kuch hiona choaye jaise ki yaar 

rent kab dega emi staytem se pura data sab kuc h milna choaye smamaj gayenaa bhai please ficnial balalbhi api cll akrega us dhiakeg ais mahine ki kakamami aggar nahi hoga datakuch bhi nahi ilega wo flier lagag sakta he moth wise year wise smamaj agyenaa fir bhi us current yar ke har moth ka clalaute data mil janna chaoye ek api me bad me wo jaise bhi filter laegye smamaj gayenaa bhai please itna sa kam he karo code dedo add kardo 




muskilse muskil mere hisab se 4 se 5 api laegi ek dash baord ki ek ficnial ki ek status update ki ki me update karpanu usne pay kardiya heto kese kiya ek img uplaodkardu smamaj agyenaa bhai 



--------------------------------------------------------------

models :
// models/admin.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 10,
  },
  avatar: {
    type: String, // URL to image (Cloudinary/AWS S3)
    default: '',
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String, // For refresh token mechanism
  },
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;// models/plot.model.js
const { required } = require('joi');
const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    street: { type: String,  trim: true },
    city: { type: String,  trim: true },
    state: { type: String,  trim: true },
    country: { type: String,  trim: true },
    pincode: { type: String,  trim: true },
  },
  totalArea: {
    type: Number, // In square feet
    
  },
  constructionYear: {
    type: Number,
  },
  images: [{
    url: { type: String, required: true }, // Cloudinary/AWS S3 URL
    caption: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
  facilities: [{
    type: String, // e.g., parking, water supply, electricity backup
    trim: true,
  }],
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Plot = mongoose.model('Plot', plotSchema);
module.exports = Plot;// models/room.model.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: Number, // In square feet
    required: true,
  },
  type: {
    type: String, // e.g., 1BHK, 2BHK, Single
    required: true,
    trim: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
    required: true,
  },
  furnished: {
    type: String,
    enum: ['furnished', 'semi-furnished', 'unfurnished'],
    required: true,
  },
  floor: {
    type: Number,
  },
  facing: {
    type: String, // e.g., east, west
    trim: true,
  },
  images: [{
    url: { type: String, required: true }, // Cloudinary/AWS S3 URL
    caption: { type: String, trim: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
  amenities: [{
    type: String, // e.g., AC, WiFi, TV
    trim: true,
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available',
  },
  plotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plot',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;// models/tenant.model.js
const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  addresses: {
    permanent: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    current: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
  },
  emergency: {
    name: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
  },
  profession: {
    occupation: { type: String, trim: true },
    officeAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
  },
  ids: {
    aadhar: {
      front: { type: String }, // Image URL
      back: { type: String }, // Image URL
    },
    pan: { type: String }, // Image URL
    photo: { type: String }, // Passport-size photo URL
    others: [{ url: { type: String }, type: { type: String } }],
  },
  family: [{
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    relation: { type: String, required: true, trim: true },
    photo: { type: String }, // Image URL
    contact: { type: String, trim: true },
  }],
  agreement: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    document: { type: String }, // PDF/Image URL
    termsAccepted: { type: Boolean, default: false },
  },
  finances: {
    rent: { type: Number, required: true },
    billType: {
      type: String,
      enum: ['included', 'separate'],
      default: 'separate',
    },
    additionalCharges: [{
      type: String, // e.g., parking, maintenance
      amount: Number,
    }],
    paymentMode: {
      type: String,
      enum: ['cash', 'online', 'cheque'],
      default: 'cash',
    },
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  plotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plot',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tenant = mongoose.model('Tenant', tenantSchema);
module.exports = Tenant;// models/zindex.js
const Admin = require('./admin.model');
const Plot = require('./plot.model');
const Room = require('./room.model');
const Tenant = require('./tenant.model');


module.exports = {
  Admin,
  Plot,
  Room,
  Tenant,
};
// controllers/tenantController.js
const asyncHandler = require('express-async-handler');
const model = require('../models/zindex');
const { HTTP_STATUS, sendResponse, sendError } = require('../utils/httpUtils');
const { createTenantSchema, updateTenantSchema } = require('./validators/index');
const parseJsonFields = require('../utils/parseJsonFields');

// Normalize file path
const normalizePath = (p) => (
    p
        ? String(p)
            .replace(/\\/g, '/')
            .replace(/^\.*\/*/, '')
        : ''
);

// ✅ Create Tenant WITH DOCUMENTS
const createTenant = asyncHandler(async (req, res) => {
  req.body = parseJsonFields(req.body);
  // const { error } = createTenantSchema.validate(req.body);
  // if (error) {
  //   return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  // }

  const { name, mobile, email, addresses, emergency, profession, family, agreement, finances, roomId, plotId } = req.body;

  // Verify room ownership and availability
  const room = await model.Room.findById(roomId).populate('plotId');
  if (!room || room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Invalid or unauthorized room');
  }
  if (room.status !== 'available') {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Room is not available');
  }

  // Handle uploaded documents
  const ids = {};
  
  if (req.files) {
    // Aadhar documents
    if (req.files.aadharFront && req.files.aadharFront[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.front = normalizePath(req.files.aadharFront[0].path);
    }
    if (req.files.aadharBack && req.files.aadharBack[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.back = normalizePath(req.files.aadharBack[0].path);
    }
    
    // PAN card
    if (req.files.pan && req.files.pan[0]) {
      ids.pan = normalizePath(req.files.pan[0].path);
    }
    
    // Tenant photo
    if (req.files.photo && req.files.photo[0]) {
      ids.photo = normalizePath(req.files.photo[0].path);
    }
    
    // Other documents
    if (req.files.others && req.files.others.length > 0) {
      ids.others = req.files.others.map((file, index) => ({
        url: normalizePath(file.path),
        type: req.body.otherTypes ? req.body.otherTypes[index] : 'other',
      }));
    }
  }

  // Handle agreement document
  let agreementData = agreement;
  if (req.files && req.files.agreement && req.files.agreement[0]) {
    agreementData = {
      ...agreement,
      document: normalizePath(req.files.agreement[0].path)
    };
  }

  // Handle family photos
  let familyData = family;
  if (req.files && req.files.familyPhotos && req.files.familyPhotos.length > 0) {
    familyData = family.map((member, index) => ({
      ...member,
      photo: req.files.familyPhotos[index] ? normalizePath(req.files.familyPhotos[index].path) : member.photo
    }));
  }

  const tenant = new model.Tenant({
    name,
    mobile,
    email,
    addresses,
    emergency,
    profession,
    ids,
    family: familyData,
    agreement: agreementData,
    finances,
    roomId,
    plotId,
  });

  // Update room status
  room.status = 'occupied';
  await room.save();
  await tenant.save();

  // Create notification
  const notification = new model.Notification({
    type: 'new_tenant',
    message: `New tenant ${name} added to room ${room.number}`,
    userId: req.admin._id,
  });
  await notification.save();

  return sendResponse(res, HTTP_STATUS.CREATED, tenant, 'Tenant created successfully');
});

// ✅ Get All Tenants
// const getAllTenants = asyncHandler(async (req, res) => {
//   const tenants = await model.Tenant.find({
//     plotId: { $in: await model.Plot.find({ ownerId: req.admin._id }).distinct('_id') },
//   }).populate('roomId plotId');
//   return sendResponse(res, HTTP_STATUS.OK, tenants, 'Tenants retrieved successfully');
// });

// ✅ Get All Tenants with Filters
const getAllTenants = asyncHandler(async (req, res) => {
  const { plotId, roomId } = req.query;
  
  // Step 1: Admin ke saare plots ki IDs
  const adminPlotIds = await model.Plot.find({ ownerId: req.admin._id }).distinct('_id');
  
  // Step 2: Basic query - admin ke saare plots ke tenants
  const query = { 
    plotId: { $in: adminPlotIds } 
  };
  
  // Step 3: Agar plotId diya hai toh SIRF us plot ke tenants
  if (plotId) query.plotId = plotId;
  
  // Step 4: Agar roomId diya hai toh SIRF us room ka tenant
  if (roomId) query.roomId = roomId;

  const tenants = await model.Tenant.find(query)
    .populate('roomId')
    .populate('plotId');
    
  return sendResponse(res, HTTP_STATUS.OK, tenants, 'Tenants retrieved successfully');
});

// ✅ Get Tenant by ID
const getTenantById = asyncHandler(async (req, res) => {
  const tenant = await model.Tenant.findById(req.params.id).populate('roomId plotId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  
  const room = await model.Room.findById(tenant.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }
  return sendResponse(res, HTTP_STATUS.OK, tenant, 'Tenant retrieved successfully');
});

// ✅ Update Tenant WITH NEW DOCUMENTS
const updateTenant = asyncHandler(async (req, res) => {
    req.body = parseJsonFields(req.body);
  // const { error } = updateTenantSchema.validate(req.body);
  // if (error) {
  //   return sendError(res, HTTP_STATUS.BAD_REQUEST, error.details[0].message);
  // }

  const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  
  const room = await model.Room.findById(tenant.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Update basic fields
  Object.assign(tenant, req.body);

  // Handle new uploaded documents
  if (req.files) {
    const ids = tenant.ids || {};
    
    // Update Aadhar documents
    if (req.files.aadharFront && req.files.aadharFront[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.front = normalizePath(req.files.aadharFront[0].path);
    }
    if (req.files.aadharBack && req.files.aadharBack[0]) {
      ids.aadhar = ids.aadhar || {};
      ids.aadhar.back = normalizePath(req.files.aadharBack[0].path);
    }
    
    // Update PAN card
    if (req.files.pan && req.files.pan[0]) {
      ids.pan = normalizePath(req.files.pan[0].path);
    }
    
    // Update photo
    if (req.files.photo && req.files.photo[0]) {
      ids.photo = normalizePath(req.files.photo[0].path);
    }
    
    // Update other documents
    if (req.files.others && req.files.others.length > 0) {
      const newOthers = req.files.others.map((file, index) => ({
        url: normalizePath(file.path),
        type: req.body.otherTypes ? req.body.otherTypes[index] : 'other',
      }));
      ids.others = [...(ids.others || []), ...newOthers];
    }
    
    tenant.ids = ids;

    // Update agreement document
    if (req.files.agreement && req.files.agreement[0]) {
      tenant.agreement.document = normalizePath(req.files.agreement[0].path);
    }

    // Update family photos
    if (req.files.familyPhotos && req.files.familyPhotos.length > 0) {
      tenant.family = tenant.family.map((member, index) => ({
        ...member,
        photo: req.files.familyPhotos[index] ? normalizePath(req.files.familyPhotos[index].path) : member.photo
      }));
    }
  }

  await tenant.save();
  return sendResponse(res, HTTP_STATUS.OK, tenant, 'Tenant updated successfully');
});

// ✅ Delete Tenant
const deleteTenant = asyncHandler(async (req, res) => {
  const tenant = await model.Tenant.findById(req.params.id).populate('roomId');
  if (!tenant) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, 'Tenant not found');
  }
  
  const room = await model.Room.findById(tenant.roomId).populate('plotId');
  if (room.plotId.ownerId.toString() !== req.admin._id.toString()) {
    return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Not authorized');
  }

  // Make room available again
  room.status = 'available';
  await room.save();

  await tenant.deleteOne();
  return sendResponse(res, HTTP_STATUS.OK, null, 'Tenant deleted successfully');
});

module.exports = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  changePassword,
  getProfile,
  updateProfile,
  resetPassword,

  createPlot,
  getAllPlots,
  getPlotById,
  updatePlot,
  deletePlot,

  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,

  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,

} = require('../controllers/index');


const { uploader } = require('../middleware/files'); // Import uploader
// ✅ Plot Image Uploader
const plotImageUploader = uploader('plots');
const roomImageUploader = uploader('rooms');
const tenantDocUploader = uploader('tenants'); 
const adminAvatarUploader = uploader('admins');

// ✅ Public Routes (Auth) - No Authentication Required
router.post('/auth/register', adminAvatarUploader.single('avatar'), registerAdmin);
router.post('/auth/login', loginAdmin);
router.post('/auth/logout', logoutAdmin);
router.post('/auth/reset-password', resetPassword);

// ✅ Protected Routes (Require Authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, adminAvatarUploader.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);

// ✅✅ Plot Routes WITH IMAGE UPLOAD
router.post('/plots', protect, plotImageUploader.array('images', 10), createPlot); // Max 10 images
router.get('/plots', protect, getAllPlots);
router.get('/plots/:id', protect, getPlotById);
router.put('/plots/:id', protect, plotImageUploader.array('images', 10), updatePlot); // Update with new images
router.delete('/plots/:id', protect, deletePlot);

// ✅✅ Room Routes WITH IMAGE UPLOAD
router.post('/rooms', protect, roomImageUploader.array('images', 10), createRoom); // Create with images
router.get('/rooms', protect, getAllRooms);
router.get('/rooms/:id', protect, getRoomById);
router.put('/rooms/:id', protect, roomImageUploader.array('images', 10), updateRoom); // Update with images
router.delete('/rooms/:id', protect, deleteRoom);

// ✅✅ Tenant Routes WITH DOCUMENT UPLOAD
router.post(
  '/tenants',
  protect,
  tenantDocUploader.fields([
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'others', maxCount: 5 },
    { name: 'agreement', maxCount: 1 },
    { name: 'familyPhotos', maxCount: 10 },
  ]),
  createTenant
);
router.get('/tenants', protect, getAllTenants);
router.get('/tenants/:id', protect, getTenantById);
router.put(
  '/tenants/:id',
  protect,
  tenantDocUploader.fields([
    { name: 'aadharFront', maxCount: 1 },
    { name: 'aadharBack', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'others', maxCount: 5 },
    { name: 'agreement', maxCount: 1 },
    { name: 'familyPhotos', maxCount: 10 },
  ]),
  updateTenant
);
router.delete('/tenants/:id', protect, deleteTenant);


module.exports = router;