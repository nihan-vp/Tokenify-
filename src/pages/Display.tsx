import { doc, onSnapshot, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { TokenMeta, DisplaySettings, Clinic } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';

export default function Display() {
  const { displayCode } = useParams<{ displayCode: string }>();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [meta, setMeta] = useState<TokenMeta | null>(null);
  const [settings, setSettings] = useState<DisplaySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastCalledToken = useRef<number | null>(null);

  useEffect(() => {
    if (!displayCode) return;

    const initDisplay = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Find clinic by displayCode
        const clinicsRef = collection(db, 'clinics');
        const q = query(clinicsRef, where('displayCode', '==', displayCode.toUpperCase()));
        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
        } catch (err) {
          handleFirestoreError(err, OperationType.LIST, 'clinics');
          return;
        }

        if (querySnapshot.empty) {
          setError('Invalid Display Code');
          setLoading(false);
          return;
        }

        const clinicDoc = querySnapshot.docs[0];
        const clinicId = clinicDoc.id;
        setClinic({ id: clinicId, ...clinicDoc.data() } as Clinic);

        // Listen to Meta
        const unsubMeta = onSnapshot(doc(db, 'clinics', clinicId, 'meta', 'tokens'), (doc) => {
          if (doc.exists()) {
            const data = doc.data() as TokenMeta;
            setMeta(data);
            
            // Voice Announcement
            if (lastCalledToken.current !== null && data.currentToken > lastCalledToken.current) {
              announceToken(data.currentToken);
            }
            lastCalledToken.current = data.currentToken;
          }
        }, (err) => {
          try {
            handleFirestoreError(err, OperationType.GET, `clinics/${clinicId}/meta/tokens`);
          } catch (e) {
            // Logged
          }
        });

        // Listen to Settings
        const unsubSettings = onSnapshot(doc(db, 'clinics', clinicId, 'settings', 'display'), (doc) => {
          if (doc.exists()) {
            setSettings(doc.data() as DisplaySettings);
          }
          setLoading(false);
        }, (err) => {
          setLoading(false);
          try {
            handleFirestoreError(err, OperationType.GET, `clinics/${clinicId}/settings/display`);
          } catch (e) {
            // Logged
          }
        });

        return () => {
          unsubMeta();
          unsubSettings();
        };
      } catch (err: any) {
        console.error('Error initializing display:', err);
        setError('Failed to load display');
        setLoading(false);
      }
    };

    const cleanup = initDisplay();
    return () => {
      cleanup.then(unsub => unsub?.());
    };
  }, [displayCode]);

  const announceToken = (number: number) => {
    if (!settings?.voiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = settings.language || 'en-IN';
    
    if (settings.language === 'ml-IN') {
      utterance.text = `ടോക്കൺ നമ്പർ ${number}, ദയവായി വരിക`;
    } else {
      utterance.text = `Token number ${number}, please come`;
    }

    window.speechSynthesis.speak(utterance);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-2">{error}</h1>
      <p className="text-slate-400 mb-8 max-w-xs">Please check the display code and try again.</p>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        Back to Home
      </button>
    </div>
  );

  if (!clinic) return null;

  const style = {
    backgroundColor: settings?.bgColor || '#f3f4f6',
    color: settings?.textColor || '#1f2937',
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden relative"
      style={style}
    >
      {/* Controls Overlay */}
      <div className="absolute top-6 right-6 flex gap-4 opacity-20 hover:opacity-100 transition-opacity">
        <button onClick={toggleFullscreen} className="p-2 rounded-full bg-black/10 hover:bg-black/20">
          <Maximize size={24} />
        </button>
        <div className="p-2 rounded-full bg-black/10">
          {settings?.voiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <h2 className="text-2xl md:text-4xl font-medium opacity-60 mb-4 tracking-widest uppercase">
          NOW SERVING
        </h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={meta?.currentToken}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="font-bold leading-none select-none"
            style={{ fontSize: settings?.fontSize || '200px' }}
          >
            {meta?.currentToken}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12">
          <h1 className="text-3xl md:text-5xl font-bold opacity-80">
            {clinic.name}
          </h1>
        </div>
      </motion.div>

      {/* Footer info */}
      <div className="absolute bottom-8 w-full text-center opacity-30 text-sm font-mono">
        TOKEN MANAGEMENT SYSTEM • {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
