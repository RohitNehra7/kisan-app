# 📱 KisanNiti Android APK Build Instructions

These instructions are generated per the Phase 1 goals for sideloading the app onto test devices.

## Prerequisites
1. Ensure [Android Studio](https://developer.android.com/studio) is installed on your machine.
2. Ensure you have the necessary Android SDKs installed (specifically Android SDK 33 or 34).

## Step 1: Sync Frontend with Android Project
Run the following commands in the project root to ensure the latest React build is synced into the Android wrapper:

```bash
cd client
npm run build
npx cap sync android
```

## Step 2: Open Android Studio
Open the generated Android project directly in Android Studio:
```bash
npx cap open android
```

## Step 3: Generate Signed APK
1. In Android Studio, wait for the initial Gradle sync to complete (watch the progress bar at the bottom).
2. Go to the top menu bar: **Build > Generate Signed Bundle / APK...**
3. Select **APK** and click **Next**.
4. In the **Key store path**, click **Create new...**
   - Save it somewhere safe (e.g., `C:\keys\kisanniti.jks`).
   - Set a strong password.
   - Fill in your details (Alias: `kisanniti`, your name, and organization details).
   - Click **OK**.
5. Ensure the newly created keystore is selected, enter the passwords, and click **Next**.
6. Select **release** as the Build Variant.
7. Click **Create** or **Finish**.

## Step 4: Locate the APK
Once the build process is complete, a popup will appear in the bottom right of Android Studio. Click **locate** to open the folder containing your APK.

Typically, it is found at:
`client\android\appelease\app-release.apk`

## Step 5: Install on Test Phones
1. Send the `app-release.apk` file via WhatsApp or USB to your test farmers.
2. Instruct them to tap the file to install.
3. If they receive a warning about "Install from Unknown Sources", instruct them to go to Settings and toggle the permission on for WhatsApp/Files.

---
**Note for Future Play Store Releases (Phase 2):**
For the Play Store, you will need to generate an **Android App Bundle (.aab)** instead of an APK. The process is identical, just select "Android App Bundle" in Step 3 instead of "APK".