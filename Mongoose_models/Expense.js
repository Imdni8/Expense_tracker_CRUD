const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    value: {
        type: Number,
        min: 0,
        required: true
    },
    expenseDate: {
        type: Date,
        required: true
    }
})

const Expense = mongoose.model("Expense", expenseSchema)

module.exports = Expense