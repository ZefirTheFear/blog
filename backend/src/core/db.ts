import mongoose from "mongoose";

const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-zygzu.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`;

// const dbConnection = mongoose.connection;
// dbConnection.on("error", console.error.bind(console, "connection error"));
// dbConnection.once("open", () => console.log("MongoDb connected"));

// mongoose
//   .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//   .then(() => console.log("MongoDb initial connected"))
//   .catch((error) => console.log("db initial connection error", error));

// export { dbConnection };

mongoose.connection.on("connected", () => {
  console.log("DB Connection Established");
});

mongoose.connection.on("reconnected", () => {
  console.log("DB Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
  console.log("DB Connection Disconnected");
});

mongoose.connection.on("error", (error) => {
  console.log("DB Connection ERROR: " + error);
});

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("DB initial connected");
  } catch (error) {
    console.log("DB initial connection error", error);
  }
};
