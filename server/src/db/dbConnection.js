import { connect } from "mongoose";

const dbConnection = async () => {
  try {
    await connect(process.env.DB_URI);

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

export default dbConnection;
