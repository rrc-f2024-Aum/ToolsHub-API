import { Router } from "express";
import * as toolController from "../controllers/toolController";

const router = Router();

// GET - healthCheck
router.get("/health", toolController.checkHealth);

// GET - All Tools
router.get("/", toolController.displayAllTools);

// GET - tools by category
router.get("/category/:category",
    toolController.displayToolByCategory
);

// GET - tool by id
router.get("/:id", toolController.displayToolById);

// POST - create new tool
router.post("/", toolController.generateTool);

// PUT - update tool by id 
router.put("/:id", toolController.updateToolDetails);

// DELETE - tool by id
router.delete("/:id", toolController.removeTool);

export default router;