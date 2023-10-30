// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES
const Workout = require("../database/Workout");
const { v4: uuid } = require("uuid");
// *** ADD ***
const getAllWorkouts = () => {
    try {
      const allWorkouts = Workout.getAllWorkouts();
      return allWorkouts;
    } catch (error) {
      throw error;
    }
  };

  const createNewWorkout = (newWorkout) => {
    const workoutToInsert = {
      ...newWorkout,
      id: uuid(),
      createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    try {
      const createdWorkout = Workout.createNewWorkout(workoutToInsert);
      return createdWorkout;
    } catch (error) {
      throw error;
    }
  };
// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES// TEST PURPOSES