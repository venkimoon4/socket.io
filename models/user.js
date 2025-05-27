const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    kycStatus: {
      type: String,
      enum: ["PENDING", "MIN-KYC", "FULL-KYC"],
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      required: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;
