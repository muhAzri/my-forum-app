# My Forum App

A modern forum application built with React, TypeScript, Redux Toolkit, and comprehensive testing infrastructure.

## 🚀 Features

### Core Functionality
- **User Authentication**: Login/Register with JWT tokens
- **Thread Management**: Create, read, and interact with forum threads  
- **Voting System**: Upvote/downvote threads and comments with optimistic updates
- **Category Filtering**: Browse threads by categories
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Optimistic UI updates for better UX

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit with async thunks
- **Routing**: React Router with protected routes
- **Testing**: Comprehensive test coverage (Unit, Integration, E2E)
- **CI/CD**: Automated testing and deployment pipeline
- **Performance Monitoring**: React DevTools integration
- **Code Quality**: ESLint, TypeScript, and automated code quality checks

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing
- **@testing-library/user-event** - User interaction testing

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Why Did You Render** - React performance monitoring
- **React DevTools** - Development debugging

### CI/CD & Deployment
- **GitHub Actions** - Continuous Integration
- **Vercel** - Continuous Deployment
- **Codecov** - Code coverage reporting
- **Lighthouse CI** - Performance monitoring

## 🧪 Testing Strategy

### Test Coverage
This project implements comprehensive testing across multiple levels:

#### 1. Reducer Tests (2+ test files)
- **Location**: `src/core/store/slices/__tests__/`
- **Coverage**: Complex state management logic, optimistic updates, error handling
- **Scenarios**: 
  - Initial state management
  - Multi-step async action flows
  - Complex optimistic voting system
  - State rollback mechanisms

#### 2. Thunk Function Tests (2+ test files)  
- **Location**: `src/core/store/slices/__tests__/`
- **Coverage**: API calls, authentication flows, error handling
- **Scenarios**:
  - Successful/failed authentication flows
  - Complex state-dependent API calls
  - Network error handling
  - Integration between multiple thunks

#### 3. React Component Tests (2+ test files)
- **Location**: `src/modules/*/components/__tests__/`
- **Coverage**: User interactions, rendering logic, form validation
- **Scenarios**:
  - Form validation and submission
  - Conditional rendering logic
  - User interaction flows
  - Redux integration

#### 4. End-to-End Tests (1+ test file)
- **Location**: `src/e2e/`
- **Coverage**: Complete user workflows
- **Scenarios**:
  - Full login flow with API mocking
  - Error handling and validation
  - Navigation and accessibility
  - Responsive design testing

### Running Tests
```bash
# Unit and integration tests
npm test

# E2E tests
npm run e2e

# Test coverage
npm run test:coverage

# E2E tests with UI
npm run e2e:ui
```

## 🚦 CI/CD Pipeline

### Automated Testing
- ✅ Unit tests with coverage reporting
- ✅ E2E tests with Playwright
- ✅ TypeScript type checking  
- ✅ ESLint code quality checks
- ✅ Security vulnerability audits
- ✅ Performance budget monitoring

### Deployment Flow
1. **Pull Request**: All tests and checks must pass
2. **Branch Protection**: Direct pushes to main branch blocked
3. **Merge to Main**: Automatic deployment to production
4. **Preview Deployments**: Each PR gets a unique preview URL

### Branch Protection
The main branch is protected with the following rules:
- Required status checks: All CI tests must pass
- Require pull request reviews
- No direct pushes allowed
- Linear history enforced

## 🔧 Development Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd my-forum-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run e2e          # Run E2E tests
npm run e2e:ui       # Run E2E tests with UI
```

## 🎯 React Ecosystem Integration

### Why Did You Render
This project integrates **Why Did You Render** from the approved React ecosystem tools list for performance monitoring:

- **Purpose**: Identifies unnecessary re-renders in React components
- **Usage**: Automatically detects and logs performance issues in development
- **Configuration**: Located in `src/dev/whyDidYouRender.ts`
- **Benefits**: Helps optimize component performance and identify rendering bottlenecks

#### Monitored Components:
- LoginForm
- ThreadCard  
- VoteButtons
- ThreadList
- NavigationBar

### React DevTools
The application is fully compatible with React DevTools browser extension for:
- Component tree inspection
- Props and state debugging
- Performance profiling
- Redux DevTools integration

## 📁 Project Structure

```
src/
├── core/                   # Core application logic
│   ├── store/             # Redux store configuration
│   │   └── slices/        # Redux slices with tests
│   └── router/            # Application routing
├── modules/               # Feature modules
│   ├── auth/              # Authentication module
│   ├── threads/           # Thread management module
│   └── leaderboard/       # Leaderboard module
├── shared/                # Shared components and utilities
│   ├── components/        # Reusable UI components
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── e2e/                   # End-to-end tests
├── dev/                   # Development tools
└── styles/                # Global styles
```

## 🔐 Security

- ✅ JWT token-based authentication
- ✅ Protected routes with authentication guards
- ✅ Input validation and sanitization
- ✅ HTTPS enforced in production
- ✅ Regular security audits via CI/CD
- ✅ No secrets in repository

## 📊 Performance

- ✅ Code splitting with dynamic imports
- ✅ Optimistic updates for better UX
- ✅ Bundle size monitoring
- ✅ Performance budget enforcement
- ✅ Lighthouse CI integration
- ✅ Why Did You Render for React optimization

## 🚀 Deployment

### Vercel (Production)
- **URL**: Deployed automatically on merge to main
- **Preview**: Each PR gets a preview deployment
- **Configuration**: `vercel.json`

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run the test suite: `npm test && npm run e2e`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript strict mode
- Use ESLint configuration
- Add proper type definitions
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For deployment and setup instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

For issues and questions:
1. Check existing GitHub issues
2. Review the deployment guide
3. Check CI/CD pipeline logs
4. Create a new issue with detailed information