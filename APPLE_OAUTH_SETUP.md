# Apple Sign In Setup Guide for AWS Cognito

Complete guide to adding Apple as an identity provider to your NewsHub application.

---

## Overview

Apple Sign In (Sign in with Apple) allows users to authenticate using their Apple ID. Apple provides:
- ✅ Email (real or private relay email)
- ✅ Name (first and last)
- ⚠️ Limited profile data (Apple prioritizes privacy)
- ❌ No profile picture
- ❌ No phone number

---

## Prerequisites

- Apple Developer Account ($99/year)
- Domain name (for Service ID)
- AWS Cognito User Pool configured

---

## Part 1: Apple Developer Setup

### Step 1: Create App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** in the left sidebar
4. Click the **+** button to create new identifier
5. Select **App IDs** → Click **Continue**
6. Select **App** → Click **Continue**

### Step 2: Configure App ID

1. **Description**: NewsHub App
2. **Bundle ID**: Choose **Explicit**
   - Enter: `com.yourcompany.newshub` (use your actual domain)
3. **Capabilities**: Scroll down and check:
   - ✅ **Sign in with Apple**
4. Click **Continue** → **Register**

---

## Part 2: Create Service ID

### Step 1: Create New Identifier

1. Still in **Identifiers**, click the **+** button
2. Select **Services IDs** → Click **Continue**

### Step 2: Configure Service ID

1. **Description**: NewsHub Web Service
2. **Identifier**: `com.yourcompany.newshub.service`
   - Must be different from App ID
   - Use reverse domain notation
3. Click **Continue** → **Register**

### Step 3: Configure Sign in with Apple

1. Find your newly created Service ID in the list
2. Click on it to edit
3. Check **Sign in with Apple** checkbox
4. Click **Configure** next to it

### Step 4: Configure Domains and URLs

In the configuration popup:

**Primary App ID**: Select the App ID you created earlier

