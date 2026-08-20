# CardForge — College Student ID Card Generator

CardForge is a full-stack web application for creating, customizing, saving, editing, and exporting professional college student ID cards.

Built with Next.js, TypeScript, MongoDB, JWT authentication, Tailwind CSS, Framer Motion, QR codes, PNG export, and PDF generation.

## ✨ Features

- 🔐 User authentication with email and password
- 🎓 College-focused student ID card builder
- 👤 Student personal information
- 🏫 College and institution details
- 📸 Student photo upload
- 🏛️ College logo upload
- 🎨 Custom card colors
- 🖋️ Custom text colors
- 🔳 Automatic QR code generation
- 💾 Save student ID cards
- ✏️ Edit existing ID cards
- 🗑️ Delete saved ID cards
- 📥 Export ID cards as PNG
- 📄 Export ID cards as PDF
- 📱 Responsive design
- ✨ Glassmorphism UI and smooth animations
- 🔄 Live card preview while editing

## 🛠️ Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend

- Next.js API Routes
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Card & Export

- html2canvas
- jsPDF
- qrcode.react
- FileReader API

### Deployment

- Vercel
- MongoDB Atlas

## 📋 Student ID Card Fields

CardForge currently supports:

- First Name
- Last Name
- Roll Number
- Date of Birth
- Blood Group
- Phone Number
- Department / Branch
- Address
- College Name
- College Address
- College Phone
- College Logo
- Student Photo
- Valid Till
- Card Color
- Text Color

## 🖥️ Main Pages

/
├── Landing Page
│
├── /sign-in
│   └── User authentication
│
├── /sign-up
│   └── Account creation
│
├── /dashboard
│   └── Saved student ID cards
│
└── /builder
    └── Student ID card builder



  🔌  API Routes
Authentication
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/me


Student ID Cards
GET    /api/cards
POST   /api/cards
GET    /api/cards/[id]
PUT    /api/cards/[id]
DELETE /api/cards/[id]


📤 Export

CardForge supports:

PNG

High-resolution PNG export using html2canvas.

PDF

Print-ready PDF export using jsPDF.

The generated PDF uses standard ID card dimensions:

85.6 × 53.98 mm



📁 Project Structure
app/
├── page.tsx
├── sign-in/
├── sign-up/
├── dashboard/
├── builder/
└── api/
    ├── auth/
    │   ├── signup/
    │   ├── signin/
    │   ├── signout/
    │   └── me/
    │
    └── cards/
        └── [id]/


components/
├── ...


lib/
├── mongodb.ts
├── auth.ts
├── auth-context.tsx
└── models/
    ├── User.ts
    └── IDCard.ts









