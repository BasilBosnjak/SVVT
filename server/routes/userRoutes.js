import express from "express";
import User from "../models/User.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../middleware/sendVerificationEmail.js";
import { sendPasswordResetEmail } from "../middleware/sendPasswordResetEmail.js";
import { isAdmin, protectRoute } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const userRoutes = express.Router();

const genToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "2h" }); // change expiresIn value before deploying live
};

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    user.firstLogin = false;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      googleImage: user.googleImage,
      googleId: user.googleId,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
      firstLogin: user.firstLogin,
      created: user.createdAt,
      active: user.active,
    });
  } else {
    res.status(401).json({ message: "Invalid Email or Password!" });
    throw new Error("User not found!");
  }
});

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User with that email already exists!" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const newToken = genToken(user._id);

  sendVerificationEmail(newToken, email, name, user._id);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      googleImage: user.googleImage,
      googleId: user.googleId,
      firstLogin: user.firstLogin,
      isAdmin: user.isAdmin,
      token: newToken,
      active: user.active,
      createdAt: user.createdAt,
    });
  } else {
    res.status(400).json({ message: "Unable to register!" });
    throw new Error(
      "Something went wrong. Please check your credentials and try again!"
    );
  }
});

const verifyEmail = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  user.active = true;
  await user.save();
  res.json("Account activated successfully, you can close this window now.");
});

const passwordResetRequest = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const newToken = genToken(user._id);
      sendPasswordResetEmail(newToken, user.email, user.name);
      res.status(200).send(`Password recovery email sent to ${email}`);
    }
  } catch (error) {
    res.status(401).json({ message: "Account with that email doesn't exist." });
  }
});

const passwordReset = expressAsyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      user.password = req.body.password;
      await user.save();
      res.json("Password updated successfully.");
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res.status(401).json({ message: "Password reset failed" });
  }
});

const googleLogin = expressAsyncHandler(async (req, res) => {
  const { googleId, email, name, googleImage } = req.body;

  try {
    const user = await User.findOne({ googleId: googleId });
    if (user) {
      user.firstLogin = false;
      await user.save();
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        googleImage: user.googleImage,
        googleId: user.googleId,
        firstLogin: user.firstLogin,
        isAdmin: user.isAdmin,
        token: genToken(user._id),
        active: user.active,
        createdAt: user.createdAt,
      });
    } else {
      const newUser = await User.create({
        name,
        email,
        googleId,
        googleImage,
      });

      const newToken = genToken(newUser._id);

      sendVerificationEmail(newToken, newUser.email, newUser.name, newUser._id);

      res.json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        googleImage: newUser.googleImage,
        googleId: newUser.googleId,
        firstLogin: newUser.firstLogin,
        isAdmin: newUser.isAdmin,
        token: genToken(newUser._id),
        active: newUser.active,
        createdAt: newUser.createdAt,
      });
    }
  } catch (error) {
    res.status(404).json({ message: "Something went wrong, try again later!" });
  }
});

const getUserOrders = expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id });
  if (!orders) {
    res.status(404).json({ message: "No orders could be found!" });
    throw new Error("No Orders found!");
  } else {
    res.status(200).json(orders);
  }
});

const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const deleteUserById = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "User not found!" });
    throw new Error("User could not be deleted!");
  }
});

userRoutes.route("/login").post(loginUser);
userRoutes.route("/register").post(registerUser);
userRoutes.route("/verify-email").get(protectRoute, verifyEmail);
userRoutes.route("/password-reset-request").post(passwordResetRequest);
userRoutes.route("/password-reset").post(passwordReset, protectRoute);
userRoutes.route("/google-login").post(googleLogin);
userRoutes.route("/:id").get(protectRoute, getUserOrders);
userRoutes.route("/").get(getUsers, protectRoute, isAdmin);
userRoutes.route("/:id").delete(deleteUserById, protectRoute, isAdmin);

export default userRoutes;
