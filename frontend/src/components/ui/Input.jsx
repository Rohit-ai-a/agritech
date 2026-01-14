import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-secondary-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    className={`
                        w-full px-4 py-2.5 bg-white border rounded-lg text-sm transition-all duration-200
                        placeholder:text-gray-400 text-secondary-900
                        focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        disabled:bg-gray-50 disabled:text-gray-500
                        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-gray-300'}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
