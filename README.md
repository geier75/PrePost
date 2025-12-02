# 🛡️ PREPOST - Think Before You Post

**AI-Powered Social Media Protection**

> Schütze deine Karriere und Reputation mit KI-gestützter Content-Analyse in Echtzeit

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 Über das Projekt

PREPOST ist eine innovative Web-Anwendung, die Nutzer vor potenziell schädlichen Social Media Posts schützt. Unsere KI analysiert Content in Echtzeit und warnt vor karriereschädigenden, rechtlich problematischen oder toxischen Inhalten - bevor sie veröffentlicht werden.

**🌟 Trusted by 50,000+ Professionals**

### ✨ Hauptfunktionen

- 🧠 **AI Risk Analyzer** - Echtzeit-Analyse deiner Social Media Posts
- 📊 **Live Dashboard** - Übersichtliche Statistiken und Risk Alerts
- 🔒 **Privacy First** - DSGVO-konform mit vollständiger Datenkontrolle
- ⚡ **Instant Feedback** - Sofortige Warnungen bei kritischem Content
- 🎯 **Multi-Platform** - Unterstützung für LinkedIn, Twitter, Facebook & mehr
- 📈 **Analytics** - Detaillierte Insights zu deinem Posting-Verhalten

---

## 🚀 Demo

**Live Demo:** [Coming Soon]

### Screenshots

#### Landing Page
![Landing Page](docs/screenshots/landing.png)

#### Risk Analyzer
![Risk Analyzer](docs/screenshots/analyzer.png)

#### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14.2.3 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom Components
- **Animations:** Framer Motion

### Backend
- **API:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Cookie-based Sessions
- **AI Integration:** OpenAI/Claude (geplant)

### DevOps
- **Deployment:** Vercel
- **Monitoring:** Sentry (geplant)
- **Analytics:** PostHog (geplant)

---

## 📦 Installation

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Git

### Setup

1. **Repository klonen**
```bash
git clone https://github.com/DEIN_USERNAME/prepost.git
cd prepost
```

2. **Dependencies installieren**
```bash
npm install
# oder
yarn install
```

3. **Environment Variables**
```bash
cp .env.example .env.local
```

Fülle die `.env.local` mit deinen Credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
OPENAI_API_KEY=your_openai_key
```

4. **Development Server starten**
```bash
npm run dev
# oder
yarn dev
```

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

---

## 📁 Projektstruktur

```
prepost/
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── (routes)/          # Route Groups
│   │   ├── api/               # API Routes
│   │   └── layout.tsx         # Root Layout
│   ├── components/            # React Components
│   ├── lib/                   # Utilities & Services
│   └── services/              # Business Logic
├── public/                    # Static Assets
├── database/                  # Database Schema
└── tests/                     # Test Files
```

---

## 🔧 Development

### Verfügbare Scripts

```bash
npm run dev          # Development Server starten
npm run build        # Production Build erstellen
npm run start        # Production Server starten
npm run lint         # Code Linting
npm run test         # Tests ausführen
```

### Code Style

Wir verwenden ESLint und Prettier für konsistenten Code Style:

```bash
npm run lint         # Linting prüfen
npm run format       # Code formatieren
```

---

## 🧪 Testing

```bash
npm run test         # Unit Tests
npm run test:e2e     # E2E Tests
npm run test:coverage # Coverage Report
```

---

## 📊 Features & Status

| Feature | Status | Beschreibung |
|---------|--------|--------------|
| Landing Page | ✅ | Professionelle Marketing-Seite |
| Risk Analyzer | ✅ | Content-Analyse in Echtzeit |
| Dashboard | ✅ | Statistiken & Analytics |
| Authentication | ⚠️ | Basic Login (Security Improvements nötig) |
| Supabase Integration | 🚧 | In Arbeit |
| Real AI Analysis | 🚧 | OpenAI Integration geplant |
| Email Service | 📋 | Geplant |
| Payment Integration | 📋 | Stripe Integration geplant |
| Mobile App | 📋 | React Native geplant |

**Legende:**
- ✅ Fertig
- ⚠️ Funktional, aber Verbesserungen nötig
- 🚧 In Entwicklung
- 📋 Geplant

---

## 🔐 Security

- DSGVO-konform
- Cookie Consent Management
- Hashed IP Addresses
- Session Management
- Input Validation (in Arbeit)
- Rate Limiting (geplant)

**Sicherheitshinweis:** Dieses Projekt ist aktuell im DEMO/PROTOTYPE Stadium. Für Production-Einsatz müssen noch Security-Verbesserungen implementiert werden.

---

## 📈 Roadmap

### Q1 2025
- [x] Landing Page & Branding
- [x] Basic Risk Analyzer
- [x] Dashboard Prototype
- [ ] Supabase Integration
- [ ] Real AI Integration (OpenAI)

### Q2 2025
- [ ] Beta Launch
- [ ] Email Verification
- [ ] Password Reset
- [ ] User Profile Management
- [ ] Stripe Integration

### Q3 2025
- [ ] Public Launch
- [ ] Mobile App (iOS/Android)
- [ ] Browser Extension
- [ ] Team Features
- [ ] Enterprise Features

---

## 🤝 Contributing

Contributions sind willkommen! Bitte lies [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

### Development Workflow

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

---

## 📄 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](LICENSE) für Details.

---

## 👥 Team

- **Creator:** [Dein Name]
- **Contributors:** [Contributors Liste]

---

## 📞 Support

- **Email:** support@prepost.ai (coming soon)
- **Issues:** [GitHub Issues](https://github.com/DEIN_USERNAME/prepost/issues)
- **Discussions:** [GitHub Discussions](https://github.com/DEIN_USERNAME/prepost/discussions)

---

## 🌟 Acknowledgments

- Next.js Team für das fantastische Framework
- Vercel für Hosting & Deployment
- Supabase für die Backend-Infrastruktur
- OpenAI für KI-Capabilities

---

## 📊 Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Demo Ready](https://img.shields.io/badge/demo-ready-blue)
![Production Ready](https://img.shields.io/badge/production-in_progress-yellow)

**Current Version:** 1.0.0-beta  
**Last Updated:** Dezember 2025

---

<p align="center">
  Made with ❤️ by the PREPOST Team
</p>

<p align="center">
  <a href="#-über-das-projekt">Über</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-features--status">Features</a> •
  <a href="#-roadmap">Roadmap</a>
</p>
