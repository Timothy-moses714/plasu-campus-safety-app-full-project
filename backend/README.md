# PLASU Campus Safety App - Backend API

Node.js + Express + MongoDB REST API.

## Setup

```bash
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret
npm run dev
```

## API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET  | /api/auth/me | Protected | Get current user |
| POST | /api/auth/logout | Protected | Logout |

### Alerts
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET    | /api/alerts | Protected | Get all active alerts |
| POST   | /api/alerts | Admin/Security | Create alert |
| POST   | /api/alerts/panic | Protected | Trigger panic alert |
| GET    | /api/alerts/panics | Admin/Security | Get all panic alerts |
| PATCH  | /api/alerts/:id/deactivate | Admin/Security | Deactivate alert |

### Incidents
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST   | /api/incidents | Protected | Report incident |
| GET    | /api/incidents | Protected | Get incidents |
| GET    | /api/incidents/:id | Protected | Get single incident |
| PATCH  | /api/incidents/:id | Admin/Security | Update status |

### Users
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET    | /api/users | Admin | Get all users |
| GET    | /api/users/:id | Protected | Get user by ID |
| PATCH  | /api/users/profile | Protected | Update own profile |
