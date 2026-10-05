const pool = require("../config/db");
const bcrypt = require("bcrypt");
const {findUserByEmail , createUser} = require("../models/user.model")
const jwt = require("jsonwebtoken");

const signUp = async (req,res)=>{
    try{
        const {name,email,password,address} = req.body;

        const existingUser = await findUserByEmail(email);

        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"Eamil already resgistered"
            });
        }

        const hashPassword = await bcrypt.hash(password,10);

        const user = await createUser(
            name,
            email,
            hashPassword,
            address 
        );

        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user
        });
    }catch(error){
        console.error(error);

        res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect){
            return res.status(401).json({
                success:false,
                message:"Invalid password"
            })
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {   
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await findUserByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `UPDATE users
             SET password = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [hashedPassword, userId]
        );

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update password"
        });
    }
};

module.exports = {
    signUp,
    login,
    updatePassword
};