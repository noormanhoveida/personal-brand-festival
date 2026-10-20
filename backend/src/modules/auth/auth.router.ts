import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import {
  register,
  login,
  verifyEmailCode,
  verifyPhoneCode,
  resendVerification,
  resendPhoneVerification,
  refresh,
  logout,
} from "./auth.controller";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
  resendVerificationSchema,
  resendPhoneVerificationSchema,
} from "./auth.validator";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/verify-email", validateBody(verifyEmailSchema), verifyEmailCode);
router.post("/verify-phone", validateBody(verifyPhoneSchema), verifyPhoneCode);
router.post(
  "/resend-verification",
  validateBody(resendVerificationSchema),
  resendVerification
);
router.post(
  "/resend-phone-verification",
  validateBody(resendPhoneVerificationSchema),
  resendPhoneVerification
);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
