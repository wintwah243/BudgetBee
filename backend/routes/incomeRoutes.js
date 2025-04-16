const express = require("express");

const {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadIncomeExcel,
    updateIncome
} = require("../controllers/incomeController");

const {protect} = require("../middleware/authMiddleware");
const { model } = require("mongoose");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);
router.delete("/:id", protect, deleteIncome);
router.put("/update/:id", protect, updateIncome);

module.exports = router;

