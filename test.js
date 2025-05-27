const Users = require("./models/user");

const createUser = async (req, res) => {
  try {
    await Users.create({
      firstName: "Venkatesh",
      lastName: "S M",
      userId: "USER01",
      email: "venkimoon4@gmail.com",
      mobileNumber: "+919353221738",
      kycStatus: "PENDING",
      accountStatus: "ACTIVE",
      paymentStatus: "INACTIVE",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

createUser();
