import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fetchWorkoutPlans,
  deleteWorkoutPlan,
} from '../api/planService';
import { Loader2, Search, SlidersHorizontal, Plus, Edit, Trash2 } from 'lucide-react';

const bg = 'bg-black';
const card = 'bg-[#0b1e3c]';
const accent = 'bg-red-600';

const goalOptions = ['All Goals', 'Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'Flexibility', 'General Fitness'];
const difficultyOptions = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const statusOptions = ['All Statuses', 'Active', 'Completed', 'Cancelled', 'Paused'];

const WorkoutPlansOverview = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState('All Goals');
  const [difficultyFilter, setDifficultyFilter] = useState('All Levels');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetchWorkoutPlans({ limit: 200 });
      setPlans(response.data?.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load workout plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch = search
        ? `${plan?.planName ?? ''} ${plan?.user?.username ?? ''} ${plan?.goal ?? ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      const matchesGoal = goalFilter === 'All Goals' || plan.goal === goalFilter;
      const matchesDifficulty =
        difficultyFilter === 'All Levels' || plan.difficulty === difficultyFilter;
      const matchesStatus =
        statusFilter === 'All Statuses' || plan.status === statusFilter;

      return matchesSearch && matchesGoal && matchesDifficulty && matchesStatus;
    });
  }, [plans, search, goalFilter, difficultyFilter, statusFilter]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this workout plan?');
    if (!confirm) return;

    try {
      await deleteWorkoutPlan(id);
      toast.success('Workout plan deleted');
      setPlans((prev) => prev.filter((plan) => plan._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete workout plan');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/workout-plans/edit/${id}`);
  };

  return (
    <div className={`min-h-screen ${bg} py-10`}> 
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Workout Plans</h1>
            <p className="mt-2 text-sm text-white/70">
              Review, filter, and manage workout programmes assigned to members.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin/workout-plans/create')}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <Plus className="h-4 w-4" /> Create Plan
            </button>
          </div>
        </header>

        <section className={`rounded-3xl border border-white/10 ${card} p-6 shadow-2xl`}> 
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Search</label>
              <div className="mt-1 flex items-center rounded-xl border border-white/10 bg-black/30 pl-3 pr-2">
                <Search className="h-4 w-4 text-white/50" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by member, plan name, or goal"
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/60">Goal</label>
              <div className="relative mt-1">
                <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <select
                  value={goalFilter}
                  onChange={(event) => setGoalFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                >
                  {goalOptions.map((goal) => (
                    <option key={goal} value={goal} className="text-black">
                      {goal}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <div>
                <label className="text-xs uppercase tracking-wide text-white/60">Difficulty</label>
                <div className="relative mt-1">
                  <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <select
                    value={difficultyFilter}
                    onChange={(event) => setDifficultyFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {difficultyOptions.map((diff) => (
                      <option key={diff} value={diff} className="text-black">
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/60">Status</label>
                <div className="relative mt-1">
                  <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className="text-black">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/60">
                <tr className="text-left text-xs uppercase tracking-wide text-white/60">
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Goal</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white/80">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/60">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading workout plans...
                      </div>
                    </td>
                  </tr>
                ) : filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/60">
                      No workout plans match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <tr
                      key={plan._id}
                      className="transition hover:bg-white/5"
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">
                          {plan.user?.username || 'Unknown member'}
                        </div>
                        <div className="text-xs text-white/50">{plan.user?.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{plan.planName}</div>
                        <div className="text-xs text-white/50">Frequency: {plan.frequency}</div>
                      </td>
                      <td className="px-4 py-4 text-white">{plan.goal}</td>
                      <td className="px-4 py-4 text-white">{plan.difficulty}</td>
                      <td className="px-4 py-4">
                        <div>{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : '-'}</div>
                        <div className="text-xs text-white/50">to {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : '-'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${plan.status === 'Active' ? 'bg-emerald-500/20 text-emerald-200' : plan.status === 'Completed' ? 'bg-sky-500/20 text-sky-200' : 'bg-red-600/20 text-red-300'}`}
                        >
                          {plan.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(plan._id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white transition hover:border-white hover:bg-white/10"
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(plan._id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkoutPlansOverview;
