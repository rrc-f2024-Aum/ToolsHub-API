import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import morgan from "morgan";
import toolRoutes from "../src/api/v1/routes/toolRoutes";
import rentalRoutes from "../src/api/v1/routes/rentalRoutes";
import setupSwagger from "../src/config/swagger";

const app = express();

app.use(morgan("combined"));
app.use(express.json());

setupSwagger(app);

app.use("/api/v1", toolRoutes);
app.use("/api/v1", rentalRoutes);

export default app;