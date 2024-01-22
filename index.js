const express = require('express')
const path = require("path")
const app = express()
const port = 4000
const mongoose = require("mongoose");

const cookieParser = require('cookie-parser');


const userRoute = require("./routes/user");
const { checkForAuthenticationCookies } = require('./middlewares/authentication');

mongoose.connect("mongodb://127.0.0.1:27017/blogistan")
    .then(() => {
        console.log("DB Connected...");
    });

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));

app.use("/user", userRoute);

app.get("/", (req, res) => {
    return res.render("index", {
        user: req.user,
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!!!`))
