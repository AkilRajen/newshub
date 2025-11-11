# NewsHub - News Application with AWS Cognito Authentication

A modern news application built with Next.js, featuring Google OAuth authentication through AWS Cognito.

## Features

- 🔐 **Secure Authentication** - Google OAuth via AWS Cognito
- 👤 **User Profiles** - View detailed user information and preferences
- 📰 **News Feed** - Browse and read articles
- 🎨 **Modern UI** - Built with Tailwind CSS
- ⚡ **Fast & Responsive** - Optimized Next.js application

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: AWS Cognito + AWS Amplify
- **OAuth Provider**: Google
- **Styling**: Tailwind CSS
- **UI Components**: AWS Amplify UI React
- **Deployment**: Vercel

## Documentation

- **[AWS Cognito Setup Guide](./AWS_COGNITO_SETUP.md)** - Complete setup instructions for AWS Cognito and Google OAuth
- **[Authentication Flow](./AUTH_FLOW_EXPLANATION.md)** - Detailed explanation of how authentication works

## Quick Start

### Prerequisites

- Node.js 18+ installed
- AWS Account
- Google Cloud Account
- Vercel Account (for deployment)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd newshub
npm install
```

### 2. Set Up AWS Cognito & Google OAuth

Follow the complete guide in [AWS_COGNITO_SETUP.md](./AWS_COGNITO_SETUP.md)

### 3. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_DOMAIN=https://your-domain.auth.region.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/
```

See `.env.example` for a template.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test Authentication

1. Click "Sign In"
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. You should be redirected back and logged in

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard (see [AWS_COGNITO_SETUP.md](./AWS_COGNITO_SETUP.md) Part 7)
4. Update Cognito callback URLs with your Vercel domain
5. Deploy!

## Project Structure

```
newshub/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Home page
│   │   ├── signin/            # Sign in page
│   │   ├── profile/           # User profile page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── AuthProvider.tsx   # Auth context provider
│   │   └── AmplifyInit.tsx    # Amplify initialization
│   └── lib/
│       └── amplify.ts         # Amplify configuration
├── .env.local                 # Local environment variables (gitignored)
├── .env.example              # Environment variables template
├── AWS_COGNITO_SETUP.md      # Setup guide
└── AUTH_FLOW_EXPLANATION.md  # Authentication flow documentation
```

## Key Components

### Authentication

- **AmplifyInit** - Initializes AWS Amplify on client side
- **AuthProvider** - Provides authentication context to the app
- **Header** - Shows user info and sign in/out buttons
- **Profile Page** - Displays detailed user information

### Configuration

- **amplify.ts** - Configures AWS Amplify with Cognito settings
- Uses dynamic origin for redirect URLs (works in any environment)

## Environment Variables

All environment variables are prefixed with `NEXT_PUBLIC_` because they're used in client-side code:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | AWS Cognito User Pool ID | `us-east-1_k90mwXxsL` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID` | App Client ID (SPA type) | `26uhgsh1bjf8bvjo2r5nuvksu1` |
| `NEXT_PUBLIC_COGNITO_DOMAIN` | Cognito Hosted UI domain | `https://domain.auth.region.amazoncognito.com` |
| `NEXT_PUBLIC_REDIRECT_SIGN_IN` | OAuth callback URL | `http://localhost:3000/` |
| `NEXT_PUBLIC_REDIRECT_SIGN_OUT` | Sign out redirect URL | `http://localhost:3000/` |

## Security

- ✅ Uses SPA app client (no client secret in browser)
- ✅ PKCE (Proof Key for Code Exchange) for OAuth
- ✅ Secure token storage in browser
- ✅ Automatic token refresh
- ✅ HTTPS in production
- ✅ Environment variables not committed to Git

## Troubleshooting

See the **Troubleshooting** section in [AWS_COGNITO_SETUP.md](./AWS_COGNITO_SETUP.md) for common issues and solutions.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

## License

MIT
