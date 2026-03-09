# Contributing to PharmaOS Compliance Response AI

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL 14+ with pgvector extension
- Git
- Supabase account (for storage and database)
- Google Cloud account (for Gemini API)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pharmaos.git
   cd pharmaos
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd apps/web
   npm install

   # Install backend dependencies
   cd ../api
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Frontend
   cp .env.example apps/web/.env.local
   # Edit apps/web/.env.local with your values

   # Backend
   cp .env.example apps/api/.env
   # Edit apps/api/.env with your values
   ```

4. **Set up database**
   ```bash
   cd apps/api
   # Run schema creation
   psql -h your-host -U your-user -d your-db -f database_schema.sql
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd apps/api
   npm run dev

   # Terminal 2: Frontend
   cd apps/web
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Write clean, readable code**
   - Follow existing code style
   - Use TypeScript types
   - Add JSDoc comments for functions
   - Keep functions small and focused

2. **Test your changes**
   ```bash
   # Backend tests
   cd apps/api
   npm test

   # Frontend tests
   cd apps/web
   npm test
   ```

3. **Commit with meaningful messages**
   ```bash
   git add .
   git commit -m "feat(component): add new feature description"
   ```

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(ui): add citation snippets to reference cards
fix(auth): resolve UUID foreign key violation in demo mode
docs: update deployment guide with Render configuration
refactor(rag): improve chunk retrieval performance
```

### Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in PR template

3. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Tests pass
   - No merge conflicts

## Code Style Guidelines

### TypeScript

```typescript
// ✅ Good
interface Citation {
  documentName: string;
  pageNumber?: number;
  snippet: string;
}

const generateAnswer = async (
  question: string,
  context: string[]
): Promise<Answer> => {
  // Implementation
};

// ❌ Bad
const generateAnswer = async (question, context) => {
  // Missing types
};
```

### React Components

```typescript
// ✅ Good
interface QuestionCardProps {
  question: string;
  answer?: Answer;
  onRegenerate: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onRegenerate
}) => {
  // Component logic
};

// ❌ Bad
export const QuestionCard = (props) => {
  // Missing types and interface
};
```

### File Organization

```
apps/web/src/
├── components/
│   ├── ai-assistant/      # Feature-specific components
│   ├── common/            # Shared components
│   └── layout/            # Layout components
├── lib/                   # Utilities and helpers
├── services/              # API clients
└── types/                 # TypeScript types

apps/api/src/
├── controllers/           # Route handlers
├── services/              # Business logic
├── middleware/            # Express middleware
├── routes/                # Route definitions
└── types/                 # TypeScript types
```

## Testing Guidelines

### Unit Tests

```typescript
// Example unit test
describe('sanitizeAnswerText', () => {
  it('should remove markdown symbols', () => {
    const input = '## Heading **bold** text';
    const expected = 'Heading bold text';
    expect(sanitizeAnswerText(input)).toBe(expected);
  });
});
```

### Integration Tests

```typescript
// Example integration test
describe('POST /chat/generate-answers', () => {
  it('should generate answers for all questions', async () => {
    const response = await request(app)
      .post('/api/chat/generate-answers')
      .set('Authorization', 'Bearer demo-token-12345')
      .send({ sessionId: 'test-session-id' });

    expect(response.status).toBe(200);
    expect(response.body.answersGenerated).toBeGreaterThan(0);
  });
});
```

## Documentation

### Code Comments

```typescript
/**
 * Sanitizes answer text by removing markdown formatting.
 * 
 * @param text - The text to sanitize
 * @returns Cleaned text without markdown symbols
 * 
 * @example
 * sanitizeAnswerText('## Title **bold**')
 * // Returns: 'Title bold'
 */
const sanitizeAnswerText = (text: string): string => {
  // Implementation
};
```

### README Updates

When adding new features:
1. Update README.md with feature description
2. Add to CHANGELOG.md
3. Update API_DOCUMENTATION.md if adding endpoints
4. Update DEPLOYMENT.md if changing configuration

## Performance Guidelines

### Frontend

- Use React.memo for expensive components
- Implement virtualization for long lists
- Debounce user input (search, auto-save)
- Lazy load routes and components
- Optimize images and assets

### Backend

- Use database indexes for queries
- Implement caching where appropriate
- Batch database operations
- Use connection pooling
- Optimize vector search parameters

## Security Guidelines

### Never Commit

- Environment variables (`.env` files)
- API keys or secrets
- Database credentials
- User data or PII

### Always

- Validate user input
- Sanitize database queries
- Use parameterized queries
- Implement rate limiting
- Check authentication/authorization

## Getting Help

- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: See README.md and docs/
- **Code Review**: Request review from maintainers

## Code Review Process

1. Self-review your code first
2. Ensure all tests pass
3. Update documentation
4. Request review from 1-2 maintainers
5. Address feedback
6. Maintainer approves and merges

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributor graph

Thank you for contributing to PharmaOS! 🎉
