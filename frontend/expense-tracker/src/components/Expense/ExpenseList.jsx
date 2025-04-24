import React, { useState } from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';

const ExpenseList = ({ transactions, onDelete, onDownload, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions?.filter(
    (expense) =>
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='card'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <h5 className='text-lg'>All Expenses</h5>

        <div className='flex items-center gap-3 w-full md:w-auto'>
          <input
            type='text'
            placeholder='Search expenses...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
          />

          <button className='flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors' onClick={onDownload}>
            <LuDownload className='text-base' /> Download
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2'>
        {filteredTransactions?.length > 0 ? (
          filteredTransactions.map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.category}
              icon={expense.icon}
              description={expense.description}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense._id)}
              onEdit={() => onEdit(expense)}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-2 text-center">No matching expenses found.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
