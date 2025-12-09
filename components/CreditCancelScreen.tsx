import React from 'react';
import TetrisPanel from './TetrisPanel';

interface CreditCancelScreenProps {
    onBack: () => void;
}

const CreditCancelScreen: React.FC<CreditCancelScreenProps> = ({ onBack }) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <TetrisPanel title="GEANNULEERD" className="max-w-md w-full text-center border-gray-600">

                <div className="flex justify-center mb-6 opacity-70">
                    {/* Yin Yang Symbol (text or simplistic css) */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white via-gray-400 to-black border-4 border-gray-500 animate-spin-slow shadow-lg flex items-center justify-center">
                        <span className="text-4xl">☯️</span>
                    </div>
                </div>

                <p className="text-white text-lg mb-8">Je betaling is geannuleerd. Geen zorgen, er is niets afgeschreven.</p>

                <button
                    onClick={onBack}
                    className="w-full bg-[#333] border-2 border-gray-500 text-gray-300 py-3 text-lg font-bold hover:bg-gray-700 hover:text-white transition-colors"
                >
                    Terug naar Menu
                </button>
            </TetrisPanel>
        </div>
    );
};

export default CreditCancelScreen;
