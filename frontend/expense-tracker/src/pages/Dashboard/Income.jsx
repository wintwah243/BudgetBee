import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';
import { motion } from 'framer-motion';

const Income = () => {

  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [editIncomeData, setEditIncomeData] = useState(null);

  //get all income details
  const fetchIncomeDetails = async () => {
    if(loading) return;
    setLoading(true);
    try{
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );
      
      if(response.data){
        setIncomeData(response.data);
      }
    }catch(error){
      console.log("Something went wrong. Please try again.", error)
    }finally{
      setLoading(false);
    }
  };

  //handle add income and edit income
const handleAddIncome = async (income) => {
  const { source, description, amount, date, icon } = income;

  if (!source.trim()) {
    toast.error("Source is required!");
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
    if (editIncomeData) {
      // Updating existing income
      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(editIncomeData._id), {
        source,
        description,
        amount,
        date,
        icon
      });
      toast.success("Income updated successfully.");
    } else {
      // Adding new income
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        description,
        amount,
        date,
        icon
      });
      toast.success("Income added successfully.");
    }

    setOpenAddIncomeModal(false); // Close modal after success
    setEditIncomeData(null); // Reset edit data
    fetchIncomeDetails(); // Refresh list

  } catch (error) {
    console.error("Error submitting income:", error.response?.data?.message || error.message);
  }
};

  //delete income
  const deleteIncome = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({show:false, data:null});
      toast.success("Income details deleted successfully");
      fetchIncomeDetails();
    }catch(error){
      console.error(
        "Error deleting income:",
        error.response?.data?.message || error.message
      );
    }
  };

  //download income details
  const handleDownloadIncomeDetails = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob"
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    }catch(error){
      console.error("Error occured while downloading income details:", error);
      toast.error("Failed to download income details. Please try again.")
    }
  }; 

  useEffect(() => {
    fetchIncomeDetails();

    return() => {};
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <DashboardLayout activeMenu="Income">
     <motion.div
        className='my-5 mx-auto'
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
          <div className='grid grid-cols-1 gap-6'>
             <motion.div variants={fadeInUp}>
                  <IncomeOverview 
                    transactions={incomeData}
                    onAddIncome={() => setOpenAddIncomeModal(true)}
                  />
              </motion.div>

            <motion.div variants={fadeInUp}>
              <IncomeList 
                transactions={incomeData}
                onDelete={(id) => {
                  setOpenDeleteAlert({show:true, data:id})
                }}
                onDownload={handleDownloadIncomeDetails}
                onEdit={(income) => {
                  setEditIncomeData(income);
                  setOpenAddIncomeModal(true);
                   }}
              />
          </motion.div>
          </div>

          <Modal
            isOpen={openAddIncomeModal}
            onClose={() => {
            setOpenAddIncomeModal(false);
            setEditIncomeData(null);
                }}
            title={editIncomeData ? "Edit Income" : "Add Income"}
                >
                <AddIncomeForm onAddIncome={handleAddIncome} initialData={editIncomeData} />
            </Modal>


          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({show:false, data:null})}
            title="Delete Income"
          >
            <DeleteAlert 
              content="Are you sure you want to delete this income details?"
              onDelete={() => deleteIncome(openDeleteAlert.data)}
            />
          </Modal>
      </motion.div>
    </DashboardLayout>
  )
}

export default Income
