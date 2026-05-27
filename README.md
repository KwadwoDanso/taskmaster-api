# TaskMaster API

Backend Development Project: A secure RESTful API for managing users, projects, and tasks.

## Description
 It handles user accounts with JWT authentication, project management with ownership rules, and task tracking nested under projects. Authorization ensures users can only access their own data at every level.

## Technologies
- Node.js
- Express
- MongoDB Atlas / Mongoose
- bcrypt
- jsonwebtoken (JWT)
- dotenv


## Setup
1. Clone the repo
2. `npm install`
3. Create `.env` (see `.env.example`)
4. `node server.js`

## Environment Variables
- `MONGO_URI` — MongoDB connection string
- `PORT` — server port (default 3001)
- `JWT_SECRET` — random string for signing tokens

## Data Model Relationships
```
User ──owns── Project ──contains── Task
```
- `Project.user` references `User._id`
- `Task.project` references `Project._id`
- Task authorization checks the PARENT project's owner


## Authorization Rules
1. **Authentication:** All project and task routes require a valid JWT in the `Authorization: Bearer <token>` header. Without it - 401.
2. **Project ownership:** Users can only CRUD their own projects. `project.user` must match `req.user._id`. Mismatch - 403.
3. **Task parent ownership:** To create/read tasks, the user must own the parent project. To update/delete a task, the system finds the task, looks up its parent project, and verifies the project's owner matches the logged-in user. Mismatch - 403.


## Security
- Passwords hashed with bcrypt (10 salt rounds) via Mongoose async pre-save hook
- No `next` parameter in pre-save hook (Mongoose 9 compatibility)
- Passwords never returned in API responses
- Generic login error messages prevent user enumeration
- JWTs expire after 2 hours
- `.env` git-ignored

## Reflections

### 1. Why is ownership-based authorization layered?
Projects check direct ownership: `project.user === req.user._id`. Tasks check indirect ownership through their parent project. This two-layer model means a user's access to a task is derived from their relationship to the project, not the task itself. This mirrors real-world permission systems where access cascades from parent resources.

### 2. Why nest task routes under projects?
`POST /api/projects/:projectId/tasks` makes the relationship explicit in the URL. The `projectId` parameter tells the server which project the task belongs to AND provides the context for the ownership check. Without it, you'd need to send the project ID in the request body and trust the client — which is less secure.

### 3. Why do task update/delete use a flat route?
`PUT /api/tasks/:taskId` is flat because the task already knows its parent project (stored in `task.project`). There's no need to redundantly include the project ID in the URL. The route finds the task, reads its `project` field, looks up that project, and checks ownership — all without needing the client to specify the project.

## Author
- Kwadwo

## Acknowledgement
- Per Scholas Auth module
- AI 

## Additional Resources
- [Express.js Routing Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Population (ref)](https://mongoosejs.com/docs/populate.html)
- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt on npm](https://www.npmjs.com/package/bcrypt)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)