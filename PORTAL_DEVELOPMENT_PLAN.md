# Sukut Portal Development Plan

## Overview
The Sukut Portal (`sukutapps.com`) serves as a centralized hub for accessing multiple construction management applications. This portal provides single sign-on authentication, role-based access control, and a unified interface for navigating between different Sukut applications.

## Project Architecture

### High-Level Structure
```
Sukut-Ecosystem/
├── sukut-portal/              # Main portal application (this project)
├── market-forecast/           # Existing market forecasting app
├── project-management/        # Future project management app
├── equipment-tracking/        # Future equipment tracking app
└── shared-components/         # Future shared UI library
```

### Portal URL Structure
```
sukutapps.com/                 # Portal landing/dashboard
sukutapps.com/login           # Authentication
sukutapps.com/profile         # User settings
sukutapps.com/admin           # Admin panel (admin users only)
sukutapps.com/forecast        # Market Forecast app (iframe/redirect)
sukutapps.com/projects        # Project Management app (future)
sukutapps.com/equipment       # Equipment Tracking app (future)
```

## Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development, similar to existing setup)
- **Styling**: Tailwind CSS (consistent with existing apps)
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **Authentication**: JWT tokens + localStorage/sessionStorage
- **HTTP Client**: Axios or fetch API

### Backend Integration
- **Phase 1**: Mock authentication + local storage
- **Phase 2**: REST API integration with JWT
- **Phase 3**: SSO integration (optional)

## Core Features

### 1. Authentication System
- **Login/Logout**: Email/password authentication
- **User Roles**: Admin, Manager, Foreman, Operator
- **Session Management**: JWT token handling
- **Password Reset**: Email-based reset flow (future)

### 2. Application Grid
- **App Cards**: Visual cards for each available application
- **Role-Based Display**: Show only apps user has access to
- **Status Indicators**: Active, Coming Soon, Maintenance
- **Quick Access**: One-click navigation to applications

### 3. User Management (Admin Only)
- **User CRUD**: Create, view, edit, delete users
- **Role Assignment**: Assign roles and app permissions
- **Access Audit**: Track user access and activity

### 4. Navigation & Layout
- **Responsive Design**: Mobile-friendly interface
- **Unified Header**: Consistent navigation across apps
- **Breadcrumbs**: Clear navigation context
- **User Menu**: Profile, settings, logout

## Data Models

### User Interface
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'foreman' | 'operator';
  permissions: {
    apps: string[];           // App IDs user can access
    features: string[];       // Specific features within apps
  };
  company: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'pending';
}
```

### Application Definition
```typescript
interface SukutApp {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;              // Emoji or icon class
  color: string;             // Tailwind color class
  requiredRoles: string[];   // Roles that can access this app
  status: 'active' | 'coming-soon' | 'maintenance';
  version?: string;
  lastUpdated?: string;
}
```

### Authentication Context
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasPermission: (appId: string) => boolean;
  hasRole: (role: string) => boolean;
}
```

## Component Architecture

### Layout Components
```
src/components/layout/
├── Header.tsx              # Main navigation bar
├── Sidebar.tsx             # Side navigation (if needed)
├── Footer.tsx              # Portal footer
└── Layout.tsx              # Main layout wrapper
```

### Authentication Components
```
src/components/auth/
├── LoginForm.tsx           # Login form component
├── ProtectedRoute.tsx      # Route guard component
├── RoleGuard.tsx           # Role-based access guard
└── AuthProvider.tsx        # Authentication context provider
```

### Application Components
```
src/components/apps/
├── AppCard.tsx             # Individual app card
├── AppGrid.tsx             # Grid of app cards
├── AppStatus.tsx           # Status indicator component
└── AppLauncher.tsx         # App launching logic
```

### Admin Components
```
src/components/admin/
├── UserTable.tsx           # User management table
├── UserForm.tsx            # Create/edit user form
├── RoleSelector.tsx        # Role assignment component
└── PermissionMatrix.tsx    # App permission management
```

## Page Structure

### Public Pages
- **Login** (`/login`): Authentication form
- **Forgot Password** (`/forgot-password`): Password reset request

### Protected Pages
- **Dashboard** (`/`): Main portal with app grid
- **Profile** (`/profile`): User profile and settings
- **Admin Panel** (`/admin`): User and app management (admin only)

### App Integration Pages
- **App Frame** (`/app/:appId`): Container for embedded apps
- **App Redirect** (`/redirect/:appId`): Redirect to external apps

## Development Phases

### Phase 1: Foundation (Week 1)
1. **Project Setup**
   - Initialize Vite + React + TypeScript project
   - Configure Tailwind CSS
   - Set up ESLint and Prettier
   - Install core dependencies (React Router, Axios)

2. **Basic Layout**
   - Create main layout components
   - Implement responsive design
   - Set up routing structure
   - Create placeholder pages

3. **Mock Authentication**
   - Implement login form
   - Create mock user data
   - Set up authentication context
   - Add protected route logic

### Phase 2: Core Features (Week 2)
1. **Application Grid**
   - Create app card components
   - Implement role-based app filtering
   - Add app status indicators
   - Create app launching logic

