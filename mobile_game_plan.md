# Rogue Bolt - Mobile App Packaging & Distribution

## Goal
Package Rogue Bolt (Phaser 3 web game) as native mobile apps for Android and iOS, and sell for ~$2.49.

---

## Recommended Approach: Capacitor

**Capacitor** (by Ionic) is the simplest and most modern solution for wrapping a Phaser web game as native mobile apps.

### Why Capacitor?
- Modern, actively maintained (successor to Cordova)
- Excellent Phaser compatibility
- Free and open source
- Single codebase → both Android and iOS
- Generates native Android Studio / Xcode projects
- Good documentation and community support

---

## App Store Requirements

### Google Play Store (Android)
- **Developer fee**: $25 one-time
- **Commission**: 15% on first $1M/year revenue
- **Requirements**: Google account, any OS for development
- **Build tool**: Android Studio (free)

### Apple App Store (iOS)
- **Developer fee**: $99/year
- **Commission**: 15% (Small Business Program) or 30%
- **Requirements**: Apple Developer account, Mac required for building
- **Build tool**: Xcode (free, Mac only)

---

## Implementation Steps

### 1. Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Rogue Bolt" com.yourname.roguebolt
```

### 2. Build web app
```bash
npm run build
```

### 3. Add platforms
```bash
npx cap add android
npx cap add ios
```

### 4. Sync and open
```bash
npx cap sync
npx cap open android  # opens Android Studio
npx cap open ios      # opens Xcode
```

### 5. Configure for release
- Set app icons and splash screens
- Configure signing keys
- Set version numbers

### 6. Submit to stores
- Build signed APK/AAB for Google Play
- Build signed IPA for App Store

---

## Cost Summary

| Item | Cost |
|------|------|
| Google Play developer | $25 (one-time) |
| Apple Developer | $99/year |
| **Total first year** | **$124** |
| **Subsequent years** | **$99/year** |

---

## What Claude Can Help With

1. Install and configure Capacitor in the project
2. Set up Vite build to output to Capacitor's web directory
3. Generate app icons and splash screens from existing assets
4. Configure capacitor.config.ts for both platforms

---

## What You'll Do Manually

1. Register as developer on Google Play ($25) and Apple ($99/year)
2. Open and build in Android Studio / Xcode
3. Create signing certificates (guided by the IDEs)
4. Submit apps to respective stores with screenshots, descriptions
5. Set pricing to $2.49 (or your local equivalent)
