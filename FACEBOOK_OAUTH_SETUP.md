# Facebook OAuth Setup Guide for AWS Cognito

Complete guide to adding Facebook as an identity provider to your NewsHub application.

---

## Overview

Adding Facebook OAuth allows users to sign in with their Facebook accounts. Facebook can provide:
- ✅ Email
- ✅ Name
- ✅ Profile picture
- ✅ Birthday (with permission)
- ⚠️ Phone number (requires special permissions and app review)

---

## Part 1: Create Facebook App

### Step 1: Go to Facebook Developers

1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** in the top right
3. Click **Create App**

**Note**: Facebook's app creation flow has changed. You'll now select a "use case" instead of an "app type".

### Step 2: Choose Use Case

Facebook now asks you to select a use case. Choose one of these:

**Option 1: "Authenticate and request data from users with Facebook Login"**
- This is the most appropriate for authentication
- Click **Next**

**Option 2: "Other"**
- If you don't see the Facebook Login option
- Click **Next**

### Step 3: Select App Type

If prompted, choose:
- **Business** (if you have a business account)
- **Consumer** (for personal/individual apps)
- Or skip if not asked

### Step 4: Configure App Details

1. **App name**: NewsHub
2. **App contact email**: Your email
3. **Business account**: Optional (can skip)
4. Click **Create app** or **Next**

### Step 5: Complete Security Check

1. Complete the CAPTCHA
2. Your app will be created
3. You'll be taken to the app dashboard

---

## Part 2: Configure Facebook Login

### Step 1: Add Facebook Login Product

**If Facebook Login is already added** (because you selected it as use case):
- Skip to Step 2

**If Facebook Login is NOT added**:
1. In your app dashboard, find **Add Products to Your App** or **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. If asked, select **Web** as the platform

### Step 2: Configure Web Settings

1. **Site URL**: 
   ```
   http://localhost:3000
   ```
   (Add production URL later)

2. Click **Save**
3. Click **Continue**

### Step 3: Configure OAuth Settings

1. In the left sidebar, go to **Facebook Login** → **Settings**
2. Configure the following:

**Valid OAuth Redirect URIs**:
```
https://YOUR-COGNITO-DOMAIN.auth.REGION.amazoncognito.com/oauth2/idpresponse
```

Example:
```
https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
```

3. **Login with the JavaScript SDK**: No
4. **Force Web OAuth Reauthentication**: No
5. **Use Strict Mode for Redirect URIs**: Yes
6. Click **Save Changes**

---

## Part 3: Get App Credentials

### Step 1: Get App ID and Secret

1. In the left sidebar, go to **Settings** → **Basic**
2. You'll see:
   - **App ID**: `123456789012345` (example)
   - **App Secret**: Click **Show** to reveal it

3. **Save these values** - you'll need them for Cognito

### Step 2: Configure App Domains

1. Still in **Settings** → **Basic**
2. Scroll to **App Domains**
3. Add:
   ```
   localhost
   your-app.vercel.app
   ```

4. **Privacy Policy URL**: Add your privacy policy URL (required for production)
5. **Terms of Service URL**: Add your terms URL (optional)
6. Click **Save Changes**

---

## Part 4: Request Permissions (Optional)

### Default Permissions (No Review Needed):
- `email` - User's email address
- `public_profile` - Name, profile picture

### Additional Permissions (Require App Review):
- `user_birthday` - User's birthday
- `user_location` - User's location
- `user_hometown` - User's hometown

**Note**: Phone numbers require special business verification and are rarely approved.

For now, stick with default permissions.

---

## Part 5: Make App Live

### Step 1: Switch to Live Mode

1. In the top bar, you'll see a toggle that says **In Development**
2. Before going live, you need to:
   - Add a privacy policy URL
   - Choose an app category
   - Add an app icon (optional but recommended)

3. Toggle to **Live** mode when ready

**For Development**: You can keep it in Development mode and add test users.

### Step 2: Add Test Users (Development Mode)

If keeping in Development mode:

1. Go to **Roles** → **Test Users**
2. Click **Add Test Users**
3. Create test Facebook accounts for testing
4. Use these accounts to test login

---

## Part 6: Configure AWS Cognito

### Step 1: Add Facebook Identity Provider

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool
3. Go to **Sign-in experience** tab
4. Click **Add identity provider**
5. Select **Facebook**

### Step 2: Configure Facebook Provider

**App ID**: Your Facebook App ID (from Part 3)

**App secret**: Your Facebook App Secret (from Part 3)

**Authorized scopes**:
```
public_profile,email
```

**Attribute mapping**:
- Facebook `id` → Cognito `username`
- Facebook `email` → Cognito `email`
- Facebook `name` → Cognito `name`
- Facebook `picture` → Cognito `picture`

Click **Add identity provider**

### Step 3: Update App Client

1. Go to **App integration** tab
2. Click on your app client
3. Edit **Hosted UI** settings
4. Under **Identity providers**, check:
   - ✅ Google
   - ✅ Facebook

5. Click **Save changes**

---

## Part 7: Update Your Application

### Step 1: Update Amplify Configuration

The configuration in `src/lib/amplify.ts` already supports multiple providers. No code changes needed!

### Step 2: Update Sign-In Page

Update `src/app/signin/page.tsx` to include Facebook:

```typescript
<Authenticator
  socialProviders={['google', 'facebook']}  // Add 'facebook'
  signUpAttributes={['email']}
  hideSignUp={false}
>
```

