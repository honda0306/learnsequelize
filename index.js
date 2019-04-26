const express = require('express');
const bodyParser = require('body-parser');

const { User, Blog, Tag } = require('./sequelize');

const app = express();
app.use(bodyParser.json());

// Retrieve all users
app.get('/api/users', (req, res) => {
    User.findAll()
        .then(users => res.json(users));
});

// Retrieve blog by ID
app.get('/api/blogs/:userId?', (req, res) => {
    let query;
    if(req.params.userId) {
        query = Blog.findAll({ include: [
            { model: User, where: { id: req.params.userId} },
            { model: Tag }
        ]})
    } else {
        query = Blog.findAll({ include: [Tag, User]})
    }
    return query.then(blogs => res.json(blogs));
});

// Create user
app.post('/api/users', (req, res) => {
    User.create(req.body)
        .then(user => res.json(user));
});

// Create a blog post
app.post('/api/blogs', (req, res) => {
    const body = req.body;
    const tags = body.tags.map(tag => Tag.findOrCreate({ where: { name: tag.name }, defaults: { name: tag.name }})
        .spread((tag, created) => tag));

    User.findById(body.userId)
        .then(() => Blog.create(body))
        .then(blog => Promise.all(tags).then(storedTags => blog.addTags(storedTags)).then(() => blog))
        .then(blog => Blog.findOne({ where: {id: blog.id}, include: [User, Tag]}))
        .then(blogWithAssociations => res.json(blogWithAssociations))
        .catch(err => res.status(400).json({ err: `User with id = [${body.userId}] doesn\'t exist.`}))
});

const port = 3000;

app.listen(port, () => {
    console.log(`Running on localhost:${port}`);
});
