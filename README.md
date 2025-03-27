# ColorsAI - AI-Powered Coloring Page Generator

ColorsAI is an interactive web application that allows users to create, edit, and share coloring pages. Powered by AI, it transforms text descriptions or uploaded images into beautiful coloring pages that can be customized and printed.

![ColorsAI Preview](public/colors-ai-preview.png)

## 🌐 Live Demo

Visit the live application at [colormewithai.vercel.app](https://colormewithai.vercel.app)

## ✨ Features

- **AI-Powered Generation**: Create coloring pages from text descriptions using Google's Gemini AI
- **Image Upload**: Convert your own images into coloring pages with edge detection
- **Edit & Customize**: Zoom, rotate, and pan to perfect your coloring pages
- **User Dashboard**: Manage all your created coloring pages in one place
- **Gallery**: Browse and get inspired by community-created coloring pages
- **Favorites**: Save coloring pages you love for easy access
- **Dark Mode**: Comfortable viewing experience in any lighting condition
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) project. To run it locally:

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/samizak/ColorsAI.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd ColorsAI
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## 🛠️ Technologies Used

- **Frontend**:
  - [Next.js 15.2.2](https://nextjs.org)
  - [React 19.0.0](https://reactjs.org)
  - [TailwindCSS 4](https://tailwindcss.com)
- **Animation**:
  - [GSAP](https://greensock.com/gsap/) for animations
  - [Lenis](https://github.com/studio-freight/lenis) for smooth scrolling
  - [Framer Motion](https://www.framer.com/motion/) for UI transitions
- **State Management**:
  - React Hooks
  - [SWR 2.3.3](https://swr.vercel.app/) for data fetching and caching
- **Authentication & Database**:
  - [Supabase Auth](https://supabase.com/auth)
  - [Supabase PostgreSQL](https://supabase.com/database) database
- **Styling**:
  - [TailwindCSS](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com/) components
  - Dark mode support via [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**:
  - [Lucide React](https://lucide.dev) 
- **AI Integration**:
  - [Google Generative AI 0.24.0](https://ai.google.dev/) (Gemini) for image generation

---

## 🔐 Environment Variables

To run this project, you'll need to set up the following environment variables in a `.env.local` file at the root of your project:

### Required Variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key for client-side authentication
- `GEMINI_API_KEY`: Google's Gemini API key for AI image generation

To obtain these keys:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get a Gemini API key from Google AI Studio

⚠️ **Important**: Never commit your `.env.local` file to version control. It's already included in `.gitignore` to prevent accidental exposure of your API keys.

---

## 📁 Project Structure

```
ColorsAI/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── create/         # Page creation flows
│   ├── dashboard/      # User dashboard
│   ├── edit/           # Coloring page editor
│   ├── gallery/        # Community gallery
│   ├── hooks/          # Custom React hooks
│   └── services/       # API service functions
├── components/         # Global UI components
│   ├── auth/           # Authentication components
│   ├── providers/      # Context providers
│   ├── sections/       # Page sections
│   └── ui/             # UI components
├── lib/                # Utility functions
├── public/             # Static assets
│   └── images/         # Image assets
├── utils/              # Helper utilities
│   └── superbase/      # Supabase client utilities
└── types/              # TypeScript type definitions
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
