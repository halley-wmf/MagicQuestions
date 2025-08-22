# Overview

This is a full-stack magical questions team-building game built with React and Express. The app helps remote teams connect through thought-provoking questions that spark meaningful conversations. Users can rate questions with thumbs up/down voting and administrators can manage the question pool. The application currently has 15 default questions covering topics from lighthearted fun to thoughtful reflection. The system includes both a user-facing game interface and an admin panel for managing questions. The application uses a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components for a polished user experience.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client uses **React with TypeScript** and follows a component-based architecture:
- **Routing**: Uses Wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Animations**: Framer Motion for smooth transitions and animations
- **Theming**: next-themes for dark/light mode support
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
The server follows a **RESTful API** pattern with Express.js:
- **Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with connection pooling via node-postgres
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot reload with tsx and Vite middleware integration

## Data Storage Solutions
- **Primary Database**: PostgreSQL hosted via environment variable configuration
- **ORM**: Drizzle ORM provides type-safe queries and migrations
- **Schema Management**: Centralized schema definitions in `/shared/schema.ts`
- **Connection**: Uses connection pooling with SSL support for production environments

## Key Data Models
- **Questions**: Text content, categories, active status, and timestamps
- **Ratings**: User ratings (1=thumbs down, 2=thumbs up) with session tracking
- **Session Management**: Client-side session IDs for anonymous rating tracking

## Authentication and Authorization
Currently implements **anonymous sessions** with client-generated session IDs. No user authentication is required - the system tracks ratings by session to prevent duplicate votes on the same question.

## API Structure
RESTful endpoints following standard conventions:
- `GET /api/questions` - Fetch all questions
- `GET /api/questions/active` - Fetch active questions only
- `GET /api/questions/random` - Get random question with exclusion support
- `GET /api/questions/stats` - Questions with rating statistics
- `POST /api/questions` - Create new questions (admin)
- `POST /api/ratings` - Submit user ratings

## Architecture Decisions

### Database Choice
**PostgreSQL with Drizzle ORM** was chosen for:
- Strong typing with TypeScript integration
- Robust relational data handling
- Easy migration management
- Connection pooling for production scalability

### State Management Strategy
**React Query** handles server state because:
- Automatic caching and background refetching
- Optimistic updates for better UX
- Built-in loading and error states
- Reduces boilerplate compared to custom state management

### Styling Approach
**Tailwind + shadcn/ui** provides:
- Consistent design system with minimal custom CSS
- Accessible components out of the box
- Easy theming with CSS variables
- Responsive design utilities

### Session Management
**Client-side anonymous sessions** offer:
- No registration barriers for users
- Simple rating tracking without authentication complexity
- Privacy-focused approach (no personal data collection)

# External Dependencies

## Database Services
- **PostgreSQL Database**: Configured via `DATABASE_URL` environment variable
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)

## UI Component Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **shadcn/ui**: Pre-built component library with consistent styling
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for smooth interactions

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and autoprefixer

## Runtime Dependencies
- **React Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema parsing
- **Wouter**: Lightweight routing library
- **date-fns**: Date manipulation utilities

## Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database migration and introspection tools

## Potential Future Integrations
- **Google Sheets API**: Placeholder service exists for question management via spreadsheets
- **Analytics Services**: Could be added for user behavior tracking
- **Internationalization**: Multi-language support infrastructure is partially in place