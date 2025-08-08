import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import expressEjsLayouts from "express-ejs-layouts";
//routing/router

//auth Router
import authRoutes from "./routes/authRoute.js";
//landing Page Router
import landingRouter from './routes/landingRoute.js'
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


app.use('/', landingRouter)
app.use("/auth", authRoutes);

export default app;
