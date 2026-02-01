import app from "./app";
import { AppDataSource } from "./data-source";
import { env } from "./config/env";

AppDataSource.initialize()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  })
  .catch(console.error);
