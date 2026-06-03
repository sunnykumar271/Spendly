# 💰 Spendly — Personal Expense Tracker

A full-stack personal finance application to track expenses, manage budgets, and visualise spending patterns.

Built with **Node.js + Express** (backend) and **React + Vite** (frontend).

---

## 📸 Features

- 🔐 JWT Authentication (Register, Login, Logout)
- 📧 OTP-based Forgot Password via Gmail
- 💸 Add, Edit, Delete, Filter Expenses
- 🏷️ Category Management with icons and colours
- 🎯 Budget setting per category with progress tracking
- 📊 Dashboard with Bar, Pie, and Line charts
- 🌙 Dark Mode with localStorage persistence
- 📱 Fully Responsive (Mobile, Tablet, Desktop)

---

## 🗂️ Project Structure

```
spendly/
├── expense-tracker/            ← Backend (Node.js + Express)
│   ├── config/
│   │   ├── db.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── categoryController.js
│   │   └── budgetController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── budgetRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── generateOTP.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── expense-tracker-frontend/   ← Frontend (React + Vite)
    ├── src/
    │   ├── components/
    │   ├── features/
    │   ├── pages/
    │   ├── services/
    │   ├── store/
    │   ├── utils/
    │   ├── layouts/
    │   ├── routes/
    │   ├── constants/
    │   ├── styles/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Tech Stack

### Backend
| Tech | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth tokens |
| Nodemailer | OTP email delivery |
| dotenv | Environment variables |

### Frontend
| Tech | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool + dev server |
| Tailwind CSS | Utility-first styling |
| Redux Toolkit | Global state management |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Hook Form | Form handling + validation |
| Recharts | Charts and analytics |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |
| date-fns | Date formatting |

---

## 🚀 Local Setup — Step by Step

### Prerequisites
- Node.js v18 or higher → [nodejs.org](https://nodejs.org)
- A MongoDB Atlas account → [cloud.mongodb.com](https://cloud.mongodb.com)
- A Gmail account with App Password enabled

---

### 1. Clone the repository

```bash
git clone https://github.com/sunnykumar271/Spendly.git
cd Spendly
```

---

### 2. Set up the Backend

```bash
cd expense-tracker
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority

# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_64_char_random_string_here
JWT_EXPIRES_IN=7d

# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=Spendly <your_gmail@gmail.com>

OTP_EXPIRES_IN_MINUTES=10
```

Start the backend:

```bash
npm run dev
```

Backend runs at: **http://localhost:5000**
Health check: open `http://localhost:5000` in browser — you should see a JSON response.

---

### 3. Set up the Frontend

Open a **new terminal tab**:

```bash
cd expense-tracker-frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Your `.env` should contain:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Spendly
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

### 4. Running Both Together

| Terminal | Command | URL |
|---|---|---|
| Terminal 1 (backend) | `cd expense-tracker && npm run dev` | http://localhost:5000 |
| Terminal 2 (frontend) | `cd expense-tracker-frontend && npm run dev` | http://localhost:3000 |

Open **http://localhost:3000** in your browser. Register an account and start tracking.

---

## 🔌 API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, receive JWT |
| GET | `/api/auth/me` | ✅ | Get own profile |
| POST | `/api/auth/forgot-password` | ❌ | Send OTP to email |
| POST | `/api/auth/verify-otp` | ❌ | Verify OTP code |
| POST | `/api/auth/reset-password` | ❌ | Set new password |

### Expenses — `/api/expenses`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/expenses` | ✅ | Add expense |
| GET | `/api/expenses` | ✅ | Get all (filterable) |
| GET | `/api/expenses/:id` | ✅ | Get single expense |
| PUT | `/api/expenses/:id` | ✅ | Update expense |
| DELETE | `/api/expenses/:id` | ✅ | Delete expense |

**Filter query params for GET /api/expenses:**
```
?category=<id>
?startDate=2024-01-01&endDate=2024-01-31
?paymentMethod=upi
```

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/categories` | ✅ | Create category |
| GET | `/api/categories` | ✅ | Get all categories |
| PUT | `/api/categories/:id` | ✅ | Update category |
| DELETE | `/api/categories/:id` | ✅ | Delete category |

### Budget — `/api/budget`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PUT | `/api/budget/:categoryId` | ✅ | Set category budget |
| GET | `/api/budget/report` | ✅ | Budget vs spending report |

**Query param for report:**
```
?month=2024-01   (YYYY-MM format)
```

---

## 🔐 How Authentication Works

```
1. User registers/logs in
         ↓
