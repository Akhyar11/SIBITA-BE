import cron from "node-cron";
import express, { Application, Request, Response } from "express";
import Router from "./src/routes/api";
import cors from "cors";
import dotenv from "dotenv";
import { startJobsEveryMidNight } from "./src/job";

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

    this.app.get("/", this.defaultRoute);
    this.app.use("/api", Router);

    // cron every day at midnight
    cron.schedule("0 0 * * *", () => {
      console.log("Running a task every day at midnight");
      // Add your scheduled task logic here
      startJobsEveryMidNight();
    });
  }

  private defaultRoute(req: Request, res: Response) {
    res.send("Welcome to the API!, Sistem for Academic Information (SIBITA)");
  }

  public getApp(): Application {
    return this.app;
  }
}

// ✅ Ekspor Express app, bukan menjalankan server langsung
const server = new Server();
export default server.getApp();
