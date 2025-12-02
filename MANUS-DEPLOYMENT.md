# 🚀 PREPOST - Manus Deployment Guide

**Standalone Version - Keine externen Abhängigkeiten**

---

## 📋 Übersicht

Diese Version von PREPOST ist **komplett standalone** und läuft vollständig auf Manus ohne externe Services wie:

- ❌ Keine Supabase (lokale Datei-Datenbank)
- ❌ Kein Clerk (eingebautes Auth-System)
- ❌ Kein Stripe (keine Zahlungen nötig)
- ❌ Keine externen APIs außer Anthropic

✅ **Nutzt nur:**
- Lokales Dateisystem für Datenbank
- Eingebaute Authentifizierung
- ANTHROPIC_API_KEY aus Manus Environment

---

## 🎯 Was wurde geändert?

### Neue Standalone-Komponenten

1. **Lokale Datenbank** (`src/lib/local-db.ts`)
   - JSON-basierte Datenspeicherung
   - Speichert in `/data` Verzeichnis
   - Collections: users, analyses, sessions

2. **Eingebaute Authentifizierung** (`src/lib/auth.ts`)
   - PBKDF2 Password Hashing
   - Session Management mit Tokens
   - Keine externen Auth-Provider

3. **Standalone API Routes**
   - `/api/analyze-standalone` - Content-Analyse
   - `/api/auth-standalone/login` - Login
   - `/api/auth-standalone/register` - Registrierung
   - `/api/auth-standalone/logout` - Logout
   - `/api/user-standalone/me` - User Profile
   - `/api/dashboard-standalone` - Dashboard Daten

---

## 🔧 Installation & Setup

### 1. Projekt klonen

```bash
git clone https://github.com/geier75/PrePost.git
cd PrePost
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Environment Variables

Erstelle `.env.local`:

```bash
# Nur diese Variable wird benötigt!
ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Wichtig:** Der `ANTHROPIC_API_KEY` ist bereits in Manus als Environment Variable gesetzt!

### 4. Datenverzeichnis erstellen

```bash
mkdir -p data
chmod 755 data
```

### 5. Build & Start

```bash
# Production Build
npm run build

# Start Server
npm start
```

Oder für Development:

```bash
npm run dev
```

---

## 📂 Datenstruktur

### Lokale Datenbank

Alle Daten werden in JSON-Dateien gespeichert:

```
data/
├── users.json          # Benutzer
├── analyses.json       # Analysen
└── sessions.json       # Sessions
```

**Beispiel `users.json`:**
```json
[
  {
    "id": "uuid-123",
    "email": "user@example.com",
    "password_hash": "salt:hash",
    "full_name": "Max Mustermann",
    "created_at": "2025-12-02T10:00:00.000Z",
    "last_login": "2025-12-02T12:00:00.000Z",
    "settings": {
      "language": "de",
      "notifications": true
    }
  }
]
```

---

## 🔐 Authentifizierung

### Registrierung

```bash
curl -X POST http://localhost:3000/api/auth-standalone/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "full_name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth-standalone/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "full_name": "Test User"
  }
}
```

Das Auth-Token wird als HttpOnly Cookie gesetzt.

---

## 🧠 Content-Analyse

### Analyse durchführen

```bash
curl -X POST http://localhost:3000/api/analyze-standalone \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Ich hasse meinen Chef!",
    "platform": "linkedin"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "overallRisk": "high",
      "riskScore": 85,
      "recommendation": "danger",
      "categories": [
        {
          "name": "Professionalität",
          "score": 90,
          "severity": "high",
          "description": "Unprofessionelle Sprache erkannt"
        }
      ],
      "suggestions": [
        "Vermeide negative Aussagen über Arbeitgeber",
        "Formuliere konstruktiv statt emotional"
      ],
      "confidence": 92
    }
  }
}
```

---

## 📊 Dashboard

### Dashboard-Daten abrufen

```bash
curl http://localhost:3000/api/dashboard-standalone \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "full_name": "Test User"
    },
    "statistics": {
      "totalAnalyses": 42,
      "riskDistribution": {
        "none": 10,
        "low": 15,
        "medium": 12,
        "high": 5
      },
      "averageRiskScore": 35
    },
    "recentAnalyses": [...]
  }
}
```

---

## 🚀 Deployment auf Manus

### Schritt 1: Repository vorbereiten

```bash
# Stelle sicher, dass alle Änderungen committed sind
git add .
git commit -m "Standalone version for Manus"
git push origin main
```

### Schritt 2: Auf Manus deployen

1. Öffne Manus
2. Erstelle neues Web-Projekt:
   ```
   Repository: https://github.com/geier75/PrePost
   Branch: main
   Framework: Next.js
   ```

3. Environment Variables setzen:
   - `ANTHROPIC_API_KEY` ist bereits verfügbar ✅
   - Optional: `NODE_ENV=production`

4. Build Command:
   ```bash
   npm run build
   ```

5. Start Command:
   ```bash
   npm start
   ```

### Schritt 3: Datenverzeichnis

Manus erstellt automatisch ein persistentes `/data` Verzeichnis.

---

## 🔒 Sicherheit

### Passwort-Hashing

