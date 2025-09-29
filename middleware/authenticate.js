const userModel = require('../model/user');
const jwt = require('jsonwebtoken');


exports.authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(404).json({
        message: 'Token is not passed to headers'
      })
    };

    const token = auth.split(' ')[1];

    if (!token) {
      return res.status(404).json({
        message: 'Token not found'
      })
    };

    const decodedToken = jwt.verify(token, 'password');
    const { id } = decodedToken;
    let user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'Account not found'
      })
    };

    if (user.isLoggedIn !== decodedToken.isLoggedIn) {
      return res.status(401).json({
        message: 'Authentication failed: Account is not logged in'
      })
    };

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error.message);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Session expired, please login to continue'
      })
    };

    res.status(500).json({
      message: error.message
    })
  }
};