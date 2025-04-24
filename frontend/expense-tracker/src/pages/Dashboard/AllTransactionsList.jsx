import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { motion } from "framer-motion";
import TransactionList from '../../components/Transaction/TransactionList';
import { toast } from 'react-hot-toast';  
import * as XLSX from 'xlsx';  

const AllTransactionList = () => {
  useUserAuth();
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactionDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
      ]);

      const incomeData = incomeResponse.data.map(item => ({
        ...item,
        type: 'income',
      }));

      const expenseData = expenseResponse.data.map(item => ({
        ...item,
        type: 'expense',
      }));

      const allTransactions = [...incomeData, ...expenseData];
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactionData(allTransactions);
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionDetails();
  }, []);

  const filteredTransactions = transactionData.filter((txn) => {
    const title = txn.type === 'income' ? txn.source : txn.category;
    return title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Download both income and expense details in one file
  const handleDownloadTransactionDetails = async () => {
    try {
      // Prepare the combined data
      const combinedData = transactionData.map(txn => ({
        Date: new Date(txn.date).toLocaleDateString(),
        Type: txn.type.charAt(0).toUpperCase() + txn.type.slice(1),
        Title: txn.type === 'income' ? txn.source : txn.category,
        Amount: txn.amount,
        Description: txn.description,
      }));

      // Create a new worksheet and workbook
      const ws = XLSX.utils.json_to_sheet(combinedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

      // Generate Excel file and trigger download
      const fileName = 'transaction_details.xlsx';
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error occurred while downloading transaction details:", error);
      toast.error("Failed to download transaction details. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <DashboardLayout activeMenu="Transactions">
      <motion.div
        className="my-5 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                  <h2 className="text-2xl sm:text-1xl font-semibold text-gray-800 mb-4 sm:mb-0">All Transactions</h2>

                    <input
                      type="text"
                      placeholder="Search ..."
                      className="p-2 border border-gray-300 rounded-md w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
            </div>

            <TransactionList
              transactions={filteredTransactions}
              onDownload={handleDownloadTransactionDetails}
            />
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AllTransactionList;
