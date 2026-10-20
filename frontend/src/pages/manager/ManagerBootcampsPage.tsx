// Bootcamp management is identical for BOOTCAMP_MANAGER and ADMIN — both
// roles hit the same backend endpoints (see bootcamp.routes.ts), so this
// re-exports the admin implementation rather than duplicating it.
export { AdminBootcampsPage as ManagerBootcampsPage } from "../admin/AdminBootcampsPage";
