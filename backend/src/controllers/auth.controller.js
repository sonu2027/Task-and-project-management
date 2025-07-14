import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ userExist: true });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ userExist: false, data: { token } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", error: true });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", error: true });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", error: true });
  }
};

export const sendemailverificationcode = async (req, res) => {
  const { code, email } = req.body;

  console.log(req.body);

  console.log("req.body: ", req.body);

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sonu.mondal.2027@gmail.com",
      pass: "ghfs wdlk pkwd pjmg",
    },
  });

  console.log("transporter: ", transporter);

  let mailOptions = {
    from: "sonu.mondal.2027@gmail.com",
    to: email,
    subject: "Email Verification Code",
    text: `Welcome to task and project management website. Please, verify your email by entering the code. Your verification code is: ${code}`,
  };

  console.log("mailOptions: ", mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};