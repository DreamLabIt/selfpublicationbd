"use client";

import { useState } from "react";

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({ value, onChange }: PasswordInputProps) {
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                </svg>
            </span>
            <input
                type={showPass ? "text" : "password"}
                name="password"
                value={value}
                onChange={onChange}
                required
                placeholder="Min. 8 characters"
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
            />
            <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-[#0B1E8A] transition-colors"
            >
                {showPass ? (
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
            </button>
        </div>
    );
}