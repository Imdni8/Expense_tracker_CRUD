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

//home
app.get("/expenses", async (req, res) => {
    const expenses = await Expense.find()
    // console.log(expenses)
    res.render("expenses.ejs", { expenses })
})

//add new expense form
app.get("/addexpense", (req, res) => {
    res.render("newexpense.ejs")
})

//Create new expense in DB based on form input
app.post("/addexpense", (req, res) => {
    // console.log(req.body)
    const { value, expenseDate } = req.body
    if (expenseDate) {
        const newExpense = Expense(req.body)
        newExpense.save()
    } else {
        const todaysDate = new Date().toLocaleDateString()
        const newExpense = Expense({ value: value, expenseDate: todaysDate })
        newExpense.save()
    }
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
    const { value, expenseDate } = req.body
    if (value && expenseDate) {
        const editedExpense = await Expense.findByIdAndUpdate(id, req.body)
        res.redirect("/expenses")
    } else if (value) {
        const todaysDate = new Date().toLocaleDateString()
        const editedExpense = await Expense.findByIdAndUpdate(id, { value: value, expenseDate: todaysDate })
        res.redirect("/expenses")
    }
})

//delete an expense
app.delete("/expenses/:id", async (req, res) => {
    const { id } = req.params
    await Expense.findByIdAndDelete(id)
    res.redirect("/expenses")
})

//analytics page
app.get("/analytics", (req, res) => {
    res.render("analytics.ejs")
})