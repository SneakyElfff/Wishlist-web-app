# Wishlist Web App

A full-stack, responsive wishlist web application built with the **MERN stack** (MongoDB, Express, React, Node.js) and styled with **Tailwind CSS v4**.  

Users can create personal wishlists, add gift items, reserve items to avoid duplicates, and easily share lists with friends and family. Perfect for birthdays, holidays, weddings, or any gift-giving occasion!

[![Vercel](https://img.shields.io/badge/Vercel-Deployed-brightgreen)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- Fully responsive UI powered by Tailwind CSS v4
- Add gift items with title, description, optional image URL
- Reserve gifts (mark as purchased/reserved with username) to prevent duplicate gifts
- RESTful API backend with Express
- Persistent storage using MongoDB
- Clean separation of frontend and backend

## 📦 Tech Stack

### 🛠 Frontend
- React (Vite)
- Tailwind CSS v4
- React Router (client-side navigation)
- Axios/Fetch for API communication

### 🧠 Backend
- Node.js + Express
- MongoDB (via MongoDB Atlas or local)
- Mongoose ODM for schema modeling

### 🗄 Database
- MongoDB (document-based storage for users and gifts)

### 📦 Deployment
- Vercel (frontend + serverless API support)
- Environment variables for secure configuration

## 📁 Repository Structure

```
Wishlist-web-app/
├── client/                 # React single-page application (frontend)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page views and routes
│       ├── services/       # API service helpers
│       ├── App.jsx
│       └── index.jsx
├── server/                 # Express API (backend)
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── package.json
└── README.md
```

## 🧠 Core Concepts

### Wishlist & Gift Items
A wishlist contains multiple gift items with the following fields:
- Title
- Optional image URL
- Description
- Reserved state (true/false)
- Reserver's username (when reserved)

## 🛠 Installation & Local Setup

### Clone the Repository
```bash
git clone https://github.com/SneakyElfff/Wishlist-web-app.git
cd Wishlist-web-app
```

### Backend Setup
```bash
cd server
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string
PORT=5000" > .env

# Start backend (with nodemon for development)
npm run dev
```

### Frontend Setup
```bash
cd ../client
npm install

# Start frontend (Vite dev server)
npm start
```

Open your browser at `http://localhost:5000` (or the port shown in the terminal).

## 🚀 Deployment

- **Frontend & API**: Deploy easily on Vercel (root directory contains both client and server).
- **Database**: Use MongoDB Atlas for production (set `MONGO_URI` in Vercel environment variables).

## 📊 Roadmap / Future Enhancements

- Add user authentication (JWT-based login/signup)
- Real-time updates with WebSockets/Socket.io
- Email notifications for reservations
- Search and filtering within wishlist
- Import gifts from external links (e.g., Amazon)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests where applicable.

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [SneakyElfff](https://github.com/SneakyElfff)
