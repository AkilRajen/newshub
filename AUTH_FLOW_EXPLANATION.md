# Authentication Flow: Sign In to Sign Out

## Overview
Your NewsHub app uses AWS Cognito with Google OAuth for authentication, integrated through AWS Amplify.

---

## 1. Application Initialization

### When the app loads (`src/app/layout.tsx`):

```
User visits site
    ↓
Next.js renders RootLayout
    ↓
<AmplifyInit /> component mounts
    ↓
Calls configureAmplify() function
    ↓
Amplify.configure() sets up AWS Cognito connection
    ↓
<AuthProvider> wraps the entire app
    ↓
Authenticator.Provider makes auth state available everywhere
```

**Key Files:**
- `src/app/layout.tsx` - Root layout
- `src/components/AmplifyInit.tsx` - Initializes Amplify on client side
- `src/lib/amplify.ts` - Amplify configuration
- `src/components/AuthProvider.tsx` - Provides auth context

**What happens:**
- Amplify connects to your Cognito User Pool
- Configuration includes:
  - User Pool ID: `us-east-1_k90mwXxsL`
  - Client ID: `26uhgsh1bjf8bvjo2r5nuvksu1`
  - OAuth domain: `us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com`
  - Redirect URLs for callbacks

---

## 2. User Clicks "Sign In"

### Navigation to Sign In Page:

```
User clicks "Sign In" button in Header
    ↓
Navigates to /signin
    ↓
src/app/signin/page.tsx renders
    ↓
<Authenticator> component displays
    ↓
Shows Google sign-in button
```

**Key Files:**
- `src/components/Header.tsx` - Contains Sign In button
- `src/app/signin/page.tsx` - Sign in page with Authenticator

**What the user sees:**
- A sign-in form with "Sign in with Google" button
- Powered by AWS Amplify UI components

---

## 3. Google OAuth Flow Begins

### When user clicks "Sign in with Google":

```
User clicks "Sign in with Google"
    ↓
Amplify calls signInWithRedirect({ provider: 'Google' })
    ↓
Amplify constructs OAuth URL with:
  - Cognito domain
  - Client ID
  - Scopes (openid, email, profile)
  - Redirect URI (http://localhost:3000/)
  - State parameter (for security)
  - PKCE code challenge (for security)
    ↓
Browser redirects to Cognito Hosted UI
```

**OAuth URL Example:**
```
https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/login
  ?client_id=26uhgsh1bjf8bvjo2r5nuvksu1
  &response_type=code
  &scope=openid+email+profile+aws.cognito.signin.user.admin
  &redirect_uri=http://localhost:3000/
  &state=<random-state>
  &code_challenge=<pkce-challenge>
```

---

## 4. Cognito Redirects to Google

### Cognito acts as intermediary:

```
User lands on Cognito Hosted UI
    ↓
Cognito sees Google is configured as identity provider
    ↓
Cognito redirects to Google OAuth
    ↓
Google OAuth URL includes:
  - Google Client ID (from Cognito config)
  - Scopes (openid, email, profile)
  - Redirect back to Cognito
```

**Google OAuth URL:**
```
https://accounts.google.com/o/oauth2/v2/auth
  ?client_id=<your-google-client-id>
  &redirect_uri=https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
  &scope=openid+email+profile
  &response_type=code
```

---

## 5. User Signs In with Google

### Google authentication:

```
User sees Google sign-in page
    ↓
User selects Google account
    ↓
User grants permissions (email, profile)
    ↓
Google generates authorization code
    ↓
Google redirects back to Cognito with code
```

**Redirect back to Cognito:**
```
https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
  ?code=<google-auth-code>
  &state=<state-from-cognito>
```

---

## 6. Cognito Processes Google Response

### Cognito exchanges code for tokens:

```
Cognito receives Google auth code
    ↓
Cognito calls Google token endpoint
    ↓
Google returns:
  - ID token (user info)
  - Access token
    ↓
Cognito extracts user info:
  - Email
  - Name
  - Profile picture
    ↓
Cognito checks if user exists in User Pool
    ↓
If new user: Creates user account
If existing: Updates user info
    ↓
Cognito generates its own tokens:
  - ID token (JWT)
  - Access token (JWT)
  - Refresh token
    ↓
Cognito redirects back to your app
```

**Redirect back to app:**
```
http://localhost:3000/
  ?code=<cognito-auth-code>
  &state=<original-state>
```

---

## 7. App Receives OAuth Callback

### Token exchange in browser:

```
Browser lands on http://localhost:3000/?code=...
    ↓
Amplify detects OAuth callback (code parameter)
    ↓
Amplify automatically exchanges code for tokens
    ↓
Calls Cognito token endpoint with:
  - Authorization code
  - PKCE code verifier
  - Client ID
    ↓
Cognito returns tokens:
  - ID token (user identity)
  - Access token (API access)
  - Refresh token (get new tokens)
    ↓
Amplify stores tokens securely in browser:
  - localStorage (encrypted)
  - Session storage
    ↓
Amplify emits 'signedIn' event
    ↓
AuthProvider Hub listener catches event
    ↓
useAuthenticator hook updates with user object
```

