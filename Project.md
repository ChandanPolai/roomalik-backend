# Room Malik Application - Complete Detailed Documentation

## Overview
Room Malik Application ek comprehensive rental property management tool hai jo room owners (landlords) ke liye design kiya gaya hai. Ye application unhe apne rental properties ko efficiently manage karne me madad karta hai, jaise ki plots, rooms, tenants, finances, aur related services. Isme advanced features shamil hain jaise detailed tenant management, image galleries for visual documentation, dashboard notifications for real-time updates, rent due alerts, aur complete financial tracking with analytics. Application cross-platform hai, web aur mobile dono ke liye, taaki owner kahin se bhi access kar sake.

Ye app simple se advanced level tak evolve kiya gaya hai, focus karke security, user-friendliness, aur automation pe. Primary user room owner hai, jo email-password se login karta hai aur sab kuch manage karta hai.

## Technology Stack
- **Backend**: Node.js with Express.js – API endpoints ke liye robust framework.
- **Frontend (Web)**: React.js with modern UI libraries jaise Material-UI ya Ant Design for responsive design.
- **Mobile App**: React Native with Expo – Cross-platform mobile development ke liye, easy deployment aur features jaise push notifications.
- **Database**: MongoDB with Mongoose ODM – Flexible NoSQL database for handling complex schemas like nested tenant details.
- **Image Storage**: Cloudinary / AWS S3 / Local Storage with Multer – Image uploads aur management ke liye.
- **Authentication**: JWT-based authentication with refresh tokens – Secure sessions aur token rotation.
- **Pagination**: Mongoose-paginate-v2 plugin – Large data lists ko handle karne ke liye.
- **File Uploads**: Multer for image handling – Multi-file uploads support.
- **Push Notifications**: Expo Notifications (mobile) / Web Push API – Real-time alerts.
- **Additional Libraries**: Nodemailer for emails, Cron for scheduled tasks (e.g., auto rent calculations), Chart.js for graphs.

## Core Features
### 1. Advanced User Authentication
- **Login/Register**: Email aur password se secure login/register. Validation for strong passwords.
- **Profile Management**: Complete profile with avatar image upload, name, phone, address, aur preferences.
- **Security**: JWT tokens with refresh token mechanism to handle session expiry without re-login.
- **Password Recovery**: Email-based password reset with OTP or link.

### 2. Enhanced Dashboard
- **Rent Due Notifications**: Jo tenants ka rent due hai wo highlight hoga with countdown.
- **Monthly Overview**: Total income, expenses, occupancy rate in visual cards.
- **Recent Activities**: Latest tenant arrivals/departures, payments, maintenance logs.
- **Quick Stats**: Total plots, rooms, occupied/vacant rooms count.
- **Alerts Section**: Upcoming due dates, maintenance reminders, low occupancy alerts.
- **Graph/Charts**: Monthly income trends (bar/line charts), plot-wise earnings (pie charts).

### 3. Detailed Plot Management
- **Basic Info**: Name, address, total area, construction year.
- **Image Gallery**: Multiple images per plot with captions, upload support for high-res photos.
- **Plot Images**: Front view, gate, compound, parking area photos.
- **Room Count**: Total rooms aur unka breakdown (1BHK, 2BHK, etc.) with auto-calculation.
- **Facilities**: Parking, water supply, electricity backup details, checkbox-based entry.
- **Location Map**: GPS coordinates for easy navigation, integration with Google Maps API if possible.

### 4. Advanced Room Management
- **Room Details**:
  - Room number/name.
  - Size (sq ft), type (1BHK/2BHK/Single room).
  - Rent amount, security deposit.
  - Furnished/Semi-furnished/Unfurnished.
  - Floor number, facing direction (e.g., east-facing).
- **Room Images Gallery**:
  - Multiple photos per room from different angles.
  - Before/after photos for maintenance records.
  - 360-degree view option (if supported by image upload).
- **Amenities Checklist**: AC, WiFi, TV, Fridge, Washing Machine, etc., with custom additions.
- **Room Status**: Available, Occupied, Under Maintenance, Reserved – Color-coded for easy viewing.

