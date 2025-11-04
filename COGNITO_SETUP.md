# AWS Cognito Setup Guide

This guide will walk you through setting up AWS Cognito with Google social authentication for your NewsHub application.

## Step 1: Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen:
   - Application name: "NewsHub"
   - Authorized domains: Add your domain
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-cognito-domain.auth.region.amazoncognito.com/oauth2/idpresponse`
7. Save the Client ID and Client Secret

## Step 2: Create Cognito User Pool

1. Open AWS Cognito Console
2. Click "Create user pool"
3. **Step 1 - Configure sign-in experience:**
   - Provider types: Select "Federated identity providers"
   - Cognito user pool sign-in options: Check "Email"
   - Federated sign-in options: Check "Google"

4. **Step 2 - Configure security requirements:**
   - Password policy: Use default or customize
   - Multi-factor authentication: Optional (recommended: Optional MFA)
   - User account recovery: Email only

5. **Step 3 - Configure sign-up experience:**
   - Self-service sign-up: Enable
   - Required attributes: Email
   - Optional attributes: Add any you need (name, picture, etc.)

6. **Step 4 - Configure message delivery:**
   - Email provider: Use default or configure SES
   - SMS: Configure if using phone verification

7. **Step 5 - Integrate your app:**
   - User pool name: "NewsHub-UserPool"
   - Hosted authentication pages: Use Cognito Hosted UI
   - Domain: Create a new domain (e.g., "newshub-auth")
   - Initial app client: Create new app client
     - App client name: "NewsHub-Client"
     - Client secret: Don't generate (for public clients)

8. **Step 6 - Review and create**

## Step 3: Configure App Client

After creating the user pool:

1. Go to your User Pool → "App integration" tab
2. Click on your app client
3. Edit "Hosted UI" settings:
   - **Allowed callback URLs**: `http://localhost:3000/`
   - **Allowed sign-out URLs**: `http://localhost:3000/`
   - **OAuth 2.0 grant types**: Authorization code grant
   - **OpenID Connect scopes**: openid, email, profile

## Step 4: Add Google as Identity Provider

1. In your User Pool, go to "Sign-in experience" tab
2. Click "Add identity provider"
3. Select "Google"
4. Configure:
   - **Google app ID**: Your Google OAuth Client ID
   - **Google app secret**: Your Google OAuth Client Secret
   - **Authorized scopes**: openid email profile
   - **Attribute mapping**:
     - email → email
     - name → name
     - picture → picture

## Step 5: Configure Attribute Mapping

1. Go to "Sign-in experience" → "Attribute mapping"
2. Map Google attributes to Cognito attributes:
   - Google `email` → Cognito `email`
   - Google `name` → Cognito `name`
   - Google `picture` → Cognito `picture`

## Step 6: Update Environment Variables

Copy the following values to your `.env.local`:

```env
# From User Pool General Settings
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX

# From App Client Settings
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your-client-id

# From Domain Settings (App integration tab)
NEXT_PUBLIC_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com

# Redirect URLs
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/
```

## Step 7: Test the Setup

1. Start your Next.js application: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign In"
4. You should see the Cognito Hosted UI with Google sign-in option
5. Test Google authentication

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Ensure callback URLs match exactly in both Google and Cognito
   - Check for trailing slashes

2. **"User pool does not exist"**
   - Verify the User Pool ID and region
   - Check environment variables

3. **Google sign-in button not appearing**
   - Verify Google is configured as identity provider
   - Check attribute mapping is set up

4. **"Access denied" after Google auth**
   - Check OAuth scopes in both Google and Cognito
   - Verify attribute mapping

### Debug Steps:

1. Check browser console for errors
2. Verify all environment variables are set
3. Test Cognito Hosted UI directly: `https://your-domain.auth.region.amazoncognito.com/login?client_id=your-client-id&response_type=code&scope=openid+email+profile&redirect_uri=http://localhost:3000/`

## Production Deployment

When deploying to production:

1. Update Google OAuth authorized redirect URIs
2. Update Cognito callback/sign-out URLs
3. Update environment variables with production values
4. Consider using a custom domain for Cognito Hosted UI

## Security Best Practices

1. Use HTTPS in production
2. Implement proper CORS settings
3. Regularly rotate client secrets
4. Monitor authentication logs
5. Set up CloudWatch alarms for failed authentications

## Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS Amplify Authentication](https://docs.amplify.aws/lib/auth/getting-started/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)