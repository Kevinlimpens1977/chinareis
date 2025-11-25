import React from 'react';

interface WelcomeScreenProps {
    onLogin: () => void;
    onRegister: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister }) => {
    return (
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full animate-fade-in p-4 md:p-8 overflow-y-auto">

            {/* Main Container */}
            <div className="glass-panel p-6 md:p-10 rounded-3xl max-w-2xl w-full shadow-2xl border border-white/20 relative">

                {/* Festive Decor */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl animate-float">🎄</div>

                {/* Header */}
                <div className="text-center mb-8 mt-4">
                    <h2 className="text-xs md:text-sm uppercase tracking-widest text-red-200 mb-2">Omroep Parkstad Presenteert</h2>
                    <h1 className="text-5xl md:text-7xl font-black leading-none mb-4 relative z-10"
                        style={{
                            fontFamily: 'Montserrat, sans-serif',
                            color: '#ef4444',
                            WebkitTextStroke: '2px #fff',
                            textShadow: `
                  0 0 20px rgba(220, 38, 38, 0.5),
                  2px 2px 0 #991b1b,
                  4px 4px 0 #7f1d1d,
                  6px 6px 15px rgba(0,0,0,0.5)
                `
                        }}>
                        KERST<br />TETRIS
                    </h1>
                    <p className="text-cyan-300 text-sm md:text-base">Speel mee en win fantastische prijzen!</p>
                </div>

                {/* Game Rules */}
                <div className="bg-black/40 rounded-xl p-4 md:p-6 mb-6 border border-white/10">
                    <h3 className="text-yellow-400 font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">📜</span> Spelregels
                    </h3>
                    <ul className="space-y-2 text-sm md:text-base text-gray-200">
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">▸</span>
                            <span>Gebruik de <strong className="text-white">pijltjestoetsen</strong> om de blokken te bewegen</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">▸</span>
                            <span><strong className="text-white">Pijl omhoog</strong> = roteren</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">▸</span>
                            <span><strong className="text-white">Pijl omlaag</strong> = sneller laten vallen</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">▸</span>
                            <span>Maak volledige rijen om punten te scoren</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400 mt-1">▸</span>
                            <span>Hoe meer rijen tegelijk, hoe meer punten!</span>
                        </li>
                    </ul>
                </div>

                {/* Prizes */}
                <div className="bg-gradient-to-br from-yellow-950/40 to-black/60 rounded-xl p-4 md:p-6 mb-6 border border-yellow-500/30">
                    <h3 className="text-yellow-400 font-bold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏆</span> Prijzen
                    </h3>
                    <div className="space-y-2 text-sm md:text-base text-gray-200">
                        <p className="flex items-start gap-2">
                            <span className="text-yellow-400">★</span>
                            <span><strong className="text-yellow-300">Top 3</strong> op 31 december: Exclusief prijzenpakket!</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <span className="text-purple-400">★</span>
                            <span><strong className="text-purple-300">5 Random winnaars</strong> uit alle deelnemers op 1 januari</span>
                        </p>
                    </div>
                </div>

                {/* Important Info */}
                <div className="bg-cyan-900/20 rounded-xl p-4 mb-6 border border-cyan-500/30">
                    <p className="text-xs md:text-sm text-cyan-200 text-center leading-relaxed">
                        <span className="text-cyan-400 font-bold">⚠️ Let op:</span> Je moet een account aanmaken en je email bevestigen om mee te kunnen doen. Alleen geverifieerde spelers kunnen hun scores opslaan!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onRegister}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <span className="text-2xl">🎮</span>
                        NIEUW ACCOUNT AANMAKEN
                    </button>

                    <button
                        onClick={onLogin}
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">🔑</span>
                        AL EEN ACCOUNT? INLOGGEN
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>Powered by Omroep Parkstad 📻</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
