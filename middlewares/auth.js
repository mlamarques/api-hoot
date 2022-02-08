const jwt = require("jsonwebtoken");
require('dotenv').config()

module.exports = async (req, res, next) => {

  const authHeaders = req.headers.authorization;

  if (!authHeaders) {
    return res.status(401).json({
      message: "Ocorreu um problema na autenticação"
    });
  }

  const [,token] = authHeaders.split(" ");

  try {
    jwt.verify(token, process.env.SECRET_ENV, (err, authData) => {
        if (err) {
            res.json({tokenMatch: false})
        } else {
            res.json({tokenMatch: true, authData, token})
        }
    })
    // const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // req.userId = decoded.id;
    next();

  } catch(e) {
    return res.status(401).json({
      message: "Token inválido"
    })
  }
}

// const token = req.body.session
//     jwt.verify(token, process.env.SECRET_ENV, (err, authData) => {
//         if (err) {
//             res.json({tokenMatch: false})
//         } else {
//             res.json({tokenMatch: true, authData, token})
//         }
//     })