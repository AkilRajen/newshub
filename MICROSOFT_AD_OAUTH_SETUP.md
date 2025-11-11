# Microsoft Active Directory (Azure AD) OAuth Setup Guide

Complete guide to adding Microsoft Active Directory / Azure AD / Microsoft Entra ID as an identity provider for NewsHub.

---

## Overview

Microsoft Active Directory authentication allows users to sign in with their Microsoft accounts (personal, work, or school). Microsoft provides:
- ✅ Email address
- ✅ Name (first and last)
- ✅ Profile picture
- ✅ Work/School account support
- ✅ Personal Microsoft account support

**Note**: Microsoft rebranded Azure AD to **Microsoft Entra ID** in 2023, but the setup process is the same.

---

## Prerequisites

- Microsoft account (free)
- Azure subscription (free tier works)
- AWS Cognito User Pool configured

---

## Part 1: Azure Portal Setup

### Step 1: Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Sign in with your Microsoft account
3. If you don't have an Azure subscription, create a free one

### Step 2: Register Application

1. In Azure Portal, search for **"Azure Active Directory"** or **"Microsoft Entra ID"**
2. Click on it
3. In the left sidebar, click **App registrations**
4. Click **+ New registration**

### Step 3: Configure Application Registration

**Name**: `NewsHub`

**Supported account types**: Choose one:
- **Accounts in any organizational directory and personal Microsoft accounts** (Recommended)
  - Allows work, school, and personal Microsoft accounts
- **Accounts in this organizational directory only**
  - Only your organization's users
- **Personal Microsoft accounts only**
  - Only personal Microsoft accounts

**Redirect URI**:
- Platform: **Web**
- URI: 
  ```
  https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
  ```
  (Use your actual Cognito domain)

Click **Register**

---

## Part 2: Configure Application

### Step 1: Get Application Credentials

After registration, you'll see the **Overview** page:

**Copy these values**:
- **Application (client) ID**: `12345678-1234-1234-1234-123456789abc`
- **Directory (tenant) ID**: `87654321-4321-4321-4321-cba987654321`

### Step 2: Create Client Secret

1. In the left sidebar, click **Certificates & secrets**
2. Click **+ New client secret**
3. **Description**: `NewsHub Cognito Secret`
4. **Expires**: Choose duration (recommended: 24 months)
5. Click **Add**

⚠️ **IMPORTANT**: Copy the **Value** immediately! You can't see it again.

**Save this value**: `abc123def456ghi789jkl012mno345pqr678stu901`

### Step 3: Configure API Permissions

1. In the left sidebar, click **API permissions**
2. You should see **Microsoft Graph** with **User.Read** permission (default)
3. Click **+ Add a permission**
4. Select **Microsoft Graph**
5. Select **Delegated permissions**
6. Add these permissions:
   - ✅ `openid`
   - ✅ `email`
   - ✅ `profile`
7. Click **Add permissions**

**Optional**: Click **Grant admin consent** if you're an admin (makes approval easier for users)

### Step 4: Configure Authentication

1. In the left sidebar, click **Authentication**
2. Under **Platform configurations** → **Web**, verify your redirect URI is there
3. Under **Implicit grant and hybrid flows**:
   - ✅ Check **ID tokens** (for implicit flow)
4. Under **Supported account types**: Verify your selection
5. Click **Save**

---

## Part 3: Configure AWS Cognito

### Step 1: Add Microsoft Identity Provider

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool
3. Go to **Sign-in experience** tab
4. Click **Add identity provider**
5. Select **OpenID Connect** (Microsoft uses OIDC)

### Step 2: Configure OIDC Provider

**Provider name**: `Microsoft` (or any name you prefer)

**Client ID**: 
```
12345678-1234-1234-1234-123456789abc
```
(Your Application (client) ID from Azure)

**Client secret**: 
```
abc123def456ghi789jkl012mno345pqr678stu901
```
(The secret value you copied)

**Authorized scopes**:
```
openid email profile
```

**Issuer URL**: Choose based on your account type:

**For multi-tenant (work, school, and personal accounts)**:
```
https://login.microsoftonline.com/common/v2.0
```

**For single tenant (your organization only)**:
```
https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0
```
(Replace `YOUR_TENANT_ID` with your Directory (tenant) ID)

**For personal Microsoft accounts only**:
```
https://login.microsoftonline.com/consumers/v2.0
```

**Attribute mapping**:
- OIDC `email` → Cognito `email`
- OIDC `name` → Cognito `name`
- OIDC `sub` → Cognito `username`

Click **Add identity provider**

### Step 3: Update App Client

1. Go to **App integration** tab
2. Click on your app client
3. Edit **Hosted UI** settings
4. Under **Identity providers**, check:
   - ✅ Google
   - ✅ Facebook
   - ✅ Microsoft (NEW!)
5. Click **Save changes**

---

## Part 4: Update Your Application

### Step 1: Update Amplify Configuration

The Amplify configuration already supports OIDC providers. No code changes needed in `src/lib/amplify.ts`!

### Step 2: Update Sign-In Page

Update `src/app/signin/page.tsx`:

```typescript
<Authenticator
  socialProviders={['google', 'facebook', 'apple']}
  signUpAttributes={['email']}
  hideSignUp={false}
>
```

**Note**: AWS Amplify UI doesn't have a built-in Microsoft button. You'll need to add a custom button or use the Cognito Hosted UI directly.

### Option A: Use Cognito Hosted UI (Recommended)

Create a custom Microsoft sign-in button:

