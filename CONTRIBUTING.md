# Contributing to react-meet

First off, thank you for considering contributing to react-meet! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, Browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass: `npm test`
6. Update documentation if needed
7. Commit your changes: `git commit -m 'Add amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Setup

1. Fork and clone the repository:

```bash
git clone https://github.com/yourusername/react-meet.git
cd react-meet
```

2. Install dependencies:

```bash
npm install
```

3. Start development:

```bash
npm run dev
```

4. Run tests:

```bash
npm test
```

## Project Structure

```
react-meet/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom hooks
│   ├── types/         # TypeScript definitions
│   ├── utils/         # Utility functions
│   └── styles/        # CSS styles
├── examples/          # Usage examples
├── docs/             # Documentation
└── tests/            # Test files
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Handle edge cases and error states

### CSS/Styling

- Use Tailwind CSS classes when possible [[memory:4515552]]
- Define custom colors in the Tailwind theme configuration
- Ensure responsive design
- Follow accessibility guidelines

### Testing

- Write tests for new features
- Maintain good test coverage
- Test edge cases and error conditions
- Use descriptive test names

## Commit Messages

Follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` code style changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:

```
feat: add device switching functionality
fix: resolve video mirroring issue
docs: update API documentation
```

## Release Process

We use semantic versioning (SemVer):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

## Questions?

Don't hesitate to ask questions by creating an issue with the "question" label.

## License

By contributing to react-meet, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🚀
