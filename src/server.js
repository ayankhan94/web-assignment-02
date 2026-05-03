const dotenv = require("dotenv");
const app = require("./app");
const AppDataSource = require("./config/data-source");

dotenv.config();

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed");
    console.log(error);
  });