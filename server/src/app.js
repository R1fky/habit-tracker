import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import expressEjsLayouts from "express-ejs-layouts";

import passport from "./config/passport-google-jwt.js";
import authGoogleRoutes from "./routes/authGoogle.js";
// import cookieParser from "cookie-parser";
import cookieParser from "cookie-parser";

//auth Router
import authRoutes from "./routes/authRoute.js";
//landing Page Router
import landingRouter from "./routes/landingRoute.js";
//Habbit Route
import habitRouter from "./routes/habbitRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();
const app = express();

// Path Fixing
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// views engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

// layoyts
app.use(expressEjsLayouts);

// Static Files
app.use(express.static(path.join(__dirname, "../public")));

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// app.use(cookieParser());
// Passport init (tanpa session)
app.use(passport.initialize());

app.use("/", landingRouter);
app.use("/auth", authRoutes);
app.use("/habbit", habitRouter);
app.use("/authGoogle", authGoogleRoutes);
app.use("/user", userRoute);

// contoh protected route
// import { authenticateJWT } from "./middleware/authMiddleware.js";
// app.get("/protected", authenticateJWT, (req, res) => {
//   res.json({ success: true, message: "Akses berhasil", user: req.user });
// });

export default app;
