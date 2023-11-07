// In src/v1/routes/workoutRoutes.js
import express from 'express';
import workoutController from "../../../controllers/test/workoutController.js";
// *** ADD ***
import recordController from "../../../controllers/test/recordController.js";

const router = express.Router();

router.get("/workout", workoutController.getAllWorkouts);

router.get("/:workoutId", workoutController.getOneWorkout);

// *** ADD ***
router.get("/:workoutId/records", recordController.getRecordForWorkout);

router.post("/", workoutController.createNewWorkout);

router.patch("/:workoutId", workoutController.updateOneWorkout);

router.delete("/:workoutId", workoutController.deleteOneWorkout);

export { router };

