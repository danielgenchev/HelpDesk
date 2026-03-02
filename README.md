# 🛠️ IT Help Desk - Support Ticketing System

A fully functional, multi-page web application for managing IT support tickets. Built with Vanilla JavaScript, Bootstrap 5, and Supabase.

🚀 **Live Demo:** https://help-desk-xi-beige.vercel.app

## 🔑 Demo Credentials (For Examiners)

To simplify testing, you can use the built-in demo admin account:

- **Email:** `demo@helpdesk.local` (or simply type `demo`)
- **Password:** `demo123`
  _Note: The login page includes a "1-Click Demo Admin Login" button for instant access._

---

## 🌟 Key Features

### 👥 Roles & Authorization

- **Regular Users:** Can create tickets, upload attachments, view their own tickets, and edit them (only if the status is `open`).
- **Administrators:** Have a global dashboard to view all tickets from all users and can dynamically change ticket statuses (`open` -> `in progress` -> `resolved` -> `closed`).

### 🌍 i18n (Internationalization)

- The entire application supports real-time language switching between **English (EN)** and **Bulgarian (BG)** using a custom dictionary service.

### 🌓 Dark / Light Mode

- Fully integrated theme switcher that saves user preferences in the browser's `localStorage`.

### 🔒 Security & Database

- Uses **Supabase Row Level Security (RLS)** to ensure data privacy (users can only access their own data via DB policies).
- Stores attachments securely in **Supabase Storage**.
- Minimum 4 DB tables implemented: `users` (auth), `profiles`, `tickets`, `categories`, and `comments`.

---

## 🏗️ Architecture & Technologies

This project strictly follows the **"Frontend is UI only"** principle. The codebase is modular and separates business logic from UI rendering (MVC-like pattern).

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **UI Framework:** Bootstrap 5
- **Bundler:** Vite (for local development and multi-page routing)
- **Backend (BaaS):** Supabase (PostgreSQL Database, Auth, Storage)
- **JS Services:**
  - `api.js`: Handles all database queries.
  - `auth.js`: Handles user sessions, login, and registration.
  - `i18n.js`: Handles translations and language state.

---

## 💻 Local Development Setup

If you want to run this project locally on your machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/danielgenchev/HelpDesk.git
   cd HelpDesk
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Environment Variables:**
   _The Supabase keys are currently initialized in `src/supabase.js` for testing purposes._
