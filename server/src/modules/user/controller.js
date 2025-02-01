import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../db/models/user.model.js";
import ApiError from "../../utils/apiError.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

  if (userExist.role === "superadmin") {
    return next(new ApiError("Super Admin cannot be deleted", 403));
  }

  await User.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hospitalmanagement824@gmail.com",
    pass: "rtkz njug oono fhgt", 
  },
});

export const requestResetCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const resetCode = crypto.randomInt(1000, 9999).toString();
  user.resetCode = await bcrypt.hash(resetCode, 10);
  await user.save();

  const mailOptions = {
    from: "spitalmanagement824@gmail.com",
    to: user.email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${resetCode}`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    status: "success",
    message: "Reset code sent to email",
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetCode, newPassword } = req.body;

  if (!email || !resetCode || !newPassword) {
    return next(new ApiError("Email, reset code, and new password are required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const isCodeValid = await bcrypt.compare(resetCode, user.resetCode);
  if (!isCodeValid) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { _id: user._id },
    { password: hashedPassword, resetCode: undefined }
  );

  await User.findById(user._id);

  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});
