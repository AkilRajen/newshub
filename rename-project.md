# Project Rename Instructions

To complete the rename from `cognito-social-auth` to `newshub`:

## Option 1: Manual Rename (Recommended)

1. **Close all editors and terminals** that might be using the project directory
2. **Stop the development server** if it's running (Ctrl+C)
3. **Navigate to the parent directory**:
   ```bash
   cd ..
   ```
4. **Rename the directory**:
   ```bash
   # Windows
   move cognito-social-auth newshub
   
   # macOS/Linux
   mv cognito-social-auth newshub
   ```
5. **Navigate to the new directory**:
   ```bash
   cd newshub
   ```
6. **Start the development server**:
   ```bash
   npm run dev
   ```

## Option 2: Copy Method

If the rename doesn't work due to file locks:

1. **Create a new directory**:
   ```bash
   mkdir newshub
   ```
2. **Copy all files** (excluding node_modules):
   ```bash
   # Windows
   xcopy cognito-social-auth newshub /E /I /H /Y /exclude:node_modules

   # macOS/Linux
   cp -r cognito-social-auth/* newshub/
   ```
3. **Navigate to new directory and reinstall**:
   ```bash
   cd newshub
   npm install
   ```
4. **Remove old directory** when safe:
   ```bash
   cd ..
   rmdir /s cognito-social-auth  # Windows
   rm -rf cognito-social-auth    # macOS/Linux
   ```

## What's Already Updated

The following files have been updated with the new project name:
- ✅ `package.json` - Project name changed to "newshub"
- ✅ `README.md` - Installation instructions updated
- ✅ All documentation references updated

## After Renaming

Once you've renamed the directory, you can:
1. Update your Git remote if needed
2. Update any IDE workspace settings
3. Continue development with `npm run dev`

The project is fully functional with the new name!