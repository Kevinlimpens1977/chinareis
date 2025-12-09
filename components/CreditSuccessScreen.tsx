import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import TetrisPanel from './TetrisPanel';

interface CreditSuccessScreenProps {
    onContinue: () => void;
}

const CreditSuccessScreen: React.FC<CreditSuccessScreenProps> = ({ onContinue }) => {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [addedCredits, setAddedCredits] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const verifyPayment = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (!sessionId) {
                setStatus('error');
                setErrorMsg('Geen sessie gevonden.');
                return;
            }

            try {
                // Call Edge Function to verify with Stripe
                const { data, error } = await supabase.functions.invoke('verify-session', {
                    body: { session_id: sessionId }
                });

                if (error || !data?.verified) {
                    throw new Error(error?.message || 'Verificatie mislukt');
                }

                // If verified, credits returned from metadata
                const creditsFromServer = data.credits;
                setAddedCredits(creditsFromServer);

                // Now update Profile via DB (Client-side update allowed by logic request, but better if EF did it. 
                // The prompt step 4 says "Tel credits op in mijn Supabase database: PATCH naar tabel".
                // Ideally this should be server side, but let's follow the prompt's implied flow or do it here if RLS allows.
                // Actually, step 4 implies the frontend does it OR the EF does it. 
                // Best practice: EF does it. But prompt says "4. Tel credits op". 
                // Let's assume the EF handles the verification, and we update the DB here if EF didn't.
                // BUT: EF is safer.
                // Prompt: "3. ... De function moet deze waardes teruggeven aan de frontend. 4. Tel credits op..."
                // This implies frontend orchestration. Okay.

                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Fetch current first to increment accurately or use RPC inc?
                    // Let's use RPC if available or simple update. 
                    // Since we removed 'use_credit' RPC, we likely need to fetch, then update or create new RPC.
                    // Or just direct update if RLS allows.
                    // We will try a direct fetch-and-update for simplicity as per "PATCH naar tabel profiles".

                    const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
                    const current = profile?.credits || 0;

                    await supabase.from('profiles').update({
                        credits: current + creditsFromServer
                    }).eq('id', user.id);
                }

                setStatus('success');

                // Auto-redirect after 4s
                setTimeout(() => {
                    onContinue();
                }, 4000);

            } catch (err: any) {
                console.error("Verification failed:", err);
                setStatus('error');
                setErrorMsg(err.message || "Er ging iets mis bij het verifiëren.");
            }
        };

        verifyPayment();
    }, []);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <TetrisPanel title={status === 'success' ? "BETALING GESLAAGD!" : "VERIFIËREN..."} className="w-full max-w-md text-center">

                {status === 'verifying' && (
                    <div className="flex flex-col items-center py-8">
                        <div className="text-4xl animate-spin mb-4">⏳</div>
                        <p className="text-[#FFD700] animate-pulse">Betaling verifiëren met Stripe...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-in zoom-in duration-300">
                        <div className="text-6xl mb-4 text-green-500">✔</div>
                        <h2 className="text-2xl text-[#FFD700] font-bold mb-2 font-arcade">GELUKT!</h2>
                        <p className="text-white text-lg mb-6">
                            Je hebt <span className="font-bold text-[#FFD700]">{addedCredits} credits</span> ontvangen.
                        </p>
                        <p className="text-sm text-gray-400 mb-8">Je wordt zo teruggestuurd...</p>

                        <button
                            onClick={onContinue}
                            className="w-full py-4 bg-green-600 text-white font-bold rounded hover:bg-green-500 font-arcade text-xl border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
                        >
                            GA NAAR SPEL
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl text-red-500 font-bold mb-4">Er ging iets mis</h2>
                        <p className="text-white mb-8">{errorMsg}</p>
                        <button
                            onClick={onContinue} // Just go back
                            className="w-full py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600"
                        >
                            Terug
                        </button>
                    </div>
                )}
            </TetrisPanel>
        </div>
    );
};

export default CreditSuccessScreen;
