# Full Stack Book Store App

This is a full-stack web application for an online Book Store. Built with a modern JavaScript backend and frontend, it supports features like browsing books, user authentication, shopping cart, and order processing.

---

## Features

- User registration and login (authentication & authorization)  
- Browse book listings, with details (title, author, cover image, price, description)  
- Add books to your shopping cart and manage cart items  
- Place orders and view order history  
- Admin/Host role: add/edit/delete books, manage inventory  
- Responsive UI for desktop and mobile  
- Clean full-stack architecture (front-end + back-end + database)

---

## Tech Stack

- Backend: Node.js, Express.js  
- Frontend: React using shadcn UI 
- Database: MongoDB 
- API: RESTful endpoints for user, books, cart, orders  
- Other: JWT (for authentication), bcrypt (password hashing), middleware for auth/roles

---

## Architecture & Project Structure

```

Full_Stack_Book_Store_App/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
├   ├── services/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── App.js
├── .env
├── package.json
└── README.md

````

---

## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/mehtabali05/Full_Stack_Book_Store_App.git
cd Full_Stack_Book_Store_App
````

### Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm start
```

### Setup the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` (if needed) with:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm start
```

Open in your browser: `http://localhost:3000`

---

## Usage

* Create an account or login
* Browse available books
* Add books to your cart and adjust quantities
* Checkout and view your orders
* If you are an admin/host: add new books, update existing books, manage inventory
* Mobile-friendly layout ensures easy browsing on smaller devices

---

## Why This Project Matters

* Demonstrates full-stack web development skills (RESTful API + frontend integration)
* Covers key e-commerce workflows: catalog browsing, cart management, order processing
* Clean architecture makes it easy to extend (for example: adding reviews, ratings, payment integration)
* Great portfolio piece for job applications or academic projects

---

## Future Improvements

* Payment gateway integration (Stripe)
* Reviews & ratings system for books
* Advanced search filters (genre, price range, author)
* Image uploads for book covers (cloud storage)
* Write tests (unit, integration) for backend and frontend
* Improve UI/UX: animation, theme toggle (dark/light), accessibility

---


## Author

**Mehtab Ali**
GitHub: [https://github.com/mehtabali05](https://github.com/mehtabali05)
Email: [mehtabalics7@gmail.com]

---

## License

This project is open-source under the MIT License. Feel free to use, modify and share.

```

---
