import React from 'react';
import { motion } from 'framer-motion';

const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 border-transparent",
    secondary: "bg-white text-secondary-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
    ghost: "bg-transparent text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900",
    outline: "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50"
};

const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]} 
                ${sizes[size]} 
                ${className}
            `}
            onClick={onClick}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
