//importing packages
const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require("method-override") //for executing HTTP functions other than GET and POST
const path = require("path") //for setting views directory only
require("dotenv").config()

const app = express()

//setting views to ejs engine
app.set("view engine", "ejs")

//setting up view directory
app.set("views", path.join(__dirname, "/views"))

//express data parsing middlewares
app.use(express.urlencoded({ extended: true }))

//method overriding using string query
app.use(methodOverride('_method'))

//mongo atlas link
const dburl = process.env.db_URL
//"mongodb://localhost/expenseApp"

//connecting mongoose
mongoose.connect(dburl)
.then(() => {
	console.log("Connection to expense app open")
}).catch((err) => {
	console.log(err)
})

//importing mongoose model
const Expense = require("./Mongoose_models/Expense")

//setting up port
const port = process.env.PORT || 3000

const baseURL = process.env.RENDER_URL || 'http://localhost:3000'; // Use localhost for local dev
app.locals.baseURL = baseURL // setting baseURL as a local variable for this project


//opening port
app.listen(port, () => {
    console.log("MSW_Expense CRUD app is live at " + port)
})

//------// Routes //------//

//home - transactions with month filtering
app.get("/expenses", async (req, res) => {
    // Get month and year from query params, default to current month
    const now = new Date()
    const selectedMonth = parseInt(req.query.month) || now.getMonth()
    const selectedYear = parseInt(req.query.year) || now.getFullYear()

    // Create date range for the selected month
    const startDate = new Date(selectedYear, selectedMonth, 1)
    const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59)

    // Query expenses for the selected month
    const expenses = await Expense.find({
        expenseDate: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ expenseDate: -1 })

    // Calculate monthly total
    const monthlyTotal = expenses.reduce((sum, expense) => sum + expense.value, 0)

    res.render("expenses.ejs", {
        expenses,
        monthlyTotal,
        selectedMonth,
        selectedYear
    })
})

//add new expense form
app.get("/addexpense", (req, res) => {
    res.render("newexpense.ejs")
})

//Create new expense in DB based on form input
app.post("/addexpense", async (req, res) => {
    const { value, expenseDate, gnw, category, description } = req.body

    // Prepare expense data
    const expenseData = {
        value: value,
        expenseDate: expenseDate || new Date(),
        gnw: gnw || 'Need',
        category: category || null,
        description: description || null
    }

    const newExpense = new Expense(expenseData)
    await newExpense.save()
    res.redirect(`${baseURL}/expenses`)
})

//expense details page
app.get("/expenses/:id", async (req, res) => {
    const { id } = req.params
    const foundExpense = await Expense.findById(id)
    res.render("expenseDetails.ejs", { foundExpense })
})

//update an expense - form
app.get("/expenses/:id/edit", async (req, res) => {
    const { id } = req.params
    const foundExpense = await Expense.findById(id)
    res.render("editExpense.ejs", { foundExpense })
})

//update in DB
app.patch("/expenses/:id", async (req, res) => {
    const { id } = req.params
    const { value, expenseDate, gnw, category, description } = req.body

    // Prepare update data
    const updateData = {
        value: value,
        expenseDate: expenseDate || new Date(),
        gnw: gnw || 'Need',
        category: category || null,
        description: description || null
    }

    await Expense.findByIdAndUpdate(id, updateData)
    res.redirect(`${baseURL}/expenses`)
})

//delete an expense
app.delete("/expenses/:id", async (req, res) => {
    const { id } = req.params
    await Expense.findByIdAndDelete(id)
    res.redirect("/expenses")
})

//analytics page with data aggregations and custom date range
app.get("/analytics", async (req, res) => {
    const now = new Date()

    // Get custom date range from query params or default to current month
    let startDate, endDate

    if (req.query.startDate && req.query.endDate) {
        // Custom date range provided
        startDate = new Date(req.query.startDate)
        startDate.setHours(0, 0, 0, 0)

        endDate = new Date(req.query.endDate)
        endDate.setHours(23, 59, 59, 999)
    } else {
        // Default to current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    }

    // Format dates for display and form population
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]

    // Get all expenses for the date range
    const expenses = await Expense.find({
        expenseDate: {
            $gte: startDate,
            $lte: endDate
        }
    })

    // Calculate total
    const monthlyTotal = expenses.reduce((sum, expense) => sum + expense.value, 0)

    // Aggregate by category
    const categoryBreakdown = await Expense.aggregate([
        {
            $match: {
                expenseDate: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: { $ifNull: ["$category", "Untagged"] },
                total: { $sum: "$value" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { total: -1 }
        }
    ])

    // Aggregate by GNW
    const gnwBreakdown = await Expense.aggregate([
        {
            $match: {
                expenseDate: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: "$gnw",
                total: { $sum: "$value" },
                count: { $sum: 1 }
            }
        }
    ])

    // Convert GNW array to object for easier access
    const gnwData = {
        Goal: gnwBreakdown.find(g => g._id === 'Goal') || { total: 0, count: 0 },
        Need: gnwBreakdown.find(g => g._id === 'Need') || { total: 0, count: 0 },
        Want: gnwBreakdown.find(g => g._id === 'Want') || { total: 0, count: 0 }
    }

    res.render("analytics.ejs", {
        monthlyTotal,
        categoryBreakdown,
        gnwData,
        startDateStr,
        endDateStr
    })
})