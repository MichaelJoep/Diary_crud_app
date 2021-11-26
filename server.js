const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const app = express();

const Port = process.env.PORT || 3008;


// Set template for ejs
app.set("view engine", "ejs");

//Static files
app.use(express.static('public'));


//BodyParser Middleware

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

// middleware for method-override
app.use(methodOverride('_method'))

//database url
const url = 'mongodb+srv://admin:admin1234Mp@cluster0.t6hv7.mongodb.net/DiaryDB?retryWrites=true&w=majority';

//connecting application to database
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Mongo DB Connected Successfully"))
    .catch(err => console.log(err));

//Import Diary Model
const Diary = require('./models/Diary');
//ROUTING


//Route for /

app.get('/', (req, res)=> {
    res.render("Home")
});

//Route for about Page
app.get('/about', (req, res)=> {
    res.render("About")
})

//Route for Diary Page
app.get('/diary', (req, res)=> {
    Diary.find().then(data=>{
        res.render("Diary", {data:data})
    }).catch(err=> console.log(err));
    
})

//Route for displaying data
app.get('/diary/:id', (req, res)=>{
    Diary.findOne({
        _id:req.params.id
    }).then(data =>{
        res.render('Page', {data: data})
    }).catch(err => console.log(err));
})
//Route for edit page
app.get('/diary/edit/:id', (req, res)=> {
    Diary.findOne({
        _id:req.params.id
    }).then(data => {
        res.render('Edit', {data: data})
    }).catch(err => console.log(err))
})

// Edit Data
app.put('/diary/edit/:id', (req, res)=> {
    Diary.findOne({
        _id:req.params.id
    }).then(data => {
        data.title = req.body.title
        data.description = req.body.description
        data.date = req.body.date

        data.save().then(()=>{
            res.redirect('/diary')
        }).catch(err => console.log(err));

    }).catch(err => console.log(err));
})

//Route for Page Add
app.get('/add', (req, res)=> {
    res.render("Add")
})

//Route for Page Saving Diary
app.post('/add-to-diary', (req, res)=> {
    // save data on the database
    const Data = new Diary({
        title:req.body.title,
        description:req.body.description,
        date:req.body.date
    })
    
    Data.save().then(()=> {
        res.redirect('/diary');
    }).catch(err => console.log(err))
    
})
// Delete from database
app.delete('/diary/delete/:id', (req, res)=> {
    Diary.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
})


app.listen(Port, () => {
    console.log(`server is running on http://localhost:${Port}`)
})