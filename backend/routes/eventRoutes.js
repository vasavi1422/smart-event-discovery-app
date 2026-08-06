import express from "express";
import { 
    createEvent, 
    getEvents, 
    deleteEvent // This is what was causing the error
} from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.delete("/:id", deleteEvent); // Route for deleting

export default router;