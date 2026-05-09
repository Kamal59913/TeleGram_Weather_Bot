# ⛅ Telegram Weather Bot

A full-stack **Telegram Weather Bot** with a dedicated **Admin Panel** for managing subscribers and weather configurations. Users interact with the bot on Telegram to get real-time weather updates and can subscribe for automatic daily notifications.

---

## 🏗️ Architecture

```
TeleGram_Weather_Bot/
├── backend/          # NestJS REST API + Telegram Bot
└── admin/            # React Admin Panel (Turborepo + Vite)
```

| Layer | Tech Stack |
|-------|-----------|
| **Bot & API** | NestJS, Mongoose, node-telegram-bot-api, JWT, bcrypt |
| **Database** | MongoDB |
| **Admin Panel** | React 19, Vite, React Router, TailwindCSS, Turborepo |
| **Weather Data** | OpenWeatherMap API |

---

## ✨ Features

### 🤖 Telegram Bot
- `/start` — Welcome message and usage guide
- `<city name>` — Get current weather for any city
- `/<city>` — Subscribe to daily weather updates for that city
- `/Unsubscribe` — Stop receiving daily updates
- Automated scheduled weather notifications to all active subscribers
- Rich HTML-formatted weather messages with temperature, humidity, pressure, wind speed, and more

### 🖥️ Admin Panel
- **JWT Authentication** with secure login
- **Dashboard** — Overview of bot activity and stats
- **Subscribers Management** — View and manage all bot subscribers
- **Weather Config** — Configure weather API settings
- **Account Settings** — Admin profile management
- Responsive design with dark mode support

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)
- **Telegram Bot Token** — Create one via [@BotFather](https://t.me/BotFather)
- **OpenWeatherMap API Key** — Get one at [openweathermap.org](https://openweathermap.org/api)

### 1. Clone the Repository

```bash
git clone https://github.com/Kamal59913/TeleGram_Weather_Bot.git
cd TeleGram_Weather_Bot
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your actual credentials
```

**Required environment variables:**

| Variable | Description |
|----------|-------------|
| `DB_URI` | MongoDB connection string |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather |
| `API_OF_WEATHER` | OpenWeatherMap API key |
| `JWT_SECRET` | Secret key for JWT signing |
| `FRONT_END_URL` | Admin panel URL (for subscribe button) |

```bash
# Seed default admin account
npx ts-node --transpile-only ./scripts/seed-admin.ts

# Start development server
npm run dev
```

The backend runs on **http://localhost:5000** by default.

### 3. Admin Panel Setup

```bash
cd admin
npm install

# Create environment file
cp apps/admin/.env.example apps/admin/.env

# Start development server
npm run dev
```

The admin panel runs on **http://localhost:5173** by default.

**Default admin credentials:**
```
Username: admin
Password: Admin@123
```

---

## 📁 Project Structure

### Backend (`/backend`)

```
src/
├── app.module.ts                        # Root module
├── app.controller.ts                    # Admin auth endpoints
├── app.service.ts                       # Admin auth + JWT logic
├── admin.schema.ts                      # Admin Mongoose schema
├── book/                                # Subscriber module
│   ├── subscribe.controller.ts          # Subscriber CRUD endpoints
│   ├── subscribe.service.ts             # Subscriber business logic
│   └── schema/                          # User & API schemas
└── telegram-assignment-ast/             # Telegram bot module
    ├── telegram-assignment-ast.service.ts  # Bot polling + weather logic
    └── telegram-assignment-ast.module.ts   # Module config
```

### Admin Panel (`/admin`)

```
apps/admin/src/
├── components/
│   ├── auth/            # Auth guards & wrappers
│   ├── dashboard/       # Dashboard module
│   ├── subscribers/     # Subscriber management
│   ├── weather-config/  # Weather API configuration
│   └── settings/        # Account settings
├── layout/              # App shell (sidebar, header)
├── api/                 # API client & endpoints
├── redux/               # State management
└── routes/              # Route configuration
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/login` | Admin login |
| `GET` | `/admin/profile` | Get admin profile |

### Subscribers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/subscribers` | List all subscribers |
| `POST` | `/subscribers/block/:id` | Block a subscriber |
| `DELETE` | `/subscribers/:id` | Delete a subscriber |

---

## 🛡️ Security Notes

- All passwords are hashed with **bcrypt**
- API authentication via **JWT Bearer tokens**
- Environment variables are **never committed** — use `.env.example` as a template
- Admin seeding uses configurable credentials from environment

---

## 📜 License

This project is unlicensed — feel free to use it for learning and reference.

---

## 👤 Author

**Kamal** — [GitHub](https://github.com/Kamal59913)
