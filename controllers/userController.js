import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка, чи існує вже користувач з такою поштою
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
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

    // Пошук користувача за email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Перевірка пароля
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // Генерація JWT токена
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
    // Видаліть токен користувача з об'єкта req
    req.user.token = null;
    await req.user.save();

    // Поверніть успішну відповідь з статусом 204 (No Content)
    res.status(204).end();
  } catch (error) {
    // В разі помилки поверніть статус 500 та повідомлення про помилку
    res.status(500).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Отримати дані користувача з об'єкта req, який був доданий під час аутентифікації
    const { email, subscription } = req.user;

    // Повернути дані поточного користувача у відповідь
    res.status(200).json({ email, subscription });
  } catch (error) {
    // В разі помилки повернути статус 500 та повідомлення про помилку
    res.status(500).json({ message: error.message });
  }
};

const updateUserSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;
    const allowedSubscriptions = ["starter", "pro", "business"];

    // Перевірка чи передано коректне значення підписки
    if (!allowedSubscriptions.includes(subscription)) {
      return res.status(400).json({ message: "Invalid subscription value" });
    }

    // Оновлення підписки користувача
    const userId = req.user._id; // Отримання ідентифікатора користувача з об'єкта запиту
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Повернення успішної відповіді з оновленими даними користувача
    res.status(200).json(updatedUser);
  } catch (error) {
    // В разі помилки повернення статусу 500 та повідомлення про помилку
    res.status(500).json({ message: error.message });
  }
};

export { register, login, logout, getCurrentUser, updateUserSubscription };
