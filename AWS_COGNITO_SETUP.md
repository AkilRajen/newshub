# AWS Cognito & Google OAuth Setup Guide

Complete guide to setting up AWS Cognito with Google authentication for NewsHub.

---

## Prerequisites

- AWS Account
- Google Cloud Account
- Next.js application

---

## Part 1: Google OAuth Setup

### Step 1: Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**

### Step 2: Configure OAuth Consent Screen

1. Click **Configure Consent Screen**
2. Select **External** user type
3. Fill in application information:
   - **App name**: NewsHub
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Save and continue

### Step 3: Create OAuth 2.0 Client ID

1. **Application type**: Web application
2. **Name**: NewsHub Web Client
3. **Authorized redirect URIs**: 
   ```
   https://YOUR-COGNITO-DOMAIN.auth.REGION.amazoncognito.com/oauth2/idpresponse
   ```
   (You'll get this domain after creating Cognito User Pool)
4. Click **Create**
5. **Save the Client ID and Client Secret** - you'll need these for Cognito

---

## Part 2: AWS Cognito Setup

### Step 1: Create Cognito User Pool

1. Open [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Click **Create user pool**

### Step 2: Configure Sign-in Experience

1. **Provider types**: 
   - ✅ Federated identity providers
2. **Cognito user pool sign-in options**: 
   - ✅ Email
3. **Federated sign-in options**: 
   - ✅ Google
4. Click **Next**

### Step 3: Configure Security Requirements

1. **Password policy**: Use default or customize
2. **Multi-factor authentication**: No MFA (or Optional)
3. **User account recovery**: Email only
4. Click **Next**

### Step 4: Configure Sign-up Experience

1. **Self-service sign-up**: ✅ Enable
2. **Required attributes**: 
   - ✅ Email (ONLY - do NOT select phone_number)
3. **Optional attributes**: 
   - name
   - picture
4. Click **Next**

### Step 5: Configure Message Delivery

1. **Email provider**: Send email with Cognito (or configure SES)
2. Click **Next**

### Step 6: Integrate Your App

1. **User pool name**: `NewsHub-UserPool`
2. **Hosted authentication pages**: ✅ Use Cognito Hosted UI
3. **Domain type**: Use a Cognito domain
4. **Cognito domain**: Enter a unique prefix (e.g., `newshub-auth-123`)
5. Click **Next**

### Step 7: Create App Client

1. **App type**: ✅ Single-page application (SPA)
2. **App client name**: `NewsHub-SPA-Client`
3. **Client secret**: Not applicable for SPA (automatically no secret)
4. Click **Next**

### Step 8: Review and Create

1. Review all settings
2. Click **Create user pool**
3. **Save these values**:
   - User Pool ID (e.g., `us-east-1_k90mwXxsL`)
   - App Client ID (e.g., `26uhgsh1bjf8bvjo2r5nuvksu1`)
   - Domain (e.g., `newshub-auth-123.auth.us-east-1.amazoncognito.com`)

---

## Part 3: Configure App Client

### Step 1: Configure Hosted UI

1. Go to your User Pool → **App integration** tab
2. Click on your app client
3. Click **Edit** under Hosted UI section
4. Configure:

**Allowed callback URLs**:
```
http://localhost:3000/
https://your-production-domain.vercel.app/
```

**Allowed sign-out URLs**:
```
http://localhost:3000/
https://your-production-domain.vercel.app/
```

**Identity providers**:
- ✅ Google

**OAuth 2.0 grant types**:
- ✅ Authorization code grant

**OpenID Connect scopes**:
- ✅ openid
- ✅ email
- ✅ profile
- ✅ aws.cognito.signin.user.admin

5. Click **Save changes**

---

## Part 4: Add Google as Identity Provider

### Step 1: Configure Google Identity Provider

1. In your User Pool → **Sign-in experience** tab
2. Click **Add identity provider**
3. Select **Google**
4. Configure:

**Google app ID**: Your Google OAuth Client ID (from Part 1)

**Google app secret**: Your Google OAuth Client Secret (from Part 1)

**Authorized scopes**:
```
openid email profile
```

5. Click **Add identity provider**

### Step 2: Configure Attribute Mapping

1. Go to **Sign-in experience** → **Attribute mapping** → **Google**
2. Map attributes:
   - Google `email` → Cognito `email`
   - Google `name` → Cognito `name`
   - Google `picture` → Cognito `picture`
3. Click **Save changes**

---

## Part 5: Update Google OAuth Redirect URI

Now that you have your Cognito domain, update Google:

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. **Authorized redirect URIs** - Add:
   ```
   https://newshub-auth-123.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
   (Replace with your actual Cognito domain)
5. Click **Save**

---

## Part 6: Configure Your Application

### Step 1: Create Environment Files

Create `.env.local` for local development:

```env
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_k90mwXxsL
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=26uhgsh1bjf8bvjo2r5nuvksu1
NEXT_PUBLIC_COGNITO_DOMAIN=https://newshub-auth-123.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/
```

Create `.env` for production (template):

```env
# AWS Cognito Configuration - Production
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_k90mwXxsL
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=26uhgsh1bjf8bvjo2r5nuvksu1
NEXT_PUBLIC_COGNITO_DOMAIN=https://newshub-auth-123.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=https://your-app.vercel.app/
NEXT_PUBLIC_REDIRECT_SIGN_OUT=https://your-app.vercel.app/
```

### Step 2: Test Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click **Sign In**
4. Click **Sign in with Google**
5. Authenticate with your Google account
6. You should be redirected back and logged in

---

## Part 7: Deploy to Production (Vercel)

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable for **Production**:

```
NEXT_PUBLIC_COGNITO_USER_POOL_ID = us-east-1_k90mwXxsL
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = 26uhgsh1bjf8bvjo2r5nuvksu1
NEXT_PUBLIC_COGNITO_DOMAIN = https://newshub-auth-123.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN = https://your-app.vercel.app/
NEXT_PUBLIC_REDIRECT_SIGN_OUT = https://your-app.vercel.app/
```

### Step 2: Update Cognito Callback URLs

1. Go to AWS Cognito → Your User Pool → **App integration**
2. Click on your app client
3. Edit **Hosted UI** settings
4. Add production URL to **Allowed callback URLs**:
   ```
   https://your-app.vercel.app/
   ```
5. Add production URL to **Allowed sign-out URLs**:
   ```
   https://your-app.vercel.app/
   ```
6. Save changes

### Step 3: Redeploy

1. Push your code to Git
2. Vercel will automatically deploy
3. Or manually redeploy from Vercel dashboard

---

## Troubleshooting

### "Login pages unavailable"
- ✅ Check that Hosted UI is enabled for your app client
- ✅ Verify domain is active in App integration tab
- ✅ Ensure Google is added as identity provider

### "redirect_uri_mismatch"
- ✅ Check Google OAuth authorized redirect URIs includes Cognito domain
- ✅ Verify exact match: `https://domain.auth.region.amazoncognito.com/oauth2/idpresponse`

### "invalid_scope"
- ✅ Check OpenID Connect scopes are enabled in app client
- ✅ Verify Google identity provider has correct scopes: `openid email profile`

### "attributes required: [phone_number]"
- ✅ User Pool has phone_number as required attribute
- ✅ Solution: Create new User Pool with only email as required

### "OAuth redirect failed"
- ✅ App client has a client secret (should be SPA type with no secret)
- ✅ Solution: Create new SPA app client without secret

### Production not working
- ✅ Environment variables not set in Vercel dashboard
- ✅ Production URL not added to Cognito callback URLs
- ✅ Solution: Add all environment variables in Vercel and update Cognito

---

## Security Best Practices

1. **Use SPA app client** - No client secret for browser apps
2. **HTTPS in production** - Always use secure connections
3. **Limit callback URLs** - Only add domains you control
4. **Regular token rotation** - Tokens expire automatically
5. **Monitor auth logs** - Check CloudWatch for suspicious activity
6. **Keep secrets secure** - Never commit `.env` files to Git

---

## Summary

You now have:
- ✅ Google OAuth application configured
- ✅ AWS Cognito User Pool with Google authentication
- ✅ SPA app client (no secret)
- ✅ Proper callback URLs configured
- ✅ Environment variables set up
- ✅ Production deployment ready

Your users can now sign in with their Google accounts securely!
