# Fix for Phone Number Required Error

## Problem
Your Cognito User Pool requires `phone_number` attribute, but Google OAuth doesn't provide it.

## Solution: Create New User Pool

### Step 1: Create New User Pool

1. Go to AWS Cognito Console
2. Click "Create user pool"

### Step 2: Configure Sign-in Experience
- **Provider types**: Federated identity providers
- **Cognito user pool sign-in options**: Email
- **Federated sign-in options**: Google

### Step 3: Configure Security Requirements
- Use default password policy
- MFA: Optional or No MFA

### Step 4: Configure Sign-up Experience
- **Self-service sign-up**: Enable
- **Required attributes**: **EMAIL ONLY** (DO NOT select phone_number)
- **Optional attributes**: name, picture

### Step 5: Configure Message Delivery
- Use default email configuration

### Step 6: Integrate Your App
- **User pool name**: NewsHub-UserPool-v2
- **Hosted authentication pages**: Use Cognito Hosted UI
- **Domain**: Create new domain (e.g., newshub-auth-v2)
- **App client name**: NewsHub-Client
- **Client secret**: Don't generate
- **Allowed callback URLs**: 
  - http://localhost:3000/
  - https://newshub-aws.vercel.app/
- **Allowed sign-out URLs**:
  - http://localhost:3000/
  - https://newshub-aws.vercel.app/
- **OAuth 2.0 grant types**: Authorization code grant
- **OpenID Connect scopes**: openid, email, profile, aws.cognito.signin.user.admin

### Step 7: Add Google Identity Provider

1. Go to Sign-in experience → Identity providers → Add identity provider
2. Select Google
3. Enter your Google OAuth Client ID and Secret
4. **Authorized scopes**: openid email profile
5. **Attribute mapping**:
   - email → email
   - name → name
   - picture → picture

### Step 8: Update Environment Variables

Update your `.env` and `.env.local` files with the new values:

```env
NEXT_PUBLIC_COGNITO_USER_POOL_ID=<new-user-pool-id>
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=<new-client-id>
NEXT_PUBLIC_COGNITO_DOMAIN=https://<new-domain>.auth.<region>.amazoncognito.com
```

## Alternative: Keep Existing Pool

If you must keep the existing User Pool, you would need to:
1. Modify your application to collect phone numbers
2. Use a Lambda trigger to provide a dummy phone number
3. This is NOT recommended for production

## Why This Happens

Cognito User Pool required attributes cannot be changed after creation. If phone_number was set as required during creation, it will always be required for all sign-up methods, including social OAuth.
