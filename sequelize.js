const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const BlogModel = require('./models/blog');
const TagModel = require('./models/tag');

const sequelize = new Sequelize('firstRun', 'honda92', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const User = UserModel(sequelize, Sequelize);
const BlogTag = sequelize.define('blog_tag', {});
const Blog = BlogModel(sequelize, Sequelize);
const Tag = TagModel(sequelize, Sequelize);

Blog.belongsToMany(Tag, { through: BlogTag, unique: false });
Tag.belongsToMany(Blog, { through: BlogTag, unique: false });
Blog.belongsTo(User);

// `force: true` cleares the db upon startup and creates brand new db and tables
sequelize.sync({ force: true })
    .then(() => {
        console.log(`Database & tables created.`);
    });

module.exports = {
    User, Blog, Tag
};
