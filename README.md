<div align="center">
  <img src="https://raw.githubusercontent.com/sahil7700/geek-room-site/main/public/logo.jpg" alt="GeekRoom Logo" width="120" style="border-radius: 20px; margin-bottom: 20px;" onerror="this.style.display='none'"/>
  
  # GeekRoom

  **The Builder-Led Student Tech Society at JIMS EMTC**

  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
</div>

<br />

GeekRoom is a vibrant community of passionate learners and builders at JIMS EMTC. We host hackathons, conduct hands-on workshops, and cultivate an environment where curiosity transforms into real-world engineering skills.

---

## ⚡ Tech Stack

This project is built using modern web development standards to ensure high performance, maintainability, and a premium user experience:

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React, TypeScript
- **Styling:** Tailwind CSS v4 alongside highly customized modern CSS (featuring dynamic glows, glassmorphism, and hardware-accelerated animations)
- **Database:** Supabase PostgreSQL managed with Prisma ORM
- **Authentication:** Clerk Auth
- **Media & Storage:** Supabase Storage CDN

## 🏗️ Architecture & Design System

### Unified Background System
To maintain a consistent "Dark Tech" aesthetic across the entire platform, we have implemented a layout-level styling system.
*   **The `<UnifiedBackground />` Component:** Sits firmly at `z-index: -1` in `app/layout.tsx`. It provides the foundational `#080a0f` deep dark base, a multi-gradient radial glow (Cyan `00c8ff`, Purple `7f77dd`, Magenta), an analog noise overlay, and a subtle dot grid.
*   **Rule of Thumb:** Developers **must not** apply opaque background colors (like `bg-black`, `bg-[#050505]`, or `bg-white`) to page wrappers (`<main>`, `body`, etc.). Doing so blocks the root background from being inherited and destroys the intended glassmorphism and depth.

### Media Architecture
We enforce a **Remote-First Content Pipeline**:
*   All dynamic visual assets—such as team avatars, event banners, gallery photos, and sponsor logos—are decoupled from this monolithic repository.
*   They are securely hosted in **Supabase Storage** and delivered instantly via its edge CDN network.
*   As a result, the local `public/` directory is kept exceptionally lightweight, drastically improving repository clone speeds and build times.

## 🚀 Getting Started

Follow these steps to run the application securely in your local environment.

### 1. Prerequisites
Ensure you have the latest LTS version of [Node.js](https://nodejs.org/) installed.

### 2. Installation
Clone the repository and install the required dependencies:
```bash
npm install
```

### 3. Environment Configuration
You must configure the required environment variables. Create a `.env.local` file in the root of the project and populate it with the necessary API keys from Supabase and Clerk:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

DATABASE_URL=your_supabase_postgresql_connection_string
DIRECT_URL=your_supabase_direct_url
```

### 4. Running the Development Server
Boot up the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the site out locally.

---
<div align="center">
  <i>"Code is like humor. When you have to explain it, it's bad."</i>
</div>