- **Algorithmus:** PBKDF2
- **Iterations:** 100,000
- **Key Length:** 64 bytes
- **Digest:** SHA-512
- **Salt:** 32 bytes (zufällig)

### Session Management

- **Token:** UUID v4
- **Speicherung:** HttpOnly Cookies
- **Lifetime:** 7 Tage
- **Auto-Cleanup:** Abgelaufene Sessions werden gelöscht

### Rate Limiting

- **Limit:** 20 Requests / Minute
- **Methode:** In-Memory LRU Cache
- **Identifier:** IP-Adresse

---

## 📈 Performance

### Optimierungen

1. **Datei-basierte DB:**
   - Schnelle Lese-/Schreiboperationen
   - Keine Netzwerk-Latenz
   - Automatisches Caching

2. **Minimale Dependencies:**
   - Nur essenzielle npm Pakete
   - Keine schweren Frameworks
   - Schneller Build

3. **Edge-Ready:**
   - Stateless API Routes
   - Kann auf Edge Functions laufen
   - Globale Verfügbarkeit

---

## 🧪 Testing

### Manuelles Testen

1. **Registrierung testen:**
```bash
curl -X POST http://localhost:3000/api/auth-standalone/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!","full_name":"Test"}'
```

2. **Login testen:**
```bash
curl -X POST http://localhost:3000/api/auth-standalone/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test1234!"}'
```

3. **Analyse testen:**
```bash
curl -X POST http://localhost:3000/api/analyze-standalone \
  -H "Content-Type: application/json" \
  -d '{"content":"Test Post","platform":"twitter"}'
```

---

## 🐛 Troubleshooting

### Problem: "Supabase not configured"

**Lösung:** Ignoriere alte Supabase-Dateien, nutze nur die `-standalone` APIs.

### Problem: "ANTHROPIC_API_KEY not set"

**Lösung:** 
```bash
export ANTHROPIC_API_KEY=sk-ant-api03-...
```

Oder in `.env.local` setzen.

### Problem: "Permission denied: data/"

**Lösung:**
```bash
mkdir -p data
chmod 755 data
```

### Problem: "Session expired"

**Lösung:** Erneut einloggen. Sessions laufen nach 7 Tagen ab.

---

## 📝 API Dokumentation

### Authentifizierung

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/auth-standalone/register` | POST | `{email, password, full_name}` | `{success, userId}` |
| `/api/auth-standalone/login` | POST | `{email, password}` | `{success, user}` + Cookie |
| `/api/auth-standalone/logout` | POST | - | `{success}` |

### Analyse

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/analyze-standalone` | POST | `{content, platform}` | `{success, data: {analysis}}` |
| `/api/analyze-standalone` | GET | - | Health Check |

### User

| Endpoint | Method | Headers | Response |
|----------|--------|---------|----------|
| `/api/user-standalone/me` | GET | Cookie: auth_token | `{success, user}` |
| `/api/dashboard-standalone` | GET | Cookie: auth_token | `{success, data}` |

---

## 🎨 Frontend Integration

### Beispiel: Login Component

```typescript
async function handleLogin(email: string, password: string) {
  const response = await fetch('/api/auth-standalone/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Wichtig für Cookies!
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } else {
    alert(data.error);
  }
}
```

### Beispiel: Analyse Component

```typescript
async function analyzeContent(content: string, platform: string) {
  const response = await fetch('/api/analyze-standalone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, platform }),
    credentials: 'include',
  });
  
  const data = await response.json();
  
  if (data.success) {
    return data.data.analysis;
  } else {
    throw new Error(data.error);
  }
}
```

---

## 📊 Monitoring

### Logs

Alle Logs werden in der Console ausgegeben:

```bash
# Development
npm run dev

# Production (mit PM2)
pm2 start npm --name "prepost" -- start
pm2 logs prepost
```

### Metriken

- Response Times in `X-Response-Time` Header
- Request Count via Rate Limiter
- Error Rates in Console Logs

---

## 🔄 Updates

### Datenbank-Migration

Bei Schema-Änderungen:

1. Backup erstellen:
```bash
cp -r data data-backup-$(date +%Y%m%d)
```

2. Migration-Script ausführen (falls nötig)

3. Testen

4. Backup löschen (nach erfolgreicher Migration)

---

## 📞 Support

Bei Problemen:

1. Check Logs: `pm2 logs prepost`
2. Check Data Dir: `ls -la data/`
3. Check Environment: `env | grep ANTHROPIC`
4. GitHub Issues: https://github.com/geier75/PrePost/issues

---

## ✅ Checkliste für Deployment

- [ ] Repository geklont
- [ ] Dependencies installiert (`npm install`)
- [ ] `.env.local` erstellt mit `ANTHROPIC_API_KEY`
- [ ] `/data` Verzeichnis erstellt
- [ ] Production Build erfolgreich (`npm run build`)
- [ ] Server startet (`npm start`)
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Analyse funktioniert
- [ ] Dashboard lädt

---

## 🎉 Fertig!

PREPOST läuft jetzt komplett standalone auf Manus!

**Nächste Schritte:**
1. Erste Benutzer registrieren
2. Content analysieren
3. Feedback sammeln
4. Iterieren & Verbessern

---

<p align="center">
  Made with ❤️ for Manus Deployment
</p>
