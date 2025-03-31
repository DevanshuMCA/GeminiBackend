import morgan from "morgan"
import express from "express"
import connect from "./db/db.js"
import userRoutes from "./routes/user.routes.js"
import cookieParser from "cookie-parser"
import projectRoutes from "../backend/routes/project.routes.js"
import aiRoutes from "../backend/routes/ai.routes.js"
import cors from "cors"
import chatRoutes from "./routes/chat.routes.js"
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
connect()
app.use("/",(req,res)=>{
    res.json("thisoagige")
})
app.use('/users',userRoutes)
app.use('/projects',projectRoutes)
app.use('/ai',aiRoutes)
app.use('/chat',chatRoutes)
export default app;