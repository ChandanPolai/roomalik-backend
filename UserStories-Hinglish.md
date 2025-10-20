## Room Malik - Admin User Stories (Simple Hinglish)

### 1) Admin kaun hai?
- Admin matlab room/plot ka owner ya manager. Ye banda sab kuch handle karta hai: plots, rooms, tenants, payments, bills, aur reports.

### 2) Admin ka daily kaam kya hota hai?
- Dashboard pe dekhna: aaj ka rent due, recent payments, tenants ka status.
- Naye tenants add karna ya purane ko update/checkout karna.
- Rooms aur plots manage karna (konsi room khali hai, konsi occupied).
- Har mahine electricity units enter karke bill banana.
- Paisa (income/expense) record karna aur receipts dekhna.
- Notifications/alerts dekhna (rent due, agreement khatam hone wala, etc.).
- Simple reports dekhna: kitna kamaaya, kitna kharcha, occupancy kitni hai.

---

### 3) Login & Profile
As an Admin, main:
- Email + password se login karta hu.
- Agar password bhool jaun to email se reset kar sakta hu.
- Apni profile update kar sakta hu (naam, phone, address, profile photo).

Acceptance (simple):
- Galat password pe error mile.
- Sahi login pe dashboard khul jaye.
- Profile save karne pe nayi info turant dikhe.

---

### 4) Plots Manage Karna
As an Admin, main:
- Naya plot add kar sakta hu (naam, address, area, year, facilities).
- Plot ki images upload kar sakta hu (front, gate, parking, etc.).
- Plot ko edit/delete kar sakta hu.

Acceptance:
- Plot list me naya plot turant dikhe.
- Image upload ke baad gallery me photo dikhe.

---

### 5) Rooms Manage Karna
As an Admin, main:
- Room add karta hu (number, size, type, rent, deposit, floor, facing, furnished ya nahi).
- Room ki images upload karta hu (before/after maintenance, angles, etc.).
- Room ki status set karta hu: Available / Occupied / Under Maintenance / Reserved.
- Room edit/delete kar sakta hu.

Acceptance:
- Available filter lagane pe sirf khaali rooms dikhen.
- Images upload ke baad gallery sahi chale.
- Status change karne pe dashboard ki counts update ho.

---

### 6) Tenants Manage Karna
As an Admin, main:
- Naya tenant add karta hu with full details:
  - Personal info: naam, mobile, email, address
  - IDs: Aadhar/PAN/Photo (images upload)
  - Family/Roommates: naam, age, relation, photo
  - Agreement: start/end date, rent, deposit, document upload
  - Finance preference: bill included ya alag, extra charges, payment mode
- Tenant ko kisi room me allot karta hu.
- Tenant info edit karta hu, checkout pe room ko khali karta hu.

Acceptance:
- Tenant add karne ke baad room ki status Occupied ho jaye.
- Checkout pe room Available ho jaye aur tenant history safe rahe.

---

### 7) Electricity Bills (Room-wise)
As an Admin, main:
- Har mahine meter reading (units) enter karta hu.
- Per-unit rate set karta hu (editable).
- System amount auto-calculate karta hai: amount = units × rate.
- Bill ko paid/unpaid mark karta hu.

Acceptance:
- Month select karke sab rooms ka bill dekh saku.
- Paid mark karne pe pending list se hat jaye.

---

### 8) Payments & Receipts
As an Admin, main:
- Tenant se rent/charges receive karta hu aur payment record karta hu (amount, date, method).
- Receipt generate hoti hai (PDF/Image store ho sakta hai) aur history me dikhta hai.
- Pending payments dekh sakta hu.

Acceptance:
- Payment add hote hi tenant ki pending amount kam ho jaye.
- Receipt view/download option mile.

---

### 9) Finances (Income/Expense)
As an Admin, main:
- Income add karta hu (rent, deposit, parking, etc.).
- Expenses add karta hu (maintenance, utility, tax, insurance, vendor details ke saath).
- Plot-wise/Room-wise expense tag kar sakta hu.

Acceptance:
- Monthly summary me total income vs expense sahi dikhe.
- Category wise breakdown (charts) dikhe.

---

### 10) Dashboard & Notifications
As an Admin, main:
- Dashboard pe quick stats dekhta hu: total plots, rooms, occupied/vacant, aaj ka due.
- Rent due alerts, agreement renewal, maintenance reminders dekh sakta hu.
- Mobile push/email notifications mil sakte hain (agar enabled ho).

Acceptance:
- Aaj due list me aaj ke tenants aayein.
- Next 7 days me jo due hai wo "Upcoming" me dikhe.

---

### 11) Reports & Analytics
As an Admin, main:
- Monthly/Yearly income reports dekh sakta hu (export PDF/Excel).
- Plot-wise profitability, expense categories, tenant occupancy trends dekh sakta hu.
- Payment behavior (on-time vs late) samajh sakta hu.

Acceptance:
- Filters lagane pe report sahi update ho.
- Export pe file download ho jaye.

---

### 12) Files & Gallery (Images/Documents)
As an Admin, main:
- Plot, Room, Tenant ki photos upload karta hu.
- Agreement/document upload karta hu (PDF/Image).
- Gallery me sari files organized dikhti hain.

Acceptance:
- Upload ke baad preview turant aaye.
- Delete pe photo/document remove ho jaye.

---

### 13) Simple End-to-End Flows (Bachche wali simplicity)
1) Naya Room Ready karna:
   - Plot add karo → Room add karo → Room images upload karo → Status = Available.

2) Tenant ko Room dena:
   - Tenant add karo (details + IDs + agreement) → Room allot karo → Room status = Occupied.

3) Mahine ka Bill banana:
   - Month select karo → Har occupied room ka units enter karo → Rate set karo → Amount auto-calculated → Bill save karo → Paid/unpaid mark karo.

4) Rent lena aur Receipt dena:
   - Tenant select karo → Payment add karo (amount, method) → Receipt generate → Pending kam ho jaye.

5) Tenant Checkout:
   - Tenant profile me checkout karo → Agreement end mark → Room status = Available → History safe.

---

### 14) Acceptance Overview (1 line checks)
- Login secure, profile update hota hai.
- Plot/Room/Tenant CRUD kaam karta hai.
- Gallery uploads/preview/delete sahi.
- Electricity bills month-wise sahi calculate.
- Payments add hote hi receipts/history update.
- Finances me income/expense summary sahi.
- Dashboard alerts/notifications timely.
- Reports filter + export theek se.

---

### 15) Chhota Glossary
- CRUD: Create, Read, Update, Delete (basic add/edit/delete dekhna).
- Occupancy: Kitne rooms filled hain.
- Due: Jo payment abhi dena baaki hai.
- Receipt: Payment ka proof/document.

---

Ye document simple Hinglish me Admin ki daily life aur features samjhata hai. Isse koi bhi easily samajh sakta hai ki Room Malik me Admin kya kya karta hai aur kaise karta hai.


