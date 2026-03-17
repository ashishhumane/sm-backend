import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes" 
import authRoutes from "./routes/auth.routes" 
import postRoutes from "./routes/post.routes"; 
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/post', postRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});