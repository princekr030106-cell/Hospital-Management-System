require('dotenv').config();

const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const fileUpload =require ("express-fileupload");

const messageRouter= require ("./router/messageRouter.js");
const { errorMiddleware } =require("./middlewares/errorMiddleware.js");
const userRouter =require ("./router/userRouter.js");
const appointmentRouter =require ("./router/appointmentRouter.js");

const app = express();


const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
  ...(process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
      ]),
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


app.use("/api/v1/message", messageRouter);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/appointment", appointmentRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});



module.exports=app
