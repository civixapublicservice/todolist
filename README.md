# TaskFlow — Production-Quality Todo Management Application

TaskFlow is a production-grade, multi-tenant enterprise Todo Management Platform built with **React**, **Vite**, **Express.js**, **Prisma ORM**, and **SQLite/PostgreSQL**. It features secure JWT authentication, password hashing with bcrypt, data isolation per user, a real-time responsive dashboard, search, status & priority filtering, dark mode, and human-designed split-screen UI aesthetics.

---

## Key Features

### 🔐 Production Authentication & Security
- **Real Registration & Login**: User accounts stored in a relational SQL database.
- **Bcrypt Hashing**: Passwords stored with 10 salt rounds (never stored in plaintext).
- **JWT Authorization**: 24-hour signed JSON Web Tokens for API requests.
- **Multi-Tenant Data Isolation**: Database queries enforce `WHERE userId = req.user.userId`. Users can only access their own data.
- **Form Validation**: Server-side and client-side email format regex, password length, and name checks.

### 📊 Dashboard & Operational Console
- **Analytics Metrics Bar**: Real-time stats cards for Total Tasks, Pending Tasks, Completed Tasks, and Completion Rate %.
- **Task Management (CRUD)**: Create, Read, Update, Delete tasks with title, description, and priority (`HIGH`, `MEDIUM`, `LOW`).
- **Search, Filter & Sort**: Search by title/description, filter by status (`All`, `Active`, `Completed`) and priority, sort by date or title.
- **Inline Editing**: Quick task modification without leaving the dashboard context.
- **Optimistic Updates**: Immediate UI feedback on completion toggle and task deletion with automatic rollback on network error.

### 🎨 Human-Designed UI/UX Aesthetics
- **Split-Screen Auth Pages**: Form panel on left with warm cream/yellow palette (`#F6F4EB`, `#FACC15`), professional team workspace illustration on right.
- **Lucide SVG Icons**: 100% SVG icon discipline (`lucide-react`) with **zero emojis** used as UI controls.
- **Theme Persistence**: Light and Dark Mode toggle stored in local storage and applied to root CSS tokens.
- **Accessibility (a11y)**: Accessible color contrast (4.5:1 minimum), keyboard focus outlines, and `aria-label` attributes on all icon controls.

---

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Fast single-page app with HMR |
| **Routing** | React Router v7 | Public auth routes & protected dashboard route guards |
| **Icons** | Lucide React | Clean, scalable SVG icons |
| **Backend** | Node.js + Express.js | Modular REST API server |
| **ORM** | Prisma ORM v6 | Type-safe database queries and migrations |
| **Database** | SQLite / PostgreSQL | Relational database with foreign key cascade constraints |
| **Authentication**| JWT + Bcryptjs | Secure session token authorization & password encryption |

---

## Project Structure

```
training/vite-project/
├── index.html
├── package.json
├── vite.config.js                # Vite dev server + /api proxy config
├── public/
│   └── auth-bg.png               # Auth panel workspace image
│
├── server/                       # Express Backend
│   ├── package.json
│   ├── .env                      # Backend environment variables
│   ├── prisma/
│   │   └── schema.prisma         # Prisma database schema definition
│   └── src/
│       ├── index.js              # Express app entry point
│       ├── config/
│       │   └── db.js             # Prisma client instance
│       ├── controllers/
│       │   ├── auth.controller.js# Register, login, session handlers
│       │   └── todo.controller.js# Todo CRUD & search/filter handlers
│       ├── middleware/
│       │   ├── auth.js           # JWT token verification
│       │   └── validate.js       # Request body validation
│       ├── routes/
│       │   ├── auth.routes.js    # Auth endpoint definitions
│       │   └── todo.routes.js    # Todo endpoint definitions
│       └── utils/
│           └── errors.js         # Error formatting helpers
│
└── src/                          # React Frontend
    ├── main.jsx
    ├── App.jsx                   # Router setup with AuthProvider
    ├── components/
    │   ├── Navbar.jsx            # Header navbar with user info & theme toggle
    │   ├── StatsBar.jsx          # Dashboard analytics cards
    │   ├── FilterBar.jsx         # Status, priority & sort selectors
    │   ├── SearchBar.jsx         # Live search input with clear button
    │   ├── TodoForm.jsx          # Task creation form
    │   ├── TodoItem.jsx          # Individual task item with priority badge
    │   ├── TodoList.jsx          # Task list grid & empty state
    │   └── ProtectedRoute.jsx    # Route guard for authenticated user
    ├── context/
    │   └── AuthContext.jsx       # Global auth provider
    ├── hooks/
    │   ├── useAuth.js            # Auth context hook
    │   └── useTheme.js           # Dark/Light mode theme hook
    ├── layouts/
    │   ├── AuthLayout.jsx        # Split-screen auth layout
    │   └── MainLayout.jsx        # Authenticated dashboard layout
    ├── pages/
    │   ├── LoginPage.jsx         # Login page with validation
    │   ├── RegisterPage.jsx      # Register page with validation
    │   └── Dashboard.jsx         # Main operational dashboard
    ├── services/
    │   ├── api.js                # Fetch API wrapper with JWT headers
    │   ├── authService.js        # Auth API handlers
    │   └── todoService.js        # Todo CRUD API handlers
    └── styles/
        ├── index.css             # Global tokens & CSS resets
        ├── app.css               # Dashboard & stats styling
        ├── auth.css              # Split-screen auth styling
        ├── todoitem.css          # Priority tags & task item styling
        └── todolist.css          # Task list & empty state styling
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT (`email`, `password`) | No |
| `GET` | `/api/auth/me` | Fetch active user session profile | Yes (Bearer Token) |

### Todo Endpoints (All Protected by JWT)

| Method | Endpoint | Description | Query Params / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | Fetch user todos | `?search=`, `?status=all\|active\|completed`, `?sort=newest\|oldest\|title` |
| `POST` | `/api/todos` | Create new todo | `{ title, description?, priority? }` |
| `PUT` | `/api/todos/:id` | Update todo | `{ title?, description?, completed?, priority? }` |
| `PATCH` | `/api/todos/:id/toggle` | Toggle task completion | None |
| `DELETE` | `/api/todos/:id` | Delete todo | None |

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Local Setup

1. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Initialize Database**:
   ```bash
   npx prisma db push
   ```

3. **Start Backend Server**:
   ```bash
   npm start
   ```
   *Backend runs on `http://localhost:5000`*

4. **Install Frontend Dependencies & Run Dev Server**:
   ```bash
   cd ..
   npm install
   npm run dev
   ```
   *Frontend runs on `http://localhost:5173`*

---

## Verification & Build

To test the production build:
```bash
npm run build
```

---

## License

MIT © TaskFlow Management Systems
