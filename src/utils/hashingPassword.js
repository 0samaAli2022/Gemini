import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
const hashPassword = asyncHandler(async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hash(password, salt);
  return hashedPassword;
});

const comparePassword = asyncHandler((password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
});

export { hashPassword, comparePassword };