import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { createRegionSchema, updateUserRoleSchema } from "./admin.validator";
import {
  addRegion,
  changeUserRole,
  blockUser,
  removeUser,
  overview,
  participants,
  regions,
  users,
} from "./admin.controller";

const router = Router();

// Every route below requires a valid access token AND the ADMIN role.
router.use(requireAuth, requireRole(Role.ADMIN));

router.get("/overview", overview);

router.get("/users", users);
router.put("/users/:id/role", validateBody(updateUserRoleSchema), changeUserRole);
router.put("/users/:id/block", blockUser);
router.delete("/users/:id", removeUser);

router.get("/regions", regions);
router.post("/regions", validateBody(createRegionSchema), addRegion);

router.get("/participants", participants);

export default router;
