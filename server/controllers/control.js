// const db = require("../model/loginmodel");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");
// const path = require("path");

// require("dotenv").config();

// exports.createuser = (req, res) => {
//   const userdetails = req.body;
//   if (!userdetails.Name || !userdetails.Email || !userdetails.Password) {
//     return res.json({ Error: "Include all details" });
//   }
//   db.createuser(userdetails, (result, err) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ Error: "Unable to register", details: err });
//     }
//     if (result && result.alreadyExists) {
//       return res.json({ message: "User already exists" });
//     }
//     return res.status(201).json({ message: "Successfully registered" });
//   });
// };

// exports.LoginUser = (req, res) => {
//   const loginDetails = req.body;
//   db.LoginUser(loginDetails, (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ Error: "Internal Server Error" });
//     } else if (result.Message === "Login Successfull") {
//       const user = result.user;
//       const name = user.Name;
//       const role = user.role;
//       const token = jwt.sign(
//         { name: name, role: role },
//         process.env.Secret_key,
//         {
//           expiresIn: "1d",
//         }
//       );
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: true, // Set to true for HTTPS deployment
//         sameSite: 'none', // Set appropriately based on your requirements
//       });
//       res.cookie("token", token);
//       console.log(user);
//       const isadmin = role == "admin";
//       return res
//         .status(200)
//         .json({ message: "Login Successfull", isadmin: isadmin,token:token });
//     } else if (result.Message === "Wrong password") {
//       return res.status(401).json({ message: "Wrong password" });
//     } else {
//       return res.status(401).json({ message: "Invalid Username" });
//     }
//   });
// };

// // exports.verifyUSer = (req, res) => {
// //   console.log('Request Headers:', req.headers);
// //   console.log(req.cookies);
// //   const token = req.cookies.token;
// //   if (!token) {
// //     return res.status(403).json({
// //       auth: false,
// //       message: "No token provided.",
// //     });
// //   }
// //   try {
// //     const decode = jwt.verify(token, process.env.Secret_key);
// //     const username = decode.name;
// //     return res.status(200).json({
// //       auth: true,
// //       name: username,
// //       message: "Token verified successfully",
// //       isadmin: decode.role === "admin" ? true : false,
// //     });
// //   } catch (error) {
// //     console.log(error);
// //     return res.status(500).send("Internal error");
// //   }
// // };



// exports.verifyUser = (req, res) => {
//   console.log('Request Cookies:', req.cookies); // Log cookies for debugging
//   const tokenFromCookie = req.cookies.token;
//   const authHeader = req.headers.authorization;
//   let token;
//   if (tokenFromCookie) {
//     token = tokenFromCookie;
//   } else if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(403).json({
//       auth: false,
//       message: "No token provided.",
//     });
//   }

//   try {
//     const decode = jwt.verify(token, process.env.Secret_key);
//     const username = decode.name;
//     return res.status(200).json({
//       auth: true,
//       name: username,
//       message: "Token verified successfully",
//       isadmin: decode.role === "admin" ? true : false,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send("Internal error");
//   }
// };

// exports.sendImage = (req, res) => {
//   const imagename = req.params.imagename;
//   const readstream = fs.createReadStream(`./uploads/${imagename}`);
//   readstream.on("data", (chunk) => {
//     res.write(chunk);
//   });
//   readstream.on("end", () => {
//     res.end();
//   });
//   readstream.on("error", () => {
//     res.status(404).json({ Error: "File not found" });
//   });
// };

// exports.getalbums = (req, res) => {
//   db.getalbums((err, output) => {
//     if (err) {
//       console.log(err,output);
//       res.status(500).json("Internal server error");
//     } else {
//       res.status(200).send(output);
//     }
//   });
// };

// exports.playmusic = (req, res) => {
//   const songName = req.params.songname;
//   const filePath = `./songs/${songName}`;
//   fs.readFile(filePath, (err, data) => {
//     if (err) {
//       console.error("Error reading audio file:", err);
//       return res.status(500).json({ error: "Error reading audio file" });
//     }
//     res.setHeader("Content-Type", "audio/mpeg");
//     res.send(data);
//   });
// };