### 5. Comprehensive Tenant Management
- **Personal Details**:
  - Full name, mobile number, email.
  - Permanent address, current address.
  - Emergency contact details.
  - Profession/occupation, office address.
- **Identity Verification**:
  - Aadhar Card front/back images.
  - PAN Card image.
  - Passport size photo.
  - Other ID proof (Driving License, Voter ID) uploads.
- **Family/Roommate Details**:
  - Number of family members/roommates.
  - Each member ka name, age, relation.
  - Individual photos of all members.
  - Contact numbers of family members.
- **Rental Agreement**:
  - Agreement start/end date.
  - Rent amount, security deposit paid.
  - Agreement document upload (PDF/Image).
  - Terms and conditions acceptance (digital signature optional).
- **Financial Details**:
  - Monthly rent amount.
  - Electricity bill handling (included/separate).
  - Additional charges (parking, maintenance).
  - Payment mode preference (cash/online/cheque).

### 6. Image Gallery System
- **Plot-wise Gallery**:
  - Plot exterior/interior photos.
  - Common area images (lobby, stairs).
  - Parking, garden, entrance photos.
  - Before/after renovation images.
- **Room-wise Gallery**:
  - Room interior photos from different angles.
  - Bathroom, kitchen (if attached) photos.
  - Balcony, window view images.
  - Furniture and fixtures photos.
- **Tenant Gallery**:
  - Profile photos of all residents.
  - ID proof images (Aadhar, PAN, etc.).
  - Family/roommate photos.
- **Document Gallery**:
  - Rental agreements.
  - Payment receipts (auto-generated).
  - Maintenance bills.
  - Legal documents (property papers).

### 7. Advanced Financial Management
- **Income Tracking**:
  - Monthly rent collection per room.
  - Security deposit management with refund tracking.
  - Late payment charges (auto-applied after due date).
  - Additional income (parking, maintenance charges).
- **Expense Management**:
  - Plot-wise expense tracking.
  - Maintenance costs (plumbing, electrical, painting) with vendor details.
  - Utility bills (common area electricity, water).
  - Property tax, insurance payments with due date reminders.
- **Electricity Bill Management**:
  - Individual room meter readings (manual entry or integration if possible).
  - Monthly unit consumption tracking.
  - Per-unit rate management (editable).
  - Auto-calculation with rent (added to monthly due).
- **Payment History**:
  - Complete payment timeline per tenant.
  - Receipt generation and storage (PDF export).
  - Pending payment alerts.
  - Payment method tracking with bank details if online.

### 8. Dashboard & Notifications
- **Today's Overview**:
  - Rent due today list with tenant names.
  - New tenant arrivals.
  - Departing tenants.
  - Maintenance scheduled tasks.
- **Upcoming Due Dates**:
  - Next 7 days rent due list.
  - Agreement renewal dates.
  - Maintenance reminders.
- **Monthly Summary**:
  - Total collection vs expected.
  - Occupancy percentage.
  - Top earning plots/rooms.
- **Alert System**:
  - Push notifications for mobile app (via Expo).
  - Email alerts for important updates (e.g., payment received).
  - SMS integration for critical alerts (third-party API like Twilio).

### 9. Reporting & Analytics
- **Financial Reports**:
  - Monthly/yearly income statements (export to PDF/Excel).
  - Plot-wise profitability analysis.
  - Expense categorization reports (pie charts).
  - Tax calculation assistance (basic formulas).
- **Tenant Reports**:
  - Occupancy trends over time.
  - Tenant duration analysis (average stay).
  - Payment behavior reports (on-time vs late payers).
- **Plot Performance**:
  - ROI calculation per plot (income minus expenses).
  - Vacancy duration tracking per room.
  - Rent rate comparison (across plots or market rates, if external data integrated).

