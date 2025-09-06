# CaptchaRizz

## Overview

CaptchaRizz is a modern web application that reimagines CAPTCHA verification with AI-powered, culture-savvy challenges. Instead of traditional traffic light puzzles, it uses human-only prompts like slang, memes, and cultural references to distinguish humans from bots. The application features a landing page showcasing the product with an interactive demo and installation options for developers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system featuring dark theme and brand colors (electric indigo, vivid violet, plasma blue)
- **UI Components**: shadcn/ui component library providing consistent, accessible React components built on Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and API caching
- **Animations**: Framer Motion for smooth transitions and interactive elements

### Backend Architecture  
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules for type safety and modern JavaScript features
- **Development**: Hot module replacement via Vite integration in development mode
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage) for development

### Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM
- **ORM**: Drizzle for type-safe database operations with schema definitions
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Development Storage**: In-memory storage implementation for rapid prototyping

### Authentication and Authorization
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **User Schema**: Basic user model with username/password authentication
- **Validation**: Zod schemas for runtime type validation and form validation

### Design System
- **Component Library**: Custom implementation of shadcn/ui with CaptchaRizz branding
- **Typography**: Multiple font families (Sora, Space Grotesk, Inter) for different use cases
- **Color System**: Custom CSS variables supporting dark mode with brand-specific colors
- **Animations**: CSS animations and Framer Motion for interactive elements like gradient text and tubelight navigation

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon Database serverless PostgreSQL driver for cloud database connectivity
- **drizzle-orm** and **drizzle-zod**: Type-safe ORM with Zod integration for schema validation
- **express**: Web application framework for Node.js backend
- **react** and **react-dom**: React framework for building user interfaces
- **vite**: Fast build tool and development server

### UI and Styling Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Utility for creating type-safe variant-based component APIs
- **clsx** and **tailwind-merge**: Conditional className utilities

### State Management and Data Fetching
- **@tanstack/react-query**: Powerful data synchronization for server state
- **wouter**: Minimalist routing library for React applications

### Development and Build Tools
- **typescript**: Static type checking for JavaScript
- **@vitejs/plugin-react**: Vite plugin for React support
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for Node.js development

### Animation and Interaction
- **framer-motion**: Production-ready motion library for React
- **embla-carousel-react**: Lightweight carousel component

### Form Handling and Validation
- **react-hook-form**: Performant forms library with easy validation
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: TypeScript-first schema validation library

### Utilities and Helpers
- **date-fns**: Modern JavaScript date utility library
- **cmdk**: Command palette component for React applications
- **nanoid**: Secure URL-friendly unique string ID generator