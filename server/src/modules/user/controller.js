import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../db/models/user.model.js";
import ApiError from "../../utils/apiError.js";

import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

export const addUser = asyncHandler(async (req, res, next) => {
  const { email, password, role, name, clinicId } = req.body;

  const userData = {
    email,
    password,
    role,
    name,
  };

  if (role === "doctor" || role === "laboratory-doctor") {
    userData.clinicId = clinicId;
  }

  const user = await User.create(userData);

  res.status(201).json({
    status: "success",
    message: "User added successfully",
    data: user,
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
