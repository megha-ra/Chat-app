import User from "../models/user.model.js"
import bcrypt from "bcryptjs" //Import bcrypt for password hashing
import { generateToken } from "../lib/utilis.js";
import cloudinary from "../lib/cloudinary.js"; // Import cloudinary for image uploads

//Controller for user signup
export const signup = async (req, res) => {
    const {fullName, email, password} = req.body; 
    try {
        //Check if password is atleast 6 characters long
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All feilds are required"})
        }
        if(password.length < 6){ 
            return res.status(400).json({message: "Password must be at least 6 characters"}); //Invalid input
        }

        //Check if a user with the given email already exists
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message: "Email already exists"});

        //Generate the salt for hashing the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }else{
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
         console.log("Error in signup controller", error.message);
         res.status(500).json({message: "Internal Server Error"});
    }
};

//Controller for user login
//This function checks if the user exists and if the password is correct
export const login = async(req, res) => {
    const { email, password} = req.body
    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Wrong Password"});
        }
        
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
        
    }
};

//Controller for user logout
//This function clears the JWT cookie to log the user out
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully."});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

//Controller for updating user profile
export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // Get user ID from the request object     

        if(!profilePic) {
            return res.status(400).json({message: "Profile picture is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId, {profilePic: uploadResponse.secure_url},
            {new: true} // Return the updated user document
        );

        if(!updatedUser) {  // Check if the user was found and updated
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({ // Return the updated user data
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
        });
        
    } catch (error) { // Handle any errors that occur during the update process
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({message: "Internal Server Error"});  
    }
}

//Controller to check if the user is authenticated
export const checkAuth = (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from the request object
        if(!userId) {
        return res.status(401).json({message: "Unauthorized"});
        }
        res.status(200).json({message: "User is authenticated"});
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
};