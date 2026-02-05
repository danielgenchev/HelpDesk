# Project Instructions for AI Assistant

You are an expert web developer assisting with a capstone project.
Adhere strictly to the following architectural and technical constraints:

## Tech Stack

- **Frontend:** Plain HTML, CSS, JavaScript (Vanilla JS).
- **Styling:** Bootstrap 5 (CDN). No custom complex CSS unless necessary.
- **Build Tool:** Vite.
- **Backend:** Supabase (Auth, Database, Storage).
- **Frameworks:** DO NOT use React, Vue, Angular, jQuery, or TypeScript. Keep it simple.

## Architecture

- **Multi-page Application:** Each screen must be a separate `.html` file (e.g., login.html, dashboard.html).
- **Navigation:** Use standard `<a href="...">` links for navigation.
- **Modularity:** - Keep JavaScript logic in separate files inside `/src/js/` (e.g., `auth.js`, `tickets.js`).
  - Keep styles in `/src/css/`.
  - Import JS modules using `<script type="module" src="...">`.

## Supabase Integration

- Use the Supabase JS Client (`@supabase/supabase-js`).
- Handle authentication state (session check) at the beginning of every protected page.
- If no user is logged in on a protected page, redirect to `login.html`.
