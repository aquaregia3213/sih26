import React, { useState, useEffect } from 'react';
import { Plus, Check, Edit3, Trash2, Sun, Cloud, Moon, Clock, X, Save } from 'lucide-react';
import { RoutineTask } from '../../types';
import { DEFAULT_ROUTINE_TASKS } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

export const DailyRoutinePage: React.FC = () => {
  const [tasks, setTasks] = useState<RoutineTask[]>(() => {
    const saved = localStorage.getItem('vanika_routine');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    return DEFAULT_ROUTINE_TASKS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPeriod, setNewPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [newIcon, setNewIcon] = useState('📋');

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await apiClient.get<any[]>('/routines');
        if (Array.isArray(data) && data.length > 0) {
          const mapped: RoutineTask[] = data.map((r: any) => ({
            id: r.id,
            title: r.title,
            time: r.time || '12:00 PM',
            period: (r.period || 'morning').toLowerCase() as 'morning' | 'afternoon' | 'evening',
            icon: r.icon || '📋',
            completed: r.isCompleted ?? r.completed ?? false,
          }));
          setTasks(mapped);
          localStorage.setItem('vanika_routine', JSON.stringify(mapped));
        }
      } catch (err) {
        // Fall back to stored state
      }
    };
    fetchRoutines();
  }, []);

  const saveTasks = (updated: RoutineTask[]) => {
    setTasks(updated);
    localStorage.setItem('vanika_routine', JSON.stringify(updated));
  };

  const toggleCompleted = async (id: string) => {
    const target = tasks.find(t => t.id === id);
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);

    try {
      if (target) {
        await apiClient.post(`/routines/${id}/complete`, { completed: !target.completed });
      }
    } catch (err) {
      // Optimistic update retained locally
    }
  };

  const deleteTask = async (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    try {
      await apiClient.delete(`/routines/${id}`);
    } catch (err) {
      // Retained locally
    }
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    const newTask: RoutineTask = {
      id: `r-${Date.now()}`,
      time: newTime || '12:00 PM',
      title: newTitle,
      icon: newIcon,
      period: newPeriod,
      completed: false,
    };
    const updated = [...tasks, newTask];
    saveTasks(updated);
    resetForm();

    try {
      const created = await apiClient.post<any>('/routines', {
        title: newTitle,
        time: newTime || '12:00 PM',
        period: newPeriod.toUpperCase(),
        icon: newIcon,
      });
      if (created && created.id) {
        // Update local temp id with backend id
        setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, id: created.id } : t));
      }
    } catch (err) {
      // Kept with local id
    }
  };

  const handleEditSave = async () => {
    if (!editingTask || !newTitle.trim()) return;
    const updated = tasks.map(t =>
      t.id === editingTask.id
        ? { ...t, title: newTitle, time: newTime, period: newPeriod, icon: newIcon }
        : t
    );
    saveTasks(updated);

    try {
      await apiClient.patch(`/routines/${editingTask.id}`, {
        title: newTitle,
        time: newTime,
        period: newPeriod.toUpperCase(),
        icon: newIcon,
      });
    } catch (err) {
      // Kept locally
    }

    setEditingTask(null);
    resetForm();
  };

  const startEdit = (task: RoutineTask) => {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewTime(task.time);
    setNewPeriod(task.period);
    setNewIcon(task.icon);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setShowAddModal(false);
    setEditingTask(null);
    setNewTitle('');
    setNewTime('');
    setNewPeriod('morning');
    setNewIcon('📋');
  };

  const morningTasks = tasks.filter(t => t.period === 'morning');
  const afternoonTasks = tasks.filter(t => t.period === 'afternoon');
  const eveningTasks = tasks.filter(t => t.period === 'evening');
  const completedCount = tasks.filter(t => t.completed).length;

  const ICON_OPTIONS = ['📋', '💊', '🍵', '🚶', '🧩', '🍛', '😴', '🎯', '☕', '📞', '🍽️', '🎶', '🌙', '🌅', '🧘', '📖'];

  const renderPeriod = (
    label: string,
    icon: React.ReactNode,
    periodTasks: RoutineTask[],
    colorClass: string,
  ) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
          {icon}
        </div>
        <h2 className="text-xl font-extrabold font-heading text-[#1E3A2F]">{label}</h2>
        <span className="text-xs font-bold text-[#52635D] bg-[#F5EFE6] px-2 py-1 rounded-full">
          {periodTasks.filter(t => t.completed).length}/{periodTasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {periodTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
              task.completed
                ? 'border-emerald-200 bg-emerald-50/50'
                : 'border-[#2D4739]/10 shadow-sm'
            }`}
          >
            {/* Completion Checkbox */}
            <button
              onClick={() => toggleCompleted(task.id)}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                task.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-[#2D4739]/25 hover:border-[#D4AF37] text-transparent hover:text-[#D4AF37]'
              }`}
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
            >
              <Check className="w-6 h-6" />
            </button>

            {/* Icon */}
            <span className="text-2xl shrink-0">{task.icon}</span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className={`block text-base font-bold ${
                task.completed ? 'text-[#52635D] line-through' : 'text-[#1E3A2F]'
              }`}>
                {task.title}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#6A9B96] mt-0.5">
                <Clock className="w-3 h-3" />
                {task.time}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => startEdit(task)}
                className="p-2 rounded-xl hover:bg-[#F5EFE6] text-[#52635D] hover:text-[#1E3A2F] cursor-pointer transition-colors"
                aria-label="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 rounded-xl hover:bg-rose-50 text-[#52635D] hover:text-rose-500 cursor-pointer transition-colors"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {periodTasks.length === 0 && (
          <p className="text-sm text-[#52635D] text-center py-4 font-semibold">
            No tasks yet. Tap the + button to add one.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6" id="view-daily-routine">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#1E3A2F]">
                Daily Routine
              </h1>
              <p className="text-sm text-[#52635D]">
                {completedCount} of {tasks.length} completed today
              </p>
            </div>
          </div>

          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-bold text-sm shadow-md transition-all cursor-pointer focus-accessible"
            id="btn-add-routine"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="w-full h-4 rounded-full bg-[#F5EFE6] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2D4739] to-[#D4AF37] transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs font-bold text-[#6A9B96] mt-2 text-center">
            {completedCount === tasks.length && tasks.length > 0
              ? '🎉 All tasks completed! Wonderful job today!'
              : `${tasks.length - completedCount} tasks remaining — you are doing great!`}
          </p>
        </div>

        {/* Periods */}
        {renderPeriod('Morning', <Sun className="w-5 h-5 text-amber-500" />, morningTasks, 'bg-amber-100')}
        {renderPeriod('Afternoon', <Cloud className="w-5 h-5 text-[#6A9B96]" />, afternoonTasks, 'bg-[#6A9B96]/15')}
        {renderPeriod('Evening', <Moon className="w-5 h-5 text-indigo-400" />, eveningTasks, 'bg-indigo-100')}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#FDFBF7] p-6 sm:p-8 shadow-2xl border border-[#2D4739]/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-[#1E3A2F]">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 rounded-xl hover:bg-[#F5EFE6] cursor-pointer"
              >
                <X className="w-5 h-5 text-[#52635D]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1E3A2F] mb-2">Task Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Morning walk"
                  className="w-full py-4 px-4 rounded-2xl bg-white border-2 border-[#2D4739]/15 text-base font-semibold text-[#1E3A2F] placeholder-[#52635D]/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1E3A2F] mb-2">Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g., 8:00 AM"
                  className="w-full py-4 px-4 rounded-2xl bg-white border-2 border-[#2D4739]/15 text-base font-semibold text-[#1E3A2F] placeholder-[#52635D]/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1E3A2F] mb-2">Time of Day</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewPeriod(p)}
                      className={`py-3 px-3 rounded-xl font-bold text-sm capitalize cursor-pointer border-2 transition-all ${
                        newPeriod === p
                          ? 'bg-[#2D4739] text-[#FDFBF7] border-[#2D4739]'
                          : 'bg-white text-[#52635D] border-[#2D4739]/15 hover:border-[#D4AF37]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1E3A2F] mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewIcon(icon)}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center cursor-pointer border-2 transition-all ${
                        newIcon === icon
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37]'
                          : 'bg-white border-[#2D4739]/10 hover:border-[#D4AF37]'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 py-3 rounded-2xl bg-white border-2 border-[#2D4739]/15 text-[#52635D] font-bold cursor-pointer hover:bg-[#F5EFE6] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={editingTask ? handleEditSave : handleAddTask}
                className="flex-1 py-3 rounded-2xl bg-[#1E3A2F] text-[#FDFBF7] font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer hover:bg-[#2D4739] transition-all focus-accessible"
              >
                <Save className="w-4 h-4" />
                {editingTask ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
