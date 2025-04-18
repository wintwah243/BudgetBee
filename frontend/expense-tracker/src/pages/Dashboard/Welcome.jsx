import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import budgetbeeLogo from '../../assets/images/BudgetBee.png';

const Welcome = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 text-gray-800 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold">
          Budget<span className="text-yellow-500">Bee</span>
        </h1>
        <img src={budgetbeeLogo} alt="BudgetBee" className="w-20 ml-2" />
      </motion.div>

      <motion.p
        className="text-center max-w-xl text-lg md:text-xl mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Welcome to <strong>BudgetBee</strong> — your smart and simple expense tracker. Manage your spending, plan your budget, and achieve your financial goals, all in one place.
      </motion.p>

      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/login"
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
          >
            Login
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/signup"
            className="px-6 py-3 border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-100 rounded-lg font-medium transition"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>

      <motion.p
        className="mt-12 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        &copy; {new Date().getFullYear()} BudgetBee. All rights reserved.
      </motion.p>
    </motion.div>
  );
};

export default Welcome;
