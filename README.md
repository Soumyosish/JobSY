# Jobsy Web Application Tracker

## Overview
Jobsy is a simple yet powerful web application designed to help users efficiently track and manage their job application journey. From the initial application to receiving an offer, Jobsy provides a centralized platform to monitor progress, set goals, stay updated on hiring trends, and easily access resumes.

This application aims to streamline the job search process, making it easier for users to stay organized and focused on their career aspirations.

---

## Features

### Frontend
- **Job Application Management:**
  - Add Job Application: Users can easily add new job applications, specifying details such as company name, role, and current status (e.g., Applied, Interview, Offer, Rejected).
  - Update Status: Seamlessly update the status of existing job applications as they progress through different stages.
- **Filtering & Organization:**
  - Filter by Status: Quickly filter job applications by their current status (Applied, Interview, Rejected, Offer) to get a clear overview of specific categories.
- **Progress Visualization:**
  - Timeline View: Visualize the progression of job applications through a timeline, showing the history of status changes (e.g., from "Applied" to "Interview").
- **Goal Setting & Notifications:**
  - Calendar Integration: Set career goals and important dates within a calendar.
  - Hiring Updates: Receive notifications about recent hiring updates and relevant job market news.
- **Resume Management:**
  - Resume Upload: Securely upload and store your resume for future use, allowing for instant access when needed without searching through files.
- **User Authentication:** Secure user login and registration to ensure personalized tracking and data privacy.

### Backend
- **CRUD APIs for Jobs:** Robust RESTful APIs for creating, reading, updating, and deleting job application records.
- **File Upload Service:** Secure handling of resume file uploads.
- **Authentication:** JWT (JSON Web Token) based authentication for secure user sessions and API access.

---

## Technology Stack
- **Frontend:**
  - React
  - CSS
- **Backend:**
  - Express.js (RESTful APIs)
  - MongoDB (Atlas)
  - Nodemailer (email services, e.g., password reset)
- **Authentication:**
  - JSON Web Tokens (JWT)

---

## Folder Structure
```
JobSY/
  backend/   # Express API, MongoDB models, routes, middleware
  frontend/  # React app (Vite), CSS, components
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB Atlas account

### 1. Clone the repository
```
git clone https://github.com/Soumyosish/JobSY.git
cd JobSY
```

### 2. Setup Backend
```
cd backend
npm install
```
Create a `.env` file in `backend/` with:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
BASE_URL=https://your-frontend.vercel.app
```

### 3. Setup Frontend
```
cd ../frontend
npm install
```
Create a `.env` file in `frontend/` with:
```
VITE_API_URL=https://your-backend.onrender.com
```

### 4. Run Locally
- **Backend:**
  ```
  cd backend
  npm start
  ```
- **Frontend:**
  ```
  cd frontend
  npm run dev
  ```

---

## Deployment
- **Frontend:** Deploy to [Vercel](https://vercel.com/) (root: `frontend`)
- **Backend:** Deploy to [Render](https://render.com/) (root: `backend`)
- Set all environment variables in the respective dashboards.

---

## Usage
1. Register a new account or log in with existing credentials.
2. Navigate to the "Add Job" section to input new application details.
3. View your applications on the dashboard, filter them by status, or explore the timeline.
4. Upload your resume for quick access.
5. Set goals in the calendar and check for new hiring updates.

---

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License
Distributed under the MIT License. See `LICENSE` for more information.

---
