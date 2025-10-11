import express, { Application, Request, Response } from "express";
import Router from "./routes/api";
import cors from "cors";
import dotenv from "dotenv";

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
