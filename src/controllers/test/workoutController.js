import Test from '../../database/Test.js';
import workoutService from '../../services/workoutService.js';

import { v4 as uuid } from 'uuid';

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