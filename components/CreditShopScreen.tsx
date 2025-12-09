import React, { useState } from 'react';
import TetrisPanel from './TetrisPanel';
import ChineseModal from './ChineseModal';
import { createCheckoutSession } from '../services/credits';
import { supabase } from '../services/supabase';

interface CreditShopScreenProps {
    onClose: () => void;
}

const CreditShopScreen: React.FC<CreditShopScreenProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [showPwywModal, setShowPwywModal] = useState(false);
    const [pwywAmount, setPwywAmount] = useState<string>('15');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const playSound = (type: 'success' | 'click' | 'error') => {
        // Placeholder for sound logic. 
        // In a real app we'd play an Audio object here.
        // console.log(`Playing sound: ${type}`);
    };

    const handleBuy = async (type: string, amount: number | null = null) => {
        try {
            setLoading(true);
            playSound('click');

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Je moet ingelogd zijn om credits te kopen.");
                setLoading(false);
                return;
            }

            const data = await createCheckoutSession(user.id, type, amount);

            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            setErrorMsg("Er ging iets mis bij het starten van de betaling.");
            playSound('error');
            setLoading(false);
        }
    };

    const handlePwywSubmit = () => {
        const amount = parseFloat(pwywAmount);
        if (isNaN(amount) || amount < 15) {
            setErrorMsg("Het sponsorbedrag moet minimaal €15 zijn.");
            playSound('error'); // gong effect logic
            return;
        }
        handleBuy('pwyw', amount);
    };

    const ShopButton = ({ label, price, onClick, subtext }: any) => (
        <button
            disabled={loading}
            onClick={onClick}
            className="group relative w-full p-4 mb-4 bg-[#C92A2A] border-4 border-[#8B0000] hover:border-[#FFD700] hover:-translate-y-1 transition-all active:translate-y-0"
        >
            <div className="flex flex-col items-center">
                <span className="text-[#FFD700] font-bold text-xl drop-shadow-md font-arcade tracking-wider">{label}</span>
                <span className="text-white text-lg">{price}</span>
                {subtext && <span className="text-xs text-white/80 mt-1">{subtext}</span>}
            </div>
            {/* Neon Glow on verify */}
            <div className="absolute inset-0 bg-[#FFD700] opacity-0 group-hover:opacity-10 transition-opacity" />
        </button>
    );

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            {/* Close Button Top Right */}
            <button
                onClick={onClose}
                className="fixed top-4 right-4 z-[60] bg-[#C92A2A] text-white w-10 h-10 border-2 border-[#FFD700] font-bold text-xl hover:scale-110"
            >
                ✕
            </button>

            <TetrisPanel title="Credit Shop" className="w-full max-w-2xl animate-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <p className="text-[#FFD700] text-lg mb-2">Steun onze reis en koop credits!</p>
                    <div className="flex justify-center gap-2">
                        <span className="text-3xl">🏮</span>
                        <span className="text-3xl">🏮</span>
                        <span className="text-3xl">🏮</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ShopButton
                        label="1 Credit"
                        price="€5,00"
                        onClick={() => handleBuy('1_credit')}
                    />

                    <ShopButton
                        label="2 Credits"
                        price="€10,00"
                        subtext="Populairste keuze!"
                        onClick={() => handleBuy('2_credits')}
                    />

                    <ShopButton
                        label="Sponsor"
                        price="Kies bedrag"
                        subtext="Min. €15 (5 credits)"
                        onClick={() => {
                            setShowPwywModal(true);
                            setErrorMsg(null);
                            playSound('click');
                        }}
                    />
                </div>

                {loading && (
                    <div className="mt-6 text-center text-[#FFD700] animate-pulse">
                        Even wachten... we openen Stripe...
                    </div>
                )}

                {errorMsg && !showPwywModal && (
                    <div className="mt-4 text-center text-red-500 bg-black/50 p-2 border border-red-500">
                        {errorMsg}
                    </div>
                )}
            </TetrisPanel>

            {/* PWYW Modal */}
            <ChineseModal
                isOpen={showPwywModal}
                onClose={() => setShowPwywModal(false)}
                title="Sponsor Ons"
            >
                <div className="space-y-4 text-center">
                    <p className="text-white">Vul je sponsorbedrag in (Minimaal €15)</p>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFD700] font-bold">€</span>
                        <input
                            type="number"
                            min="15"
                            value={pwywAmount}
                            onChange={(e) => setPwywAmount(e.target.value)}
                            className="w-full bg-black/50 border-2 border-[#C92A2A] text-white p-3 pl-8 focus:border-[#FFD700] outline-none font-arcade text-lg"
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-[#FF4444] text-sm font-bold bg-black/20 p-2 rounded animate-shake">
                            ⚠️ {errorMsg}
                        </p>
                    )}

                    <button
                        onClick={handlePwywSubmit}
                        disabled={loading}
                        className="w-full bg-[#FFD700] text-[#C92A2A] font-bold py-3 mt-2 border-b-4 border-[#B8860B] active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all font-arcade"
                    >
                        {loading ? 'Momentje...' : 'Naar Betalen'}
                    </button>
                </div>
            </ChineseModal>
        </div>
    );
};

export default CreditShopScreen;
