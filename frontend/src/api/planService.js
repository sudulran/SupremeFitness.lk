import axiosInstance from './axiosInstance';

export const fetchUsersForPlans = () => axiosInstance.get('/auth/users');

export const fetchExercises = (params = {}) =>
  axiosInstance.get('/exercises', { params: { limit: 200, ...params } });

export const fetchFoods = (params = {}) =>
  axiosInstance.get('/foods', { params: { limit: 200, ...params } });

export const createWorkoutPlan = (payload) =>
  axiosInstance.post('/workout-plans', payload);

export const createMealPlan = (payload) =>
  axiosInstance.post('/meal-plans', payload);
