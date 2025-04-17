import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import { Strategy as OAuthStrategy } from "passport-google-oauth2";
import jwt from "jsonwebtoken";

// Internal imports (adjust the paths if needed)
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userdb from "./models/User.js";

// Workaround for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());


connectDB();

//setup for session
app.use(session({
    secret:"e4d8aab3b6a0e2b114d5c76cb90d20cc54a39977746075609b28244acb00741b2021f63ea4b88598a457c2505640e85600587007386bdfaca9f0352b782405f0",
    resave:false,
    saveUninitialized: true
}));

//setup for passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuthStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://budgetbee-backend-p6tn.onrender.com/api/v1/auth/google/callback",
        scope: ["profile", "email"]
    },
    async(accessToken, refreshToken, profile, done) => {
        
        try{
            let user = await userdb.findOne({googleId: profile.id});

            if(!user){
                user = new userdb({
                    googleId: profile.id,
                     fullName: profile.displayName,
                     email: profile.emails[0].value,
                     profileImageUrl: profile.photos[0].value
                });
                await user.save();
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
        
            return done(null, user);
        }catch(error){
            return done(error, null);
        }
    }
)
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/uploads", express.static(path.join(__dirname,"uploads")));


// Set Content-Type header manually for .css files (Render sometimes misinterprets it)
app.use((req, res, next) => {
  if (req.url.endsWith(".css")) {
    res.setHeader("Content-Type", "text/css");
  }
  next();
});

// Serve frontend (React build)
app.use(express.static(path.join(__dirname, "..", "dist"))); // adjust if build folder is elsewhere

// Catch-all for React Router (e.g., /forgotpassword/:id/:token)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

