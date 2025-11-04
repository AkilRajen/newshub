# NewsHub - Next.js with AWS Cognito Social Authentication

A modern news website built with Next.js 15, featuring AWS Cognito integration for Google social login, user profiles, and personalized content.

## Features

- 🔐 **AWS Cognito Authentication** - Google social login integration
- 📰 **News Website** - Complete news site with articles, categories, and search
- 👤 **User Profiles** - Personalized user dashboard and preferences
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI** - Clean, professional interface
- 🔍 **Article Search & Filter** - Search articles by title/content and filter by category
- 📖 **Individual Article Pages** - Detailed article view with related content
- 💾 **User Preferences** - Save articles and customize news feed

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: AWS Amplify + Cognito
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **UI Components**: AWS Amplify UI React

## Prerequisites

Before running this project, you need:

1. **AWS Account** with Cognito User Pool configured
2. **Google OAuth App** set up in Google Cloud Console
3. **Node.js** 18+ installed

## AWS Cognito Setup

### 1. Create Cognito User Pool

1. Go to AWS Cognito Console
2. Create a new User Pool
3. Configure sign-in options (email)
4. Set up Google as identity provider:
   - Add Google as social identity provider
   - Enter your Google OAuth client ID and secret
   - Set authorized scopes: `openid email profile`

### 2. Configure App Client

1. Create an app client in your User Pool
2. Set the following settings:
   - **App type**: Public client
   - **Authentication flows**: Allow all
   - **OAuth 2.0 settings**:
     - Allowed OAuth flows: Authorization code grant
     - Allowed OAuth scopes: openid, email, profile
     - Callback URLs: `http://localhost:3000/`
     - Sign out URLs: `http://localhost:3000/`

### 3. Set up Hosted UI Domain

1. Go to App integration tab
2. Create a domain for Hosted UI
3. Note the domain URL (e.g., `your-domain.auth.region.amazoncognito.com`)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cognito-social-auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env.local` with your AWS Cognito settings:
   ```env
   NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
   NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your-client-id
   NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain.auth.region.amazoncognito.com
   NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/
   NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── about/              # About page
│   ├── articles/           # Articles listing and individual article pages
│   │   └── [id]/          # Dynamic article pages
│   ├── profile/           # User profile page
│   ├── signin/            # Authentication page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with auth provider
│   └── page.tsx           # Home page
├── components/
│   ├── AuthProvider.tsx   # Amplify auth provider wrapper
│   └── Header.tsx         # Navigation header
└── lib/
    └── amplify.ts         # AWS Amplify configuration
```

## Key Components

### Authentication Flow

1. **AuthProvider**: Wraps the app with Amplify authentication context
2. **Header**: Shows sign-in/sign-out buttons and user status
3. **Sign-in Page**: Uses Amplify UI components for Google OAuth
4. **Profile Page**: Protected route showing user information

### News Features

1. **Home Page**: Featured articles and latest news
2. **Articles Page**: Searchable and filterable article listing
3. **Individual Articles**: Detailed article view with related content
4. **User Profile**: Personalized dashboard with saved articles

## Customization

### Adding More Social Providers

To add Facebook, Amazon, or other providers:

1. Configure the provider in Cognito
2. Update the `socialProviders` array in `signin/page.tsx`:
   ```tsx
   <Authenticator
     socialProviders={['google', 'facebook', 'amazon']}
     // ...
   />
   ```

### Styling

The project uses Tailwind CSS. Key style files:
- `globals.css`: Global styles and prose classes
- Component files: Inline Tailwind classes

### Adding Real Data

Replace the mock data in components with real API calls:
- Update article data in `page.tsx` and `articles/page.tsx`
- Connect to a CMS or database
- Implement real user preferences storage

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update redirect URLs in Cognito to use your production domain

### Other Platforms

Update the redirect URLs in both:
1. Your `.env.local` file
2. AWS Cognito App Client settings

## Troubleshooting

### Common Issues

1. **"User pool does not exist"**
   - Verify your User Pool ID and region
   - Check environment variables

2. **Google sign-in not working**
   - Verify Google OAuth configuration in Cognito
   - Check redirect URLs match exactly

3. **Styling issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS

### Debug Mode

Enable debug logging by adding to your environment:
```env
NEXT_PUBLIC_AMPLIFY_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the AWS Amplify documentation
- Review AWS Cognito setup guides
- Open an issue in this repository