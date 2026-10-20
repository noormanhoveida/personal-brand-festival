import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import { getProfile } from "../api/profile";
import { getPreAssessmentStatus, PreAssessmentStatus } from "../api/preAssessment";
import { PreAssessmentModal } from "./PreAssessmentModal";

/**
 * Mounted once in DashboardLayout. Shows the mandatory pre-assessment
 * popup as soon as onboarding is complete and it hasn't been
 * submitted yet — "به محض ثبت‌نام کاربر" in practice means right after
 * the profile (name, mobile, ...) exists, since the popup prefills
 * from it. Only ever relevant for participants.
 */
export function PreAssessmentGate() {
  const role = useAppSelector((s) => s.auth.role);
  const [status, setStatus] = useState<PreAssessmentStatus | null>(null);

  useEffect(() => {
    if (role !== "PARTICIPANT") return;
    getProfile()
      .then((res) => {
        if (!res.onboardingComplete) return;
        return getPreAssessmentStatus().then((s) => {
          if (!s.completed) setStatus(s);
        });
      })
      .catch(() => {
        // silent — a transient failure here shouldn't block the whole dashboard;
        // the popup will simply appear on the next successful check.
      });
  }, [role]);

  if (!status) return null;
  return <PreAssessmentModal status={status} onDone={() => setStatus(null)} />;
}
