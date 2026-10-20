// Weekly-challenge authoring is identical for BOOTCAMP_MANAGER and ADMIN —
// both roles hit the same backend endpoints, so this re-exports the admin
// implementation rather than duplicating it (same pattern as ManagerBootcampsPage).
export { AdminChallengesPage as ManagerChallengesPage } from "../admin/AdminChallengesPage";
