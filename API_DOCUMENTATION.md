# Roomalik Backend - Dashboard & Payment APIs

## New APIs Added

### 1. Dashboard API
**Endpoint:** `GET /api/admin/dashboard`
**Auth:** Required (protect middleware)

**Description:** Shows upcoming rent payments for all tenants (EMI-style system)
- Shows tenants with pending payments
- Displays payment schedule based on agreement dates
- Automatically calculates due dates for each month
- Returns nested data: Plot -> Multiple Rooms -> One Tenant per Room -> Rent Schedule
- **Structure:** Ek plot ke andar multiple rooms, aur ek room ke ander ek hi tenant hoga

**Response Format:**
```json
{
  "success": true,
  "data": {
    "totalPlots": 2,
    "totalTenants": 5,
    "dashboard": [
      {
        "plot": {
          "id": "...",
          "name": "Plot Name",
          "address": {...}
        },
        "rooms": [
          {
            "room": {
              "id": "...",
              "number": "101",
              "type": "1BHK",
              "rent": 15000
            },
            "tenant": {
              "tenant": {
                "id": "...",
                "name": "Tenant Name",
                "mobile": "1234567890",
                "email": "tenant@email.com"
              },
              "agreement": {
                "start": "2024-01-01",
                "end": "2024-12-31"
              },
              "rentSchedule": [
                {
                  "month": "2024-01",
                  "monthName": "January 2024",
                  "dueDate": "2024-01-01",
                  "amount": 15000,
                  "status": "pending",
                  "paymentId": null
                }
              ],
              "totalPending": 15000
            }
          }
        ]
      }
    ]
  }
}
```

### 2. Generate Payment Records API
**Endpoint:** `POST /api/admin/payments/generate`
**Auth:** Required (protect middleware)

**Description:** Automatically generates payment records for all tenants based on their agreement dates
- Creates payment records for each month in the agreement period
- Checks for existing payments to avoid duplicates
- Updates due dates if needed

**Response Format:**
```json
{
  "success": true,
  "data": {
    "created": 25,
    "updated": 5,
    "message": "Payment records generated successfully"
  }
}
```

### 3. Update Payment Status API
**Endpoint:** `PUT /api/admin/payments/:paymentId/status`
**Auth:** Required (protect middleware)

**Description:** Updates payment status to "paid" with payment proof image
- Marks payment as paid
- Uploads payment proof image
- Stores payment mode and date

**Request Body:**
```json
{
  "paymentMode": "online", // "cash", "online", "cheque"
  "remarks": "Payment received via UPI"
}
```

**File Upload:** `paymentProof` (single image file)

**Response Format:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "tenantId": "...",
    "amount": 15000,
    "month": "2024-01",
    "status": "paid",
    "paymentDate": "2024-01-05",
    "paymentMode": "online",
    "paymentProof": "uploads/payments/xyz.jpg",
    "remarks": "Payment received via UPI"
  }
}
```

### 4. Earnings API
**Endpoint:** `GET /api/admin/earnings`
**Auth:** Required (protect middleware)

**Description:** Shows earnings report with filtering options
- Can filter by month and year
- Shows nested structure: Plot -> Room -> Tenant -> Payments
- Calculates total earnings

**Query Parameters:**
- `month` (optional): 1-12
- `year` (optional): YYYY

**Examples:**
- `GET /api/admin/earnings` - All earnings
- `GET /api/admin/earnings?year=2024` - All earnings for 2024
- `GET /api/admin/earnings?month=1&year=2024` - January 2024 earnings

**Response Format:**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 75000,
    "totalPayments": 5,
    "earnings": [
      {
        "plot": "Plot Name",
        "rooms": [
          {
            "room": "101",
            "type": "1BHK",
            "tenant": {
              "tenant": "Tenant Name",
              "mobile": "1234567890",
              "payments": [
                {
                  "month": "2024-01",
                  "amount": 15000,
                  "paymentDate": "2024-01-05",
                  "paymentMode": "online"
                }
              ],
              "total": 15000
            },
            "total": 15000
          }
        ],
        "total": 15000
      }
    ]
  }
}
```

## Payment Model

Created new model: `models/payment.model.js`

**Fields:**
- `tenantId` - Reference to Tenant
- `roomId` - Reference to Room
- `plotId` - Reference to Plot
- `amount` - Payment amount
- `month` - Month in format "YYYY-MM"
- `dueDate` - Due date for payment
- `status` - "pending", "paid", "overdue"
- `paymentDate` - When payment was received
- `paymentMode` - "cash", "online", "cheque"
- `paymentProof` - Image URL
- `remarks` - Additional notes

## How It Works

1. **Tenant Agreement Setup:**
   - When tenant is added, agreement start/end dates are set
   - Finance details include monthly rent amount

2. **Payment Generation:**
   - Call `/payments/generate` to create payment records
   - Automatically creates records for all months in agreement period
   - Each month gets a payment record with status "pending"

3. **Dashboard View:**
   - Shows all tenants with pending payments
   - Calculates upcoming due dates using moment.js
   - Displays payment schedule (EMI-style)

4. **Payment Collection:**
   - When tenant pays rent, call update payment status API
   - Upload payment proof image
   - Payment status changes to "paid"

5. **Earnings Report:**
   - Filter by month/year to see earnings
   - Shows breakdown by plot, room, and tenant
   - Calculates total earnings

## Installation

1. Installed `moment` package for date handling
2. Created `uploads/payments` directory for payment proof images
3. Added Payment model to models
4. Created dashboard controller
5. Updated routes with new endpoints

## Usage Instructions

1. **First Time Setup:**
   - Add tenants with agreement dates
   - Call `POST /api/admin/payments/generate` to create payment records

2. **Daily Usage:**
   - Check dashboard: `GET /api/admin/dashboard`
   - Update payment status when tenant pays: `PUT /api/admin/payments/:paymentId/status`
   - View earnings: `GET /api/admin/earnings?month=1&year=2024`

## Notes

- All dates use moment.js for proper handling
- Payments are automatically calculated based on agreement dates
- Dashboard only shows tenants with pending payments
- Earnings API shows only paid payments
- Payment records are unique per tenant per month