### Step 3: Test Locally

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/signin`
3. You should now see both:
   - Sign in with Google
   - Sign in with Facebook

4. Click **Sign in with Facebook**
5. Authenticate with Facebook
6. You should be redirected back and logged in

---

## Part 8: Production Deployment

### Step 1: Update Facebook App Settings

1. Go to Facebook App → **Settings** → **Basic**
2. Update **App Domains** to include:
   ```
   your-app.vercel.app
   ```

3. Go to **Facebook Login** → **Settings**
4. Update **Valid OAuth Redirect URIs** to include:
   ```
   https://us-east-1k90mwxxsl.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
   (Should already be there)

### Step 2: Update Cognito Callback URLs

1. AWS Cognito → Your User Pool → **App integration**
2. Click on your app client
3. Make sure **Allowed callback URLs** includes:
   ```
   https://your-app.vercel.app/
   ```

### Step 3: Make Facebook App Live

1. Add required information:
   - Privacy Policy URL
   - App Category
   - App Icon (recommended)

2. Toggle app to **Live** mode

3. Your Facebook login will now work in production

---

## New Facebook App Creation Flow (2024+)

### What Changed:

Facebook now uses a **use case-based** app creation flow instead of app types.

### Current Flow:

1. **Enter app name** → NewsHub
2. **Select use case** → Choose "Authenticate and request data from users with Facebook Login"
3. **App details** → Enter contact email
4. **Create app** → Complete CAPTCHA
5. **Dashboard** → Facebook Login may already be added

### If You Don't See "Consumer" Option:

This is normal! Facebook removed the "Consumer" app type. Instead:
- Select the **Facebook Login use case** during creation
- Or add **Facebook Login** product after creation
- Both work the same way

### Alternative Path:

If the use case selection is confusing:
1. Select **"Other"** as use case
2. Create the app
3. Manually add **Facebook Login** product from dashboard
4. Continue with the guide

### Quick Reference - New Flow:

```
Create App
    ↓
Enter App Name: "NewsHub"
    ↓
Select Use Case:
  → "Authenticate and request data from users with Facebook Login" ✅
  → OR "Other" (then add Facebook Login later)
    ↓
Enter Contact Email
    ↓
Complete CAPTCHA
    ↓
App Created!
    ↓
Dashboard → Facebook Login (may already be added)
    ↓
Continue with Part 2 of this guide
```

---

## Troubleshooting

### "App Not Set Up: This app is still in development mode"

**Solution**: 
- Add your Facebook account as a test user in **Roles** → **Test Users**
- Or make the app Live (requires privacy policy)

### "URL Blocked: This redirect failed because the redirect URI is not whitelisted"

**Solution**:
- Check **Facebook Login** → **Settings** → **Valid OAuth Redirect URIs**
- Must exactly match: `https://domain.auth.region.amazoncognito.com/oauth2/idpresponse`
- No trailing slashes

### "Can't Load URL: The domain of this URL isn't included in the app's domains"

**Solution**:
- Go to **Settings** → **Basic** → **App Domains**
- Add your domain (without https://)

### "Email not provided by Facebook"

**Solution**:
- User's Facebook account doesn't have a verified email
- User denied email permission
- Ask user to verify email on Facebook or use different sign-in method

### Facebook Login Works Locally but Not in Production

**Solution**:
- Make sure Facebook app is in **Live** mode
- Check that production domain is in **App Domains**
- Verify OAuth redirect URI includes Cognito domain

---

## Comparing Google vs Facebook OAuth

| Feature | Google | Facebook |
|---------|--------|----------|
| Email | ✅ Always | ✅ Usually (if verified) |
| Name | ✅ Always | ✅ Always |
| Profile Picture | ✅ Always | ✅ Always |
| Phone Number | ❌ No | ⚠️ Requires special approval |
| Birthday | ❌ No | ✅ With permission |
| Setup Complexity | Easy | Medium |
| App Review Required | No | Only for extra permissions |

---

## Security Best Practices

1. **Keep App Secret secure** - Never commit to Git
2. **Use HTTPS in production** - Required for OAuth
3. **Limit OAuth scopes** - Only request what you need
4. **Monitor login attempts** - Check Facebook Analytics
5. **Regular security reviews** - Keep app updated

---

## Testing Checklist

- [ ] Facebook app created and configured
- [ ] OAuth redirect URI set correctly
- [ ] App ID and Secret added to Cognito
- [ ] Facebook added to Cognito identity providers
- [ ] App client updated to include Facebook
- [ ] Code updated to show Facebook button
- [ ] Test login works locally
- [ ] Test user can see their profile information
- [ ] Production domain added to Facebook app
- [ ] Facebook app set to Live mode (for production)

---

## Next Steps

After setting up Facebook:

1. **Test thoroughly** - Try signing in with different Facebook accounts
2. **Handle edge cases** - Users without email, users who deny permissions
3. **Add error handling** - Show friendly messages for auth failures
4. **Monitor usage** - Check which OAuth provider users prefer
5. **Consider more providers** - Apple, LinkedIn, etc.

---

## Additional Resources

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Facebook App Review Process](https://developers.facebook.com/docs/app-review)
- [AWS Cognito Facebook Setup](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-social-idp.html#cognito-user-pools-social-idp-step-1)
- [Facebook Permissions Reference](https://developers.facebook.com/docs/permissions/reference)

---

## Summary

You now have:
- ✅ Facebook app created and configured
- ✅ Facebook OAuth integrated with Cognito
- ✅ Multiple sign-in options (Google + Facebook)
- ✅ Better user experience with more login choices

Users can now choose to sign in with either Google or Facebook!