**Domains and Subdomains**:
```
us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com
```
(Use your actual Cognito domain - without https://)

**Return URLs**:
```
https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
```
(Use your actual Cognito domain - with https://)

5. Click **Save**
6. Click **Continue** → **Save**

---

## Part 3: Create Private Key

### Step 1: Create New Key

1. In Apple Developer Portal, go to **Keys** (left sidebar)
2. Click the **+** button
3. **Key Name**: NewsHub Sign in with Apple Key
4. Check **Sign in with Apple** checkbox
5. Click **Configure** next to it

### Step 2: Configure Key

1. **Primary App ID**: Select your App ID
2. Click **Save**
3. Click **Continue**
4. Click **Register**

### Step 3: Download Key

⚠️ **IMPORTANT**: You can only download this once!

1. Click **Download**
2. Save the `.p8` file securely
3. Note the **Key ID** (e.g., `ABC123DEFG`)
4. Note your **Team ID** (shown at top right, e.g., `XYZ987HIJK`)

**Save these values**:
- Key ID: `ABC123DEFG`
- Team ID: `XYZ987HIJK`
- Private Key file: `AuthKey_ABC123DEFG.p8`

---

## Part 4: Configure AWS Cognito

### Step 1: Add Apple Identity Provider

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool
3. Go to **Sign-in experience** tab
4. Click **Add identity provider**
5. Select **Apple**

### Step 2: Configure Apple Provider

**Services ID**: `com.yourcompany.newshub.service`
(Your Service ID from Part 2)

**Team ID**: `XYZ987HIJK`
(From Apple Developer Portal, top right)

**Key ID**: `ABC123DEFG`
(From the key you created)

**Private key**: 
- Open your `.p8` file in a text editor
- Copy the entire content including:
  ```
  -----BEGIN PRIVATE KEY-----
  [key content]
  -----END PRIVATE KEY-----
  ```
- Paste into Cognito

**Authorized scopes**:
```
name,email
```

**Attribute mapping**:
- Apple `email` → Cognito `email`
- Apple `name` → Cognito `name`

Click **Add identity provider**

### Step 3: Update App Client

1. Go to **App integration** tab
2. Click on your app client
3. Edit **Hosted UI** settings
4. Under **Identity providers**, check:
   - ✅ Google
   - ✅ Facebook
   - ✅ Apple (NEW!)
5. Click **Save changes**

---

## Part 5: Update Your Application

### Step 1: Update Sign-In Page

Update `src/app/signin/page.tsx`:

```typescript
<Authenticator
  socialProviders={['google', 'facebook', 'apple']}
  signUpAttributes={['email']}
  hideSignUp={false}
>
```

### Step 2: Test Locally

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/signin`

3. You should see three buttons:
   - Sign in with Google
   - Sign in with Facebook
   - Sign in with Apple

4. Click **Sign in with Apple**

---

## Part 6: Handle Apple's Privacy Features

### Private Email Relay

Apple may provide a private relay email like:
```
abc123def@privaterelay.appleid.com
```

This is normal! Apple protects user privacy by:
- Hiding real email addresses
- Forwarding emails to the user's real address
- User can disable relay anytime

**Your app should**:
- ✅ Accept relay emails as valid
- ✅ Send emails to relay address (Apple forwards them)
- ✅ Not require email verification (Apple verifies)

### Name Sharing

Apple only shares the user's name **once** (first sign-in):
- First sign-in: You get name
- Subsequent sign-ins: Name may be empty

**Solution**: Store the name in Cognito on first sign-in.

---

## Part 7: Production Deployment

### Step 1: Update Apple Service ID

1. Go to Apple Developer Portal
2. Edit your Service ID
3. Add production domain to **Domains and Subdomains**:
   ```
   us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com
   ```

4. Add production URL to **Return URLs**:
   ```
   https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```

### Step 2: Update Cognito

Make sure your production Cognito callback URLs include:
```
https://your-app.vercel.app/
```

---

## Troubleshooting

### "invalid_client"

**Cause**: Service ID, Team ID, or Key ID is incorrect

**Solution**:
- Double-check all IDs in Cognito match Apple Developer Portal
- Verify Service ID format: `com.domain.app.service`

### "invalid_request: Invalid web redirect url"

**Cause**: Return URL not configured in Apple Service ID

**Solution**:
- Go to Apple Developer Portal → Service ID → Configure
- Add exact Cognito redirect URI
- Must include `/oauth2/idpresponse`

### "Private key is invalid"

**Cause**: Private key not copied correctly

**Solution**:
- Open `.p8` file in text editor
- Copy entire content including BEGIN/END lines
- No extra spaces or line breaks
- Paste into Cognito exactly as is

### Name not showing in profile

**Cause**: Apple only sends name on first sign-in

**Solution**:
- Delete user from Cognito
- Sign in again (Apple will send name)
- Or manually add name in profile

### Email is private relay address

**This is normal!** Apple protects user privacy.

**Solution**:
- Accept relay emails
- Send emails to relay address
- Apple forwards to user's real email

---

## Comparing OAuth Providers

| Feature | Google | Facebook | Apple |
|---------|--------|----------|-------|
| Email | ✅ Always | ✅ Usually | ✅ Real or relay |
| Name | ✅ Always | ✅ Always | ⚠️ First time only |
| Profile Picture | ✅ Yes | ✅ Yes | ❌ No |
| Phone Number | ❌ No | ⚠️ Rare | ❌ No |
| Setup Cost | Free | Free | $99/year |
| Privacy Focus | Medium | Low | Very High |
| Setup Complexity | Easy | Medium | Hard |

---

## Security Best Practices

1. **Protect Private Key** - Never commit `.p8` file to Git
2. **Rotate Keys** - Create new key annually
3. **Monitor Usage** - Check Apple Developer Portal for API usage
4. **Handle Relay Emails** - Don't block private relay addresses
5. **Store Name** - Save user's name on first sign-in

---

## Testing Checklist

- [ ] Apple Developer Account active ($99/year)
- [ ] App ID created with Sign in with Apple
- [ ] Service ID created and configured
- [ ] Private key created and downloaded
- [ ] Cognito domain added to Apple Service ID
- [ ] Return URL configured in Apple Service ID
- [ ] Apple identity provider added to Cognito
- [ ] Private key pasted into Cognito
- [ ] App client updated with Apple
- [ ] Code updated to show Apple button
- [ ] Test sign-in works
- [ ] User profile shows Apple data

---

## Cost Considerations

### Apple Developer Program:
- **$99/year** - Required for Sign in with Apple
- Includes all Apple developer features
- Must renew annually

### Alternatives if Cost is Concern:
- Use only Google + Facebook (both free)
- Add Apple later when budget allows
- Apple Sign In is optional, not required

---

## Additional Resources

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [AWS Cognito Apple Setup](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html#cognito-user-pools-social-idp-step-1)
- [Apple Developer Portal](https://developer.apple.com/account/)
- [Private Email Relay](https://support.apple.com/en-us/HT210425)

---

## Summary

You now have:
- ✅ Complete Apple Sign In setup guide
- ✅ Step-by-step configuration for Apple Developer Portal
- ✅ AWS Cognito integration instructions
- ✅ Privacy considerations for Apple's features
- ✅ Troubleshooting for common issues

**Note**: Apple Sign In requires a paid Apple Developer Account ($99/year). If you don't have one, you can skip Apple and use Google + Facebook for now.

Users can now sign in with Apple, Google, or Facebook!
