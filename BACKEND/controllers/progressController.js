const ProgressTracking = require('../models/ProgressTracking');
const Exercise = require('../models/Exercise');
const PDFDocument = require('pdfkit');
const User = require('../models/userModel');

const loadAuthenticatedUser = async (req) => {
  if (!req.user || !req.user._id) {
    return null;
  }

  return User.findById(req.user._id).select('role weight height username email');
};
//import { calculateCaloriesBurned } from '../utils/calculators.js';

// @desc    Log workout session
// @route   POST /api/progress/workout-session
// @access  Private
const logWorkoutSession = async (req, res) => {
  try {
    const { workoutPlan, date, duration, exercises, notes } = req.body;
    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id;

    // Calculate calories burned
    let totalCalories = 0;
    
    for (const ex of exercises) {
      const exercise = await Exercise.findById(ex.exercise);
      if (exercise) {
        // Calculate calories: (MET * weight * duration) / 60
        // Assuming average weight of 70kg if not provided
        const weight = currentUser.weight || 70;
        const exerciseDuration = ex.durationCompleted || duration / exercises.length;
        const calories = (exercise.metValue * weight * exerciseDuration) / 60;
        totalCalories += calories;
      }
    }

    // Find or create progress tracking
    let progress = await ProgressTracking.findOne({ user: userId });

    if (!progress) {
      progress = new ProgressTracking({ user: userId });
    }

    // Add workout session
    progress.workoutSessions.push({
      workoutPlan,
      date,
      duration,
      caloriesBurned: Math.round(totalCalories),
      exercises,
      notes
    });

    // Update totals
    progress.totalWorkouts += 1;
    progress.totalCaloriesBurned += Math.round(totalCalories);
    progress.totalWorkoutTime += duration;

    // Update streak
    const lastWorkout = progress.workoutSessions[progress.workoutSessions.length - 2];
    if (lastWorkout) {
      const daysDiff = Math.floor((new Date(date) - new Date(lastWorkout.date)) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        progress.currentStreak += 1;
        if (progress.currentStreak > progress.longestStreak) {
          progress.longestStreak = progress.currentStreak;
        }
      } else if (daysDiff > 1) {
        progress.currentStreak = 1;
      }
    } else {
      progress.currentStreak = 1;
      progress.longestStreak = 1;
    }

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Workout session logged successfully',
      data: progress
    });
  } catch (error) {
    console.error('Log workout session error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to log workout session'
    });
  }
};

// @desc    Log body metrics
// @route   POST /api/progress/body-metrics
// @access  Private
const logBodyMetrics = async (req, res) => {
  try {
    const { date, weight, height, bodyFat, muscleMass, measurements } = req.body;
    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id;

    // Find or create progress tracking
    let progress = await ProgressTracking.findOne({ user: userId });

    if (!progress) {
      progress = new ProgressTracking({ user: userId });
    }

    // Add body metrics (BMI will be calculated by the pre-save hook)
    progress.bodyMetrics.push({
      date,
      weight,
      height,
      bodyFat,
      muscleMass,
      measurements
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Body metrics logged successfully',
      data: progress
    });
  } catch (error) {
    console.error('Log body metrics error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to log body metrics'
    });
  }
};

// @desc    Get user progress
// @route   GET /api/progress/:userId
// @access  Private
const getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId;

    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check authorization
    if (currentUser.role === 'member' && userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const progress = await ProgressTracking.findOne({ user: userId })
      .populate('workoutSessions.workoutPlan')
      .populate('workoutSessions.exercises.exercise');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress data found'
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress'
    });
  }
};

// @desc    Get workout history
// @route   GET /api/progress/:userId/workout-history
// @access  Private
const getWorkoutHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { startDate, endDate, limit = 20 } = req.query;

    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check authorization
    if (currentUser.role === 'member' && userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const progress = await ProgressTracking.findOne({ user: userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress data found'
      });
    }

    let workoutSessions = progress.workoutSessions;

    // Filter by date range
    if (startDate || endDate) {
      workoutSessions = workoutSessions.filter(session => {
        const sessionDate = new Date(session.date);
        if (startDate && sessionDate < new Date(startDate)) return false;
        if (endDate && sessionDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Sort by date descending and limit
    const limitNumber = parseInt(limit, 10) || 20;

    workoutSessions = workoutSessions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limitNumber);

    res.status(200).json({
      success: true,
      count: workoutSessions.length,
      data: workoutSessions
    });
  } catch (error) {
    console.error('Get workout history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout history'
    });
  }
};

// @desc    Get body metrics history
// @route   GET /api/progress/:userId/body-metrics
// @access  Private
const getBodyMetricsHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { startDate, endDate } = req.query;

    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check authorization
    if (currentUser.role === 'member' && userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const progress = await ProgressTracking.findOne({ user: userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress data found'
      });
    }

    let bodyMetrics = progress.bodyMetrics;

    // Filter by date range
    if (startDate || endDate) {
      bodyMetrics = bodyMetrics.filter(metric => {
        const metricDate = new Date(metric.date);
        if (startDate && metricDate < new Date(startDate)) return false;
        if (endDate && metricDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Sort by date descending
    bodyMetrics = bodyMetrics.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
      success: true,
      count: bodyMetrics.length,
      data: bodyMetrics
    });
  } catch (error) {
    console.error('Get body metrics history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch body metrics history'
    });
  }
};

