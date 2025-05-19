# Community Forums API

This is a backend API for a community forum platform. It is built using **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and uses **Clerk** for authentication.

## 📦 Tech Stack

- **Express.js** (Web Framework)
- **TypeScript** (Type Safety)
- **Prisma** (ORM)
- **PostgreSQL** (Database)
- **Docker** (for DB containerization)
- **Clerk** (Authentication)

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd community-forums/server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5441/community_forums_db
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Setup the Database

Ensure Docker is running, then run:

```bash
docker compose up -d
```

Apply database schema and generate Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the Server

```bash
npm run dev
```

## 📁 Folder Structure

```
server/
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma
├── src/
│   ├── controllers/       # Route handler logic
│   ├── middlewares/       # Express middlewares
│   ├── routes/            # Route definitions
│   ├── utils/             # Utility functions (e.g. prisma client)
│   └── index.ts           # Express app entry
├── .env                   # Environment variables
├── docker-compose.yml     # Docker config for PostgreSQL
└── package.json
```

## 🔐 Authentication

- Clerk is used to authenticate users via middleware.
- After successful login, users are synced in the DB if they do not already exist.

## 📫 API Routes

Example base path: `/api`

- **GET** `/api/forums` - List all forums
- **POST** `/api/forums` - Create a forum
- **GET** `/api/forums/:id` - Get forum by ID
- **PUT** `/api/forums/:id` - Update forum (only by creator)
- **DELETE** `/api/forums/:id` - Delete forum (only by creator)
- **POST** `/api/forums/:forumId/comment` - Add comment
- **PUT** `/api/forums/comment/:commentId` - edit comment (only by creator)
- **DELETE** `/api/forums/comment/:commentId` - delete comment (only by creator)
