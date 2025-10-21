# 🚀 AREA Project

Action REAction automation platform built with modern technologies and automated development workflow.

## ⚡ Quick Start for New Developers

```bash
# 1. Clone the repository
git clone <repository-url>
cd AREA-Project

# 2. Automated setup (one command does everything!)
./scripts/setup-dev.sh

# 3. Start development
docker-compose -f docker/docker-compose.dev.yml up
```

**That's it! 🎉 Everything is automatically configured:**
- ✅ All dependencies installed
- ✅ Git hooks configured (ESLint, Prettier, Commitlint)
- ✅ Database initialized
- ✅ Hot-reload enabled
- ✅ Quality tools ready

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- Database: localhost:5432

## 🏗️ Architecture

### Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: NestJS + TypeScript + Prisma
- **Database**: PostgreSQL (dev) / SQLite (simple)
- **Quality**: ESLint + Prettier + Husky + Jest
- **Container**: Docker + Docker Compose

### Structure
```
AREA-Project/
├── 📁 front/              # React frontend
├── 📁 back/               # NestJS backend
├── 📁 docker/             # Docker configurations
│   ├── docker-compose.yml        # Production
│   ├── docker-compose.dev.yml    # Development
│   ├── docker-compose.prod.yml   # Production optimized
│   └── Dockerfile.setup          # Setup container
├── 📁 scripts/            # Build & deployment scripts
│   ├── setup-dev.sh             # Automated setup
│   ├── build-all.sh             # Build all services
│   ├── build-simple.sh          # Simple build
│   └── deploy.sh                # Deployment script
├── 📁 docs/              # Documentation
│   ├── ONBOARDING.md            # Detailed setup guide
│   ├── DEVELOPMENT_SETUP.md     # Development docs
│   ├── FINAL_VALIDATION.md      # Validation checklist
│   └── FRONTEND_REORGANIZATION.md
├── 📁 tools/             # Security & maintenance tools
│   ├── security-audit.sh        # Security audit
│   └── security-test.sh         # Security testing
└── README.md             # This file
```

## 🔧 Development

### Daily workflow
```bash
# Start development
docker-compose -f docker-compose.dev.yml up

# Make changes, commit (auto-formatted & linted)
git add .
git commit -m "feat: add feature"  # ✅ Auto-quality checks
git push
```

### Available commands
```bash
# Tests
docker-compose -f docker-compose.dev.yml exec frontend npm test
docker-compose -f docker-compose.dev.yml exec backend npm run test

# Code quality
docker-compose -f docker-compose.dev.yml exec frontend npm run lint
docker-compose -f docker-compose.dev.yml exec frontend npm run format

# Database
docker-compose -f docker-compose.dev.yml exec backend npx prisma studio
```

## � Docker Usage

### Quick Start Options

**Option 1: Simplified Docker Compose (Recommended for new developers)**
```bash
# Simple start with main docker-compose.yml
./dev.sh simple
# or
docker-compose up -d
```

**Option 2: Full Development Environment**
```bash
# Complete dev environment with all tools
./dev.sh start
# or
docker-compose -f docker/docker-compose.dev.yml up -d
```

### Available Commands

| Command | Description |
|---------|-------------|
| `./dev.sh simple` | Quick start with main compose |
| `./dev.sh start` | Full dev environment |
| `./dev.sh stop` | Stop all services |
| `./dev.sh logs` | View logs |
| `./dev.sh rebuild` | Rebuild images and restart |
| `./dev.sh clean` | Clean everything (containers, volumes, images) |

### Service Access

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React interface |
| Backend | http://localhost:5001 | NestJS API |
| Database | localhost:5432 | PostgreSQL |

### Database Credentials
- **User**: `area_user`
- **Password**: `area_password` 
- **Database**: `area_db`

### Troubleshooting

**Port conflicts:**
```bash
# Check port usage
sudo lsof -i :3000
sudo lsof -i :5001
sudo lsof -i :5432

# Stop conflicting services
./dev.sh stop
```

**Database issues:**
```bash
# Restart database only
docker-compose restart database

# View database logs
docker-compose logs database
```

**Complete reset:**
```bash
./dev.sh clean  # ⚠️  This removes everything!
./dev.sh rebuild
```

## �📚 Documentation

- **[ONBOARDING.md](./ONBOARDING.md)** - Complete automated setup guide
- **[DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)** - Development tools documentation
- **[front/README.md](./front/README.md)** - Frontend specific docs
- **[back/README.md](./back/README.md)** - Backend specific docs

## 🚢 Deployment

### Production
```bash
docker-compose up --build
```

### With automated scripts
```bash
./build-all.sh     # Build everything
./deploy.sh        # Deploy to production
./security-audit.sh # Security audit
```
