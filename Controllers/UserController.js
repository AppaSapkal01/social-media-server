import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';

// get a User
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);

        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json("No such user exists")
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// update a user 
export const updateUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {

            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied!")
    }
}

// Delete user 
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus } = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully.")
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied! You can only delete your own account.")
    }

}

// Follow a User
export const followUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId } = req.body;

    // this condition check, if user is trying to follow himself. i.e not possible.
    if (currentUserId === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {

            // this is the user which we want to follow
            const followUser = await UserModel.findById(id);

            // this is the user who wants to follow other user
            const followingUser = await UserModel.findById(currentUserId);

            // (this if condition checks whether user we want to follow,
            // in its following we shouldn't be present. 
            // i.e we can't follow a person whom we are already following)
            if (!followUser.followers.includes(currentUserId)) {

                // here we are pushing follower into the person's followers list.
                await followUser.updateOne({ $push: { followers: currentUserId } });

                // here when user follows other user, we are updating his following list.
                await followingUser.updateOne({ $push: { following: id } });

                res.status(200).json("User followed!");

            } else {
                res.status(403).json("User is already followed by you")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

// Unfollow a User
export const unfollowUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId } = req.body;

    // this condition check, if user is trying to unfollow himself. i.e not possible.
    if (currentUserId === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {

            // this is the user which we want to unfollow
            const followUser = await UserModel.findById(id);

            // this is the user who wants to unfollow other user
            const followingUser = await UserModel.findById(currentUserId);

            // (this if condition checks whether user we want to unfollow,
            // in its following we should be present. 
            // i.e we can't unfollow a person whom we aren't following)
            if (followUser.followers.includes(currentUserId)) {

                // here we are pulling(removing) follower from the person's followers list.
                await followUser.updateOne({ $pull: { followers: currentUserId } });

                // here when user unfollows other user, we are updating his following list (reducing following count).
                await followingUser.updateOne({ $pull: { following: id } });

                res.status(200).json("User unfollowed!");

            } else {
                res.status(403).json("User is not followed by you")
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}