import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register Controller
// export const register = async (req, res) => {
//   try {
//     console.log(req.body);

//     const { name, email, password, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "Email already registered" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     // Create token
//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(201).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Registration failed", error });
//   }
// };

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 👇 Return flag for frontend check
      return res.status(200).json({ userExist: true });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // 🪙 Create token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Send structured success response
    res.status(201).json({ userExist: false, data: { token } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const sendemailverificationcode = async (req, res) => {
  const { code, email } = req.body;

  console.log(req.body);

  console.log("req.body: ", req.body);

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sonu.mondal.2027@gmail.com",
      pass: "ghfs wdlk pkwd pjmg",
    },
  });

  console.log("transporter: ", transporter);

  // Setup email data
  let mailOptions = {
    from: "sonu.mondal.2027@gmail.com",
    to: email,
    subject: "Email Verification Code",
    text: `Welcome to task and project management website. Please, verify your email by entering the code. Your verification code is: ${code}`,
  };

  console.log("mailOptions: ", mailOptions);

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};
