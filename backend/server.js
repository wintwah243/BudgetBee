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

//frontendကbackendနဲ့ မတူညီတဲ့ ​portမှာရှိေနတဲ့အတွက် block requestေတွမဖြစ်ရအောင် corsကိုသုံးပေးရမယ်
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
//A session allows the server to remember a user between different requests eg:login/logout
app.use(session({
    secret:process.env.SESSION_SECRET, //ဒါမရှိရင် sessionက secureမဖြစ်ဘူး
    resave:false, //this tells the server not to save the session again to the store if it hasn’t changed
    saveUninitialized: true //this tells the server to save a new session to the store, even if it hasn’t been modified yet
}));

//setup for passport
//ဒါမရှိရင်passportကအလုပ်လုပ်မှာမဟူတ်ဘူး
app.use(passport.initialize()); //passportရဲ့functionalitiesတေွ ကိုexpress appထဲaddလိုက်လုပ်မယ်
app.use(passport.session()); //သူကexpress-sessionနဲ့passportနဲ့ကိုပေါင်းစပ်ပေးတယ်

//This tells Passport to use a new Google OAuth strategy
passport.use(
    //This object sets up how the Google login works
    new OAuthStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://budgetbee-backend-p6tn.onrender.com/api/v1/auth/google/callback", //this is to know where to redirect after login
        scope: ["profile", "email"] //Ask Google for user’s profile and email
    },
    //Googleဘက်ကuserကိုauthenticateလုပ်ပြီးပြီဆိုရင်ဒီfunctionကိုrunမယ်
    async(accessToken, refreshToken, profile, done) => {
        try{
            //userကdbထဲမှာရှိပြီးသားလားဆိုတာကိုgoogle idနဲ့တိုက်စစ်မယ်
            let user = await userdb.findOne({googleId: profile.id});
            //dbထဲမှာuserမရှိဘူးဆိုအသစ်createလုပ်မယ်
            if(!user){
                user = new userdb({
                     googleId: profile.id,
                     fullName: profile.displayName,
                     email: profile.emails[0].value,
                     profileImageUrl: profile.photos[0].value
                });
                await user.save(); //createလုပ်ပြီးdbထဲသိမ်းမယ်
            }
            //login userအတွက်jwt tokenတစ်ခုcreateလုပ်မယ်
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
            //This tells Passport to finish the process
            return done(null, user);
        }catch(error){
            return done(error, null);
        }
    }
)
);

// serializeUserကိုloginဝင်ပြီးရင်runပြီး 
// deserializeUserကိုuser requestလုပ်တိုင်းrunမယ်

//After a successful login, Passport runs this function
//user loginဝင်ပြီးတာနဲ့ user objကိုsessionထဲသိမ်းပေးတယ်
passport.serializeUser((user, done) => {
    done(null, user);
});

//When a user sends a request, Passport uses this function to restore the user object from session data
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/uploads", express.static(path.join(__dirname,"uploads")));//user image uploadဖို့အတွက်


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
