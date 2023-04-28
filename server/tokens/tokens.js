import jwt from "jsonwebtoken";
import config  from "config";
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config.get("tokenConfig");

// Create tokens
const createAccessToken = (userId) => {
    console.log('userId :>> ', userId);
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

const createRefreshToken = (userId) => {
    console.log('userId :>> ', userId);
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

// Send tokens
const sendAccessToken = (res, req, accessToken) => {
    console.log('accessToken :>> ', accessToken);
  res.send({
    accessToken,
    email: req.body.email,
  });
};

const sendRefreshToken = (res, token) => {
    console.log('token :>> ', token);
  res.cookie('refreshtoken', token, {
    httpOnly: true,
    path: '/refresh_token',
  });
};

export const tokenHelpers = {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken
};