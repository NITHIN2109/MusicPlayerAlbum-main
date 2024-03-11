// const jwt = require("jsonwebtoken");

// const verifyUser = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).send("No token");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.Secret_key);
//     // const username = decoded.name;
//     if (decoded.role === "admin") {
//       next();
//     } else {
//       return res.status(401).send("Not authorized");
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal error");
//   }
// };


// module.exports = { verifyUser };

// const jwt = require("jsonwebtoken");

// const verifyUser = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).send("No token provided");
//   }

//   const token = authHeader.split(" ")[1];
//   if (!token) {
//     return res.status(401).send("No token provided");
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.Secret_key);
//     if (decoded.role === "admin") {
//       next();
//     } else {
//       return res.status(401).send("Not authorized");
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal error");
//   }
// };

// module.exports = { verifyUser };
const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies.token;

  let token;

  // Check if token is available in the cookie or in the Authorization header
  if (tokenFromCookie) {
    token = tokenFromCookie;
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send("No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.Secret_key);
    if (decoded.role === "admin") {
      next();
    } else {
      return res.status(401).send("Not authorized");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal error");
  }
};

module.exports = { verifyUser };
