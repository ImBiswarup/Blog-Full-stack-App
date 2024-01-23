const express = require('express')
const app = express()
const port = 4000
const path = require("path")
const mongoose = require("mongoose");

const cookieParser = require('cookie-parser');

const Blogs = require("./models/blogs");
const Comment = require('./models/comment');


const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

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
app.use(express.static(path.resolve("./public")));



app.use("/user", userRoute);
app.use("/blog", blogRoute);


app.get("/", async (req, res) => {
    const allBlogs = await Blogs.find({}).sort("createdAt");
    return res.render("index", {
        user: req.user,
        blogs: allBlogs,
    });
});



app.listen(port, () => console.log(`Example app listening on port ${port}`))