2. **User Interface**
   - Build user profile page
   - Implement logout functionality
   - Add user menu and navigation
   - Create settings interface

3. **App Integration**
   - Set up iframe embedding for Market Forecast
   - Implement deep linking
   - Add navigation between portal and apps
   - Test user flow

### Phase 3: Advanced Features (Week 3)
1. **Admin Panel**
   - Create user management interface
   - Implement role assignment
   - Add permission matrix
   - Build audit logging

2. **Polish & Optimization**
   - Add loading states and error handling
   - Implement responsive design improvements
   - Add accessibility features
   - Optimize performance

3. **Deployment Preparation**
   - Configure build process
   - Set up environment variables
   - Create deployment scripts
   - Write documentation

## Configuration Files

### Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3001
VITE_MARKET_FORECAST_URL=http://localhost:3000
VITE_JWT_SECRET=your-jwt-secret
VITE_APP_NAME=Sukut Portal
VITE_APP_VERSION=1.0.0
```

### App Configuration
```typescript
// src/config/apps.ts
export const SUKUT_APPS: SukutApp[] = [
  {
    id: 'market-forecast',
    name: 'Market Forecast',
    description: 'Revenue and resource planning dashboard',
    url: process.env.VITE_MARKET_FORECAST_URL || 'http://localhost:3000',
    icon: '📊',
    color: 'bg-blue-500',
    requiredRoles: ['admin', 'manager'],
    status: 'active'
  },
  // ... more apps
];
```

### User Roles Configuration
```typescript
// src/config/roles.ts
export const USER_ROLES = {
  admin: {
    name: 'Administrator',
    permissions: ['all'],
    apps: ['*'] // Access to all apps
  },
  manager: {
    name: 'Manager',
    permissions: ['view_reports', 'manage_projects'],
    apps: ['market-forecast', 'project-management']
  },
  foreman: {
    name: 'Foreman',
    permissions: ['view_projects', 'update_progress'],
    apps: ['project-management', 'equipment-tracking']
  },
  operator: {
    name: 'Operator',
    permissions: ['view_equipment', 'update_status'],
    apps: ['equipment-tracking']
  }
} as const;
```

## Integration Strategy

### Market Forecast Integration
1. **Embed Option**: Use iframe to embed existing app
2. **Redirect Option**: Redirect to existing app with SSO
3. **Migration Option**: Gradually move components to portal

### Future App Integration
1. **Standardized Authentication**: All apps use same JWT tokens
2. **Shared Components**: Extract common UI to shared library
3. **Consistent Navigation**: Unified header across all apps
4. **Data Sharing**: Common API endpoints for shared data

## Testing Strategy

### Unit Tests
- Component rendering and behavior
- Authentication logic
- Role-based access controls
- Utility functions

### Integration Tests
- Authentication flow
- App navigation
- Permission checking
- User management

### E2E Tests
- Complete user journeys
- Cross-app navigation
- Admin workflows
- Mobile responsiveness

## Deployment Configuration

### Build Process
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name sukutapps.com;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:3001;
    }
}
```

## Security Considerations

### Authentication
- JWT tokens with reasonable expiration
- Secure password requirements
- Rate limiting on login attempts
- Session timeout handling

### Authorization
- Role-based access control
- Feature-level permissions
- App-level access restrictions
- Admin privilege separation

### Data Protection
- Input validation and sanitization
- XSS prevention
- CSRF protection
- Secure cookie handling

## Performance Optimization

### Bundle Optimization
- Code splitting by route
- Lazy loading of components
- Tree shaking of unused code
- Asset optimization

### Runtime Performance
- React.memo for expensive components
- useMemo for heavy calculations
- Virtualization for large lists
- Efficient re-rendering patterns

## Future Enhancements

### Short Term (3-6 months)
- Real backend API integration
- Email notifications
- Advanced user management
- Mobile app wrapper

### Long Term (6-12 months)
- SSO integration (Azure AD, Google)
- Advanced analytics dashboard
- Multi-tenant support
- Automated user provisioning

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Initial Setup
```bash
cd sukut-portal
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom axios tailwindcss
npm run dev
```

### Development Workflow
1. Create feature branch from main
2. Implement feature with tests
3. Run linting and tests
4. Create pull request
5. Deploy to staging for review
6. Merge to main and deploy to production

---

## Questions for Discussion

1. **Authentication Backend**: Should we build a simple Node.js backend or use a service like Auth0/Firebase?

2. **App Integration Method**: Prefer iframe embedding or redirect approach for existing Market Forecast app?

3. **Styling Consistency**: Should we create a shared component library from the start or extract later?

4. **Deployment Strategy**: Prefer cloud hosting (Vercel/Netlify) or self-hosted (Docker/VPS)?

5. **User Management**: Start with simple local storage or implement database-backed user management?

6. **Mobile Strategy**: Portal-only mobile optimization or plan for native mobile apps?

---

This plan provides a comprehensive roadmap for building the Sukut Portal. Each section can be expanded with more detailed implementation notes as development progresses.