import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (Object.keys(req.body).length === 0) {
      throw new HttpError(400, "Body must have at least one field");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (Object.keys(req.body).length === 0) {
      throw new HttpError(400, "Body must have at least one field");
    }

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({ email, subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const allowedSubscriptions = ["starter", "pro", "business"];

    if (!allowedSubscriptions.includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription value" });
    }

    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { register, login, logout, getCurrentUser, updateUserSubscription };
