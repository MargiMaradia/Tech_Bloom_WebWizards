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

### 🔑 Admin Side

* Secure **admin login**
* View and manage all orders placed by users
* Monitor shopping activity in real-time

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, JavaScript (React/Vanilla depending on implementation)
* **Backend**: Node.js + Express
* **Database**: MongoDB (or your chosen DB)
* **Authentication**: JWT / Session-based login
* **Styling**: Bootstrap / Tailwind CSS

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
