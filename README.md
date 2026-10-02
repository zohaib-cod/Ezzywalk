# Ezzywalk - Frontend & Admin Panel

This repository contains the frontend application and the admin dashboard for Ezzywalk.

## Recent Features & Problem Resolutions

Throughout the development of this project, we encountered several challenges and successfully resolved them to create a robust and user-friendly experience.

### 1. Admin Session Expiry & "Keep Me Logged In"
**Problem:** The admin dashboard was abruptly kicking users out and becoming empty because the JWT token was expiring too quickly (1 hour).
**Solution:** We updated the backend to support dynamic token expiration. Added a "Keep me logged in" checkbox on the login page. If checked, the session lasts for 30 days; otherwise, it expires in 2 hours. We also updated the frontend `auth.js` to decode the JWT and sync the NextAuth session expiry precisely with the backend token.

### 2. Blocked Admin Security & Banned Modal
**Problem:** When a Master Admin blocked another admin, the blocked admin would still see a simple ugly popup and remain somewhat in the flow.
**Solution:** We implemented a strict login guard. If an admin is blocked (`isBlocked: true`), the login attempt immediately triggers a beautiful, Glassmorphism-styled "Account Banned" modal (`BannedModal`) preventing any access to the system.

### 3. Separation of Active and Blocked Admins
**Problem:** Blocked admins and active admins were mixed in the same table, making management confusing.
**Solution:** We revamped the `AdminTabs.js` UI. Now, when an admin is blocked, they are moved to a dedicated "Blocked Admins" section. The Master Admin can easily review blocked accounts and restore (unblock) them with a single click.

### 4. Dynamic Hero Slider with Admin Controls
**Problem:** The main hero slider on the landing page was hardcoded and static. The client needed a way to change these promotional banners easily.
**Solution:** 
- **Backend:** Created a `HeroSlide` model in Prisma and a full CRUD API (`/api/heroSlides`). Fixed a 500 Internal Server Error where `id: null` was crashing Prisma by properly destructuring the request payload.
- **Frontend:** Created a complete `SliderManager.js` interface in the Admin Panel. Admins can now add new slides, upload images, write custom labels/titles, set button links, choose themes, and reorder slides.
- **UI Fix:** The uploaded slider images were appearing extremely dark due to `mix-blend-overlay`. We removed this and applied a clean `bg-black/30` overlay to ensure both image color accuracy and text readability.

### 5. Backend Vercel Deployment Preparation
**Problem:** The Node.js/Express backend needed to be ready for Vercel Serverless deployment.
**Solution:** We configured `vercel.json` for routing, exported the Express `app` natively, conditionally bypassed `app.listen` in production, and added a `"postinstall": "prisma generate"` script so Vercel builds the Prisma Client automatically on deployment.

### 6. Code Architecture & Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with custom Glassmorphism effects
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Authentication:** NextAuth.js custom credentials provider with JWT backend syncing
- **Icons:** Lucide React

---
*Developed with precision and focus on modern, premium aesthetics.*
