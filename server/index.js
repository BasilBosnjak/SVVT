import dotenv from "dotenv";
dotenv.config();
import databaseConnection from "./db.js";
import app from "./app.js";

databaseConnection();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
