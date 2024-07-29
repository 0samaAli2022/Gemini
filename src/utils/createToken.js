import jwt from 'jsonwebtoken';

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACC_TOKEN, {
    expiresIn: '15m',
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REF_TOKEN, {
    expiresIn: '30d',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACC_TOKEN);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REF_TOKEN);
};

export {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
