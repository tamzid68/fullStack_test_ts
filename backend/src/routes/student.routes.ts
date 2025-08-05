import { Router } from "express";
import { serverCheck, getStudents, createStudent } from "../controllers/student.controller";

const router = Router();

router.get("/", serverCheck);
router.get("/students/", getStudents);
router.post("/data/", createStudent);

export default router;