# FoodFlow - Production-Ready Food Ordering App

A complete full-stack food ordering application built with NestJS, GraphQL, Prisma, and Next.js. Features strict Role-Based Access Control (RBAC) and Country-based data isolation.

## 🚀 Features

- **Multi-Tenancy**: Users only see restaurants and menu items available in their country (India/America).
- **RBAC**: 
  - `ADMIN`: Global control, manage payment methods.
  - `MANAGER`: Process and cancel orders within their country.
  - `MEMBER`: Browse menus and place orders.
- **Modern Stack**:
  - **Backend**: NestJS, GraphQL (Apollo), Prisma ORM, JWT Auth.
  - **Frontend**: Next.js 15, Tailwind CSS, Apollo Client, Lucide Icons.
- **Security**: Password hashing with bcrypt, JWT-protected routes, and database-level filtering.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (or update `schema.prisma` to use another DB)

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env with your DATABASE_URL
npx prisma migrate dev
npm run seed  # To populate initial data
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Example Credentials

| Role | Email | Password | Country |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@foodapp.com` | `password123` | Global |
| **Manager (IN)** | `manager_in@foodapp.com` | `password123` | India |
| **Manager (US)** | `manager_us@foodapp.com` | `password123` | USA |
| **Member (IN)** | `member_in@foodapp.com` | `password123` | India |

## 🏗️ Architecture

- **Monorepo Structure**: Separate `backend` and `frontend` folders for clear separation of concerns.
- **GraphQL Schema**: Auto-generated from TypeScript decorators in the backend.
- **Atomic Components**: Reusable UI components styled with Tailwind CSS.
