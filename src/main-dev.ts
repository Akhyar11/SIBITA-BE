import express, { Application } from "express";
import Router from "./routes/api";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import { startJobsEveryMidNight } from "./job";

class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    dotenv.config();
    this.app.use(cors());
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ limit: "10mb", extended: true }));

    this.app.use("/api", Router);
  }

  public start(): void {
    const PORT = process.env.PORT || 3000;

    // cron every day at midnight
    cron.schedule("0 0 * * *", () => {
      console.log("Running a task every day at midnight");
      // Add your scheduled task logic here
      startJobsEveryMidNight();
    });

    this.app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

const server = new Server();
server.start();
