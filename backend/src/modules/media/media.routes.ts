import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import { upload as uploadMiddleware } from "../../config/upload";
import { uploadMediaSchema } from "./media.validator";
import { list, remove, upload } from "./media.controller";

const router = Router();
router.use(requireAuth);

// multer runs first (parses multipart body into req.file + req.body),
// THEN validateBody checks the now-populated req.body — order matters.
router.post("/", uploadMiddleware.single("file"), validateBody(uploadMediaSchema), upload);
router.get("/", list);
router.delete("/:id", remove);

export default router;
