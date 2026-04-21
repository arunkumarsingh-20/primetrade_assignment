# TaskPro

TaskPro is a full-stack task management application built as a backend internship assignment project. It includes secure authentication, role-based access control, CRUD APIs, Swagger documentation, and a polished React frontend.

## Features

- User registration and login
- Password hashing with `bcrypt`
- JWT authentication using `httpOnly` cookies
- Role-based access control for `USER` and `ADMIN`
- CRUD APIs for tasks
- Input validation using `zod`
- Centralized error handling
- API versioning with `/api/v1`
- Swagger API documentation
- Responsive React frontend
- Protected dashboard for authenticated users only
- Admin seed setup for testing role-based access

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- bcrypt
- jsonwebtoken
- zod
- swagger-jsdoc
- swagger-ui-express

### Frontend
- React
- Vite
- React Router
- Axios

---

## Project Structure

```text
backend/
  prisma/
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    utils/

frontend/
  src/
    api/
    components/
    pages/
```

---

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- PostgreSQL installed and running
- A PostgreSQL database created for this project

---

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/backend_assignment
JWT_SECRET=your_super_secret_jwt_key
ADMIN_EMAIL=admin@taskpro.com
ADMIN_PASSWORD=Admin@12345
```

If your PostgreSQL password contains special characters like `@`, make sure to URL-encode them.

Example:

```env
DATABASE_URL=postgresql://postgres:postgres%402511@localhost:5432/backend_assignment
```

---

## Backend Setup

### 1. Install dependencies

Inside the `backend` folder:

```bash
npm install
```

### 2. Run Prisma migration

```bash
npx prisma migrate dev --name init
```

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Seed admin user

```bash
npx prisma db seed
```

This creates or updates an admin user using:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

### 5. Start the backend server

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

## Frontend Setup

### 1. Install dependencies

Inside the `frontend` folder:

```bash
npm install
```

### 2. Start the frontend app

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## API Documentation

Swagger documentation is available at:

```text
http://localhost:5000/api-docs
```

---

## API Endpoints

### Auth

#### Register
`POST /api/v1/auth/register`

Request body:

```json
{
  "name": "Arun",
  "email": "arun@example.com",
  "password": "secret123"
}
```

#### Login
`POST /api/v1/auth/login`

Request body:

```json
{
  "email": "arun@example.com",
  "password": "secret123"
}
```

#### Logout
`POST /api/v1/auth/logout`

#### Get Current User
`GET /api/v1/auth/me`

---

### Tasks

#### Get Tasks
`GET /api/v1/tasks`

#### Get Task by ID
`GET /api/v1/tasks/:id`

#### Create Task
`POST /api/v1/tasks`

Request body:

```json
{
  "title": "Finish backend assignment",
  "description": "Complete auth, CRUD, and UI",
  "status": "TODO"
}
```

#### Update Task
`PUT /api/v1/tasks/:id`

#### Delete Task
`DELETE /api/v1/tasks/:id`

#### Admin Only: Get All Tasks
`GET /api/v1/tasks/admin/all`

---

## Authentication Flow

1. User registers with name, email, and password
2. Password is hashed before being stored in the database
3. On login, JWT is generated and stored in an `httpOnly` cookie
4. Protected routes read the cookie and verify the token
5. User data is attached to the request for authorization checks

---

## Role-Based Access

### USER
- Can view their own tasks
- Can create tasks
- Can update their own tasks
- Can delete their own tasks

### ADMIN
- Can view all tasks
- Can access admin-only routes
- Can update and delete all tasks

---

## Admin Setup

To test the admin flow:

1. Add the following values to `.env`:
   ```env
   ADMIN_EMAIL=admin@taskpro.com
   ADMIN_PASSWORD=Admin@12345
   ```

2. Run the seed command:
   ```bash
   npx prisma db seed
   ```

3. Login with the admin account:
   ```json
   {
     "email": "admin@taskpro.com",
     "password": "Admin@12345"
   }
   ```

4. Visit the admin-only route:
   ```text
   GET /api/v1/tasks/admin/all
   ```

---

## Scalability Note

This project is structured for future growth:

- Modular route/controller/service separation makes it easy to add new features
- Prisma keeps database schema management clean and maintainable
- JWT auth can later be extended with refresh tokens and session rotation
- Redis caching can be added for frequently accessed data
- Docker can be added for consistent deployment
- The backend can be scaled horizontally behind a load balancer

---

## Testing

You can test the APIs using:
- Postman
- Swagger UI
- The React frontend

Recommended test order:

1. Register a user
2. Login the user
3. Fetch the current user
4. Create a task
5. Fetch all tasks
6. Update a task
7. Delete a task
8. Logout
9. Login as admin
10. Test admin-only route

---

## Notes

- JWT is stored in an `httpOnly` cookie for better security
- Validation is handled server-side using `zod`
- All API routes use versioning with `/api/v1`
- The dashboard is only visible when a user is logged in
- Login and Register links disappear after authentication

---

## License

This project is created for internship assignment submission.
