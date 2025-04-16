const xlsx = require("xlsx");
const Income = require("../models/Income");

exports.addIncome = async(req,res) => {
    const userId = req.user.id;

    try{
        const {icon, source, description, amount, date} = req.body;

        if(!source || !amount || !date){
            return res.status(400).json({message:"All fields are required!"});
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            description,
            amount,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);
    }catch(error){
        res.status(500).json({message: "Server error"});
    }
}

exports.getAllIncome = async(req,res) => {
    const userId = req.user.id;

    try{
        const income = await Income.find({userId}).sort({date:-1});
        res.json(income);
    }catch(err){
        res.status(500).json({message: "Sever error"});
    }
}

exports.deleteIncome = async(req,res) => {

    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message:"Income successfully deleted!"});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
}

exports.downloadIncomeExcel = async(req,res) => {
    const userId = req.user.id;
    try{
        const income = await Income.find({userId}).sort({date: -1});

        const data = income.map((item) => ({
            Source: item.source,
            description: item.description,
            Amount: item.amount,
            Date: item.date
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download('income_details.xlsx');
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
}

exports.updateIncome = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;

    try {
        const { icon, source, description, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const income = await Income.findOne({ _id: incomeId, userId });

        if (!income) {
            return res.status(404).json({ message: "Income not found or not authorized" });
        }

        // Update fields
        income.icon = icon;
        income.source = source;
        income.description = description;
        income.amount = amount;
        income.date = new Date(date);

        await income.save();

        res.status(200).json({ message: "Income updated successfully!", income });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};