## Database Schema (High-Level)
- **User**: _id, email, password (hashed), profile {name, phone, avatar, address}.
- **Plot**: _id, name, address, area, year, images [], facilities [], location {lat, lng}, ownerId.
- **Room**: _id, number, size, type, rent, deposit, furnished, floor, facing, images [], amenities [], status, plotId.
- **Tenant**: _id, name, mobile, email, addresses {}, emergency {}, profession {}, ids {aadhar: {front, back}, pan, photo, others []}, family [{name, age, relation, photo, contact}], agreement {start, end, rent, deposit, document}, finances {rent, billType, charges, paymentMode}, roomId, plotId.
- **Finance**: _id, type (income/expense), amount, description, date, category, plotId, roomId, tenantId.
- **ElectricityBill**: _id, roomId, month, units, rate, amount, paid.
- **Payment**: _id, tenantId, amount, date, method, receipt, status.
- **Contact**: _id, name, type (plumber, etc.), phone, ownerId.
- **Notification**: _id, type, message, date, userId, read.

## API Endpoints (Backend - High-Level)
- **Auth**: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/reset-password.
- **Profile**: GET/PUT /profile.
- **Plots**: CRUD /plots, POST /plots/:id/images.
- **Rooms**: CRUD /rooms, POST /rooms/:id/images, GET /rooms?status=available.
- **Tenants**: CRUD /tenants, POST /tenants/:id/documents, POST /tenants/:id/family.
- **Finances**: CRUD /finances, GET /finances/reports?type=monthly.
- **Bills**: CRUD /bills, POST /bills/calculate.
- **Payments**: CRUD /payments, POST /payments/receipt.
- **Notifications**: GET /notifications, PUT /notifications/read.
- **Reports**: GET /reports/financial, GET /reports/tenants, GET /reports/plots.

## User Stories for Room Malik (Room Owner)
As the room owner, I want to:

1. **Securely Authenticate**: Login/register with email/password, manage profile with avatar, and recover password easily.

2. **View Dashboard**: See real-time overview of due rents, stats, activities, and charts for quick insights.

3. **Manage Plots**: Add/edit plots with details, images, facilities, and location for complete property records.

4. **Manage Rooms**: Create/update rooms with specs, amenities, status, and galleries to track availability.

5. **Manage Tenants**: Onboard tenants with personal, ID, family details, agreements, and finances for thorough verification.

6. **Handle Images and Documents**: Upload and organize galleries for plots, rooms, tenants, and docs for visual/reference purposes.

7. **Track Finances**: Record income/expenses, manage bills auto-calculations, and view payment histories.

8. **Receive Notifications**: Get alerts on dashboard, mobile push, email/SMS for dues, arrivals, maintenance.

9. **Generate Reports**: Access analytics on finances, tenants, plots including ROI, trends, and comparisons for better decisions.

10. **Automate Tasks**: Have system auto-calculate rents/bills, send reminders, and update statuses to save time.

## Implementation Guidelines
- **Frontend**: Use React hooks for state, Redux for global state, forms with validation (Formik/Yup).
- **Mobile**: React Native components mirroring web, with Expo for camera/image picker, notifications.
- **Backend**: Express routes with middleware for auth, error handling; Mongoose for queries.
- **Security**: Input sanitization, rate limiting, HTTPS; store images securely.
- **Automation**: Cron jobs for monthly bill calculations, notification triggers.
- **Testing**: Jest for unit tests, Cypress for E2E; cover edge cases like vacant rooms, overdue payments.
- **Deployment**: Heroku/Vercel for backend/frontend, Expo for mobile builds.
- **Scalability**: Pagination for lists, indexing in MongoDB for fast queries.

## Summary in Bullet Points
- **Purpose**: Comprehensive app for landlords to manage rentals with advanced features like galleries, analytics, notifications.
- **Stack**: MERN + React Native Expo, with cloud storage and JWT auth.
- **Core Features**: Auth, dashboard, plot/room/tenant management, galleries, finances, bills, notifications, reports.
- **User Focus**: Room owner-centric with detailed user stories for intuitive experience.
- **Backend**: MongoDB schemas for rich data; extensive APIs for CRUD and calculations.
- **Enhancements**: Integration with payment gateways (e.g., Razorpay), AI-based vacancy predictions (future).