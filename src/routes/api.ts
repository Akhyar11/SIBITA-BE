import { Request, Response, Router } from "express";
import { syncUsers } from "../job/syncUsers";
import {
  adminRoleMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";
import { response200, response500 } from "../utils/response";
import usersController from "../controllers/admin/users.controller";

class Route {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware);
    this.router.post("/login", authController.login);

    this.dosenGroup();
    this.adminGroup();
  }

  private dosenGroup() {
    const dosenRouter = Router();
    this.router.use("/dosen", dosenRouter);
  }

  private adminGroup() {
    const adminRouter = Router();
    this.router.use("/admin", adminRouter);
    adminRouter.use(adminRoleMiddleware);

    adminRouter.get("/users", usersController.read);
    adminRouter.get("/users/:id", usersController.detail);
    adminRouter.post("/users", usersController.create);
    adminRouter.put("/users/:id", usersController.update);
    adminRouter.delete("/users/:id", usersController.delete);

    adminRouter.get("/sync/users", async (_: Request, res: Response) => {
      try {
        await syncUsers();
        return response200(res, { message: "berhasil sync user" });
      } catch (error) {
        console.log(error);
        return response500(res, { message: "server error" });
      }
    });
  }
}

export default new Route().router;
