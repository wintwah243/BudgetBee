import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';
import { motion } from "framer-motion";

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [editExpenseData, setEditExpenseData] = useState(null);

 //get all expense details
 const fetchExpenseDetails = async () => {
  if(loading) return;
  setLoading(true);
  try{
    const response = await axiosInstance.get(
      `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
    );
    
    if(response.data){
      setExpenseData(response.data);
    }
  }catch(error){
    console.log("Something went wrong. Please try again.", error)
  }finally{
    setLoading(false);
  }
};

//handle add expense and edit expense
const handleAddExpense = async (expense) => {
  const { category, description, amount, date, icon } = expense;

  if (!category.trim()) {
    toast.error("Category is required!");
    return;
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    toast.error("Amount should be a valid number greater than 0.");
    return;
  }

  if (!date) {
    toast.error("Date is required.");
    return;
  }

  try {
    if (editExpenseData) {
      // Updating existing expense
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(editExpenseData._id), {
        category,
        description,
        amount,
        date,
        icon
      });
      toast.success("Expense updated successfully.");
    } else {
      // Adding new expense
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        description,
        amount,
        date,
        icon
      });
      toast.success("Expense added successfully.");
    }

    setOpenAddExpenseModal(false); // Close modal after success
    setEditExpenseData(null); // Reset edit data
    fetchExpenseDetails(); // Refresh list

  } catch (error) {
    console.error("Error submitting expense:", error.response?.data?.message || error.message);
  }
};



 //delete expense
  const deleteExpense = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({show:false, data:null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    }catch(error){
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  //download expense details
  const handleDownloadExpenseDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob"
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }catch(error){
      console.error("Error occured while downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.")
    }
  }; 

useEffect(() => {
  fetchExpenseDetails();

  return () => {};
}, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <DashboardLayout activeMenu="Expense">
      <motion.div
        className="my-5 mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className='grid grid-cols-1 gap-6'>
         <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            >
            </ExpenseOverview>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          <ExpenseList 
            transactions={expenseData}
             onDelete={(id) => {
             setOpenDeleteAlert({ show: true, data: id });
               }}
             onDownload={handleDownloadExpenseDetails}
              onEdit={(expense) => {
              setEditExpenseData(expense);
              setOpenAddExpenseModal(true);
               }}
               />
        </motion.div>
        </div>

        <Modal
  isOpen={openAddExpenseModal}
  onClose={() => {
    setOpenAddExpenseModal(false);
    setEditExpenseData(null);
  }}
  title={editExpenseData ? "Edit Expense" : "Add Expense"}
>
  <AddExpenseForm onAddExpense={handleAddExpense} initialData={editExpenseData} />
</Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show:false, data:null})}
          title="Delete Expense"
          >
          <DeleteAlert 
            content="Are you sure you want to delete this expense details?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
     </motion.div>
    </DashboardLayout>
  )
}

export default Expense
