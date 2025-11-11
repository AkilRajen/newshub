# User Onboarding Implementation Guide

## Overview

A complete onboarding flow that collects additional user information after Google OAuth sign-in.

---

## What Was Implemented

### 1. Onboarding Page (`/onboarding`)

**Location**: `src/app/onboarding/page.tsx`

**Features**:
- Phone number input (optional)
- Date of birth picker (optional)
- Interest selection (minimum 3 required)
- News frequency preference
- Language preference
- Skip option for users who want to complete later

**Data Storage**: AWS Cognito User Attributes

---

## How It Works

### Flow Diagram

```
User signs in with Google
        ↓
First time user? → Yes → Redirect to /onboarding
        ↓                        ↓
        No                  Fill out form
        ↓                        ↓
   Go to home            Save to Cognito
                               ↓
                          Go to home
```

### Data Storage Structure

#### Standard Cognito Attributes:
```javascript
{
  phone_number: "+1234567890",      // Standard attribute
  birthdate: "1990-01-15",          // Standard attribute
  locale: "en",                     // Standard attribute (language)
  profile: JSON.stringify({         // Standard attribute (JSON data)
    interests: ["Technology", "Business", "Sports"],
    news_frequency: "daily",
    onboarding_completed: true
  })
}
```

---

## Usage

### Access Onboarding Page

Navigate to: `http://localhost:3000/onboarding`

### Automatic Redirect (Optional)

To automatically redirect new users to onboarding, update `src/app/page.tsx`:

```typescript
useEffect(() => {
  const checkOnboarding = async () => {
    if (user) {
      const attributes = await fetchUserAttributes();
      if (!attributes.profile) {
        router.push('/onboarding');
      }
    }
  };
  checkOnboarding();
}, [user]);
```

---

## Retrieving User Data

### In Any Component:

```typescript
import { fetchUserAttributes } from 'aws-amplify/auth';

const getUserData = async () => {
  const attributes = await fetchUserAttributes();
  
  // Get phone number
  const phone = attributes.phone_number;
  
  // Get birthdate
  const dob = attributes.birthdate;
  
  // Get language
  const language = attributes.locale;
  
  // Get interests and preferences
  if (attributes.profile) {
    const profile = JSON.parse(attributes.profile);
    const interests = profile.interests; // Array of strings
    const newsFrequency = profile.news_frequency;
    const onboardingDone = profile.onboarding_completed;
  }
};
```

---

## Customization

### Add More Fields

Edit `src/app/onboarding/page.tsx`:

```typescript
// Add to formData state
const [formData, setFormData] = useState({
  // ... existing fields
  'custom:occupation': '',
  'custom:company': '',
});

// Add to form JSX
<input
  type="text"
  value={formData['custom:occupation']}
  onChange={(e) => setFormData({...formData, 'custom:occupation': e.target.value})}
/>

// Add to handleSubmit
const profile = JSON.parse(attributes.profile || '{}');
profile.occupation = formData['custom:occupation'];
attributes.profile = JSON.stringify(profile);
```

### Change Interest Options

```typescript
const interestOptions = [
  'Your',
  'Custom',
  'Categories',
  'Here',
];
```

### Modify Validation

```typescript
// Current: Requires 3 interests
disabled={saving || selectedInterests.length < 3}

// Change to require 5:
disabled={saving || selectedInterests.length < 5}

// Or make optional:
disabled={saving}
```

---

## Display User Data in Profile

Update `src/app/profile/page.tsx` to show onboarding data:

```typescript
// Parse profile data
let userProfile = {};
if (userAttributes.profile) {
  try {
    userProfile = JSON.parse(userAttributes.profile);
  } catch (e) {
    console.error('Failed to parse profile');
  }
}

// Display in JSX
<div>
  <h3>Your Interests</h3>
  {userProfile.interests?.map(interest => (
    <span key={interest}>{interest}</span>
  ))}
</div>

<div>
  <p>News Frequency: {userProfile.news_frequency}</p>
  <p>Phone: {userAttributes.phone_number}</p>
  <p>Birthday: {userAttributes.birthdate}</p>
</div>
```

---

## Update User Data

### Allow users to edit their preferences:

```typescript
import { updateUserAttributes } from 'aws-amplify/auth';

const updatePreferences = async (newInterests: string[]) => {
  const attributes = await fetchUserAttributes();
  const profile = JSON.parse(attributes.profile || '{}');
  
  profile.interests = newInterests;
  
  await updateUserAttributes({
    userAttributes: {
      profile: JSON.stringify(profile)
    }
  });
};
```

---

## Security & Privacy

### What's Stored:
- ✅ Phone number (encrypted in Cognito)
- ✅ Date of birth (encrypted in Cognito)
- ✅ Preferences (encrypted in Cognito)
- ✅ All data is in your AWS account

### What's NOT Stored:
- ❌ Credit card information
- ❌ Passwords (OAuth users don't have passwords)
- ❌ Sensitive personal data

### GDPR Compliance:
- ✅ Users can delete their account (deletes all data)
- ✅ Users can update their information
- ✅ Data is stored securely in AWS
- ✅ Users control what they share

---

## Testing

### Test the Flow:

1. **Sign in with Google**
   ```
   http://localhost:3000/signin
   ```

2. **Go to onboarding**
   ```
   http://localhost:3000/onboarding
   ```

3. **Fill out the form**
   - Add phone number: `+1234567890`
   - Select birthdate
   - Choose 3+ interests
   - Select news frequency
   - Choose language

4. **Submit**
   - Data saves to Cognito
   - Redirects to home

5. **Verify data saved**
   - Go to profile page
   - Check browser console for attributes
   - Or check AWS Cognito Console → Users

---

## Troubleshooting

### "Failed to save your information"

**Possible causes**:
- Phone number format incorrect (must start with +)
- Network error
- Cognito permissions issue

**Solution**:
- Check browser console for detailed error
- Verify phone number format: `+[country code][number]`
- Check AWS Cognito permissions

### Data not showing in profile

**Solution**:
- Refresh the page
- Check if `profile` attribute exists
- Verify JSON parsing in profile page

### Onboarding shows again after completion

**Solution**:
- Check if `onboarding_completed` is set in profile
- Verify the check in `useEffect` is working
- Clear browser cache

---

## Production Checklist

- [ ] Test onboarding flow with multiple users
- [ ] Verify data saves correctly to Cognito
- [ ] Test phone number validation
- [ ] Test date picker on mobile devices
- [ ] Add analytics tracking for onboarding completion
- [ ] Add error handling for network failures
- [ ] Test "Skip for Now" functionality
- [ ] Verify data displays correctly in profile
- [ ] Test data update functionality
- [ ] Ensure GDPR compliance (privacy policy, data deletion)

---

## Next Steps

1. **Add automatic redirect** - Send new users to onboarding after first sign-in
2. **Create edit profile page** - Allow users to update their preferences
3. **Use preferences** - Filter news based on user interests
4. **Add notifications** - Send news based on frequency preference
5. **Analytics** - Track which interests are most popular

---

## Summary

You now have:
- ✅ Complete onboarding form
- ✅ Data stored in AWS Cognito
- ✅ Phone number and birthdate collection
- ✅ Interest-based personalization
- ✅ Language and frequency preferences
- ✅ Skip option for flexibility
- ✅ Secure data storage

Users can now provide additional information to personalize their NewsHub experience!