// @desc    Get progress statistics
// @route   GET /api/progress/:userId/stats
// @access  Private
const getProgressStats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { period = '30' } = req.query; // days

    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check authorization
    if (currentUser.role === 'member' && userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const progress = await ProgressTracking.findOne({ user: userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress data found'
      });
    }

    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - (parseInt(period, 10) || 30));

    // Filter workouts by period
    const periodWorkouts = progress.workoutSessions.filter(
      session => new Date(session.date) >= periodDate
    );

    // Calculate stats
    const stats = {
      totalWorkouts: progress.totalWorkouts,
      totalCaloriesBurned: progress.totalCaloriesBurned,
      totalWorkoutTime: progress.totalWorkoutTime,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      periodStats: {
        workouts: periodWorkouts.length,
        caloriesBurned: periodWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
        workoutTime: periodWorkouts.reduce((sum, w) => sum + w.duration, 0),
        avgCaloriesPerWorkout: periodWorkouts.length > 0 
          ? Math.round(periodWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0) / periodWorkouts.length)
          : 0
      },
      latestMetrics: progress.bodyMetrics.length > 0 
        ? progress.bodyMetrics[progress.bodyMetrics.length - 1]
        : null
    };

    // Calculate weight change if we have multiple metrics
    if (progress.bodyMetrics.length >= 2) {
      const latest = progress.bodyMetrics[progress.bodyMetrics.length - 1];
      const oldest = progress.bodyMetrics[0];
      stats.weightChange = {
        total: parseFloat((latest.weight - oldest.weight).toFixed(2)),
        percentage: parseFloat(((latest.weight - oldest.weight) / oldest.weight * 100).toFixed(2))
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress statistics'
    });
  }
};

// @desc    Generate progress report PDF
// @route   GET /api/progress/:userId/report
// @access  Private
const generateProgressReport = async (req, res) => {
  try {
    const userId = req.params.userId;

    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check authorization
    if (currentUser.role === 'member' && userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const progress = await ProgressTracking.findOne({ user: userId })
      .populate('user', 'username email');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'No progress data found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=progress-report-${Date.now()}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Fitness Progress Report', { align: 'center' });
    doc.moveDown();
    
    const displayName = progress.user?.username || progress.user?.name || 'N/A';
    doc.fontSize(12).text(`User: ${displayName}`, { align: 'left' });
    doc.text(`Email: ${progress.user?.email || 'N/A'}`);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Overall Statistics
    doc.fontSize(16).text('Overall Statistics', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Total Workouts: ${progress.totalWorkouts}`);
    doc.text(`Total Calories Burned: ${progress.totalCaloriesBurned} kcal`);
    doc.text(`Total Workout Time: ${Math.round(progress.totalWorkoutTime / 60)} hours`);
    doc.text(`Current Streak: ${progress.currentStreak} days`);
    doc.text(`Longest Streak: ${progress.longestStreak} days`);
    doc.moveDown();

    // Body Metrics
    if (progress.bodyMetrics.length > 0) {
      doc.fontSize(16).text('Body Metrics Progress', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);

      const latestMetric = progress.bodyMetrics[progress.bodyMetrics.length - 1];
      const firstMetric = progress.bodyMetrics[0];

      doc.text(`Current Weight: ${latestMetric.weight} kg`);
      doc.text(`Current BMI: ${latestMetric.bmi}`);
      
      if (progress.bodyMetrics.length > 1) {
        const weightChange = latestMetric.weight - firstMetric.weight;
        const bmiChange = latestMetric.bmi - firstMetric.bmi;
        doc.text(`Weight Change: ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(2)} kg`);
        doc.text(`BMI Change: ${bmiChange > 0 ? '+' : ''}${bmiChange.toFixed(2)}`);
      }
      doc.moveDown();
    }

    // Recent Workouts
    if (progress.workoutSessions.length > 0) {
      doc.fontSize(16).text('Recent Workouts (Last 10)', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);

      const recentWorkouts = progress.workoutSessions
        .slice(-10)
        .reverse();

      recentWorkouts.forEach((workout, index) => {
        doc.text(`${index + 1}. ${new Date(workout.date).toLocaleDateString()} - ${workout.duration} mins - ${workout.caloriesBurned} kcal`);
      });
    }

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate progress report'
    });
  }
};

// @desc    Delete workout session
// @route   DELETE /api/progress/workout-session/:sessionId
// @access  Private
const deleteWorkoutSession = async (req, res) => {
  try {
    const currentUser = await loadAuthenticatedUser(req);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userId = req.user._id;
    const sessionId = req.params.sessionId;

    const progress = await ProgressTracking.findOne({ user: userId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress data not found'
      });
    }

    const sessionIndex = progress.workoutSessions.findIndex(
      s => s._id.toString() === sessionId
    );

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Workout session not found'
      });
    }

    const session = progress.workoutSessions[sessionIndex];

    // Update totals
    progress.totalWorkouts -= 1;
    progress.totalCaloriesBurned -= session.caloriesBurned;
    progress.totalWorkoutTime -= session.duration;

    // Remove session
    progress.workoutSessions.splice(sessionIndex, 1);

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Workout session deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete workout session'
    });
  }
};

module.exports = {
  logWorkoutSession,
  logBodyMetrics,
  getUserProgress,
  getWorkoutHistory,
  getBodyMetricsHistory,
  getProgressStats,
  generateProgressReport,
  deleteWorkoutSession
};
