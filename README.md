
# VAS LOGISTICS - Full Stack Project Instruction

This project is a **Full-Stack Application** consisting of a React Frontend and a Node.js/MongoDB Backend.

## 📁 Project Structure
- `server.js` -> **THIS IS THE BACKEND** (Node.js + Express + Mongoose).
- `package.json` -> Contains dependencies for the Backend (`express`, `mongoose`, etc.).
- `App.tsx` -> The main Frontend logic.
- `index.html` -> The main entry point for the browser.

## 🛠️ How to run the Backend
1. Open your terminal in this folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Setup your MongoDB URI in a `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:5000` in your browser. If you see "VAS LOGISTICS BACKEND IS LIVE", the backend is working perfectly.

## 🛠️ How to run the Frontend
The frontend is built with React. Ensure the `API_BASE_URL` in `App.tsx` points to your running backend (default is `http://localhost:5000`).

## 🔑 Authentication
The APIs are protected. Use the following key in the Header:
`Authorization: Bearer VAS_LIVE_$(6772_KEY_9901_AUTH_771)`
