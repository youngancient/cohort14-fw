// src/components/wallet/AddressSwitcher.tsx
// Simulation-only component: lets you switch which signer you're "acting as".
// Replace with WalletButton (real MetaMask) when going live.

import React, { useState } from 'react';
import { useConnectedWallet } from '../../context/WalletContext';
import { truncateAddress } from '../../utils/mockData';

export const AddressSwitcher: React.FC = () => {
    const { connectedAddress, setConnectedAddress, availableAddresses } =
        useConnectedWallet();
    const [open, setOpen] = useState(false);

    const current = availableAddresses.find(
        (a) => a.address.toLowerCase() === connectedAddress.toLowerCase()
    ) ?? { address: connectedAddress, name: 'Unknown' };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm
                   bg-[#1a1a1a] border border-gray-700 hover:border-[#7FFFD4]/40
                   transition-colors"
            >
                {/* Coloured avatar dot */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7FFFD4]/40
                        to-blue-500/40 border border-gray-600 flex items-center
                        justify-center text-[9px] font-bold text-white shrink-0">
                    {current.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-white font-medium hidden sm:block max-w-[90px] truncate">
                    {current.name}
                </span>
                <span className="text-gray-500 font-mono hidden md:block">
                    {truncateAddress(current.address, 3)}
                </span>
                <svg
                    className={`w-3 h-3 text-gray-500 shrink-0 transition-transform
                      ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 z-20
                          bg-[#1a1a1a] border border-gray-800 rounded-xl
                          shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-800 bg-[#111]">
                            <p className="text-gray-400 text-sm font-medium">Simulate as signer</p>
                            <p className="text-gray-600 text-sm mt-0.5">
                                Switch to act as a different wallet address
                            </p>
                        </div>

                        {/* Address list */}
                        {availableAddresses.map((a, i) => {
                            const isActive = a.address.toLowerCase() === connectedAddress.toLowerCase();
                            return (
                                <button
                                    key={a.address}
                                    onClick={() => { setConnectedAddress(a.address); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left
                               transition-colors hover:bg-white/5
                               ${isActive ? 'bg-[#7FFFD4]/5' : ''}`}
                                >
                                    {/* Index badge */}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                   text-sm font-bold shrink-0 border
                                   ${isActive
                                            ? 'bg-[#7FFFD4]/20 border-[#7FFFD4]/40 text-[#7FFFD4]'
                                            : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                                        {i === 0 ? '★' : i + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-medium truncate
                                     ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                {a.name}
                                            </p>
                                            {i === 0 && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded border
                                         border-yellow-500/20 bg-yellow-500/10
                                         text-yellow-400 shrink-0">
                                                    owner
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm font-mono truncate mt-0.5">
                                            {truncateAddress(a.address)}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <svg className="w-4 h-4 text-[#7FFFD4] shrink-0" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}

                        {/* Simulation note */}
                        <div className="px-4 py-3 border-t border-gray-800 bg-[#111]">
                            <p className="text-gray-600 text-sm">
                                ★ = contract owner · Settings visible only to owner
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};