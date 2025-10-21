# 🎨 AREA Frontend - Structure Organisée

Une application React + TypeScript professionnelle avec une architecture claire et des outils de développement complets.

## 🚀 Features

- ⚛️ **React 18** with TypeScript
- ⚡ **Vite** for fast development and building
- 🧹 **ESLint** + **Prettier** for code quality
- 🐕 **Husky** + **lint-staged** for git hooks
- 📝 **Commitlint** for conventional commits
- 🧪 **Jest** + **Testing Library** for testing
- 🔒 **dotenv-safe** for environment validation
- 📊 **Sentry** for error monitoring
- 🔧 **Path mapping** with `@/` alias

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

3. **Initialize git hooks:**
   ```bash
   npm run prepare
   ```

## 🏃‍♂️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript compiler check
- `npm run audit` - Run security audit

### Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

## 🏗️ Building

Build for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📝 Code Quality

### Linting

This project uses ESLint with the following configurations:
- React recommended rules
- React Hooks rules
- JSX a11y for accessibility
- TypeScript recommended rules
- Prettier integration

### Formatting

Prettier is configured with:
- Single quotes
- 2 spaces indentation
- Trailing commas (ES5)
- Semicolons

### Git Hooks

The project uses Husky for git hooks:

- **pre-commit**: Runs lint-staged to lint and format staged files
- **commit-msg**: Validates commit messages using commitlint

### Commit Convention

This project follows [Conventional Commits](https://conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Example:
```
feat: add user authentication
fix: resolve login validation issue
docs: update installation guide
```

## 🔒 Environment Variables

Required environment variables:

- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENVIRONMENT` - Environment name (development/production)
- `REACT_APP_VERSION` - Application version

Optional:
- `REACT_APP_SENTRY_DSN` - Sentry DSN for error monitoring

## 📊 Monitoring

This project includes Sentry integration for:
- Error tracking
- Performance monitoring
- Session replay (configurable)

Configure your Sentry DSN in the environment variables to enable monitoring.

## 🔧 IDE Configuration

### VS Code

Recommended extensions:
- ESLint
- Prettier - Code formatter
- TypeScript Importer
- Jest
- GitLens

### Settings

The project includes workspace settings for consistent development experience.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── __mocks__/          # Jest mocks
├── __tests__/          # Test files
├── App.tsx             # Main App component
├── main.tsx            # Application entry point
├── sentry.ts           # Sentry configuration
└── setupTests.ts       # Test setup
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/new-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m "feat: add new feature"`
6. Push to the branch: `git push origin feat/new-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
