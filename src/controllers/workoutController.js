const Test = require("../../database/Test");
const workoutService = require("../services/workoutService");

const { v4: uuid } = require("uuid");

const getAllWorkouts = () => {
    try {
      const allWorkouts = Test.getAllWorkouts();
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
      const createdWorkout = Test.createNewWorkout(workoutToInsert);
      return createdWorkout;
    } catch (error) {
      throw error;
    }
  };

module.exports = {
    getAllWorkouts,
    createNewWorkout
  };