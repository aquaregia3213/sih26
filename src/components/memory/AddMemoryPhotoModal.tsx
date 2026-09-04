import React, { useState, useRef } from 'react';
import { 
  X, Upload, Image as ImageIcon, MapPin, Calendar, Heart, 
  Sparkles, CheckCircle2, AlertCircle, Plus, Trash2, HelpCircle 
} from 'lucide-react';
import { MemoryPhotoItem, Language } from '../../types';
import { vanikaStorage } from '../../utils/storage';
import { uploadFamilyPhoto } from '../../services/supabase/supabaseClient';
import { soundSynth } from '../../utils/audioSynth';
import confetti from 'canvas-confetti';

interface AddMemoryPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoAdded?: (photo: MemoryPhotoItem) => void;
  currentLanguage?: Language;
}

export const AddMemoryPhotoModal: React.FC<AddMemoryPhotoModalProps> = ({
  isOpen,
  onClose,
  onPhotoAdded,
  currentLanguage = 'English',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('Granddaughter');
  const [location, setLocation] = useState('Guwahati, Assam');
  const [year, setYear] = useState('1988');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState('Who is this beloved family member?');
  const [options, setOptions] = useState<string[]>(['', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [storyNote, setStoryNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setImageUrl(''); // Clear manual URL if file chosen
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
    // If correct answer matches old value or is empty, auto-update
    if (index === 0 && !correctAnswer) {
      setCorrectAnswer(value);
    }
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const next = options.filter((_, i) => i !== index);
      setOptions(next);
      if (correctAnswer === options[index]) {
        setCorrectAnswer(next[0] || '');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide a title or memory occasion.');
      return;
    }

    if (!imagePreview && !imageUrl.trim()) {
      setErrorMessage('Please upload a family photo or provide an image link.');
      return;
    }

    const filteredOptions = options.map(o => o.trim()).filter(Boolean);
    if (filteredOptions.length < 2) {
      setErrorMessage('Please provide at least 2 quiz choices for the memory recall game.');
      return;
    }

    const finalAnswer = correctAnswer.trim() || filteredOptions[0];
    if (!filteredOptions.includes(finalAnswer)) {
      filteredOptions.unshift(finalAnswer);
    }

    setIsUploading(true);
    soundSynth.playSoftClick();

    try {
      let finalImageUrl = imageUrl.trim();

      // Upload file to Supabase Storage (family-photos bucket) or fallback to data URL
      if (selectedFile) {
        const userId = vanikaStorage.getCloudUserId() || 'guest-user';
        finalImageUrl = await uploadFamilyPhoto(selectedFile, userId);
      } else if (imagePreview && !finalImageUrl) {
        finalImageUrl = imagePreview;
      }

      const newPhotoItem: MemoryPhotoItem = {
        id: `photo-${Date.now()}`,
        title: title.trim(),
        personName: personName.trim() || 'Family Member',
        relationship: relationship.trim(),
        year: year.trim() || 'Memorable Era',
        location: location.trim() || 'Northeast India',
        imageUrl: finalImageUrl,
        audioPrompt: question.trim() || 'Who is in this photo?',
        options: filteredOptions,
        correctAnswer: finalAnswer,
        storyNote: storyNote.trim() || 'A cherished family moment preserved with love.'
      };

      // Save to vanikaStorage (and trigger Supabase cloud sync)
      vanikaStorage.addMemoryPhoto(newPhotoItem);

      setIsSuccess(true);
      soundSynth.playCelebration();

      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2D4739', '#D4AF37', '#C66B44', '#6A9B96']
      });

      onPhotoAdded?.(newPhotoItem);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);

    } catch (err: any) {
      console.error('Error saving family photo:', err);
      setErrorMessage(err?.message || 'Failed to save photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-[#15221B] rounded-3xl shadow-2xl border border-[#2D4739]/20 my-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-add-photo-title"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1E3A2F] via-[#2D4739] to-[#1E3A2F] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-xl">
              📸
            </div>
            <div>
              <h2 id="modal-add-photo-title" className="text-xl font-extrabold font-heading text-[#FAF7F2]">
                Add Family Photo & Place
              </h2>
              <p className="text-xs text-[#D4AF37]/90 font-medium">
                Saves to your Memory Garden, Photo Recall games & Supabase Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Memory Saved Successfully!</p>
                <p className="text-xs">Your photo and quiz question are now active in the Memory Room.</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Photo Picker / Upload */}
          <div>
            <label className="block text-sm font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-2">
              Family Portrait or Place Photo <span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2D4739]/30 hover:border-[#D4AF37] dark:border-white/20 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white dark:bg-[#1A2820] hover:bg-[#F3ECE2] flex flex-col items-center justify-center min-h-[160px]"
              >
                <Upload className="w-8 h-8 text-[#D4AF37] mb-2" />
                <span className="text-sm font-bold text-[#1E3A2F] dark:text-[#FAF7F2]">
                  {selectedFile ? selectedFile.name : 'Upload from Device'}
                </span>
                <span className="text-xs text-[#52635D] dark:text-[#9DB0A7] mt-1">
                  JPG, PNG, WebP up to 10MB
                </span>
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Preview Box */}
              <div className="relative rounded-2xl border border-[#2D4739]/15 overflow-hidden bg-[#F3ECE2] dark:bg-[#1A2820] min-h-[160px] flex items-center justify-center">
                {imagePreview || imageUrl ? (
                  <img 
                    src={imagePreview || imageUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-cover"
                    onError={() => setErrorMessage('Unable to load image preview. Check link or file.')}
                  />
                ) : (
                  <div className="text-center p-4 text-[#52635D] dark:text-[#9DB0A7]">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                    <span className="text-xs font-semibold">Photo Preview will appear here</span>
                  </div>
                )}
              </div>
            </div>

            {/* Optional URL input */}
            <div className="mt-3">
              <input 
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) {
                    setSelectedFile(null);
                    setImagePreview(null);
                  }
                }}
                placeholder="Or paste an image web link (e.g. https://...)"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#1A2820] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* 2. Basic Info: Title, Person, Relationship */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-1">
                Memory Title / Occasion <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Durga Puja in Silchar"
                className="w-full px-4 py-3 text-sm font-semibold rounded-xl bg-white dark:bg-[#1A2820] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-1">
                Person in Photo / Subject
              </label>
              <input 
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Anita & Grandson Bikram"
                className="w-full px-4 py-3 text-sm font-semibold rounded-xl bg-white dark:bg-[#1A2820] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* 3. Location & Era */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-3 text-sm font-semibold rounded-xl bg-white dark:bg-[#1A2820] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Granddaughter">Granddaughter</option>
                <option value="Grandson">Grandson</option>
                <option value="Daughter">Daughter</option>
                <option value="Son">Son</option>
                <option value="Spouse">Spouse / Partner</option>
                <option value="Sister">Sister</option>
                <option value="Brother">Brother</option>
                <option value="Childhood Home">Childhood Home / Ancestral Place</option>
                <option value="Friend">Lifelong Friend</option>
                <option value="Self">Self (Past Portrait)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-1">
                Place / Hometown
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Majuli Island"
                  className="w-full pl-9 pr-3 py-3 text-sm font-semibold rounded-xl bg-white dark:bg-[#1A2820] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-1">
                Year / Era
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input 
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 1988 or 2015"
                  className="w-full pl-9 pr-3 py-3 text-sm font-semibold rounded-xl bg-white dark:bg-[#1A2820] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* 4. Cognitive Quiz Question & Options */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F3ECE2]/80 dark:bg-[#1A2620] border border-[#2D4739]/15 dark:border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1E3A2F] dark:text-[#D4AF37]">
              <HelpCircle className="w-4 h-4" />
              <span>Cognitive Recall Question (Who / Where / When)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-1">
                Prompt or Question
              </label>
              <input 
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Who is sitting on the courtyard swing?"
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-white dark:bg-[#15221B] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Options List */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2]">
                Quiz Options & Correct Answer (Select the radio for the correct one)
              </label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input 
                    type="radio"
                    name="correct-answer-radio"
                    checked={correctAnswer === opt && opt.trim().length > 0}
                    onChange={() => setCorrectAnswer(opt)}
                    className="w-4 h-4 text-[#2D4739] accent-[#2D4739] cursor-pointer"
                    title="Mark as correct answer"
                  />
                  <input 
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1} (e.g. ${idx === 0 ? personName || 'Granddaughter Anita' : 'Niece Rita'})`}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-[#15221B] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
                      title="Remove option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {options.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#2D4739] dark:text-[#D4AF37] hover:underline pt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another choice
                </button>
              )}
            </div>
          </div>

          {/* 5. Personal Reminiscence Story Note */}
          <div>
            <label className="block text-xs font-bold text-[#1E3A2F] dark:text-[#FAF7F2] mb-1">
              Family Story / Cultural Memory Note
            </label>
            <textarea 
              value={storyNote}
              onChange={(e) => setStoryNote(e.target.value)}
              rows={3}
              placeholder="Tell Oja and the elder about this moment... e.g. We gathered for afternoon Lal Saah red tea and sang old folk songs under the banyan tree."
              className="w-full px-4 py-3 text-xs font-medium rounded-xl bg-white dark:bg-[#1A2820] border border-[#2D4739]/15 dark:border-white/10 text-[#1E3A2F] dark:text-white placeholder-[#52635D]/50 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2D4739]/15 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-[#2D4739]/20 text-[#52635D] dark:text-[#9DB0A7] font-bold text-sm hover:bg-[#F3ECE2] dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading || isSuccess}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A2F] hover:bg-[#2D4739] text-[#FDFBF7] font-extrabold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span>Saving Memory...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Save to Memory Garden</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
