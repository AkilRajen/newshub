# Adding Custom Attributes to AWS Cognito

## Overview

Custom attributes allow you to store additional user information beyond the standard attributes (email, name, etc.).

---

## Step 1: Add Custom Attributes in Cognito

### Important Note:
⚠️ **Custom attributes can only be added when creating a User Pool or through AWS CLI/API**. You cannot add them through the console after creation.

### Option 1: Create New User Pool with Custom Attributes

If you need custom attributes, you'll need to create a new User Pool:

1. Go to AWS Cognito Console
2. Create new User Pool
3. During **Step 4: Configure sign-up experience**
4. Scroll to **Custom attributes**
5. Click **Add custom attribute**

Add these custom attributes:

| Attribute Name | Type | Min | Max | Mutable |
|---------------|------|-----|-----|---------|
| `interests` | String | 0 | 256 | Yes |
| `news_frequency` | String | 0 | 50 | Yes |
| `language` | String | 0 | 10 | Yes |
| `onboarding_completed` | String | 0 | 10 | Yes |

### Option 2: Use AWS CLI (For Existing User Pool)

You cannot add custom attributes to an existing User Pool through the console, but you can use standard attributes instead.

---

## Step 2: Alternative - Use Standard Attributes

If you don't want to create a new User Pool, use these standard Cognito attributes:

| Our Field | Cognito Standard Attribute |
|-----------|---------------------------|
| Phone Number | `phone_number` ✅ |
| Date of Birth | `birthdate` ✅ |
| Language | `locale` ✅ |
| Interests | Store in `profile` or `website` |
| News Frequency | Store in `profile` |

### Update the Onboarding Form

Use standard attributes instead of custom ones:

```typescript
const attributes = {
  phone_number: formData.phone_number,
  birthdate: formData.birthdate,
  locale: formData.language,
  profile: JSON.stringify({
    interests: selectedInterests,
    news_frequency: formData.news_frequency,
    onboarding_completed: true
  })
};
```

---

## Step 3: For Production - Create New User Pool

For a production app with custom attributes:

### 1. Create New User Pool

Follow the setup in `AWS_COGNITO_SETUP.md` but add custom attributes during creation.

### 2. Custom Attributes to Add

```
custom:interests (String, 0-256 chars)
custom:news_frequency (String, 0-50 chars)
custom:language (String, 0-10 chars)
custom:onboarding_completed (String, 0-10 chars)
```

### 3. Migrate Users

If you have existing users, you'll need to:
- Export users from old pool
- Import to new pool
- Update environment variables

---

## Step 4: Update Onboarding Code

### If Using Custom Attributes (New User Pool):

Keep the code as is in `src/app/onboarding/page.tsx`

### If Using Standard Attributes (Current User Pool):

Update the onboarding page to use standard attributes instead.

---

## Recommended Approach

### For Your Current Setup:

Use **standard attributes** to avoid creating a new User Pool:

1. `phone_number` - Standard attribute ✅
2. `birthdate` - Standard attribute ✅
3. `locale` - Standard attribute for language ✅
4. `profile` - JSON string for interests and preferences ✅

This works with your existing User Pool without any changes!

---

## Summary

**Option 1: Use Standard Attributes (Recommended)**
- ✅ Works with existing User Pool
- ✅ No migration needed
- ✅ Immediate implementation
- ⚠️ Less structured (JSON in profile field)

**Option 2: Create New User Pool with Custom Attributes**
- ✅ Properly structured data
- ✅ Better for complex apps
- ❌ Requires new User Pool
- ❌ Need to migrate users
- ❌ Update all configurations

For your current project, I recommend **Option 1** (standard attributes).
