// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Users, 
  TrendingUp,
  ArrowRight,
  Star,
  Globe,
  Lock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Shield,
      title: "KI-Risiko-Analyse",
      description: "Fortschrittliche KI analysiert deinen Content in Echtzeit auf 6 kritische Risiko-Kategorien.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: AlertTriangle,
      title: "Instant Warnungen",
      description: "Erhalte sofortige Warnungen bevor du postest - schütze deine Karriere und Reputation.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Sparkles,
      title: "Smart Suggestions",
      description: "Erhalte intelligente Verbesserungsvorschläge für sichereren und effektiveren Content.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Multi-Platform",
      description: "Funktioniert nahtlos mit Facebook, Instagram, LinkedIn, Twitter/X und mehr.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Lock,
      title: "100% Privat",
      description: "Deine Daten bleiben verschlüsselt und privat. DSGVO-konform und sicher.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Risiko-Tracking",
      description: "Verfolge deine Fortschritte und werde mit der Zeit risikobewusster.",
      color: "from-teal-500 to-blue-500"
    }
  ];

  const stats = [
    { value: "50K+", label: "Aktive Nutzer" },
    { value: "2M+", label: "Analysen durchgeführt" },
    { value: "98%", label: "Genauigkeit" },
    { value: "4.9/5", label: "Bewertung" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Marketing Manager",
      content: "Diese App hat mir buchstäblich meinen Job gerettet. Ein Post hätte fast meine Karriere ruiniert!",
      rating: 5
    },
    {
      name: "Michael K.",
      role: "Influencer",
      content: "Endlich kann ich sicher posten ohne Angst vor Shitstorms. Absolut unverzichtbar!",
      rating: 5
    },
    {
      name: "Anna L.",
      role: "HR Direktorin",
      content: "Wir nutzen es im ganzen Team. Die Anzahl der PR-Krisen ist auf null gesunken.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "0€",
      period: "für immer",
      features: [
        "10 Analysen pro Monat",
        "Basis-Risikoanalyse",
        "2 Sprachen (DE, EN)",
        "Standard Support"
      ],
      cta: "Kostenlos starten",
      popular: false
    },
    {
      name: "Pro",
      price: "9,99€",
      period: "pro Monat",
      features: [
        "Unbegrenzte Analysen",
        "Erweiterte KI-Analyse",
        "Browser Extension",
        "Persönliches Risiko-Profil",
        "Priority Support",
        "Analyse-Historie"
      ],
      cta: "Jetzt upgraden",
      popular: true
    },
    {
      name: "Premium",
      price: "29,99€",
      period: "pro Monat",
      features: [
        "Alles aus Pro",
        "Team-Accounts (bis 5)",
        "API-Zugang",
        "Custom Risiko-Regeln",
        "Legal Shield",
        "Dedizierter Support"
      ],
      cta: "Premium wählen",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">ThinkBeforePost</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
                Features
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">
                Preise
              </Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition">
                Bewertungen
              </Link>
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition">
                Login
              </Link>
              <Link 
                href="/auth/register"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
              >
                Kostenlos starten
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4 mr-2" />
              Über 50.000 Nutzer vertrauen uns bereits
            </span>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Stop. Think.<br />Post Safely.
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Ein unbedachter Post kann deine Karriere ruinieren. 
            Unsere KI analysiert deine Inhalte <span className="text-foreground font-semibold">bevor</span> du postest.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition group"
            >
              Jetzt kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-border hover:border-primary transition"
            >
              Live Demo ansehen
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="max-w-5xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Das Problem ist real
            </h2>
            <p className="text-xl text-muted-foreground">
              Jeden Tag ruinieren Menschen ihre Karrieren mit unbedachten Posts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">37% der Arbeitgeber</h3>
              <p className="text-muted-foreground">
                haben bereits Bewerber wegen Social Media Posts abgelehnt
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">54% wurden gefeuert</h3>
              <p className="text-muted-foreground">
                oder mussten zurücktreten wegen problematischer Posts
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">€250.000 Schaden</h3>
              <p className="text-muted-foreground">
                durchschnittlicher Schaden bei Reputationsverlust
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Schütze deine digitale Reputation
            </h2>
            <p className="text-xl text-muted-foreground">
              Modernste KI-Technologie analysiert deinen Content in Echtzeit
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="relative z-10 bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                {hoveredFeature === index && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 blur-xl`} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Was unsere Nutzer sagen
            </h2>
            <p className="text-xl text-muted-foreground">
              Über 50.000 zufriedene Nutzer vertrauen uns täglich
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-xl border border-border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Einfache, transparente Preise
            </h2>
            <p className="text-xl text-muted-foreground">
              Wähle den Plan, der zu dir passt
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-card p-8 rounded-xl border-2 ${
                  plan.popular ? 'border-primary shadow-xl' : 'border-border'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      Beliebteste Wahl
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1">{plan.price}</div>
                  <div className="text-muted-foreground">{plan.period}</div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/auth/register"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit, sicher zu posten?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Starte noch heute kostenlos und schütze deine digitale Reputation
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition group"
          >
            Jetzt kostenlos starten
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Keine Kreditkarte erforderlich • 10 kostenlose Analysen pro Monat
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">ThinkBeforePost</span>
              </div>
              <p className="text-muted-foreground">
                Schütze deine Karriere und Reputation mit KI-gestützter Content-Analyse.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground">Preise</Link></li>
                <li><Link href="/extensions" className="text-muted-foreground hover:text-foreground">Browser Extension</Link></li>
                <li><Link href="/api" className="text-muted-foreground hover:text-foreground">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Über uns</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-foreground">Karriere</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Kontakt</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy" className="text-muted-foreground hover:text-foreground">Datenschutz</Link></li>
                <li><Link href="/legal/terms" className="text-muted-foreground hover:text-foreground">AGB</Link></li>
                <li><Link href="/legal/imprint" className="text-muted-foreground hover:text-foreground">Impressum</Link></li>
                <li><Link href="/legal/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            © 2025 ThinkBeforePost. Alle Rechte vorbehalten. Made with ❤️ in Germany.
          </div>
        </div>
      </footer>
    </div>
  );
}