2. Backend verifies credentials
         ↓
3. Backend returns JWT token (valid 7 days)
         ↓
4. Frontend stores token in localStorage
         ↓
5. Every API request includes:
   Authorization: Bearer <token>
         ↓
6. Backend middleware verifies token on protected routes
         ↓
7. After 7 days → token expires → user is redirected to login
```

---

## 🔑 Forgot Password — OTP Flow

```
Step 1: User submits email
        POST /api/auth/forgot-password { email }
        → Backend generates 6-digit OTP
        → Hashes OTP with bcrypt and stores in DB
        → Sends plain OTP to user's email via Nodemailer

Step 2: User submits OTP
        POST /api/auth/verify-otp { email, otp }
        → Backend compares OTP with stored hash
        → If valid and not expired: sets isOtpVerified = true

Step 3: User sets new password
        POST /api/auth/reset-password { email, newPassword }
        → Backend checks isOtpVerified === true
        → Updates password (bcrypt hashes it via pre-save hook)
        → Resets isOtpVerified to false
```

---

## 📦 Sample Request Bodies

### Register
```json
POST /api/auth/register
{
  "name": "Sunny Kushwa",
  "email": "sunny@example.com",
  "password": "mypassword123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "sunny@example.com",
  "password": "mypassword123"
}
```

### Add Expense
```json
POST /api/expenses
Authorization: Bearer <your_token>
{
  "title": "Lunch at café",
  "amount": 250,
  "description": "Biryani",
  "date": "2024-01-15",
  "category": "65a1b2c3d4e5f6a7b8c9d0e1",
  "paymentMethod": "upi"
}
```

### Set Budget
```json
PUT /api/budget/65a1b2c3d4e5f6a7b8c9d0e1
Authorization: Bearer <your_token>
{
  "budget": 5000
}
```

---

## 🌐 Deployment

### Deploy Backend on Render (Free)

1. Push backend folder to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Add all environment variables from your `.env`
6. Deploy → get your live URL e.g. `https://spendly-api.onrender.com`
7. In MongoDB Atlas → Network Access → Add `0.0.0.0/0`

### Deploy Frontend on Vercel (Free)

1. Push frontend folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework preset: **Vite**
4. Add environment variable:
   ```
   VITE_API_BASE_URL = https://spendly-api.onrender.com/api
   ```
5. Deploy → get your live URL e.g. `https://spendly.vercel.app`

---

## 🏗️ Production Build

### Backend
```bash
# No build step needed for Node.js
# Just run:
node server.js
```

### Frontend
```bash
cd expense-tracker-frontend
npm run build
# Creates optimised files in dist/
# Vercel runs this automatically on deploy
```

---

## 🛡️ Environment Variables Reference

### Backend `.env`

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (5000) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | ✅ | Token validity e.g. `7d` |
| `EMAIL_HOST` | ✅ | `smtp.gmail.com` |
| `EMAIL_PORT` | ✅ | `587` |
| `EMAIL_USER` | ✅ | Your Gmail address |
| `EMAIL_PASS` | ✅ | Gmail App Password (16 chars) |
| `EMAIL_FROM` | ✅ | Display name + email |
| `OTP_EXPIRES_IN_MINUTES` | ✅ | OTP validity in minutes |

### Frontend `.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL |
| `VITE_APP_NAME` | ❌ | App display name |

> ⚠️ Never commit `.env` to GitHub. It is listed in `.gitignore` in both projects.

---

## 📚 Scripts Reference

### Backend
```bash
npm run dev      # Start with nodemon (auto-restart on file change)
npm start        # Start without nodemon (production)
```

### Frontend
```bash
npm run dev      # Start Vite dev server (localhost:3000)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
```

---

## 🧠 Key Concepts Used

| Concept | Where Used |
|---|---|
| MVC Architecture | Backend folder structure |
| JWT Authentication | Login → token → protected routes |
| bcrypt Hashing | User passwords + OTP storage |
| Mongoose Pre-save Hook | Auto-hash password before saving |
| Axios Interceptors | Auto-inject JWT, auto-handle 401 |
| Redux Async Thunks | All API calls from frontend |
| React Protected Routes | ProtectedRoute + GuestRoute |
| Tailwind Dark Mode | `darkMode: 'class'` + `dark:` prefix |
| Recharts | Dashboard bar, pie, line charts |
| React Hook Form | All form validation |

---

## 👤 Author

**Sunny Kushwa**
- GitHub: [sunnykumar271](https://github.com/sunnykumar271)

---

## 📄 License

This project is for personal and educational use.
