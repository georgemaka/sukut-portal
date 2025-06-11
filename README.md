# Sukut Portal

A modern, scalable construction management portal built with React, TypeScript, and Tailwind CSS. This portal serves as a centralized hub for accessing multiple construction management applications with role-based access control.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Authentication**: JWT-based authentication with role management
- **Role-Based Access**: Admin, Manager, Foreman, and Operator roles
- **Responsive Design**: Mobile-first responsive interface
- **Performance Optimized**: Lazy loading, code splitting, memoization
- **Developer Experience**: ESLint, Prettier, hot reload
- **Error Handling**: Comprehensive error boundaries and loading states

## 🏗️ Architecture

### User Roles
- **Admin**: Full system access and user management
- **Manager**: Project oversight and planning access
- **Foreman**: Field operations and equipment management  
- **Operator**: Equipment operation and status updates

### Applications
- 📊 **Market Forecast**: Revenue and resource planning dashboard
- 🏗️ **Project Management**: Track projects, timelines, and resources
- 🚜 **Equipment Tracking**: Monitor equipment location and maintenance
- 🦺 **Safety & Compliance**: Safety protocols and compliance tracking
- 📦 **Inventory Management**: Materials and supplies inventory
- 📈 **Reports & Analytics**: Business intelligence and reporting

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd sukut-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Demo Accounts

For testing, use these demo credentials:

| Role | Email | Password |
|------|--------|----------|
| Admin | admin@sukut.com | password123 |
| Manager | manager@sukut.com | password123 |
| Foreman | foreman@sukut.com | password123 |
| Operator | operator@sukut.com | password123 |

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── apps/            # Application grid components
│   ├── admin/           # Admin panel components
│   └── ui/              # Reusable UI components
├── pages/               # Page components
├── context/             # React context providers
├── config/              # Configuration files
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── hooks/               # Custom React hooks
```

## 🎯 Performance Optimizations

### For 100+ Concurrent Users
- **Code Splitting**: Lazy loading of route components
- **Memoization**: React.memo for expensive components
- **Debouncing**: Search and filter operations
- **Caching**: Session storage with TTL
- **Bundle Optimization**: Tree shaking and chunk splitting
- **Image Optimization**: Responsive images based on device/network

### Performance Monitoring
- Performance observers for render time tracking
- Memory usage monitoring (development)
- Network quality detection
- Intersection observers for lazy loading

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

## 🌐 Environment Variables

Create a `.env.local` file with:

```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_MARKET_FORECAST_URL=http://localhost:3000
VITE_JWT_SECRET=your-jwt-secret-here
VITE_APP_NAME=Sukut Portal
VITE_APP_VERSION=1.0.0
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment-Specific Builds
- **Development**: `npm run dev`
- **Staging**: `npm run build && npm run preview`
- **Production**: `npm run build` (serve with nginx/apache)

## 🔐 Security Features

- JWT token authentication
- Role-based access control
- Input validation and sanitization
- XSS prevention
- CSRF protection
- Secure session management

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interfaces
- Optimized for tablets and mobile devices

## 🧪 Testing Strategy

### Planned Testing
- **Unit Tests**: Component testing with Vitest
- **Integration Tests**: User flow testing
- **E2E Tests**: Complete user journeys
- **Performance Tests**: Load testing for 100+ users

## 🔄 Future Enhancements

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

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

© 2024 Sukut Construction. All rights reserved.

---

**Built with ❤️ for the construction industry**