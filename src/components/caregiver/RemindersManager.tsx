import React, { useState, useEffect } from 'react';
import { Bell, Plus, CheckCircle2, Circle, Clock, Volume2, Sparkles, Trash2 } from 'lucide-react';
import { ReminderItem, Language } from '../../types';
import { soundSynth } from '../../utils/audioSynth';
import { speechEngine } from '../../utils/speech';
import { vanikaStorage } from '../../utils/storage';

interface RemindersManagerProps {
  currentLanguage: Language;
}

export const RemindersManager: React.FC<RemindersManagerProps> = ({ currentLanguage }) => {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('03:30 PM');
  const [newWrapper, setNewWrapper] = useState('');
  const [newType, setNewType] = useState<ReminderItem['type']>('medication');

  useEffect(() => {
    setReminders(vanikaStorage.getReminders());
  }, []);

  const toggleComplete = (id: string) => {
    soundSynth.playWaterDrop();
    const updated = vanikaStorage.toggleReminder(id);
    setReminders(updated);
  };

  const handleHearReminder = (audioPrompt: string) => {
    soundSynth.playSoftClick();
    speechEngine.speak(audioPrompt, { language: currentLanguage });
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundSynth.playGentleChime();
    const newRem: ReminderItem = {
      id: `rem-${Date.now()}`,
      time: newTime,
      title: newTitle,
      culturalWrapper: newWrapper || 'Delivered affectionately with a warm cultural proverb.',
      type: newType,
      completed: false,
      audioPrompt: `Here is your ${newTime} reminder for ${newTitle}.`
    };

    const updated = [...reminders, newRem];
    setReminders(updated);
    vanikaStorage.saveReminders(updated);
    setNewTitle('');
    setNewWrapper('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    soundSynth.playSoftClick();
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    vanikaStorage.saveReminders(updated);
  };

  return (
    <div className="bg-[#FDFBF7] border-2 border-[#315C4C]/20 rounded-3xl p-6 sm:p-7 shadow-sm text-[#24332E]">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#315C4C]/15 flex-wrap gap-2">
        <div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#24483C]">
            Enculturated Daily Reminders
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5B55]">
            Delivered in rhythmic, affectionate tones by Oja Companion rather than standard clinical beeps
          </p>
        </div>

        <button
          onClick={() => {
            soundSynth.playSoftClick();
            setShowAddForm(!showAddForm);
          }}
          className="px-4 py-2 rounded-xl bg-[#315C4C] hover:bg-[#24483C] text-[#F8F4EA] text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Add New Reminder'}</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <form onSubmit={handleAddReminder} className="mb-6 p-5 rounded-2xl bg-[#F8F4EA] border border-[#315C4C]/25 space-y-4 animate-fadeIn">
          <h4 className="font-bold text-sm text-[#24483C] uppercase tracking-wide">
            Schedule Culturally Wrapped Reminder
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#4A5B55] mb-1">Time</label>
              <input
                type="text"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                placeholder="e.g. 04:00 PM"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#315C4C]/20 text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A5B55] mb-1">Reminder Category</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#315C4C]/20 text-sm font-medium"
              >
                <option value="medication">Medication & Tea</option>
                <option value="hydration">Hydration & Water</option>
                <option value="memory">Memory Activity</option>
                <option value="activity">Walk / Courtyard Breath</option>
                <option value="rest">Quiet Rest / Nap</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A5B55] mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Evening herbal tea & stroll"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#315C4C]/20 text-sm font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A5B55] mb-1">Cultural Wrapping Note (Spoken warmly by Oja)</label>
            <input
              type="text"
              value={newWrapper}
              onChange={e => setNewWrapper(e.target.value)}
              placeholder="e.g. Like the sun settling over the hills, let us have our evening tea."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#315C4C]/20 text-sm font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#315C4C]/20 text-xs font-bold text-[#4A5B55]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#315C4C] text-[#F8F4EA] text-xs font-bold hover:bg-[#24483C]"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map(rem => (
          <div
            key={rem.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              rem.completed
                ? 'bg-[#F8F4EA]/60 border-[#315C4C]/10 opacity-75'
                : 'bg-[#F8F4EA] border-[#315C4C]/20 hover:border-[#315C4C]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => toggleComplete(rem.id)}
                className="p-1 rounded-full text-[#315C4C] hover:scale-110 transition-transform cursor-pointer"
                title={rem.completed ? 'Mark as pending' : 'Mark as completed'}
              >
                {rem.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-6 h-6 text-[#315C4C]" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-[#EDE5D2] text-[#24483C] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C87552]" />
                    {rem.time}
                  </span>
                  <h4 className={`font-heading font-bold text-sm sm:text-base ${rem.completed ? 'line-through text-[#4A5B55]' : 'text-[#24483C]'}`}>
                    {rem.title}
                  </h4>
                </div>
                <p className="text-xs text-[#4A5B55] mt-1 italic">
                  "{rem.culturalWrapper}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleHearReminder(rem.audioPrompt)}
                className="p-2 rounded-xl bg-white border border-[#315C4C]/20 text-[#315C4C] hover:bg-[#EDE5D2] transition-colors cursor-pointer"
                title="Hear reminder audio cue"
              >
                <Volume2 className="w-4 h-4 text-[#D9A441]" />
              </button>

              <button
                onClick={() => handleDelete(rem.id)}
                className="p-2 rounded-xl bg-white border border-[#315C4C]/20 text-[#C87552] hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