**Key Files:**
- `src/components/AuthProvider.tsx` - Listens for auth events
- Browser storage - Tokens stored securely

**Console logs you see:**
```
Auth event: signInWithRedirect
Handling OAuth redirect
User signed in successfully
```

---

## 8. User is Now Authenticated

### App updates with user state:

```
useAuthenticator hook provides user object
    ↓
Header component re-renders
    ↓
Shows user name and Sign Out button
    ↓
Protected routes become accessible
    ↓
User can access /profile page
```

**User object contains:**
```javascript
{
  userId: "google_123456789",
  username: "google_123456789",
  signInDetails: {
    loginId: "user@gmail.com",
    authFlowType: "USER_AUTH"
  }
}
```

**User attributes (from fetchUserAttributes()):**
```javascript
{
  sub: "uuid",
  email: "user@gmail.com",
  email_verified: "true",
  name: "John Doe",
  picture: "https://lh3.googleusercontent.com/...",
  given_name: "John",
  family_name: "Doe"
}
```

---

## 9. User Navigates the App

### Authenticated session:

```
User browses the site
    ↓
Every component can access user via useAuthenticator()
    ↓
Header shows: "Welcome, John Doe"
    ↓
Profile page displays user info
    ↓
Protected routes check if user exists
    ↓
Tokens automatically refresh when expired
```

**Key Components:**
- `src/components/Header.tsx` - Shows user name
- `src/app/profile/page.tsx` - Displays full user info
- `src/app/page.tsx` - Home page with personalized content

**Token Refresh (automatic):**
```
Access token expires (1 hour)
    ↓
Amplify detects expired token
    ↓
Uses refresh token to get new access token
    ↓
Happens transparently in background
    ↓
User stays logged in
```

---

## 10. User Clicks "Sign Out"

### Sign out process:

```
User clicks "Sign Out" button
    ↓
Header calls handleSignOut()
    ↓
Calls signOut() from aws-amplify/auth
    ↓
Amplify performs sign out:
  1. Clears tokens from browser storage
  2. Calls Cognito logout endpoint
  3. Invalidates session on server
    ↓
Cognito revokes tokens
    ↓
Amplify emits 'signedOut' event
    ↓
useAuthenticator hook updates (user = null)
    ↓
App re-renders without user
    ↓
Header shows "Sign In" button again
    ↓
Protected routes redirect to /signin
```

**Key Files:**
- `src/components/Header.tsx` - Sign Out button and handler

**Console logs:**
```
Auth event: signedOut
User signed out successfully
```

---

## Security Features

### 1. PKCE (Proof Key for Code Exchange)
- Prevents authorization code interception
- Code challenge sent with initial request
- Code verifier sent with token exchange
- No client secret needed in browser

### 2. State Parameter
- Prevents CSRF attacks
- Random value generated for each request
- Verified on callback

### 3. Token Storage
- Tokens stored securely in browser
- Encrypted in localStorage
- Automatically cleared on sign out

### 4. Token Expiration
- Access tokens expire after 1 hour
- Refresh tokens used to get new access tokens
- Refresh tokens expire after 30 days (configurable)

### 5. HTTPS in Production
- All OAuth flows use HTTPS
- Prevents man-in-the-middle attacks

---

## Data Flow Summary

```
┌─────────────┐
│   Browser   │
│  (Your App) │
└──────┬──────┘
       │
       │ 1. Configure Amplify
       │ 2. User clicks Sign In
       │
       ↓
┌─────────────────┐
│ AWS Cognito     │
│ Hosted UI       │
└────────┬────────┘
         │
         │ 3. Redirect to Google
         │
         ↓
┌─────────────────┐
│ Google OAuth    │
│ Sign In         │
└────────┬────────┘
         │
         │ 4. User authenticates
         │ 5. Return auth code
         │
         ↓
┌─────────────────┐
│ AWS Cognito     │
│ Token Exchange  │
└────────┬────────┘
         │
         │ 6. Exchange for Cognito tokens
         │ 7. Create/update user
         │
         ↓
┌─────────────────┐
│   Browser       │
│ (Authenticated) │
└─────────────────┘
```

---

## Environment Variables

These configure the entire flow:

```env
# Cognito User Pool
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_k90mwXxsL

# App Client (SPA - no secret)
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=26uhgsh1bjf8bvjo2r5nuvksu1

# Cognito Domain (Hosted UI)
NEXT_PUBLIC_COGNITO_DOMAIN=https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com

# OAuth Callbacks
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/
```

---

## Key Takeaways

1. **Amplify handles complexity** - You don't manually manage tokens or OAuth flows
2. **Cognito is the middleman** - Sits between your app and Google
3. **Tokens are secure** - Stored encrypted, auto-refresh, PKCE protection
4. **User state is reactive** - useAuthenticator hook updates automatically
5. **Sign out is clean** - Clears everything locally and on server

This architecture provides enterprise-grade authentication with minimal code!
