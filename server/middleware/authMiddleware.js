import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";

const protectRoute = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(`Bearer`)
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized, authentication failed." });
      throw new Error("Unauthorized, authentication failed.");
    }
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized, missing token." });
    throw new Error("Unauthorized, missing token.");
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: "Unathorized, you don't have permission to view this content.",
    });
    throw new Error(
      "Unathorized, you don't have permission to view this content."
    );
  }
};

export { protectRoute, isAdmin };
