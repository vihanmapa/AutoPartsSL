<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1g2GYzKxAURPGuzxQuLuurFaikiPxR9q4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Mobile Build (iOS)

This project uses **Capacitor** to build the iOS application.

### Prerequisites
- **Xcode** (Install from Mac App Store)
- **CocoaPods**: `sudo gem install cocoapods`

### Building and Running
1.  **Build Web Assets**:
    ```bash
    npm run build
    ```
2.  **Sync with iOS Project**:
    ```bash
    npx cap sync
    ```
3.  **Open in Xcode**:
    ```bash
    npx cap open ios
    ```
4.  In Xcode, select a simulator (e.g., iPhone 15) and press the **Play** button to run the app.
