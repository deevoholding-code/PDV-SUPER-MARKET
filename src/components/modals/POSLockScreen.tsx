import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { Lock, Unlock, Users, KeyRound, AlertCircle, ShoppingCart } from 'lucide-react';
import { sound } from '../../services/soundService';

export const POSLockScreen: React.FC = () => {
  const { isLocked, currentUser, unlockWithPin, switchOperator, currentStore, registerNumber } = usePOS();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isLocked) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setError('');
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) return;

    const ok = unlockWithPin(pin);
    if (!ok) {
      // also check if another operator is unlocking
      const switched = switchOperator(pin);
      if (!switched) {
        setError('PIN incorreto. (Demo Caixa: 1234, Supervisor: 5678)');
        setPin('');
      }
    } else {
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 z-50 animate-in fade-in duration-200 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center flex flex-col items-center">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-extrabold text-white text-base leading-none">Family Supermarket</div>
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Terminal de Caixa {registerNumber}</div>
          </div>
        </div>

        {/* Lock Icon & Operator */}
        <div className="relative my-2">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-lg"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-black text-2xl border-2 border-blue-500 shadow-lg">
              {currentUser?.name.substring(0, 2).toUpperCase() || 'OP'}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mt-3">{currentUser?.name || 'Operador'}</h3>
        <p className="text-xs text-slate-400 font-medium">Terminal Bloqueado • Digite o PIN de 4 dígitos</p>

        {/* PIN Dots */}
        <div className="flex items-center justify-center gap-3 my-5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > idx
                  ? 'bg-blue-500 border-blue-400 scale-110 shadow-sm shadow-blue-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="text-xs text-rose-400 font-semibold mb-3 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {error}
          </div>
        )}

        {/* Numeric Touchpad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white font-bold text-xl transition active:scale-95 border border-slate-700/60 flex items-center justify-center shadow-xs"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition active:scale-95 border border-slate-700/40 flex items-center justify-center"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white font-bold text-xl transition active:scale-95 border border-slate-700/60 flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs transition active:scale-95 border border-slate-700/40 flex items-center justify-center"
          >
            ←
          </button>
        </div>

        {/* Unlock Button */}
        <button
          type="button"
          onClick={() => handleUnlock()}
          className="w-full mt-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-98"
        >
          <Unlock className="w-4 h-4" />
          DESBLOQUEAR TERMINAL
        </button>
      </div>
    </div>
  );
};
