import React, { useState } from 'react';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (tokenData: TokenData) => void;
}

interface TokenData {
  tokenName: string;
  decimals: number;
  symbol: string;
  initialSupply: number;
}

const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onDeploy }) => {
    const [tokenData, setTokenData] = useState<TokenData>({
        tokenName: '',
        decimals: 18,
        symbol: '',
        initialSupply: 1000000,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!tokenData.tokenName.trim()) {
            newErrors.tokenName = 'Token name is required';
        }
        if (!tokenData.symbol.trim()) {
            newErrors.symbol = 'Symbol is required';
        }
        if (tokenData.decimals < 0 || tokenData.decimals > 18) {
            newErrors.decimals = 'Decimals must be between 0 and 18';
        }
        if (tokenData.initialSupply <= 0) {
            newErrors.initialSupply = 'Initial supply must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTokenData(prev => ({
        ...prev,
        [name]: name === 'tokenName' || name === 'symbol' 
            ? value 
            : Number(value)
        }));
    };

    const handleDeploy = () => {
        if (validateForm()) {
            console.log('Deploying token with data:', tokenData);

            alert(`Token "${tokenData.tokenName}" deployed successfully!`);
            onDeploy(tokenData);
            onClose();
        }
    };

  if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Create Token</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Configure your ERC-20 asset parameters.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                TOKEN NAME
                            </label>
                            <input
                                type="text"
                                name="tokenName"
                                value={tokenData.tokenName}
                                onChange={handleInputChange}
                                placeholder="e.g. Neon Sapphire"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.tokenName ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.tokenName && (
                                <p className="mt-1 text-xs text-red-500">{errors.tokenName}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">e.g. Neon Sapphire</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                DECIMALS
                            </label>
                            <input
                                type="number"
                                name="decimals"
                                value={tokenData.decimals}
                                onChange={handleInputChange}
                                min="0"
                                max="18"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.decimals ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.decimals && (
                                <p className="mt-1 text-xs text-red-500">{errors.decimals}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">18</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SYMBOL
                            </label>
                            <input
                                type="text"
                                name="symbol"
                                value={tokenData.symbol}
                                onChange={handleInputChange}
                                placeholder="e.g. NSPH"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.symbol ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.symbol && (
                                <p className="mt-1 text-xs text-red-500">{errors.symbol}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">e.g. NSPH</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            INITIAL SUPPLY
                            </label>
                            <input
                            type="number"
                            name="initialSupply"
                            value={tokenData.initialSupply}
                            onChange={handleInputChange}
                            min="1"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.initialSupply ? 'border-red-500' : 'border-gray-300'
                            }`}
                            />
                            {errors.initialSupply && (
                            <p className="mt-1 text-xs text-red-500">{errors.initialSupply}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">1000000</p>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeploy}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            Deploy Token
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenModal;