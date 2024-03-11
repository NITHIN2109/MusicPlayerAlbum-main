const db = require("../model/loginmodel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

exports.createuser = (req, res) => {
  const userdetails = req.body;
  if (!userdetails.Name || !userdetails.Email || !userdetails.Password) {
    return res.json({ Error: "Include all details" });
  }
  db.createuser(userdetails, (result, err) => {
    if (err) {
      return res
        .status(500)
        .json({ Error: "Unable to register", details: err });
    }
    if (result && result.alreadyExists) {
      return res.json({ message: "User already exists" });
    }
    return res.status(201).json({ message: "Successfully registered" });
  });
};

exports.LoginUser = (req, res) => {
  const loginDetails = req.body;
  db.LoginUser(loginDetails, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ Error: "Internal Server Error" });
    } else if (result.Message === "Login Successfull") {
      const user = result.user;
      const name = user.Name;
      const role = user.role;
      const token = jwt.sign(
        { name: name, role: role },
        process.env.Secret_key,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("token", token);
      const isadmin = role === "admin";
      return res
        .status(200)
        .json({ message: "Login Successfull", isadmin: isadmin });
    } else if (result.Message === "Wrong password") {
      return res.status(401).json({ message: "Wrong password" });
    } else {
      return res.status(401).json({ message: "Invalid Username" });
    }
  });
};

// exports.verifyUSer = (req, res) => {
//   console.log('Request Headers:', req.headers);
//   console.log(req.cookies);
//   const token = req.cookies.token;
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



exports.verifyUser = (req, res) => {
  console.log('Request Headers:', req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      auth: false,
      message: "No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.Secret_key);
    const username = decode.name;
    return res.status(200).json({
      auth: true,
      name: username,
      message: "Token verified successfully",
      isadmin: decode.role === "admin" ? true : false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal error");
  }
};

exports.sendImage = (req, res) => {
  const imagename = req.params.imagename;
  const readstream = fs.createReadStream(`./uploads/${imagename}`);
  readstream.on("data", (chunk) => {
    res.write(chunk);
  });
  readstream.on("end", () => {
    res.end();
  });
  readstream.on("error", () => {
    res.status(404).json({ Error: "File not found" });
  });
};

exports.getalbums = (req, res) => {
  db.getalbums((err, output) => {
    if (err) {
      console.log(err,output);
      res.status(500).json("Internal server error");
    } else {
      res.status(200).send(output);
    }
  });
};

exports.playmusic = (req, res) => {
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
  const songname = req.params.songid;
  const filePath = path.join(__dirname, "../songs", songname);
  console.log(filePath);
  res.download(filePath, (err, result) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Internal Server Error");
    }
    console.log(result);
  });
};
