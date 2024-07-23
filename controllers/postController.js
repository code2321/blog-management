const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;
    const post = await Post.create({ title, content, userId });
    res.status(201).json({ message: 'Post created successfully', post });
};

exports.getPosts = async (req, res) => {
    const posts = await Post.findAll({ include: User });
    res.json(posts);
};

exports.getPost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findOne({ where: { id }, include: [User, Comment] });
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
};

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = await Post.findByPk(id);
    if (post.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    await post.update({ title, content });
    res.json({ message: 'Post updated successfully', post });
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (post.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
};
