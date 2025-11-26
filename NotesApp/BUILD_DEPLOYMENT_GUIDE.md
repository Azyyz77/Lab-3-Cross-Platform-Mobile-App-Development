# 📱 Notes App - Build & Deployment Guide

Complete guide for building and deploying your Notes App using Expo EAS (Expo Application Services).

---

## 📋 Prerequisites

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Verify Configuration
Your project is already configured with:
- ✅ EAS Project ID: `34b151fb-124b-457c-af74-c1ea10026082`
- ✅ `eas.json` configured
- ✅ `app.json` with proper bundle identifiers

---

## 🔧 Configuration Files

### **eas.json** - Build Profiles

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"      // Quick APK for testing
      },
      "ios": {
        "simulator": true
      },
      "distribution": "internal"
    },
    "preview-release": {
      "android": {
        "buildType": "apk"      // Release APK (not for Play Store)
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"  // AAB for Google Play Store
      }
    }
  }
}
```

### **app.json** - App Configuration

Key configurations:
- **Package Name (Android)**: `com.notesapp.mynotesapp`
- **Bundle Identifier (iOS)**: `com.notesapp.mynotesapp`
- **Version**: `1.0.0`
- **Android Version Code**: `1`
- **iOS Build Number**: `1.0.0`

---

## 🏗️ Building Your App

### **Step 1: Development Build**

For testing with Expo Go or development client:

```bash
# Android
eas build --platform android --profile development

# iOS
eas build --platform ios --profile development
```

### **Step 2: Preview Build (Testing)**

Creates a standalone APK for quick testing (not for store submission):

```bash
# Android APK (quick install on devices)
eas build --platform android --profile preview

# iOS Simulator
eas build --platform ios --profile preview
```

**Download & Install:**
- After build completes, you'll get a download link
- Send to testers or install directly on Android devices

### **Step 3: Preview Release Build**

Similar to preview but with release optimizations:

```bash
eas build --platform android --profile preview-release
```

### **Step 4: Production Build**

For Google Play Store / Apple App Store submission:

```bash
# Android (creates AAB for Play Store)
eas build --platform android --profile production

# iOS (creates IPA for App Store)
eas build --platform ios --profile production

# Both platforms
eas build --platform all --profile production
```

---

## 📦 Build Types Explained

### Android

| Build Type | File Format | Use Case |
|------------|-------------|----------|
| **APK** | `.apk` | Direct installation, testing, internal distribution |
| **App Bundle (AAB)** | `.aab` | Google Play Store submission (required) |

### iOS

| Build Type | Format | Use Case |
|------------|--------|----------|
| **Simulator** | `.app` | iOS Simulator testing |
| **Development** | `.ipa` | Testing on physical devices |
| **Production** | `.ipa` | App Store submission |

---

## 🚀 Submitting to App Stores

### **Google Play Store (Android)**

#### 1. First-Time Setup
1. Create app in [Google Play Console](https://play.google.com/console)
2. Set up app details, screenshots, descriptions
3. Create a **Service Account Key**:
   - Go to Google Cloud Console
   - Create service account
   - Download JSON key
   - Save as `google-service-account.json` in project root

#### 2. Submit Build
```bash
# Submit latest production build
eas submit --platform android --latest

# Or submit specific build
eas submit --platform android --id <build-id>
```

#### 3. Create Release
- Go to Google Play Console
- Navigate to Production → Releases
- Review and roll out your app

---

### **Apple App Store (iOS)**

#### 1. First-Time Setup
1. Enroll in [Apple Developer Program](https://developer.apple.com) ($99/year)
2. Create app in [App Store Connect](https://appstoreconnect.apple.com)
3. Create **App Store Connect API Key**:
   - Users and Access → Keys → App Store Connect API
   - Download JSON key
   - Save as `app-store-connect-api-key.json`

#### 2. Submit Build
```bash
# Submit latest production build
eas submit --platform ios --latest

