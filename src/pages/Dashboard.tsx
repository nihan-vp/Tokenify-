import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { TokenMeta, Clinic } from '../types';
import { motion } from 'motion/react';
import { 
  LogOut, 
  Settings as SettingsIcon, 
  Monitor, 
  Plus, 
  ChevronRight, 
  RotateCcw,
  Users,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { profile, loading: authLoading } = useAuth();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [meta, setMeta] = useState<TokenMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!profile?.clinicId) {
      setLoading(false);
      return;
    }

    // Fetch Clinic Info
    const fetchClinic = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'clinics', profile.clinicId));
        if (docSnap.exists()) {
          setClinic({ id: docSnap.id, ...docSnap.data() } as Clinic);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `clinics/${profile.clinicId}`);
      }
    };
    fetchClinic();

    // Listen to Meta
    const unsubscribe = onSnapshot(doc(db, 'clinics', profile.clinicId, 'meta', 'tokens'), (doc) => {
      if (doc.exists()) {
        setMeta(doc.data() as TokenMeta);
      }
      setLoading(false);
    }, (err) => {
      setLoading(false);
      try {
        handleFirestoreError(err, OperationType.GET, `clinics/${profile.clinicId}/meta/tokens`);
      } catch (e) {
        // Logged
      }
    });

    return unsubscribe;
  }, [profile]);

  const handleGenerateToken = async () => {
    if (!profile?.clinicId || !meta) return;
    try {
      await updateDoc(doc(db, 'clinics', profile.clinicId, 'meta', 'tokens'), {
        lastToken: meta.lastToken + 1
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `clinics/${profile.clinicId}/meta/tokens`);
    }
  };

  const handleCallNext = async () => {
    if (!profile?.clinicId || !meta) return;
    if (meta.currentToken >= meta.lastToken) return;
    try {
      await updateDoc(doc(db, 'clinics', profile.clinicId, 'meta', 'tokens'), {
        currentToken: meta.currentToken + 1
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `clinics/${profile.clinicId}/meta/tokens`);
    }
  };

  const handleReset = async () => {
    if (!profile?.clinicId) return;
    if (!confirm('Are you sure you want to reset all tokens?')) return;
    try {
      await updateDoc(doc(db, 'clinics', profile.clinicId, 'meta', 'tokens'), {
        currentToken: 0,
        lastToken: 0
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `clinics/${profile.clinicId}/meta/tokens`);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{clinic?.name}</h1>
            <p className="text-slate-500">Clinic Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/display/${clinic?.displayCode}`)}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
              title="Public Display"
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
              title="Settings"
            >
              <SettingsIcon size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-slate-600"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Users size={24} />
              </div>
              <span className="text-sm font-medium text-slate-400">NOW SERVING</span>
            </div>
            <div className="text-5xl font-bold text-slate-900">{meta?.currentToken}</div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <Clock size={24} />
              </div>
              <span className="text-sm font-medium text-slate-400">LAST ISSUED</span>
            </div>
            <div className="text-5xl font-bold text-slate-900">{meta?.lastToken}</div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Queue Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleGenerateToken}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              <Plus size={24} />
              Generate Token
            </button>
            <button
              onClick={handleCallNext}
              disabled={meta?.currentToken === meta?.lastToken}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none"
            >
              <ChevronRight size={24} />
              Call Next
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-4 rounded-xl transition-all"
            >
              <RotateCcw size={24} />
              Reset All
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
          <Monitor className="text-blue-600" size={20} />
          <p className="text-blue-800 text-sm">
            Public Display URL: <span className="font-mono font-bold select-all">{window.location.origin}/display/{clinic?.displayCode}</span>
          </p>
        </div>
        <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-200 p-2 rounded-lg text-slate-600 font-bold">
              {clinic?.displayCode}
            </div>
            <p className="text-slate-600 text-sm font-medium">Unique Display Code for patients</p>
          </div>
        </div>
      </div>
    </div>
  );
}
