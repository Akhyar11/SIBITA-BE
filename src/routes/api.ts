import { Request, Response, Router } from "express";
import { syncUsers } from "../job/syncUsers";
import { authMiddleware } from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";

class Route {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.post("/login", authController.login);

    this.userGroup();
    this.adminGroup();
  }

  private userGroup() {
    const userRouter = Router();

    this.router.use("/user", userRouter);
  }

  private adminGroup() {
    const adminRouter = Router();
    this.router.use("/admin", adminRouter);

    adminRouter.get("/sync/users", async (_: Request, res: Response) => {
      try {
        await syncUsers();

        return res
          .status(200)
          .json({ status: true, message: "berhasil sync user" });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      }
    });
  }
}

export default new Route().router;
