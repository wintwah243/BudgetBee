import React from 'react';
import TransactionInfoCard from '../cards/TransactionInfoCard';

const TransactionList = ({ transactions, onDownload }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-lg">Transactions</h3>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Download
        </button>
      </div>

      {transactions && transactions.length > 0 ? (
        transactions.map((transaction, index) => {
          const title =
            transaction.type === 'income'
              ? transaction.source || 'Untitled Income'
              : transaction.category || 'Untitled Expense';

          return (
            <TransactionInfoCard
              key={index}
              title={title}
              icon={transaction.icon}
              date={new Date(transaction.date).toLocaleDateString()}
              amount={transaction.amount}
              description={transaction.description}
              type={transaction.type}
            />
          );
        })
      ) : (
        <div className="text-center text-gray-500">No transactions available</div>
      )}
    </div>
  );
};

export default TransactionList;
