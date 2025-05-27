const mongoose = require("mongoose");
const dburl =
  "mongodb+srv://tharun:6ql745PyVt6NdEky@tharun.aj1bq8s.mongodb.net/socketio?retryWrites=true&w=majority&appName=tharun";

mongoose.connect(dburl);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB Server");
});
