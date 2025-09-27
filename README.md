# 🛒 Shopping System – Tech Blooms (WebWizards Hackathon)

A small **e-commerce system** built by **Team Tech Blooms** for the **WebWizards Hackathon**.
This project implements a shopping cart, checkout process, and order history with both **User** and **Admin** sides.

---

## Problem Statement

**Shopping Cart with Checkout & Order History**

**Definition:**
Build a small e-commerce system with cart and checkout features.

**Requirements:**

* Product catalog displayed on the frontend.
* Add/remove items from a cart stored in sessions.
* Checkout saves the order and displays a summary.
* Logged-in users can view their past orders.
* Admin can review all orders placed.

**Expected Output:**
Users can shop, checkout, and view their order history, while the admin can monitor all orders.

---

## ✨ Features

### 👤 User Side

* Browse products in a **catalog**
* Add or remove items from the **shopping cart** (session-based)
* **Checkout** with order summary
* **Login/Register** for personalized experience
* View **past orders** anytime

* GUEST USER
Home Page
* <img width="1894" height="913" alt="image" src="https://github.com/user-attachments/assets/7535aced-4feb-427d-af8d-f89535521f05" />
Products Page:
* <img width="1904" height="910" alt="image" src="https://github.com/user-attachments/assets/15017e09-e727-4111-b261-beb8b68136d5" />
Guest Cart
*<img width="1895" height="835" alt="image" src="https://github.com/user-attachments/assets/4c5a4369-1da7-4efa-a7e7-fbe27991c78d" />
About
* <img width="1899" height="911" alt="image" src="https://github.com/user-attachments/assets/0081df1f-8867-4431-9efb-c1103be7ebaa" />





### 🔑 Admin Side

* Secure **admin login**
* View and manage all orders placed by users
* Monitor shopping activity in real-time

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, JavaScript , React
* **Backend**: Node.js + Express
* **Database**: MongoDB 
* **Authentication**: JWT
* **Styling**: CSS

---

## 📂 Project Structure

```
Tech_Bloom_WebWizards/
├── frontend/          # React/HTML-CSS-JS client
│   ├── src/           # Components, Pages, Cart, etc.
│   └── package.json
├── backend/           # Express.js server
│   ├── models/        # Product, Order, User
│   ├── routes/        # User, Cart, Admin APIs
│   ├── controllers/   # Business logic
│   ├── server.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Run

### Clone the Repository

```bash
git clone https://github.com/MargiMaradia/Tech_Bloom_WebWizards.git
cd Tech_Bloom_WebWizards
```

### Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DB_URI=your_database_connection
JWT_SECRET=your_secret_key
```

Run the server:

```bash
node index.js
```

### Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🎮 Usage

* Open the frontend at: `http://localhost:3000`

* **User Side**:

  * Register/Login
  * Browse catalog and add items to cart
  * Checkout and view order summary
  * See past orders under *Order History*

* **Admin Side**:

  * Login as admin
  * Monitor all placed orders

---
---

## License

MIT License © 2025 **Team Tech Blooms**
