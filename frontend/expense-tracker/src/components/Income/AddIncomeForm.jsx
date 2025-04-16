import React, { useState, useEffect } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';

const AddIncomeForm = ({onAddIncome, initialData}) => {

    const [income, setIncome] = useState({
        source: initialData?.source || '',
        description: initialData?.description || '',
        amount: initialData?.amount || '',
        date: initialData?.date || '',
        icon: initialData?.icon || '',
    });

    // Pre-fill form when editing
      useEffect(() => {
        if (initialData) {
          setIncome({
            source: initialData?.source || '',
            description: initialData?.description || '',
            amount: initialData?.amount || '',
            date: initialData?.date || '',
            icon: initialData?.icon || '',
          });
        }
      }, [initialData]);

    const handleChange = (key, value) => setIncome({...income, [key]: value});

    const handleSubmit = () => {
        if (!income.source || !income.amount || !income.date) {
          alert("Please fill in all required fields");
          return;
        }
        onAddIncome(income);

    // Reset form only when adding a new expense
    if (!initialData) {
      setIncome({
        source: '',
        description: '',
        amount: '',
        date: '',
        icon: '',
      });
    }
  };

  return (
    <div>

        <EmojiPickerPopup 
            icon={income.icon}
            onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />
        <Input 
            value={income.source}
            onChange={({target}) => handleChange("source", target.value)}
            label="Income Source"
            placeholder="Freelance, Salary, etc"
            type="text"
        />
        <Input
        value={income.description}
        onChange={({ target }) => handleChange('description', target.value)}
        label="Description"
        placeholder=""
        type="text"
      />
        <Input 
            value={income.amount}
            onChange={({target}) => handleChange("amount", target.value)}
            label="Amount"
            placeholder=""
            type="number"
        />
        <Input 
            value={income.date}
            onChange={({target}) => handleChange("date", target.value)}
            label="Date"
            placeholder=""
            type="date"
        />

        <div className="flex justify-end mt-6">
            <button
                type="button"
                className="add-btn add-btn-fill"
                onClick={handleSubmit}
            >
                {initialData ? 'Update Income' : 'Add Income'}
            </button>
        </div>
    </div>
  )
}

export default AddIncomeForm