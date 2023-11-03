// In src/v1/routes/workoutRoutes.js
const express = require("express");
const workoutController = require("../../../controllers/test/workoutController");
// *** ADD ***
const recordController = require("../../../controllers/test/recordController");

const router = express.Router();

router.get("/workout", workoutController.getAllWorkouts);

router.get("/:workoutId", workoutController.getOneWorkout);

// *** ADD ***
router.get("/:workoutId/records", recordController.getRecordForWorkout);

router.post("/", workoutController.createNewWorkout);

router.patch("/:workoutId", workoutController.updateOneWorkout);

router.delete("/:workoutId", workoutController.deleteOneWorkout);

module.exports = router;
