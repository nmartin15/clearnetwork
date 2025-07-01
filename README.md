# ClearNet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

ClearNet is a consent-first, AI-augmented professional network that fuses the best of LinkedIn (profiles, opportunities) and Skool (learning, groups, community) without the noise, spam, or attention hijacking.

## 🌟 Features

- **Consent-First Messaging**: No cold outreach, only meaningful connections
- **AI-Augmented Profiles**: Smart profile building with AI assistance
- **Learning-Focused Communities**: Structured educational spaces for professional growth
- **Opportunity Discovery**: Find relevant opportunities without the spam
- **Open Source**: Transparent, community-driven development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- pnpm 8+
- Python 3.9+ (for certain services)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nmartin15/clearnetwork.git
   cd clearnetwork
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

## 🛠️ Project Structure

```
clearnetwork/
├── apps/
│   ├── web/           # Next.js frontend
│   ├── api/           # Python FastAPI backend
│   └── agents/        # AI agent services
├── packages/
│   ├── mcp/          # Model Context Protocol implementation
│   ├── db/           # Database schemas and migrations
│   └── types/        # Shared TypeScript types
└── docs/             # Project documentation
```

## 📚 Documentation

For detailed documentation, please visit our [documentation site](https://github.com/nmartin15/clearnetwork/tree/main/docs).

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by the ClearNet community
- Inspired by the need for better professional networking tools
- Thanks to all contributors who help make this project better

## 📬 Contact

For questions or feedback, please [open an issue](https://github.com/nmartin15/clearnetwork/issues) or contact [Your Name] at [your.email@example.com].

## 🔧 Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Linting
```bash
pnpm lint
```

## 🚀 Deployment

### Production
```bash
pnpm build
pnpm start
```

### Development
```bash
pnpm dev
```

## 🤝 Community

Join our community on [Discord/Slack/other platform] to connect with other developers and contributors.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of notable changes to the project.
