import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../db/models/user.model.js";
import ApiError from "../../utils/apiError.js";

import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

export const addUser = asyncHandler(async (req, res, next) => {
  const { email, password, role, name, clinicId } = req.body;

  if ((role === "doctor" || role === "laboratory-doctor") && !clinicId) {
    return res.status(400).json({
      status: "fail",
      message: "Clinic ID is required for doctors and laboratory doctors",
    });
  }

  const userData = {
    email,
    password,
    role,
    name,
    clinicId: (role === "doctor" || role === "laboratory-doctor") ? clinicId : undefined,
  };

  const user = await User.create(userData);

  res.status(201).json({
    status: "success",
    message: "User added successfully",
    data: user,
  });
});


export const getUserInfo = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError("Authorization token is required", 401));
  }
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return next(new ApiError("Invalid or expired token", 401));
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    res.status(200).json({ status: "success", data: user });
  });
});





export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ status: "success", data: users });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { email, role, name, password } = req.body;

  const userExist = await User.findById(id);
  if (!userExist) {
    return next(new ApiError("User not found", 404));
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      email,
      role,
      name,
      password: await bcrypt.hash(password, 10),
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: user,
    message: "User updated successfully",
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userExist = await User.findById(id);
  if (!userExist) {
    return next(new ApiError("User not found", 404));
  }
  await User.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});
