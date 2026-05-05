# Team Task Manager

A full-stack MERN application for managing team projects and tasks with role-based access control.

## Features

- **Authentication** — Signup, Login with JWT-based sessions
- **Role-Based Access** — Admin and Member roles with granular permissions
- **Project Management** — Create, view, update, and delete projects (Admin)
- **Task Management** — Assign tasks, set priorities, due dates, and track status
- **Dashboard** — Real-time statistics overview (projects, tasks, status breakdown)
- **Responsive UI** — Built with React + Bootstrap

---

## Demo Credentials

| Role  | Email          | Password   |
| ----- | -------------- | ---------- |
| Admin | k@gmail.com    | k1234567   |

---

## Tech Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Frontend  | React 19, Vite, React Router, Axios, Bootstrap |
| Backend   | Node.js, Express 5, Mongoose, JWT, bcryptjs   |
| Database  | MongoDB                                       |

---

## Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── CreateTask.jsx
│   │   │   └── MyTasks.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable      | Description                        | Example                                           |
| ------------- | ---------------------------------- | ------------------------------------------------- |
| `PORT`        | Server port                        | `5000`                                            |
| `MONGO_URI`   | MongoDB connection string          | `mongodb://127.0.0.1:27017/team-task-manager`     |
| `JWT_SECRET`  | Secret key for JWT signing         | `your_strong_secret_key_here`                     |
| `NODE_ENV`    | Environment mode                   | `development` or `production`                     |
| `CLIENT_URL`  | Frontend URL (for CORS)            | `http://localhost:5173`                            |

### Frontend (`frontend/.env`)

| Variable        | Description            | Example                          |
| --------------- | ---------------------- | -------------------------------- |
| `VITE_API_URL`  | Backend API base URL   | `http://localhost:5000/api`      |

---

## API Endpoints

### Authentication
| Method | Endpoint             | Access  | Description          |
| ------ | -------------------- | ------- | -------------------- |
| POST   | `/api/auth/signup`   | Public  | Register a new user  |
| POST   | `/api/auth/login`    | Public  | Login and get token  |

### Users
| Method | Endpoint       | Access  | Description          |
| ------ | -------------- | ------- | -------------------- |
| GET    | `/api/users`   | Admin   | Get all users        |

### Projects
| Method | Endpoint             | Access  | Description          |
| ------ | -------------------- | ------- | -------------------- |
| GET    | `/api/projects`      | Auth    | Get all projects     |
| GET    | `/api/projects/:id`  | Auth    | Get single project   |
| POST   | `/api/projects`      | Admin   | Create a project     |
| PUT    | `/api/projects/:id`  | Admin   | Update a project     |
| DELETE | `/api/projects/:id`  | Admin   | Delete a project     |

### Tasks
| Method | Endpoint                  | Access        | Description            |
| ------ | ------------------------- | ------------- | ---------------------- |
| GET    | `/api/tasks`              | Auth          | Get tasks (filterable) |
| GET    | `/api/tasks/:id`          | Auth          | Get single task        |
| POST   | `/api/tasks`              | Admin         | Create/assign a task   |
| PUT    | `/api/tasks/:id`          | Admin         | Update entire task     |
| PATCH  | `/api/tasks/:id/status`   | Admin/Member  | Update task status     |
| DELETE | `/api/tasks/:id`          | Admin         | Delete a task          |

**Task Filters:** `GET /api/tasks?project=<projectId>&user=<userId>`

### Dashboard
| Method | Endpoint               | Access | Description         |
| ------ | ---------------------- | ------ | ------------------- |
| GET    | `/api/dashboard/stats` | Auth   | Get dashboard stats |

---

## Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd team-task-manager
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=your_strong_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## Deployment on Railway

### Backend Deployment

1. Create a new project on [Railway](https://railway.app)
2. Add a **MongoDB** service (or use MongoDB Atlas and paste the URI)
3. Add a new service → **Deploy from GitHub repo** → select the `backend/` root directory
4. Set **environment variables** in Railway dashboard:
   ```
   PORT=5000
   MONGO_URI=<your_mongodb_atlas_uri>
   JWT_SECRET=<your_production_secret>
   NODE_ENV=production
   CLIENT_URL=<your_frontend_railway_url>
   ```
5. Set the **Start Command** to: `npm start`
6. Set the **Root Directory** to: `backend`
7. Deploy — Railway will run `npm install` and then `npm start`

### Frontend Deployment

1. Add another service in the same Railway project → **Deploy from GitHub repo**
2. Set the **Root Directory** to: `frontend`
3. Set **environment variables**:
   ```
   VITE_API_URL=<your_backend_railway_url>/api
   ```
4. Set the **Build Command** to: `npm install && npm run build`
5. Set the **Start Command** to: `npx serve dist -s -l 3000`
6. Deploy

### Alternative: Single Service Deployment

In production mode, the backend automatically serves the frontend build:

1. Build the frontend locally:
   ```bash
   cd frontend && npm run build
   ```
2. Deploy only the full repo with `backend/` as root directory
3. The `server.js` will serve `frontend/dist/` for all non-API routes when `NODE_ENV=production`

---

## Roles & Permissions

| Action                  | Admin | Member |
| ----------------------- | ----- | ------ |
| Create Project          | ✅    | ❌     |
| Update/Delete Project   | ✅    | ❌     |
| View Projects           | ✅    | ✅ (assigned only) |
| Create/Assign Task      | ✅    | ❌     |
| Update/Delete Task      | ✅    | ❌     |
| View Tasks              | ✅    | ✅ (assigned only) |
| Update Task Status      | ✅    | ✅ (own tasks)     |
| View Dashboard Stats    | ✅    | ✅ (scoped)        |

---

## License

ISC
