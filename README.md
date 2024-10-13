# Personal Portfolio Website

A modern, accessible portfolio website built with React, TypeScript, and Vite. View the live site at [shawnkhoffman.dev](https://shawnkhoffman.dev).

## 🚀 Features

- **Modern Stack**: Built with React 18, TypeScript, and Vite for optimal development experience
- **Responsive Design**: Mobile-first approach using Tailwind CSS and DaisyUI
- **Internationalization**: Multi-language support with i18next
- **Accessibility**: ARIA-compliant with keyboard navigation and screen reader support
- **Performance Monitoring**: Integrated with DataDog RUM and Google Analytics
- **Error Handling**: Comprehensive error boundary implementation with error testing capabilities
- **Dark Mode**: System-aware theme switching with persistent user preference

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, DaisyUI
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **CI/CD**: GitHub Actions
- **Analytics**: DataDog RUM, Google Analytics
- **Deployment**: GitHub Pages

## 📦 Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/shawnkhoffman/shawnkhoffman.github.io.git
    cd shawnkhoffman.github.io
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file with required environment variables:

    ```bash
    VITE_DATADOG_SITE=
    VITE_DATADOG_SERVICE=
    VITE_DATADOG_CLIENT_TOKEN=
    VITE_DATADOG_APPLICATION_ID=
    VITE_GA_MEASUREMENT_ID=
    ```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

Other available scripts:

```bash
npm run build            # Build for production
npm run lint            # Run ESLint
npm run test            # Run tests
npm run test:coverage   # Run tests with coverage
npm run test:ui         # Run tests with UI
npm run lighthouse      # Run Lighthouse audit
npm run preview         # Preview production build
npm run analyze         # Analyze bundle size
npm run deploy          # Deploy to GitHub Pages
```

## 🧪 Testing

The project uses Vitest for testing with comprehensive configuration including:

- JSDOM environment for DOM testing
- Thread pooling for parallel test execution
- Coverage reporting
- Snapshot testing
- Integration with React Testing Library

Run tests:

```bash
npm run test          # Run tests
npm run test:coverage # Run tests with coverage
npm run test:ui       # Run tests with UI
```

## 📝 Code Style

The project uses TypeScript with strict type checking and ESLint for code quality. ESLint is configured with:

- TypeScript-aware rules
- React-specific plugins
- Strict type checking
- Custom rules for consistent code style

## 🌐 Internationalization

The site supports multiple languages using i18next with:

- Automatic language detection
- Fallback language support
- Lazy-loaded translations
- Namespace support for organized translations

## 🔒 Security

- CORS policies implemented
- Security headers configured
- Content Security Policy (CSP) enabled
- Rate limiting for API endpoints
- Secure cookie handling

## 📈 Performance

- Code splitting and lazy loading
- Image optimization
- Brotli compression
- Critical CSS inlining
- Preloading of critical assets

For more information about the site's features and implementation details, visit the [About This Site](https://shawnkhoffman.dev/about-this-site) page.
