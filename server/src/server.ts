import { app } from "./app";

const PORT = process.env.APP_PORT || 8000;

const StartServer = async () => {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    console.error(err);
    process.exit(1);
  });
};

StartServer().catch((err) => console.log(err));
