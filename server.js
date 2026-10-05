const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const {authenticate , authorize} = require("./middleware/auth.middleware");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const ratingRoutes = require("./routes/rating.routes");
const ownerRoutes = require("./routes/owner.routes");

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"Store rating app is running"
    });
});

app.get("/db-test",async (req,res)=>{
    try{
        const result = await pool.query("SELECT NOW()");
        res.json({
            success:true,
            message:"Database connected successfully",
            time:result.rows[0].now,
        });
    }catch(error){
        console.error(error);
        res.json({
            success:false,
            message:"Database Connection failed"
        });
    }
});

app.get("/api/protected", authenticate, (req, res) => {
    res.json({
        success: true,
        message: "You accessed a protected route",
        user: req.user
    });
});


app.get("/api/admin-test",authenticate,authorize("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Admin access granted",
            user: req.user
        });
    }
);

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});