# Or submit specific build
eas submit --platform ios --id <build-id>
```

#### 3. Create Release
- Go to App Store Connect
- Fill in app information
- Submit for review

---

## 🔐 Important: Appwrite Configuration

### **Don't Hardcode Credentials!**

Your app currently has Appwrite credentials hardcoded in `config/appwrite.ts`:

```typescript
// ❌ NOT SECURE for production
export const appwriteConfig = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '68f7b307002acb608db0',
  // ...
};
```

### **Secure Solution: Use Environment Variables**

#### 1. Create `.env` file (DO NOT commit to git):
```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=68f7b307002acb608db0
EXPO_PUBLIC_APPWRITE_DATABASE_ID=68f7b44f00041806226a
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=notes
```

#### 2. Update `config/appwrite.ts`:
```typescript
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  collectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!,
};
```

#### 3. Add to `.gitignore`:
```
.env
.env.local
```

#### 4. Set EAS Secrets:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_APPWRITE_ENDPOINT --value https://fra.cloud.appwrite.io/v1
eas secret:create --scope project --name EXPO_PUBLIC_APPWRITE_PROJECT_ID --value 68f7b307002acb608db0
eas secret:create --scope project --name EXPO_PUBLIC_APPWRITE_DATABASE_ID --value 68f7b44f00041806226a
eas secret:create --scope project --name EXPO_PUBLIC_APPWRITE_COLLECTION_ID --value notes
```

---

## 📱 Build Commands Cheat Sheet

```bash
# Quick test APK
eas build -p android --profile preview

# Production Android (Play Store)
eas build -p android --profile production

# Production iOS (App Store)
eas build -p ios --profile production

# Both platforms
eas build --platform all --profile production

# Check build status
eas build:list

# View specific build
eas build:view <build-id>

# Download build
eas build:download <build-id>
```

---

## 🔍 Troubleshooting

### Build Fails - "No matching provisioning profiles"
**Solution**: Run `eas credentials` to configure iOS certificates

### Build Fails - "Gradle build failed"
**Solution**: Check Android-specific errors in build logs

### App Crashes on Launch
**Solutions**:
1. Check Appwrite configuration
2. Verify all environment variables are set
3. Review native logs: `adb logcat` (Android) or Xcode console (iOS)

### Appwrite Connection Fails
**Solutions**:
1. Verify Appwrite endpoint is reachable
2. Check project ID matches your Appwrite project
3. Ensure collection permissions are set correctly

---

## 📊 Build Process Overview

```
┌─────────────────┐
│  Local Code     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  eas build      │ ──► Uploads to EAS servers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cloud Build    │ ──► Compiles app (Android/iOS)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Output   │ ──► APK / AAB / IPA
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Download/      │
│  Submit to      │ ──► Install or publish
│  Stores         │
└─────────────────┘
```

---

## 📝 Pre-Submission Checklist

### Before Building:

- [ ] Update version number in `app.json`
- [ ] Test app thoroughly on both platforms
- [ ] Update app screenshots and descriptions
- [ ] Review and optimize app icon and splash screen
- [ ] Configure environment variables for production
- [ ] Test authentication flow
- [ ] Test note CRUD operations
- [ ] Verify Appwrite connection

### Before Store Submission:

- [ ] Prepare marketing materials (screenshots, descriptions)
- [ ] Write privacy policy (required for apps collecting user data)
- [ ] Create App Store / Play Store listing
- [ ] Set up service account keys
- [ ] Review app store guidelines
- [ ] Test production build on real devices

---

## 🔗 Useful Links

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Apple App Store Connect](https://appstoreconnect.apple.com)
- [Expo Application Services](https://expo.dev/eas)
- [Appwrite Documentation](https://appwrite.io/docs)

---

## 📄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 2025 | Initial release with authentication and notes |

---

**Need Help?**
- EAS Support: `eas help`
- Expo Forums: https://forums.expo.dev
- Appwrite Discord: https://appwrite.io/discord

**Good luck with your app launch! 🚀**
