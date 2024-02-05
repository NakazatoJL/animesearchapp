import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.get("/", (req, res) =>{
    res.render("index.ejs");
});

app.get("/about", (req, res) =>{
    res.render("about.ejs");
});

app.get("/faq", (req, res) =>{
    res.render("faq.ejs");
});

app.listen(port, ()=>{
    console.log(`App is listening to port ${port}`);
});