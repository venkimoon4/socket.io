require("dotenv/config.js");
const express = require("express");
const http = require("http");
const db = require("./db.js");
const _ = require("lodash");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const Users = require("./models/user.js");

const io = new Server(server);

app.get("/", async (req, res) => {
  res.send("Hi Server is Working : )");
});

app.get("/sse-realtime-kyc-status/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders();

    const findUser = await Users.findOne({ userId });

    res.write(
      `data: ${JSON.stringify({
        kycStatus: !_.isEmpty(findUser) ? findUser?.kycStatus : false,
      })}\n\n`
    );

    const pipeLine = [
      {
        $match: {
          "fullDocument.userId": userId,
        },
      },
    ];

    const changeStream = Users.watch(pipeLine, {
      fullDocument: "updateLookup",
    });

    changeStream.on("change", (change) => {
      let kycStatus = change.fullDocument?.kycStatus;
      res.write(`data: ${JSON.stringify({ kycStatus })}\n\n`);
    });

    changeStream.on("error", (error) => {
      logger.error(`Error in changeStream (error): ${error.message}`, {
        error: error.message,
      });
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    });

    req.on("close", () => {
      changeStream.close();
      res.end();
    });
  } catch (error) {
    console.log("Error in kyc realtime event", error.message);
    res.status(500).end();
  }
});

io.on("connection", (socket) => {
  console.log("Connected to Socket Successfully", socket.id);

  socket.on("kyc-status", async (data) => {
    const findUser = await Users.findOne({ userId: data.userId });

    socket.emit("kyc-status", {
      kycStatus: findUser.kycStatus,
    });

    const pipeLine = [
      {
        $match: {
          "fullDocument.userId": data.userId,
        },
      },
    ];

    const changeStream = Users.watch(pipeLine, {
      fullDocument: "updateLookup",
    });

    changeStream.on("change", (change) => {
      let kycStatus = change.fullDocument?.kycStatus;
      socket.emit("kyc-status", {
        kycStatus: kycStatus,
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`Listening to Port 4000`);
});
