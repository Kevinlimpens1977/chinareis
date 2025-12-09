import React from 'react';

interface CreditBadgeProps {
    credits: number;
    onClick?: () => void;
}

const CreditBadge: React.FC<CreditBadgeProps> = ({ credits, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer group relative flex items-center gap-3 bg-black/60 border-2 border-[#FFD700] px-4 py-2 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform"
        >
            {/* Coin Icon (CSS generated pixel coin) */}
            <div className="w-8 h-8 rounded-full bg-[#FFD700] border-2 border-[#DAA520] shadow-[0_0_10px_#FFD700] flex items-center justify-center animate-pulse">
                <span className="text-[#C92A2A] font-bold text-lg select-none">¥</span>
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] text-[#FFD700] uppercase tracking-wider leading-none">Credits</span>
                <span className="text-xl text-white font-bold leading-none font-arcade drop-shadow-md">
                    {credits !== null ? credits : '-'}
                </span>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1s_ease-in-out_infinite]" />
        </div>
    );
};

export default CreditBadge;
