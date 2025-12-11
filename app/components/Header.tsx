"use client";

import Link from "next/link";
import { clsx } from "clsx";

interface HeaderProps {
    isMultiSelect: boolean;
    onToggleMultiSelect: () => void;
    isCompact: boolean;
}

export default function Header({ isMultiSelect, onToggleMultiSelect, isCompact }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between pointer-events-none">
            {/* Logo */}
            <Link href="/" className="pointer-events-auto">
                <span className={clsx(
                    "text-xl font-bold tracking-tighter transition-colors duration-500",
                    isCompact ? "text-cyan" : "text-white"
                )}>
                    portfol.io
                </span>
            </Link>

            {/* Right Side Controls */}
            <div className="flex items-center gap-6 pointer-events-auto">
                {/* Multi-select Toggle */}
                <div 
                    className="flex items-center gap-2 cursor-pointer select-none group" 
                    onClick={onToggleMultiSelect}
                >
                    <span className="text-xs text-white/50 group-hover:text-white transition-colors font-mono">
                        {isMultiSelect ? "multi-select: ON" : "multi-select: OFF"}
                    </span>
                    <div className={clsx(
                        "w-8 h-4 rounded-full relative transition-colors border border-white/20",
                        isMultiSelect ? "bg-cyan/20 border-cyan" : "bg-black/50"
                    )}>
                        <div className={clsx(
                            "absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all",
                            isMultiSelect ? "right-0.5 bg-cyan" : "left-0.5 bg-white/50"
                        )}></div>
                    </div>
                </div>

                {/* Admin Login */}
                <Link 
                    href="/admin" 
                    className="px-4 py-2 rounded-full border border-cyan/30 bg-navy/80 text-cyan text-xs font-mono hover:bg-cyan/10 hover:border-cyan transition-all backdrop-blur-sm shadow-[0_0_10px_rgba(0,194,255,0.1)]"
                >
                    [ admin_login ]
                </Link>
            </div>
        </header>
    );
}
