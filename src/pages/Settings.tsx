import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { DisplaySettings } from '../types';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Save, 
  Palette, 
  Type, 
  Volume2, 
  Globe,
  CheckCircle2
} from 'lucide-react';

export default function Settings() {
  const { profile, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<DisplaySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!profile?.clinicId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'clinics', profile.clinicId, 'settings', 'display'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as DisplaySettings);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `clinics/${profile.clinicId}/settings/display`);
    });

    return unsubscribe;
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.clinicId || !settings) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'clinics', profile.clinicId, 'settings', 'display'), {
        ...settings
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `clinics/${profile.clinicId}/settings/display`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Display Settings</h1>
            <p className="text-slate-500 text-sm">Customize how your clinic display looks</p>
          </div>
        </header>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Visual Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Palette size={20} className="text-blue-600" />
              Visual Appearance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Background Color</label>
                <input
                  type="color"
                  value={settings?.bgColor}
                  onChange={(e) => setSettings(s => s ? { ...s, bgColor: e.target.value } : null)}
                  className="w-full h-10 p-1 rounded-lg border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                <input
                  type="color"
                  value={settings?.textColor}
                  onChange={(e) => setSettings(s => s ? { ...s, textColor: e.target.value } : null)}
                  className="w-full h-10 p-1 rounded-lg border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Type size={16} /> Font Size (px)
              </label>
              <input
                type="text"
                value={settings?.fontSize}
                onChange={(e) => setSettings(s => s ? { ...s, fontSize: e.target.value } : null)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="120px"
              />
            </div>
          </div>

          {/* Voice Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Volume2 size={20} className="text-blue-600" />
              Voice Announcement
            </h2>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">Enable Voice</p>
                <p className="text-sm text-slate-500">Announce tokens when they change</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings(s => s ? { ...s, voiceEnabled: !s.voiceEnabled } : null)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings?.voiceEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings?.voiceEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                <Globe size={16} /> Announcement Language
              </label>
              <select
                value={settings?.language}
                onChange={(e) => setSettings(s => s ? { ...s, language: e.target.value } : null)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="en-IN">English (India)</option>
                <option value="ml-IN">Malayalam (India)</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            {saved && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-emerald-600 flex items-center gap-1 text-sm font-medium"
              >
                <CheckCircle2 size={16} /> Settings saved
              </motion.div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Save size={20} /> Save Changes</>
              )}
            </button>
          </div>
        </form>

        {/* Preview Card */}
        <div className="mt-12">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Live Preview</h3>
          <div 
            className="h-48 rounded-2xl border border-slate-200 flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden"
            style={{ backgroundColor: settings?.bgColor, color: settings?.textColor }}
          >
            <p className="text-[10px] opacity-50 uppercase tracking-widest mb-1">NOW SERVING</p>
            <p className="font-bold leading-none" style={{ fontSize: '64px' }}>42</p>
            <p className="text-sm font-bold opacity-80 mt-2">Clinic Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
