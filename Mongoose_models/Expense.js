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
    },
    category: {
        type: String,
        required: false,
        enum: [
            'Groceries',
            'Transport',
            'Entertainment',
            'Bills & Utilities',
            'Shopping',
            'Food & Dining',
            'Health & Fitness',
            'Home & Garden',
            'Travel',
            'Education',
            'Work',
            'Gifts',
            'Subscriptions',
            'Other',
            null
        ]
    },
    gnw: {
        type: String,
        required: true,
        enum: ['Goal', 'Need', 'Want'],
        default: 'Need'
    },
    description: {
        type: String,
        required: false
    }
})

const Expense = mongoose.model("Expense", expenseSchema)

module.exports = Expense