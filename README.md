# Magical Questions Team Building Game

A fun, interactive team-building platform designed to enhance workplace connections through thought-provoking "magical questions". This application helps remote teams connect and learn about each other in an engaging, low-pressure environment.

## Purpose

The Magical Questions game addresses the challenge of building meaningful connections in remote work environments. By presenting carefully crafted questions that spark interesting conversations and personal sharing, the game helps team members:

- **Break the ice** in a natural, engaging way
- **Discover common interests** and unique perspectives among teammates  
- **Build empathy and understanding** through personal storytelling
- **Create shared experiences** that strengthen team bonds
- **Encourage vulnerability** in a safe, supportive setting

The questions range from lighthearted and fun ("When was the last time you used glitter?") to thoughtful and reflective ("What's a small act of kindness someone did for you that you'll never forget?"), ensuring everyone can participate comfortably.

## Features

### 🎲 Random Question Display
- Get a random question from the active question pool
- Re-roll functionality to get a new question
- Clean, focused interface that encourages discussion

### 👍👎 Simple Rating System
- Thumbs up/down voting on questions
- Helps identify the most engaging questions for your team
- Anonymous rating tracking (no user accounts required)

### 🛠️ Admin Panel
- Add new custom questions tailored to your team
- Organize questions by category (Personal, Fun, Growth, etc.)
- Enable/disable questions as needed
- View question statistics and ratings

### 📱 Mobile-Friendly Design
- Responsive design works on all devices
- Dark/light theme support
- Smooth animations and transitions

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or runs with in-memory storage)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5000`

## Adding Default Questions

The application comes with 15 carefully selected default questions that cover various topics and conversation starters. To add more default questions that will be available every time the application starts:

### Method 1: Code-Based Addition

1. Open `server/storage.ts`
2. Find the `seedQuestions()` method in the `MemStorage` class
3. Add your new questions to the `sampleQuestions` array:

```typescript
{
  text: "Your question text here?",
  category: "appropriate-category",
  isActive: true,
},
```

Available categories include:
- `general` - Broad, universal questions
- `imagination` - Creative and hypothetical questions
- `personal` - Questions about individual experiences
- `creativity` - Questions that spark creative thinking
- `growth` - Questions about learning and development
- `gratitude` - Questions about positive experiences
- `experiences` - Questions about past events or memories
- `reflection` - Questions that encourage introspection
- `curiosity` - Questions about interests and learning
- `fun` - Lighthearted, entertaining questions
- `childhood` - Questions about growing up and family

### Method 2: Admin Interface

1. Navigate to `/admin` in the application
2. Use the "Add New Question" form to create questions
3. Select appropriate categories and ensure questions are marked as active

**Note**: Questions added through the admin interface are only stored in memory during the current session. For permanent additions that persist across application restarts, use Method 1.

### Question Writing Tips

Good magical questions should:
- Be **open-ended** rather than yes/no questions
- **Encourage storytelling** and personal sharing  
- Be **inclusive** and accessible to people from different backgrounds
- **Spark curiosity** about teammates' experiences
- Be **appropriate** for a workplace setting
- **Avoid sensitive topics** like politics, religion, or personal finances

**Examples of effective questions:**
- "What's a skill you learned as an adult that you wish you'd learned as a child?"
- "If you could have coffee with any historical figure, who would it be and what would you ask?"
- "What's something small that never fails to make you smile?"

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (fallback to in-memory storage)
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: React Query for server state caching

## Project Structure

```
├── client/src/           # React frontend application
│   ├── components/       # Reusable UI components
│   ├── pages/           # Main application pages (Game, Admin)
│   └── lib/             # Utilities and configuration
├── server/              # Express.js backend
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage interface and implementation
│   └── index.ts         # Server entry point
├── shared/              # Shared TypeScript types and schemas
└── README.md           # This file
```

## Future Enhancements

- **Multiplayer Mode**: Collect answers from team members and reveal responses
- **Google Sheets Integration**: Collaborative question management via spreadsheets  
- **Answer Matching Game**: Guess which teammate gave which answer
- **Question Scheduling**: Automatically present new questions daily/weekly
- **Team Analytics**: Track engagement and participation over time

## Contributing

This project is designed to be easily customizable for your team's needs. Feel free to:
- Add questions that reflect your team's culture and interests
- Modify categories to match your organization's values
- Customize the styling and branding
- Extend functionality based on team feedback

## License

Open source - feel free to adapt and modify for your team's needs.