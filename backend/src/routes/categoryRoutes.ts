import express from "express";
import * as categoryController from "../controllers/categoryController";

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

export default router; 