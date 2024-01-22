const { Router } = require("express");

const multer = require("multer");

const path = require('path');

const Blog = require("../models/blogs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/images/uploads`));
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });


const router = Router();

router.get("/add-new-blog", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

router.post("/", upload.single("coverImageURL"), async (req, res) => {
    // console.log(req.body);
    console.log(req.file);
    const { title, body } = req.body;

    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        // coverImageURL: `.uploads/${req.file.filename}`,
        coverImageURL: `./uploads/${req.file.filename}`,

    });

    console.log(blog);
    console.log(req.file.filename)

    return res.redirect(`/blog/${blog._id}`);
});



module.exports = router;