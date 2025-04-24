import React, { useState } from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';

const IncomeList = ({ transactions, onDelete, onDownload, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions?.filter(
    (income) =>
      income.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='card'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <h5 className='text-lg'>All Incomes</h5>

        <div className='flex items-center gap-3 w-full md:w-auto'>
          <input
            type='text'
            placeholder='Search income...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
          />
          <button
            onClick={onDownload}
            className='flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors'
          >
            <LuDownload className='text-base' />
            Download
          </button>
        </div>
      </div>

      <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
        {filteredTransactions?.length > 0 ? (
          filteredTransactions.map((income) => (
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              icon={income.icon}
              description={income.description}
              date={moment(income.date).format("Do MMM YYYY")}
              amount={income.amount}
              type="income"
              onDelete={() => onDelete(income._id)}
              onEdit={() => onEdit(income)}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-2 text-center">No matching income found.</p>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
