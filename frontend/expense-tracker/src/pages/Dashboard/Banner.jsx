import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Banner = () => {
  return (
    <motion.div
      className="w-full bg-gradient-to-r from-purple-400 via-pink-300 to-red-300 rounded-xl p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-lg mb-10"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        className="mb-6 md:mb-0 max-w-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          Welcome from Budget<span className="text-yellow-400">Bee</span>
        </h2>
        <p className="text-sm md:text-base text-gray-100">
          Stay on top of your finances, track your expenses, and save smarter.
        </p>
        <Link to='/learnmore'>
          <motion.button
            className="mt-4 px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-200 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </Link>
      </motion.div>

      <motion.div
        className="w-[160px] md:w-[220px]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2920/2920290.png"
          alt="Finance Chart Illustration"
          className="w-full h-auto object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default Banner;
