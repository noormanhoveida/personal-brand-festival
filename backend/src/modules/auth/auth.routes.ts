import { requireAuth } from "../../middleware/auth.middleware";
import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { 
  loginSchema,
  registerSchema,
  resendPhoneVerificationSchema,
  resendVerificationSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  changePasswordSchema
} from "./auth.validator";
import { 
  login,
  logout,
  refresh,
  register,
  resendPhoneVerification,
  resendVerification,
  verifyEmailCode,
  verifyPhoneCode,
  requestPasswordReset,
  resetPassword,
  changePassword
} from "./auth.controller";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/verify-email", validateBody(verifyEmailSchema), verifyEmailCode);
router.post("/verify-phone", validateBody(verifyPhoneSchema), verifyPhoneCode);
router.post("/resend-verification", validateBody(resendVerificationSchema), resendVerification);
router.post("/resend-phone-verification", validateBody(resendPhoneVerificationSchema), resendPhoneVerification);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);


router.post("/forgot-password", validateBody(requestPasswordResetSchema), requestPasswordReset);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);
router.post("/change-password", requireAuth, validateBody(changePasswordSchema), changePassword);

export default router;
