// import User from "../models/user.model.js";

// export const getAllUsers = async (req, res) => {
//   try {
//     // 🛡️ Only allow admin to access user list
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const users = await User.find({}, "name email role"); // only send necessary fields
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("getAllUsers Error:", error);
//     res.status(500).json({ message: "Failed to fetch users", error });
//   }
// };

import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    // 🔒 Ensure only admin can fetch user list
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🎯 Fetch only users with role "user"
    const users = await User.find({ role: "user" }, "name email role");

    res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers Error:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};
