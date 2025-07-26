# Deployment Guide

## GitHub Repository Setup

### Branch Protection Rules

To protect your main branch and enforce CI/CD pipeline, follow these steps:

1. **Go to your GitHub repository**
2. **Navigate to Settings > Branches**
3. **Add rule for `main` or `master` branch**
4. **Configure the following settings:**

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: 1
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (if you have CODEOWNERS file)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Add required status checks:**
    - `Test Suite (18.x)`
    - `Test Suite (20.x)`
    - `Security Audit`
    - `Performance Budget Check`

- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (recommended)
- ✅ **Include administrators** (applies rules to admins too)
- ✅ **Restrict pushes that create files** (prevent accidental large files)

#### Optional but Recommended:
- ✅ **Require linear history** (no merge commits)
- ✅ **Allow force pushes** (disabled)
- ✅ **Allow deletions** (disabled)

### Required Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

#### Vercel Deployment:
- `VERCEL_TOKEN` - Your Vercel personal access token
- `ORG_ID` - Your Vercel organization ID
- `PROJECT_ID` - Your Vercel project ID

#### Optional (for enhanced CI/CD):
- `CODECOV_TOKEN` - For code coverage reporting
- `LHCI_GITHUB_APP_TOKEN` - For Lighthouse CI performance testing

## Vercel Setup

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 2. Environment Variables (if needed)

Add any environment variables in Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add production environment variables

### 3. Domain Configuration

1. **Custom Domain** (optional):
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS settings as instructed

2. **Preview Deployments**:
   - Every PR will get a unique preview URL
   - Automatic deployment on merge to main branch

## Local Development Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd my-forum-app

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing Strategy

### Unit Tests
- **Location**: `src/**/__tests__/`
- **Command**: `npm test`
- **Coverage**: `npm run test:coverage`

### E2E Tests
- **Location**: `src/e2e/`
- **Command**: `npm run e2e`
- **UI Mode**: `npm run e2e:ui`

### Testing Scenarios Covered:
1. **Reducer Tests**: Complex state management logic
2. **Thunk Tests**: Async actions and API calls
3. **Component Tests**: User interactions and rendering
4. **E2E Tests**: Complete user workflows

## CI/CD Pipeline Features

### Automated Testing
- ✅ Unit tests with coverage
- ✅ E2E tests with Playwright
- ✅ TypeScript type checking
- ✅ ESLint code quality checks
- ✅ Security audit
- ✅ Performance budget monitoring

### Deployment Flow
1. **On Pull Request**: Run all tests and checks
2. **On Merge to Main**: Deploy to production
3. **Branch Protection**: Prevents direct pushes to main
4. **Preview Deployments**: Each PR gets a preview URL

## Monitoring and Maintenance

### Code Quality
- ESLint for code consistency
- TypeScript for type safety
- Prettier for code formatting (recommended to add)

### Performance
- Bundle size monitoring
- Lighthouse CI for performance audits
- Core Web Vitals tracking

### Security
- npm audit for dependency vulnerabilities
- GitHub security advisories
- Dependabot for automated updates (recommended to enable)

## Troubleshooting

### Common Issues

1. **Tests failing locally but passing in CI**
   - Check Node.js version compatibility
   - Clear `node_modules` and reinstall

2. **Vercel deployment fails**
   - Check build logs in Vercel dashboard
   - Verify environment variables are set
   - Ensure build command produces `dist` folder

3. **E2E tests failing**
   - Check if application builds successfully
   - Verify API endpoints are accessible
   - Check browser compatibility

### Getting Help
- Check GitHub Actions logs for CI/CD issues
- Review Vercel deployment logs
- Check browser console for runtime errors

## Security Considerations

- ✅ All secrets stored in GitHub Secrets
- ✅ No sensitive data in repository
- ✅ HTTPS enabled by default on Vercel
- ✅ Content Security Policy headers
- ✅ Regular dependency updates

## Performance Optimization

- ✅ Code splitting with dynamic imports
- ✅ Asset optimization and caching
- ✅ Bundle size monitoring
- ✅ Performance budget enforcement
- ✅ Core Web Vitals monitoring