# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (TypeScript + Vite)
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build
- `npm run test` - Run tests with Vitest (configured but no tests implemented yet)

## Architecture Overview

This is a React 18 TypeScript application built with Vite, serving as a centralized portal for construction management applications.

### Key Technologies
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with manual chunk splitting for optimization
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 with lazy loading
- **State Management**: React Context API for authentication
- **HTTP Client**: Axios for API requests

### Architecture Patterns
- **Component Organization**: Feature-based structure under `src/components/`
- **Authentication**: JWT-based with React Context (`AuthContext`)
- **Route Protection**: Role-based access control via `ProtectedRoute` component
- **Performance**: Lazy loading for pages, manual vendor/router/utils chunks
- **Error Handling**: Error boundaries wrap the application

### Project Structure
- `src/pages/` - Page components (lazy loaded)
- `src/components/` - Reusable components organized by feature
- `src/config/` - Application and role configurations
- `src/context/` - React Context providers
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (performance helpers)

### Role-Based Access
The portal supports four user roles with different access levels:
- Admin: Full system access
- Manager: Project oversight
- Foreman: Field operations
- Operator: Equipment operation

### Build Configuration
- TypeScript strict mode enabled
- Path alias: `@/` maps to `src/`
- Vite manual chunks: vendor (React), router, utils
- Production source maps enabled
- Bundle size warning: 600KB