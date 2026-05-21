# 🚀 Nextron API

Backend API for the Nextron AI account e-commerce platform.

## 📝 Description

Nextron API enables users to manage support tickets, connect with others, and discover new destinations through a modern REST API.

## ✨ Features

- **Session-Based Authentication** – Authentication based on server-side sessions.
- **Image Optimization** – Automatic image minification and conversion to WebP format.
- **Database Integration** – SQLite database integration using Mikro-ORM for type-safe queries.
- **Input Validation** – Request validation and schema enforcement using Zod.

## 🚀 Quick Start

> Make sure Node.js and pnpm are installed on your system.

Follow the steps below to run the project locally:

#### 1. Clone the repository

```bash
git clone https://github.com/mRYasinQ/nextron-api.git
cd nextron-api
```

#### 2. Create environment file

```bash
cp .env.example .env
```

#### 3. Install dependencies

```bash
pnpm install
```

#### 4. Build the project

```bash
pnpm build
```

#### 5. Start the application

```bash
pnpm start:prod
```

#### 6. Create superuser

```bash
pnpm superuser:create
```

#### 7. Access the application

- **API Base URL:** http://localhost:3001
- **API Documentation (Swagger):** http://localhost:3001/docs

## 🔧 Environment Configuration

```env
# Application.
NODE_ENV="production" # development | production, default: production
APP_URL="http://localhost:3001" # String, Example: http://localhost:3000, Default: http://localhost:3000
APP_PORT="3001" # Number, Example: 3000, Default: 3000
ENABLE_SWAGGER="1" # 0: false | 1: true, default 1
CORS_ORIGINS="http://localhost:3000" # String, Example: http://localhost:3000,http://localhost:3001

# Database.
DB_NAME="nextron.db" # String, Default: nextron.db

# Time, Example: 2m: 2 minute, 1d: 1 day
OTP_EXPIRE="3m" # Default: 3m
OTP_CACHE="1d" # Default: 1d
SESSION_EXPIRE="15d" # Default: 15d

# Throttle.
THROTTLE_TTL="60m" # Time, Example: 60m, Default: 60m
THROTTLE_LIMIT="100" # Number, Example: 100, Default: 100
```

## 🤝 Contributing

1. Fork the repository
2. Create branch: `git checkout -b feature/your-feature-name`
3. Commit: `git commit -m "feat(area): add feature description"`
4. Push: `git push origin feature/your-feature-name`
5. Create Pull Request

**Branch Naming:**

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Urgent fixes

## 📄 License

This project is licensed under the MIT License.
