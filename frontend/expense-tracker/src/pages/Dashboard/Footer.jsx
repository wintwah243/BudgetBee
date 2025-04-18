import React from 'react';
import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-purple-100 text-white py-10 px-4" style={{marginTop:'22px'}}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-yellow-400 font-semibold text-lg mb-2">BudgetBee</h3>
            <p className="text-gray-800">
              Your smart expense tracking buddy. Stay organized, track your spending, and reach your savings goals.
            </p>
          </div>

          <div>
            <h4 className="text-yellow-400 font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/welcomepage" className="text-gray-800 hover:text-yellow-300 transition-colors">Home</a></li>
              <li><a href="/dashboard" className="text-gray-800 hover:text-yellow-300 transition-colors">Dashboard</a></li>
              <li><a href="/login" className="text-gray-800 hover:text-yellow-300 transition-colors">Login</a></li>
              <li><a href="/signup" className="text-gray-800 hover:text-yellow-300 transition-colors">Sign Up</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-yellow-400 font-semibold mb-2">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <FiMail className='text-gray-800'/>
                <a
                  href="mailto:wahwint72@gmail.com"
                  className="text-gray-800 hover:text-yellow-300 transition-colors">
                  wahwint72@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiGithub className='text-gray-800'/>
                <a
                  href="https://github.com/wintwah243"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-yellow-300 transition-colors">
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiLinkedin className='text-gray-800'/>
                <a
                  href="http://linkedin.com/in/wint-wah-386240307"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-yellow-300 transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-500 text-xs border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} BudgetBee. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
