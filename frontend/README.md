# Budget App Frontend

A React Native mobile app built with [Expo](https://expo.dev) and [expo-router](https://docs.expo.dev/router/introduction/) for managing personal budgets. Connects to the Django REST API backend.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node.js)
- [Expo Go](https://expo.dev/go) app installed on your phone (available on App Store and Google Play)

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npx expo start
```

This starts the Metro bundler and displays a QR code in your terminal.

### Other start commands

```bash
npx expo start --ios      # Open in iOS Simulator
npx expo start --android  # Open in Android Emulator
npx expo start --web      # Open in web browser
```

## Viewing the App on Your Phone

1. Install the **Expo Go** app on your phone from the [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android).
2. Make sure your phone and computer are on the **same Wi-Fi network**.
3. Start the dev server with `npx expo start`.
4. Scan the QR code displayed in the terminal:
   - **iOS**: Use your phone's built-in Camera app.
   - **Android**: Use the QR scanner inside the Expo Go app.
5. The app will open in Expo Go.

### Troubleshooting

- **QR code not visible?** Press `c` in the terminal to show the connection info again.
- **Can't connect?** Try running `npx expo start --tunnel` to use a tunnel connection instead of LAN. This requires `@expo/ngrok` (`npm i -g @expo/ngrok`).
- **Slow bundling?** The first load takes longer as Metro bundles all modules. Subsequent reloads are faster.

## Project Structure

```
app/              # Screens and routing (file-based routing via expo-router)
  (tabs)/         # Tab navigation screens
  types/          # TypeScript type definitions
  utils/          # Utility functions
assets/           # Images, fonts, and static files
components/       # Reusable UI components
constants/        # App-wide constants (theme, colors)
```

## Linting

```bash
npm run lint
```
