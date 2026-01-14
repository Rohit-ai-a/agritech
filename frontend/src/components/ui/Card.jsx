import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div
            initial={hover ? { y: 0 } : {}}
            whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
            className={`
                bg-white rounded-xl border border-gray-100 shadow-sm 
                hover:shadow-md hover:border-primary-100 transition-shadow duration-300
                overflow-hidden
                ${className}
            `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
