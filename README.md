# BookSwap

BookSwap is a full-stack web application that allows users to share, discover, and exchange books with other members of the community.

The project was developed as a technical assessment for a Full-Stack Developer position.

## Features

### Authentication
- User registration and login
- JWT access and refresh tokens
- Automatic token refresh
- Persistent authentication
- Role-based access control
- Protected routes

### Book Catalog
- Browse available books
- Search by book title or author
- Alphabetical sorting
- Server-side pagination
- Book details page
- Book cover preview

### My Books
- View personal book collection
- Add new books
- Edit existing books
- Delete books
- Image URL validation
- Delete confirmation dialogs

### Book Exchange
- Send exchange requests
- View incoming and outgoing requests
- View sender contact information
- View books offered for exchange
- Prevent duplicate exchange requests
- Prevent exchange requests for personal books

### Admin Dashboard
- View and search users
- Create, update, and delete users
- Manage user roles
- Browse the book catalog
- Delete books regardless of ownership

## Technology Stack

### Frontend

- Next.js — App Router
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod

### Backend

- NestJS
- TypeScript
- PostgreSQL
- Sequelize
- Sequelize Typescript
- Passport JWT
- bcrypt
- class-validator
- class-transformer

### Development Tools

- Docker
- Docker Compose
- Postman
- Git

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── books/
│   │   ├── common/
│   │   ├── exchanges/
│   │   └── users/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   ├── shared/
│   │   └── store/
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 24
- npm
- Docker and Docker Compose
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Configure the backend

```bash
cd backend
npm ci
cp .env.example .env
```

Configure the environment variables in `.env`:

```env
PORT=3030
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5436

POSTGRES_USER=bookswap
POSTGRES_PASSWORD=your_database_password
POSTGRES_DB=bookswap

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

Use strong, different secrets for access and refresh tokens.

Make sure the database credentials match the Docker Compose configuration.

### 3. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

### 4. Start the backend

```bash
cd backend
npm run start:dev
```

The backend API is available at:

http://localhost:3030

### 5. Configure and start the frontend

Open a separate terminal:

```bash
cd frontend
npm ci
cp .env.example .env.local
```

Configure `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3030
```

Start the development server:

```bash
npm run dev
```

The frontend is available at:

http://localhost:3000

## Application Routes

| Route | Description | Access |
|---|---|---|
| `/` | Redirect to catalog | Public |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/books` | Book catalog | Public |
| `/books/[id]` | Book details | Public |
| `/me/books` | Personal book management | Authenticated |
| `/me/exchanges` | Exchange requests | Authenticated |
| `/admin` | Administration dashboard | Admin |

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Authenticate a user |
| POST | `/auth/refresh` | Refresh tokens |
| GET | `/auth/me` | Get current user |

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | Get paginated books |
| GET | `/books/:id` | Get book details |
| GET | `/me/books` | Get personal books |
| POST | `/books` | Create a book |
| PATCH | `/books/:id` | Update a personal book |
| DELETE | `/books/:id` | Delete a book |

### Exchange Requests

| Method | Endpoint | Description |
|---|---|---|
| POST | `/exchanges` | Create an exchange request |
| GET | `/exchanges/sent` | Get outgoing requests |
| GET | `/exchanges/received` | Get incoming requests |

### Users — Admin Only

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user details |
| POST | `/users` | Create a user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

## Administrator Setup

New accounts are assigned the `USER` role by default.

To create an administrator:

1. Register a new account through the application.
2. Connect to the PostgreSQL database.
3. Execute the following SQL statement:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

4. Log out and log in again.
5. Open the administration dashboard.

## Authentication and Authorization

The application uses JWT-based authentication with separate access and refresh tokens.

Protected API endpoints require an access token:

```http
Authorization: Bearer <access_token>
```

The frontend automatically refreshes expired access tokens through RTK Query.

Authorization and ownership restrictions are enforced on the backend.

## Architecture

The frontend follows a feature-based architecture. Each feature contains its own API definitions, components, types, and validation schemas where applicable.

RTK Query provides centralized API communication, caching, automatic token refresh, and cache invalidation after mutations.

The backend follows the modular architecture provided by NestJS, separating controllers, services, DTOs, database models, and authorization guards.

## Production Build

### Backend

```bash
cd backend
npm run build
npm run start:prod
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

Production builds require a configured environment and a running PostgreSQL instance.

## MVP Limitations

- Exchange requests are stored in the database and displayed in the application. Actual email delivery is replaced with a success notification, as permitted by the assessment requirements.
- Book covers are provided through image URLs instead of file uploads.
- JWT tokens are stored in Local Storage. A production implementation should consider secure HttpOnly cookies.
- Refresh token rotation and server-side token revocation are not implemented.
- Database schema synchronization is used for local development. Production deployments should use database migrations.
- Automated tests are not included in the current MVP.

## Author

Eduard Bilan

GitHub: https://github.com/Eduard8798