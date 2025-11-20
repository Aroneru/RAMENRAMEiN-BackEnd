# RAMENRAMEiN - Japanese Ramen Restaurant Website

A modern, full-stack web application for RAMENRAMEiN, a Japanese ramen restaurant located in Bogor, Indonesia. This project combines authentic Japanese cuisine with a contemporary digital experience, featuring both a customer-facing website and an administrative dashboard.

## 🍜 About RAMENRAMEiN

RAMENRAMEiN is a Japanese ramen restaurant that offers a fusion of traditional Japanese flavors with local Indonesian warmth. Our website provides customers with an immersive experience to explore our menu, learn about our story, and stay updated with the latest news.

## ✨ Features

### Customer-Facing Website
- **Interactive Menu**: Browse ramen, snacks (nyemil), and beverages with detailed descriptions and pricing
- **Special Ramen System**: Dynamic pricing based on topping selections with min/max price display
- **Topping Calculator**: Real-time price calculation for customizable ramen orders
- **News & Updates**: Stay informed about restaurant news, promotions, and events
- **FAQ Section**: Quick answers to common customer questions
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Deep Linking**: Share direct links to specific menu items with `?open=menuId` parameter

### Admin Dashboard
- **Menu Management**: Full CRUD operations for ramen, snacks, beverages, and toppings
- **News Management**: Rich text editor (TipTap) for creating and managing news articles
- **FAQ Management**: Organize and update frequently asked questions
- **Homepage Control**: Update hero section images and content
- **Settings Toggle**: Control visibility of special ramen features and pricing display
- **Image Upload**: Seamless image management with Supabase Storage integration
- **Authentication**: Secure admin access with Supabase Auth

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for image uploads)
- **Rich Text Editor**: TipTap
- **Deployment**: [Vercel](https://vercel.com)

## 📋 Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Supabase account and project
- Vercel account (for deployment)

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 🔐 Admin Access

Navigate to [http://localhost:3000/login](http://localhost:3000/login) to access the admin dashboard.

## 📁 Project Structure

```
ramenramein-backend/
├── app/
│   ├── (auth)/              # Authentication pages (login)
│   ├── (dashboard)/         # Admin dashboard pages
│   │   ├── dashboard-home/  # Homepage management
│   │   ├── dashboard-menu/  # Menu management (add/edit)
│   │   ├── dashboard-news/  # News management
│   │   └── dashboard-faq/   # FAQ management
│   ├── components/          # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── compro/         # Customer-facing components
│   │   └── dashboard/      # Admin dashboard components
│   ├── berita/             # News listing and detail pages
│   ├── faq/                # FAQ page
│   ├── menu/               # Menu page
│   ├── tentang-kami/       # About us page
│   └── api/                # API routes
├── lib/                     # Utility functions and helpers
│   ├── storage.ts          # Supabase Storage helpers
│   ├── auth.ts             # Authentication helpers
│   ├── berita.ts           # News data functions
│   ├── faq.ts              # FAQ data functions
│   └── types/              # TypeScript type definitions
└── public/                  # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# API Base URL
NEXT_PUBLIC_API_URL=your-supabase-project-url
```

### Supabase Setup

1. **Create Storage Bucket**: Follow instructions in `SUPABASE_STORAGE_SETUP.md`
2. **Run SQL Policies**: Execute `supabase-storage-policies.sql` in Supabase SQL Editor
3. **Database Schema**: Ensure tables are created for `menu`, `news`, `faq`, and `homepage`

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

The application is configured for automatic deployments on every push to the main branch.

## 📝 Key Features Implementation

### Special Ramen System
- Admin can toggle "Special Ramen" status for menu items
- Special ramen displays dynamic pricing (min - max) based on available toppings
- Optional "Image for Maximum Price" to showcase fully-loaded ramen

### Deep Linking
- Share direct links to menu items: `/menu?open=menu-id`
- Automatically opens the menu popup with the specified item
- Ensures "ramen" tab is active for special menu items

### Image Upload System
- All images stored in Supabase Storage
- Organized in folders: `menu/`, `berita/`, `hero/`
- Automatic cleanup when updating/deleting items
- Vercel-compatible (no local file system writes)

### Mobile-First Design
- Responsive navigation with mobile hamburger menu
- Touch-optimized menu cards and galleries
- Adaptive layouts for all screen sizes
- Optimized images for faster mobile loading

## 🧪 Testing

Test image uploads locally before deploying:
```bash
npm run dev
# Log in to admin dashboard
# Try uploading a menu item, news article, or hero image
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TipTap Editor Documentation](https://tiptap.dev/docs)

## 👥 Contributing

This is a university project for TPL Semester 5. For any questions or suggestions, please contact the development team.

## 📄 License

This project is developed as part of an academic assignment.
