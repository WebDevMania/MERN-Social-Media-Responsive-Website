const verifyToken = require('../middlewares/verifyToken')
const Post = require('../models/Post')
const User = require('../models/User')
const postController = require('express').Router()
const mongoose = require('mongoose')

// get user posts
postController.get('/find/userposts/:id', async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })

        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get timeline posts
postController.get('/timeline/posts', verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
        const posts = await Post.find({}).populate("user", '-password')
        const currentUserPosts = await Post.find({ user: currentUser._id }).populate("user", '-password')
        const friendsPosts = posts.filter((post) => {
            return currentUser.followings.includes(post.user._id)
        })

        let timelinePosts = currentUserPosts.concat(...friendsPosts)

        if (timelinePosts.length > 40) {
            timelinePosts = timelinePosts.slice(0, 40)
        }

        return res.status(200).json(timelinePosts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// get one
postController.get('/find/:id', async (req, res) => {
    try {
        let post = await Post.findById(req.params.id).populate("user", '-password')
        if (!post) {
            return res.status(500).json({ msg: "No such post with this id!" })
        } else {
            return res.status(200).json(post
            )
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// create
postController.post('/', verifyToken, async (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user.id)
        const newPost = await Post.create({ ...req.body, user: userId })

        return res.status(201).json(newPost)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// update
postController.put('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (post.user.toString() === req.user.id.toString()) {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id,
                { $set: req.body }, { new: true })
            return res.status(200).json(updatedPost)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// delete
postController.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', '-password')
        if (!post) {
            return res.status(500).json({ msg: "No such post" })
        } else if (post.user._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ msg: "You can delete only your own posts" })
        } else {
            await Post.findByIdAndDelete(req.params.id)
            return res.status(200).json({ msg: "Post is successfully deleted" })
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// like
postController.put('/toggleLike/:id', verifyToken, async(req, res) => {
    try {
        const currentUserId = req.user.id
        const post = await Post.findById(req.params.id)

        // if the user has already liked the post, remove it
        // Otherwise, add him into the likes array

        if(post.likes.includes(currentUserId)){
           post.likes = post.likes.filter((id) => id !== currentUserId)
           await post.save()
           return res.status(200).json({msg: "Successfully unliked the post"})
        } else {
           post.likes.push(currentUserId)
           await post.save()
           return res.status(200).json({msg: "Successfully liked the post"})
        } 

    } catch (error) {
        return res.status(500).json(error.message)
    }
})

module.exports = postController