```typescript
import { signInWithRedirect } from 'aws-amplify/auth';

const handleMicrosoftSignIn = async () => {
  try {
    await signInWithRedirect({ 
      provider: { custom: 'Microsoft' } 
    });
  } catch (error) {
    console.error('Microsoft sign-in error:', error);
  }
};

<button
  onClick={handleMicrosoftSignIn}
  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
>
  <img src="/microsoft-logo.svg" alt="Microsoft" className="w-5 h-5 mr-2" />
  Sign in with Microsoft
</button>
```

### Option B: Direct Hosted UI Link

Or create a direct link to Cognito Hosted UI:

```typescript
const microsoftSignInUrl = `https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Microsoft&redirect_uri=http://localhost:3000/&response_type=code&client_id=26uhgsh1bjf8bvjo2r5nuvksu1&scope=openid email profile`;

<a href={microsoftSignInUrl}>
  Sign in with Microsoft
</a>
```

---

## Part 5: Testing

### Step 1: Test Locally

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/signin`

3. Click your Microsoft sign-in button

4. You'll be redirected to Microsoft login

5. Sign in with:
   - Personal Microsoft account (Outlook, Hotmail, Live)
   - Work or school account (Office 365, Azure AD)

6. Grant permissions when prompted

7. You'll be redirected back to your app

### Step 2: Verify Data

Check your profile page to see:
- ✅ Name from Microsoft account
- ✅ Email address
- ✅ Profile picture (if available)

---

## Part 6: Production Deployment

### Step 1: Update Azure App Registration

1. Go to Azure Portal → App registrations → Your app
2. Click **Authentication**
3. Add production redirect URI:
   ```
   https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
4. Click **Save**

### Step 2: Update Cognito

Make sure your production Cognito callback URLs include:
```
https://your-app.vercel.app/
```

---

## Troubleshooting

### "AADSTS50011: The redirect URI specified in the request does not match"

**Cause**: Redirect URI in Azure doesn't match what Cognito is sending

**Solution**:
- Go to Azure Portal → App registrations → Authentication
- Add exact Cognito redirect URI
- Must include `/oauth2/idpresponse`
- No trailing slashes

### "AADSTS700016: Application not found in the directory"

**Cause**: Wrong tenant ID or issuer URL

**Solution**:
- For multi-tenant: Use `https://login.microsoftonline.com/common/v2.0`
- For single tenant: Use your specific tenant ID
- Verify tenant ID in Azure Portal

### "invalid_client"

**Cause**: Client ID or secret is incorrect

**Solution**:
- Verify Application (client) ID in Cognito matches Azure
- Regenerate client secret if needed
- Copy secret value immediately after creation

### "AADSTS65001: The user or administrator has not consented"

**Cause**: User hasn't granted permissions

**Solution**:
- User needs to accept permissions on first sign-in
- Or admin can grant consent in Azure Portal
- Go to API permissions → Grant admin consent

### No profile picture showing

**Cause**: Microsoft Graph API permission not granted

**Solution**:
- Add `User.Read` permission in Azure
- Grant admin consent
- User may need to sign in again

---

## Account Types Comparison

### Multi-tenant (Recommended):
```
https://login.microsoftonline.com/common/v2.0
```
- ✅ Personal Microsoft accounts (Outlook, Hotmail)
- ✅ Work accounts (Office 365)
- ✅ School accounts (Education)
- ✅ Maximum flexibility

### Single Tenant:
```
https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0
```
- ✅ Only your organization's users
- ❌ No personal accounts
- ✅ Better for enterprise apps

### Consumers Only:
```
https://login.microsoftonline.com/consumers/v2.0
```
- ✅ Only personal Microsoft accounts
- ❌ No work/school accounts
- ✅ Good for consumer apps

---

## Comparing OAuth Providers

| Feature | Google | Facebook | Apple | Microsoft |
|---------|--------|----------|-------|-----------|
| Email | ✅ Always | ✅ Usually | ✅ Real/Relay | ✅ Always |
| Name | ✅ Always | ✅ Always | ⚠️ First time | ✅ Always |
| Profile Picture | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Work Accounts | ❌ No | ❌ No | ❌ No | ✅ Yes |
| Setup Cost | Free | Free | $99/year | Free |
| Setup Complexity | Easy | Medium | Hard | Medium |

---

## Security Best Practices

1. **Rotate Secrets** - Regenerate client secret annually
2. **Limit Permissions** - Only request necessary scopes
3. **Monitor Access** - Check Azure AD sign-in logs
4. **Use HTTPS** - Always in production
5. **Validate Tokens** - Cognito handles this automatically

---

## Testing Checklist

- [ ] Azure AD app registered
- [ ] Client ID and secret obtained
- [ ] Redirect URI configured in Azure
- [ ] API permissions granted (openid, email, profile)
- [ ] OIDC provider added to Cognito
- [ ] Issuer URL configured correctly
- [ ] App client updated with Microsoft
- [ ] Custom sign-in button created
- [ ] Test with personal Microsoft account
- [ ] Test with work/school account (if applicable)
- [ ] User profile shows Microsoft data

---

## Cost Considerations

### Azure AD / Microsoft Entra ID:
- **Free tier** - Sufficient for basic authentication
- **Premium P1** - $6/user/month (advanced features)
- **Premium P2** - $9/user/month (identity protection)

**For basic OAuth**: Free tier is enough!

---

## Additional Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [AWS Cognito OIDC Setup](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-oidc-idp.html)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview)

---

## Summary

You now have:
- ✅ Complete Microsoft AD / Azure AD setup guide
- ✅ Support for personal, work, and school accounts
- ✅ OIDC integration with AWS Cognito
- ✅ Custom sign-in button implementation
- ✅ Multi-tenant configuration
- ✅ Troubleshooting for common issues

Users can now sign in with their Microsoft accounts (personal, work, or school)!

**Note**: Microsoft authentication is free and supports both personal and enterprise accounts, making it a great addition to Google and Facebook OAuth.
