# Community Forums Frontend

This is the **frontend** of the Community Forums application built with:

- [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.dev/)
- [Clerk](https://clerk.com/) for authentication

---

## 🛠️ Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-username/community-forums.git
cd community-forums/frontend
```

### 2. Install Dependencies

```
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the `frontend/` directory with the following:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:3000/api (should match the port on which server running)
```

> Make sure your API server is running at the specified URL.

### 4. Run the Development Server

```
npm run dev
```

This will start the frontend on `http://localhost:5173` by default.

---

## ✨ Features

- User authentication via Clerk
- View and create forums
- Post and view comments
- Responsive UI built with shadcn/ui + Tailwind CSS

---
