# SkillLoop — Local Skill Exchange

SkillLoop is a hyperlocal community skill exchange platform where neighbors trade practical skills, craftsmanship, and lessons with zero currency. Utilizing time-banking credits (1 hour taught = 1 credit earned), users discover complementary skills in their immediate neighborhood radius and schedule 1-on-1 swaps.

---

## Demo Login — Mobile Number Only (Development Environment)

For rapid development, review, and demonstration workflows, SkillLoop implements a mock mobile-number-only authentication flow that bypasses SMS OTP for designated test profiles.

### Authorized Mobile Test Numbers

| Mobile Number | User Profile | Neighborhood | Skills Offered | Skills Desired |
| :--- | :--- | :--- | :--- | :--- |
| **`9990003331`** | **Dharani** | Maplewood (0.3 mi) | Acoustic Guitar, Organic Gardening, Bicycle Repair | Spanish, React Web Design, Sourdough Baking |
| **`8880002221`** | **Sivaraj** | Elmwood (1.1 mi) | React & Tailwind CSS, Mandarin, Digital Illustration | Acoustic Guitar, Woodworking, Herbal Tea |

---

## Step-by-Step Instructions for Sign-In Testing

### 1. Initial Access & Validation Testing
1. Navigate to the application root. If not signed in, you are automatically directed to `#/login`.
2. **Test Error Handling**:
   - Leave the field empty and click **Continue** → See validation prompt.
   - Enter fewer than 10 digits (e.g., `55512`) → See length validation prompt.
   - Enter an unauthorized 10-digit number (e.g., `5551234567`) → See clear error message:
     `Phone number "(555) 123-4567" is not recognized. Please use account number 999-000-3331 (Dharani) or 888-000-2221 (Sivaraj).`

### 2. Immediate Sign-In (No OTP / Password)
1. Enter `9990003331` (or click the **Dharani** quick-autofill card).
2. Click **Continue**.
3. You will immediately see the success feedback and be redirected to your dashboard (`#/dashboard`) without OTP or password prompts.

### 3. Session Persistence Across Refreshes
1. While logged in as Dharani on the dashboard, refresh the browser window (`Cmd+R` / `F5`).
2. Verify that the session persists seamlessly without "Page unavailable", redirect loops, or 404 errors.

### 4. Reciprocal Barter Testing Between Both Accounts
1. In Dharani's dashboard, look at the **100% Reciprocal Skill Barter Match** section highlighting **Sivaraj**.
2. Click **Propose Swap with Sivaraj**. Select your offered skill (Acoustic Guitar) and requested skill (React), set duration to 1.5h, and submit.
3. Use the navbar's **Switch to Sivaraj** button (or click **Log Out** and sign in with `8880002221`).
4. Notice that Sivaraj's dashboard instantly loads with his distinct profile, 6 banked hours, and the new incoming request sent by Dharani!
5. In Sivaraj's account, click **Accept Swap** or send a reply message in the coordination thread.
6. Switch back to Dharani to verify the reciprocal accepted status!

### 5. Logging Out
1. Click the **Log Out** button located in the top navigation bar.
2. The session is cleared from storage, and you are returned cleanly to the login view.

---

## Production Authentication & Security Architecture

### Isolation from Demo Authentication
The mock authentication logic is strictly confined to `src/services/auth.ts` under development checks. It must **never** be enabled in production environments.

In `src/services/auth.ts`:
- `AUTH_ENVIRONMENT` is defined with type `'development' | 'production'`.
- `loginWithDemoMobileNumber()` validates against `AUTHORIZED_DEMO_NUMBERS`.
- Production functions (`sendProductionPhoneOtp` and `verifyProductionPhoneOtp`) enforce carrier SMS OTP and raise exceptions if invoked in unauthorized states.

### Enabling Real Production Authentication (e.g., Firebase / Twilio)

To switch to production authentication:

1. **Install Firebase or SMS Provider**:
   ```bash
   npm install firebase
   ```
2. **Configure Firebase Phone Auth**:
   In your production initialization file:
   ```typescript
   import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

   const auth = getAuth();
   const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
     size: 'invisible'
   });

   // Dispatch real carrier SMS OTP
   export async function sendProductionPhoneOtp(phoneNumber: string) {
     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
     return { verificationId: confirmationResult.verificationId, confirmationResult };
   }

   // Confirm OTP code sent to user handset
   export async function verifyProductionPhoneOtp(confirmationResult, otpCode: string) {
     const userCredential = await confirmationResult.confirm(otpCode);
     return userCredential.user;
   }
   ```
3. **Environment Flags**:
   Set `VITE_AUTH_MODE=production` in your production deployment environment variables. Ensure mock bypass routes are excluded from production builds.

---

## Core Features Included in SkillLoop

- **Local Skill Matching**: Filter neighbors by category, search keywords, and distance radius slider (0.5 to 10 miles).
- **Reciprocal Barter Scoring**: Automatic algorithm matching complementary skills (e.g. Alex offers Guitar and seeks React; Maya offers React and seeks Guitar).
- **Exchange Requests & Live Messages**: Propose, accept, decline, complete, and message directly inside exchange threads.
- **Time Banking System**: 1:1 credit balance tracking for fair, zero-currency exchanges.
- **Profile & Skill Management**: Add/remove skills offered and skills sought, customize neighborhood, and view community reviews.
- **Accessible & Responsive UI**: Built with Tailwind CSS, DM Sans, Plus Jakarta Sans, and animated ambient backgrounds adhering to zero-pill and anti-slop guidelines.
