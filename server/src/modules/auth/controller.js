import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../db/models/user.model.js";
import ApiError from "../../utils/apiError.js";

import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
  delete user._doc.password;

  res.json({
    status: "success",
    message: "Logged in successfully",
    user,
    token,
  });
});
