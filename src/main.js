import cors from "cors";
import express from "express";
import helmet from "helmet";
import { PORT } from "./config/config.js";
import { dbConnection } from "./DB/connection.db.js";
import globalErrMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notfound.middleware.js";
import authController from "./module/auth/auth.controller.js";
import messageController from "./module/message/message.controller.js";
import userController from "./module/user/user.controller.js";
import rateLimit from "express-rate-limit";

async function bootstrap() {
  const app = express();

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  });

  app.use(
    helmet(),
    cors({
      origin: function (requestOrigin, cb) {
        // if (!requestOrigin) {
        //   cb(
        //     new Error("You Can't use Testing Tool", {
        //       cause: { statusCode: 400 },
        //     }),
        //   );
        //   return;
        // }

        cb(null, ["http://localhost:4200"]);
      },
    }),
    limiter,
  );

  await dbConnection();

  app.use(express.json());

  app.use("/assets", express.static("./assets"));

  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/message", messageController);

  app.all("{/*dummy}", notFoundMiddleware);

  app.use(globalErrMiddleware);

  app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
}

bootstrap();
