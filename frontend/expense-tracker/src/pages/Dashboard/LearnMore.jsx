import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { FaLock, FaChartLine, FaMobileAlt, FaReact, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';

const features = [
  {
    title: 'Secure & Private',
    icon: <FaLock className="text-blue-600 text-3xl" />,
    desc: 'We protect your data using modern encryption and secure authentication.',
  },
  {
    title: 'Visual Analytics',
    icon: <FaChartLine className="text-green-600 text-3xl" />,
    desc: 'Understand your financial habits with clear and insightful charts.',
  },
  {
    title: 'Mobile Friendly',
    icon: <FaMobileAlt className="text-pink-600 text-3xl" />,
    desc: 'Access your dashboard on any device, any time, anywhere.',
  },
  {
    title: 'Built with React',
    icon: <FaReact className="text-cyan-500 text-3xl" />,
    desc: 'Powered by the latest React stack for speed and scalability.',
  },
  {
    title: 'Track Your Money',
    icon: <FaMoneyBillWave className="text-yellow-500 text-3xl" />,
    desc: 'Easily manage income, expenses, and see where your money goes.',
  },
  {
    title: 'Support & Contact',
    icon: <FaHeadset className="text-indigo-600 text-3xl" />,
    desc: 'Have questions or feedback? We’re here to help you anytime.',
  },
];

const LearnMore = () => {
  return (
    <DashboardLayout>
      <div className="bg-white px-6 py-12 max-w-7xl mx-auto text-gray-800">

        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            Discover the Power of Budget<span className='text-yellow-400'>Bee</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            Our project is designed to help you take control of your money and make smarter financial decisions.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <motion.div 
              key={i}
              className="bg-gray-100 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}>
              
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-blue-50 p-10 rounded-xl text-center shadow-inner">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>
            Our Mission
          </motion.h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We believe that personal finance should be easy, accessible, and stress-free. That's why we created this project — to give everyone the tools they need to succeed financially. Whether you're budgeting for the month or planning for the year, our project has your back.
          </p>
        </div>

        <div className="mt-16 text-center">
          <motion.a 
            href="/dashboard"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-full text-lg shadow-md transition"
            whileHover={{ scale: 1.05 }}
          >
            Enjoy now
          </motion.a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LearnMore;
