# EGO Playwright Automation

[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Cucumber](https://img.shields.io/badge/Cucumber-23D96C?style=flat&logo=cucumber&logoColor=white)](https://cucumber.io/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive end-to-end test automation framework built with Playwright and Cucumber for e-commerce testing. This project automates critical user journeys including product browsing, search, cart management, and checkout flows.

## Features

###  Product Automation
- **PLP & PDP Testing** – Product browsing, filtering, variant selection with intelligent retry logic
- **Multi-Size Product Handling** – Specialized handling for products with size variants
- **Search Automation** – Search functionality with retry mechanisms for dynamic content

### Cart & Checkout
- **Cart Operations** – Add-to-cart, cart verification, pricing validation
- **Checkout Flows** – End-to-end testing for both guest and customer checkout
- **Payment Integration** – Support for multiple payment methods (Card, PayPal)

### User Flows
- **Authentication** – Login, signup, and logout automation
- **User Journeys** – Complete end-to-end user flow testing

### Framework Features
- **Intelligent Retry Logic** – Built-in retry mechanisms for PDP, PLP, and search scenarios
- **BDD with Cucumber** – Behavior-driven development using Gherkin syntax
- **Comprehensive Reporting** – HTML and JSON reports with detailed test execution results
- **Page Object Model** – Maintainable and scalable test architecture

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control system

### Supported Browsers & Devices
- **Browsers**: Chromium, Firefox, WebKit (installed automatically by Playwright)
- **Platforms**: Windows, macOS,
- **Devices**: Desktop and mobile viewport testing supported

## Getting Started

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd Ego-Automation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run your first test
npm run test:homepage
```

## Installation

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ego-Automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Configure environment variables**
   
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   BASE_URL=https://your-ecommerce-site.com
   TIMEOUT=30000
   HEADLESS=false
   # Add other environment variables as needed
   ```

## Usage

### Running Tests

The project uses a custom test wrapper script for organized test execution. Below are the available test commands:

#### Test Suites

| Suite Category | Command | Description |
|----------------|---------|-------------|
| **E2E** | `npm run test:e2e` | Complete end-to-end test suite |
| **Full Journey** | `npm run test:fulljourney` | Complete user journey from login to checkout |
| **Authentication** | `npm run test:login` | User login tests |
| | `npm run test:signup` | User signup tests |
| | `npm run test:logout` | User logout tests |
| **Product Pages** | `npm run test:homepage` | Homepage functionality tests |
| | `npm run test:plp` | Product Listing Page tests |
| | `npm run test:pdp` | Product Detail Page tests |
| | `npm run test:search` | Search functionality tests |
| **Cart & Checkout** | `npm run test:addtocart` | Add-to-cart functionality tests |
| | `npm run test:checkout` | All checkout tests |
| | `npm run test:checkout:guest` | Guest checkout flow |
| | `npm run test:checkout:customer` | Customer checkout flow |

### Running with Tags

You can run specific scenarios using Cucumber tags:

```bash
# Run guest checkout scenarios
node scripts/run-test-wrapper.js checkout --tags @guest

# Run customer checkout scenarios
node scripts/run-test-wrapper.js checkout --tags @customer
```

## Project Structure

```
Ego-Automation/
│
├── config/                      # Configuration files
│   ├── config.js               # Main configuration settings
│   ├── constants.js            # Application constants
│   ├── egoLabels.js            # UI element labels
│   ├── egoLogs.js              # Logging configuration
│   └── testData.js             # Test data management
│
├── features/                    # Cucumber feature files (BDD scenarios)
│   ├── step-definitions/       # Step implementations for all features
│   ├── support/                # Cucumber hooks, utils, and world context
│   └── *.feature               # Gherkin feature files
│
├── locators/                    # Element locators (Page Object Model)
│   └── *Locators.js            # Locators for each page/component
│
├── pages/                       # Page Object classes
│   ├── ProductDetailPage/      # PDP pages (standard & multi-size)
│   ├── checkout/               # Checkout pages (guest, customer, auth)
│   ├── paymentMethods/         # Payment handlers (Card, PayPal)
│   └── *.js                    # Page objects for each feature
│
├── scripts/                     # Test execution and reporting scripts
│   ├── generate-report.js      # HTML report generation
│   ├── run-test-wrapper.js     # Test execution wrapper
│   └── run-test.js             # Core test runner
│
├── utils/                       # Utility functions
│   └── dynamicWait.js          # Retry logic and dynamic wait helpers
│
├── reports/                     # Auto-generated test reports (JSON & HTML)
│
├── .env.example                 # Example environment configuration
├── cucumber.js                  # Cucumber configuration
├── playwright.config.js         # Playwright configuration
└── package.json                 # Project dependencies and scripts
```

### Key Directories

- **`config/`** - Centralized configuration for environment settings, constants, and test data
- **`features/`** - BDD scenarios written in Gherkin with step definitions and support files
- **`locators/`** - Element selectors separated from page logic for maintainability
- **`pages/`** - Page Object Model implementation with reusable page classes
- **`scripts/`** - Custom test runners and report generators
- **`utils/`** - Shared utilities including retry logic for dynamic content
- **`reports/`** - Generated after test execution (not committed to version control)

## Retry Logic

The framework implements intelligent retry mechanisms to handle dynamic content and improve test reliability:

| Feature | Purpose | Use Cases |
|---------|---------|----------|
| **PDP Retry** | Handle dynamic product loading | Product images, price updates, size selection, add-to-cart availability |
| **PLP Retry** | Ensure listings are fully loaded | Product grid loading, filters, pagination, product interactions |
| **Search Retry** | Handle search result loading | Search suggestions, results rendering, auto-complete, no-results |

### Configuration

Retry logic is configured in `utils/dynamicWait.js` and can be customized based on application behavior.

**Example: Customizing Retry Settings**

```javascript
// utils/dynamicWait.js
const retryConfig = {
  maxRetries: 3,           // Maximum number of retry attempts
  retryDelay: 1000,        // Delay between retries (ms)
  timeout: 30000,          // Overall timeout (ms)
};

// Usage in page objects
await dynamicWait.waitForElement(selector, retryConfig);
```

You can override these settings in `config/config.js` for environment-specific behavior.

## Test Reports

After test execution, reports are generated in the `reports/` directory:

- **Cucumber JSON Report**: `reports/cucumber-report.json`
- **HTML Report**: Generated using `multiple-cucumber-html-reporter`

To generate HTML reports after test execution:

```bash
node scripts/generate-report.js
```

## Configuration

### Main Configuration (`config/config.js`)

Contains environment-specific settings, timeouts, and browser configurations.

### Constants (`config/constants.js`)

Defines application-wide constants and URLs.

### Test Data (`config/testData.js`)

Manages test data for different scenarios.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Follow coding standards**
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Follow the existing Page Object Model pattern
   - Write clear Gherkin scenarios

4. **Write tests**
   - Add feature files for new functionality
   - Implement corresponding step definitions
   - Update page objects and locators as needed

5. **Commit your changes**
   ```bash
   git commit -m "Add: description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure all tests pass

### Code Style

- Use consistent indentation (2 spaces)
- Follow ESLint rules (if configured)
- Keep functions focused and single-purpose
- Use async/await for asynchronous operations

## Troubleshooting

### Common Issues

**Tests failing due to timeouts**
- Increase timeout values in `playwright.config.js`
- Check network connectivity
- Verify application availability
- Review retry configuration in `utils/dynamicWait.js`

**Element not found errors**
- Review locators in `locators/` directory
- Check if UI has changed
- Ensure page is fully loaded before interaction
- Verify element selectors are up to date

**Browser not launching**
- Run `npx playwright install` to reinstall browsers
- Check system compatibility
- Verify Node.js version (v16 or higher required)

**Environment configuration issues**
- Ensure `.env` file exists (copy from `.env.example`)
- Verify all required environment variables are set
- Check BASE_URL is accessible

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions, issues, or contributions:

- **Issues**: Open an issue in the repository
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Pull Requests**: Contributions are welcome! See [Contributing](#contributing) section

## Author

**Umair** - [GitHub Profile](https://github.com/sana513)

---

**Built with** ❤️ **using Playwright and Cucumber**
