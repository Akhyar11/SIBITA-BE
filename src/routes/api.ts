import { Router } from "express";

class Route {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
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
  }
}

export default new Route().router;
