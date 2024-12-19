
# Kanbas Node Server App

The backend for the Kanbas role-based learning platform. This server handles user authentication, role-based access control, and dynamic data management. It follows a modular and scalable DAO (Data Access Object) architecture.

## Frontend Repository
The frontend code for this project is available on GitHub:  
[Kanbas React Web App](https://github.com/viyur/kanbas-react-web-app-cs5610)

## Setup Instructions
To run the backend locally and enable all functionalities, follow these steps:

### Prerequisites
1. Clone the frontend repository and set it up by following the instructions in its `README.md`.
2. **MongoDB Setup**:  
   - Install MongoDB and ensure the service is running.  
   - Create a new database (e.g., `kanbasDB`) with the following collections:  
     - `assignments`, `courses`, `enrollments`, `modules`, `questions`, `quizAttempts`, `quizzes`, `users`.  
   - These collections can be empty initially, as new courses, modules, and quizzes can be added by registering as a `Faculty` user.  
3. Use the `quiz` branch in both the frontend and backend repositories for full feature support.

### Environment Variables
Create a `.env` file in the root directory of this project and include the following variables:
```env
NODE_ENV=development
NETLIFY_URL=http://localhost:3000
NODE_SERVER_DOMAIN=http://localhost:4000
SESSION_SECRET=super secret session phrase
MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/kanbas-cs5610-fa2024
```

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/viyur/kanbas-node-server-app.git
   cd kanbas-node-server-app
   ```
2. Switch to the `quiz` branch:
   ```bash
   git checkout quiz
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

The backend will be running at `http://localhost:4000`.

## Features
This backend supports the following functionalities:
- **Authentication**: Secure user login and registration with session management.
- **Role-based Access Control**: Dynamic rendering and permission management for Faculty, Students, and Admins.
- **Course and Module Management**: Faculty can create and manage courses, modules, assignments, and quizzes.
- **Student Activities**: Students can enroll in courses, view content, take quizzes, and track scores.
- **Admin Capabilities**: Admins can oversee and manage all user and system data.

## Architecture
- **DAO Pattern**: Ensures a clean separation of concerns, making data access operations modular and scalable.
- **Session Management**: Uses secure session cookies for authentication and user state persistence.
- **Express Middleware**: Manages routes and handles role-based requests effectively.


---

Enjoy exploring the **Kanbas Node Server App**!
