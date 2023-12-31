const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Routes
// GET/Home
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDB."
        }

        // show 10 datas in a page
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }
});

// GET/Post:id 
router.get('/post/:id', async (req, res) => {
    try {
        let id = req.params.id; // get the id from '/post/:id'
        const data = await Post.findById(id); // or findById({ _id: id })
        const locals = {
            title: data.title,
            description: 'Simple Blog created with NodeJs, Express & MongoDb.'
        };
        res.render('post', {
            locals,
            data
        });
    } catch (error) {
        console.log(error)
    }
});

// POST/(Post-searchTerm)
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: 'Search'
        };
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/, "");
        const data = await Post.find({
            $or: [  // to search title or body
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        });
        res.render('search', { data, locals });
    } catch (error) {
        console.log(error)
    }
});

router.get('/about', (req, res) => {
    res.render('about');
})

module.exports = router;

// test the connection between server and database
/* function insertPostData() {
    Post.insertMany([
        {
            title: "Building a blog",
            body: "This is the body text"
        },
    ])
}

insertPostData(); */