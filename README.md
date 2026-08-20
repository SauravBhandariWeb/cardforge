# CardForge - Professional ID Card Generator SaaS

A premium, full-stack SaaS application for creating, customizing, and exporting professional ID cards. Built with Next.js 16, MongoDB, JWT authentication, and Framer Motion animations.

## Features

- **User Authentication**: Secure JWT-based authentication with email and password
- **Card Builder**: Intuitive drag-and-drop interface for creating professional ID cards
- **Customization**: Full design control with colors, layouts, fonts, and branding
- **Export Options**: Export cards as PNG or PDF with print-ready resolution
- **Card Management**: Save, edit, and organize multiple ID card designs
- **Template System**: Pre-built templates for quick card creation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Premium UI**: Glassmorphism, mesh gradients, and smooth animations

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **html2canvas** - Canvas rendering for exports
- **jsPDF** - PDF generation

### Backend
- **Node.js** - Runtime
- **Express** (via Next.js API routes)
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Hosting and deployment

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas account
- Environment variables configured

### Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit `http://localhost:3000` to access the application.

## Project Structure

```
app/
├── page.tsx              # Landing page
├── sign-in/             # Sign-in page
├── sign-up/             # Sign-up page
├── dashboard/           # User dashboard
├── builder/             # Card builder interface
└── api/
    ├── auth/            # Authentication endpoints
    │   ├── signup/
    │   ├── signin/
    │   ├── signout/
    │   └── me/
    ├── cards/           # Card management endpoints
    │   ├── [id]/
    │   └── [id]/export/
    └── templates/       # Template endpoints

lib/
├── mongodb.ts           # MongoDB connection
├── auth.ts             # JWT token utilities
├── auth-context.tsx    # React auth context
└── models/
    ├── User.ts         # User schema
    ├── IDCard.ts       # ID card schema
    └── Template.ts     # Template schema

components/
└── (shared components)
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user

### ID Cards
- `GET /api/cards` - Get all user cards
- `POST /api/cards` - Create new card
- `GET /api/cards/[id]` - Get card details
- `PUT /api/cards/[id]` - Update card
- `DELETE /api/cards/[id]` - Delete card
- `POST /api/cards/[id]/export` - Export card (PNG/PDF)

### Templates
- `GET /api/templates` - Get available templates
- `POST /api/templates` - Create new template

## Database Schema

### User Model
- `id` - Unique identifier
- `email` - User email (unique)
- `password` - Hashed password
- `name` - Full name
- `createdAt` - Account creation timestamp

### ID Card Model
- `id` - Unique identifier
- `userId` - Reference to user
- `templateId` - Optional template reference
- `firstName` - Card holder first name
- `lastName` - Card holder last name
- `email` - Contact email
- `phone` - Contact phone
- `title` - Job title
- `department` - Department
- `company` - Company name
- `designJson` - Design configuration (colors, layout)
- `frontImageUrl` - Exported front image URL
- `backImageUrl` - Exported back image URL
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Template Model
- `id` - Unique identifier
- `userId` - Creator user ID
- `name` - Template name
- `description` - Template description
- `designJson` - Design configuration
- `isPublic` - Whether template is public
- `createdAt` - Creation timestamp

## Authentication Flow

1. User signs up with email and password
2. Password is hashed with bcryptjs
3. User data is stored in MongoDB
4. JWT token is generated and returned
5. Token is stored in localStorage (client-side)
6. Token is sent with each API request in Authorization header
7. Backend verifies token and extracts user ID
8. All queries are scoped to the authenticated user

## Card Customization Options

- **Colors**: Background, text, and accent colors
- **Layout**: Vertical or horizontal card orientation
- **Typography**: Font families and sizes
- **Information**: Name, title, company, contact details
- **Branding**: Custom logos and color schemes

## Export Features

- **PNG Export**: High-resolution raster image (300 DPI)
- **PDF Export**: Print-ready PDF (85.6 × 53.98 mm standard size)
- **Multiple Sides**: Front and back card printing

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
vercel deploy
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- User data isolation (queries scoped to user ID)
- HTTPS-only in production
- Secure cookie settings
- Input validation on server and client

## Performance Optimizations

- Image optimization with Next.js Image component
- CSS-in-JS with Tailwind for minimal bundle size
- Framer Motion for GPU-accelerated animations
- Lazy loading of routes
- Optimized database queries with indexing

## Future Enhancements

- [ ] Multi-user collaboration on templates
- [ ] Advanced design editor with drag-and-drop
- [ ] Bulk card printing
- [ ] Card batch processing
- [ ] Team/organization management
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and usage tracking
- [ ] Social sharing of templates
- [ ] Payment integration for premium features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, feature requests, or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js, MongoDB, and Framer Motion**
