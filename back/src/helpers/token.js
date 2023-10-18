import jwt from "jsonwebtoken";
import config  from "config";
const { access_token_secret } = config.get("jwt");

// Create tokens
const generateToken = (userId, expiration) => {  
  const token = jwt.sign({ userId }, access_token_secret, { expiresIn: expiration });
    
  return token;
};

const decodeToken = (token) => {
    try {
      // Verify and decode the token using your secret key
      const decodedToken = jwt.verify(token, access_token_secret);
      
      // Return the decoded token payload
      return decodedToken;
    } catch (error) {
      // Handle any token decoding errors
      console.error(`Error decoding token: ${error.message}`);
      return null;
    }
  };

// const createRefreshToken = (userId) => {
//   return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
//     expiresIn: '7d',
//   });
// };

// // Send tokens
// const sendAccessToken = (res, req, accessToken) => {
//   res.send({
//     accessToken,
//     email: req.body.email,
//   });
// };

// const sendRefreshToken = (res, token) => {
//   res.cookie('refreshtoken', token, {
//     httpOnly: true,
//     path: '/refresh_token',
//   });
// };

export const tokenHelpers = {
  generateToken,
  decodeToken
//   createRefreshToken,
//   sendAccessToken,
//   sendRefreshToken
};