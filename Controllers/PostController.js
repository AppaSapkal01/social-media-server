import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";

// Create new Post
export const createPost = async (req, res) => {

    //creating a new instance of PostModel i.e newPost
    const newPost = new PostModel(req.body);

    try {

        //saves the newPost document(i.e instance of PostModel) in MongoDB collection
        await newPost.save();
        res.status(200).json("Post created")
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get a post

export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Update a post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        // Find the post by its ID
        const post = await PostModel.findById(postId);

        // Check if the post belongs to the user who is trying to update it
        if (post.userId === userId) {

            // If the post belongs to the user, update it with the data from the request body
            await post.updateOne({ $set: req.body });

            res.status(200).json("Post Updated");

        } else {

            res.status(403).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Delete a post 
export const deletePost = async (req, res) => {
    const postId = req.params.id;

    const { userId } = req.body;

    try {
        // Find the post by its ID
        const post = await PostModel.findById(postId);

        // Check if the post belongs to the user who is trying to delete it
        if (post.userId === userId) {

            // If the post belongs to the user, delete it from the database
            await post.deleteOne();

            res.status(200).json("Post deleted sucessfully")

        } else {
            // If the post doesn't belong to the user, respond with a forbidden status code
            res.status(403).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// Likes/dislike a post
export const likePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId);

        if (!post.likes.includes(userId)) {
            // If the user has not already liked the post, like it by adding the user ID to the 'likes' array
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Post liked");
        } else {
            // If the user has already liked the post, unlike it by removing the user ID from the 'likes' array
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Post unliked");
        }

    } catch (error) {
        res.status(403).json("Action forbidden");
    }
};