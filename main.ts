import { exec } from "child_process";

(async () => {
  if (process.env.RUN_MIGRATION === "true") {
    await new Promise<void>((resolve, reject) => {
      exec(
        "npx sequelize-cli db:create && npx sequelize-cli db:migrate",
        (err, stdout, stderr) => {
          if (err) console.error(err);
          console.log(stdout);
          resolve();
        }
      );
    });
  }
})();

import { Server } from "./main-dev";

// ✅ Ekspor Express app, bukan menjalankan server langsung
const server = new Server();
export default server.getApp();
