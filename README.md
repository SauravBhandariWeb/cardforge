# CardForge — College Student ID Card Generator

CardForge is a full-stack web application for creating, customizing, saving, editing, and exporting professional college student ID cards.

Built with Next.js, TypeScript, MongoDB, JWT authentication, Tailwind CSS, Framer Motion, QR codes, PNG export, and PDF generation.

## Features

- User authentication with email and password
- College-focused student ID card builder
- Student personal information management
- College and institution details
- Student photo upload
- College logo upload
- Custom card colors
- Custom text colors
- Automatic QR code generation
- Save student ID cards
- Edit existing ID cards
- Delete saved ID cards
- Export ID cards as PNG
- Export ID cards as PDF
- Responsive design
- Glassmorphism UI and smooth animations
- Live card preview while editing

## Tech Stack

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

### Card and Export

- html2canvas
- jsPDF
- qrcode.react
- FileReader API

### Deployment

- Vercel
- MongoDB Atlas

## Student ID Card Fields

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

## Main Pages

/
├── Landing Page
├── /sign-in
├── /sign-up
├── /dashboard
└── /builder

## API Routes

### Authentication

POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout
GET /api/auth/me

### Student ID Cards

GET /api/cards
POST /api/cards
GET /api/cards/[id]
PUT /api/cards/[id]
DELETE /api/cards/[id]

## Project Structure

app/
├── page.tsx
├── sign-in/
│   └── page.tsx
├── sign-up/
│   └── page.tsx
├── dashboard/
│   └── page.tsx
├── builder/
│   └── page.tsx
├── api/
│   ├── auth/
│   │   ├── signup/
│   │   │   └── route.ts
│   │   ├── signin/
│   │   │   └── route.ts
│   │   ├── signout/
│   │   │   └── route.ts
│   │   └── me/
│   │       └── route.ts
│   └── cards/
│       ├── route.ts
│       └── [id]/
│           ├── route.ts
│           ├── export/
│           │   └── route.ts
│           └── download/
│               └── route.ts
└── globals.css

components/
└── ui/
    └── button.tsx

lib/
├── mongodb.ts
├── auth.ts
├── auth-context.tsx
├── utils.ts
└── models/
    ├── User.ts
    ├── IDCard.ts
    └── Template.ts

next.config.mjs
package.json
package-lock.json
tsconfig.json
postcss.config.mjs
components.json
README.md

## Export

CardForge supports PNG and PDF export.

### PNG Export

High-resolution PNG generation using html2canvas.

### PDF Export

Print-ready PDF generation using jsPDF.

The generated PDF uses standard ID card dimensions:

85.6 × 53.98 mm

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas

### Clone the Repository

git clone https://github.com/SauravBhandariWeb/cardforge.git
cd cardforge

### Install Dependencies

npm install

### Environment Variables

Create a .env file in the project root:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Never commit your .env file or expose your secret values publicly.

### Start Development Server

npm run dev

Then open:

http://localhost:3000

## Security

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- User-specific card access
- Environment variables for sensitive configuration
- User-scoped database operations

## Responsive Design

CardForge is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The builder provides a responsive layout with a live student ID preview and customization controls.

## Future Improvements

- More college ID card templates
- Additional card layouts
- Barcode support
- Bulk student ID generation
- Institution management
- Batch card creation
- Advanced template customization
- Additional export formats

## Author

Saurav Bhandari

Software Engineer | Full-Stack Developer

GitHub: https://github.com/SauravBhandariWeb

## License

This project currently does not include a separate open-source license.

---

Built with Next.js, TypeScript, MongoDB, and a focus on creating practical full-stack products.