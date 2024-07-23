const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

exports.addComment = async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.id;
    const comment = await Comment.create({ postId, userId, content });
    res.status(201).json({ message: 'Comment added successfully', comment });
};

exports.getComments = async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.findAll({ where: { postId }, include: User });
    res.json(comments);
};

exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByPk(id);
    if (comment.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    await comment.update({ content });
    res.json({ message: 'Comment updated successfully', comment });
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (comment.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
};