// exports.songdownload = (req, res) => {
//   const songname = req.params.songid;
//   const filePath = path.join(__dirname, "../songs", songname);
//   console.log(filePath);
//   res.download(filePath, (err, result) => {
//     if (err) {
//       console.error("Error downloading file:", err);
//       res.status(500).send("Internal Server Error");
//     }
//     console.log(result);
//   });
// };

const db = require("../model/loginmodel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

exports.createuser = async (req, res) => {
  console.log("Creating user...");
  const userdetails = req.body;
  if (!userdetails.Name || !userdetails.Email || !userdetails.Password) {
    console.log("User details incomplete");
    return res.json({ Error: "Include all details" });
  }
  try {
    const result = await db.createuser(userdetails);
    if (result.error) {
      console.error("Unable to register:", result.error);
      return res
        .status(500)
        .json({ Error: "Unable to register", details: result.error });
    }
    if (result.alreadyExists) {
      console.log("User already exists");
      return res.json({ message: "User already exists" });
    }
    console.log("User registered successfully");
    return res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res
      .status(500)
      .json({ Error: "Internal Server Error", details: error.message });
  }
};

exports.LoginUser = async (req, res) => {
  console.log("Logging in user...");
  const loginDetails = req.body;
  try {
    const result = await db.LoginUser(loginDetails);
    if (result.error) {
      console.error("Internal Server Error:", result.error);
      return res.status(500).json({ Error: "Internal Server Error" });
    } else if (result.Message === "Login Successful") {
      console.log("Login successful");
      const user = result.user;
      const name = user.Name;
      const role = user.role;
      const token = jwt.sign(
        { name: name, role: role },
        process.env.Secret_key,
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      const isadmin = role == "admin";
      return res
        .status(200)
        .json({ message: "Login Successful", isadmin: isadmin, token: token });
    } else if (result.Message === "Wrong password") {
      console.log("Wrong password");
      return res.status(401).json({ message: "Wrong password" });
    } else {
      console.log("Invalid username");
      return res.status(401).json({ message: "Invalid Username" });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res
      .status(500)
      .json({ Error: "Internal Server Error", details: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  console.log("Verifying user...");
  const authHeader = req.headers.authorization;
  const tokenCookie = req.cookies.token;

  // Check if token is provided in authorization header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.Secret_key);
      const username = decoded.name;
      console.log("Token verified successfully");
      return res.status(200).json({
        auth: true,
        name: username,
        message: "Token verified successfully",
        isadmin: decoded.role === "admin",
      });
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(403).json({ auth: false, message: "Invalid token" });
    }
  }

  // Check if token is provided in cookie
  if (tokenCookie) {
    try {
      const decoded = jwt.verify(tokenCookie, process.env.Secret_key);
      const username = decoded.name;
      console.log("Token from cookie verified successfully");
      return res.status(200).json({
        auth: true,
        name: username,
        message: "Token from cookie verified successfully",
        isadmin: decoded.role === "admin",
      });
    } catch (error) {
      console.error("Error verifying token from cookie:", error);
      return res.status(403).json({ auth: false, message: "Invalid token" });
    }
  }

  console.log("No token provided");
  return res.status(403).json({ auth: false, message: "No token provided." });
};

exports.sendImage = (req, res) => {
  console.log("Sending image...");
  const imagename = req.params.imagename;
  const readstream = fs.createReadStream(`./uploads/${imagename}`);
  readstream.on("data", (chunk) => {
    res.write(chunk);
  });
  readstream.on("end", () => {
    console.log("Image sent");
    res.end();
  });
  readstream.on("error", () => {
    console.error("File not found");
    res.status(404).json({ Error: "File not found" });
  });
};

exports.getalbums = async (req, res) => {
  console.log("Getting albums...");
  try {
    const output = await db.getalbums();
    console.log("Albums retrieved successfully");
    res.status(200).send(output);
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json("Internal server error");
  }
};

exports.playmusic = (req, res) => {
  console.log("Playing music...");
  const songName = req.params.songname;
  const filePath = `./songs/${songName}`;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading audio file:", err);
      return res.status(500).json({ error: "Error reading audio file" });
    }
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(data);
  });
};

exports.songdownload = (req, res) => {
  console.log("Downloading song...");
  const songname = req.params.songid;
  const filePath = path.join(__dirname, "../songs", songname);
  console.log("File path:", filePath);
  res.download(filePath, (err, result) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Internal Server Error");
    }
    console.log("Download complete:", result);
  });
};
