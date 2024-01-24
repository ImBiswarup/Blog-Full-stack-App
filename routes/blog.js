const { Router } = require("express");

const multer = require("multer");

const path = require('path');

const Blog = require("../models/blogs")

const Comment = require("../models/comment")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`));
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
    console.log(req.body);
    console.log(req.file);
    const { title, body } = req.body;

    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });

    // console.log(blog);
    // console.log(req.file.filename)

    return res.redirect("/");
});

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const allComments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    // console.log(allComments); 
    return res.render("blog", {
        user: req.user,
        blog,
        allComments,
    });
});


router.post("/comment/:blogId", async (req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    res.redirect(`/blog/${req.params.blogId}`);
});




module.exports = router;