require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const OAuthStrategy = require("passport-google-oauth2").Strategy;
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userdb = require('./models/User');
const jwt = require("jsonwebtoken");



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

app.use(express.static(path.join(__dirname, '../frontend/expense-tracker/dist')));


app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

