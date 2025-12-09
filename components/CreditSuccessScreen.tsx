import React, { useEffect } from 'react';
import TetrisPanel from './TetrisPanel';

interface CreditSuccessScreenProps {
    onContinue: () => void;
}

const CreditSuccessScreen: React.FC<CreditSuccessScreenProps> = ({ onContinue }) => {

    // Simple CSS Confetti on mount would be nice, but let's stick to decorative elements for now.

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#C92A2A]/20 backdrop-blur-md">
            <TetrisPanel title="BETALING GELUKT" className="max-w-xl w-full text-center">

                <div className="flex justify-center mb-6">
                    {/* Giant Checkmark or Success Graphic */}
                    <div className="w-24 h-24 bg-[#FFD700] p-4 rotate-45 border-4 border-[#C92A2A] shadow-[0_0_20px_#FFD700] animate-[bounce_2s_infinite]">
                        <div className="w-full h-full border-r-4 border-b-4 border-[#C92A2A] -rotate-12 translate-y-[-10px]"></div>
                    </div>
                </div>

                <h2 className="text-4xl text-[#FFD700] font-arcade mb-4 drop-shadow-[4px_4px_0_#000]">SUCCESS!</h2>

                <p className="text-white text-xl mb-2 font-bold">付款成功</p>
                <p className="text-gray-300 mb-8">Je credits zijn toegevoegd aan je account. Veel speelplezier!</p>

                <div className="flex justify-center gap-4 text-3xl mb-8 animate-[pulse_3s_ease-in-out_infinite]">
                    🏮 🐲 🏮
                </div>

                <button
                    onClick={onContinue}
                    className="w-full bg-[#111] border-2 border-[#FFD700] text-[#FFD700] py-4 text-xl font-bold hover:bg-[#FFD700] hover:text-[#111] transition-colors font-arcade uppercase tracking-widest"
                >
                    Start Spel
                </button>
            </TetrisPanel>
        </div>
    );
};

export default CreditSuccessScreen;
