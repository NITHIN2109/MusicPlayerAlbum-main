// const db = require("./model");
// exports.createuser = (userdeatils, callback) => {
//   let Name = userdeatils.Name;
//   let Email = userdeatils.Email;
//   let Password = userdeatils.Password;
//   let query1 = `Select * from users where Email='${Email}'`;
//   db.query(query1, (err, result) => {
//     if (err) {
//       callback(null, err);
//       return;
//     }
//     console.log(result);

//     if (result.length > 0 || result) {
//       // console.log(result.length);
//       callback({ alreadyExists: true }, null);
//       console.log(result);
//       return;
//     }
//     let query = `Insert into users(Name,Email,Password) values ("${Name}","${Email}","${Password}")`;

//     db.query(query, (err) => {
//       if (err) {
//         // console.log(err);
//         callback(null, err);
//         return;
//       }
//       callback();
//       return;
//     });
//   });
// };
// exports.LoginUser = (Logindata, callback) => {
//   const { Email, Password } = Logindata;

//   let query = `SELECT * FROM users WHERE Email='${Email}'`;
//   db.query(query, (err, result) => {
//      console.log(result);
//     if (err) {
//       callback(err, null);
//     }
    
//     if (result.length > 0 || result) {
//       console.log(result);
//       if (result[0].Password === Password) {
//         callback(null, { Message: "Login Successfull", ...result });
//         return;
//       } else {
//          console.log(result);
//         callback(null, { Message: "Wrong password" });
//         return;
//       }
//     } else {
//       console.log(result);
//       callback(null, { Message: "Invalid UserName" });
//       return;
//     }
//   });
// };

// exports.getalbums = (callback) => {
//   let query = `
//     SELECT a.*, 
//            GROUP_CONCAT(s.song_name) AS song_filenames,
//            GROUP_CONCAT(s.song_id) AS song_ids
//     FROM albums a
//     LEFT JOIN songs s ON a.id = s.album_id
//     GROUP BY a.id
//   `;
//   db.query(query, (err, result) => {
//     if (err) {
//       callback(err, null);
//     } else {
//       const albumsWithSongs = result.map((album) => {
//         const song_filenames = album.song_filenames
//           ? album.song_filenames.split(",")
//           : [];
//         const song_ids = album.song_ids ? album.song_ids.split(",") : [];
//         const songs = song_filenames.map((song_filename, index) => ({
//           song_filename,
//           song_id: song_ids[index],
//         }));
//         return {
//           id: album.id,
//           title: album.title,
//           genre: album.genre,
//           artist: album.artist,
//           coverImage: album.coverImage,
//           releaseYear: album.releaseYear,
//           songs,
//         };
//       });
//       callback(null, albumsWithSongs);
//     }
//   });
// };
// const db = require("./model");

// exports.createuser = (userdetails, callback) => {
//   const { Name, Email, Password } = userdetails;
//   const query1 = `SELECT * FROM users WHERE Email='${Email}'`;

//   db.query(query1, (err, result) => {
//     if (err) {
//       return callback(null, err);
//     }

//     if (result.length > 0) {
//       return callback({ alreadyExists: true }, null);
//     }

//     const query = `INSERT INTO users (Name, Email, Password) VALUES ("${Name}", "${Email}", "${Password}")`;

//     db.query(query, (err) => {
//       if (err) {
//         return callback(null, err);
//       }
//       callback();
//     });
//   });
// };

// exports.LoginUser = (Logindata, callback) => {
//   const { Email, Password } = Logindata;
//   const query = `SELECT * FROM users WHERE Email='${Email}'`;

//   db.query(query, (err, result) => {
//     if (err) {
//       return callback(err, null);
//     }

//     if (!result || result.length === 0) {
//       return callback(null, { Message: "Invalid UserName" });
//     }

//     const user = result[0];

//     if (user.Password === Password) {
//       const userInfo = {
//         id: user.id,
//         Name: user.Name,
//         Email: user.Email,
//         role:user.role,
//         // Add other necessary user information here
//       };
//       return callback(null, { Message: "Login Successfull", user: userInfo });
//     } else {
//       return callback(null, { Message: "Wrong password" });
//     }
//   });
// };

// exports.getalbums = (callback) => {
//   const query = `
//     SELECT a.*, 
//            GROUP_CONCAT(s.song_name) AS song_filenames,
//            GROUP_CONCAT(s.song_id) AS song_ids
//     FROM albums a
//     LEFT JOIN Songs s ON a.id = s.album_id
//     GROUP BY a.id
//   `;
//   db.query(query, (err, result) => {
//     if (err) {
//       console.log(err);
//       return callback(err, null);
//     }
//     const albumsWithSongs = result.map((album) => {
//       const song_filenames = album.song_filenames ? album.song_filenames.split(",") : [];
//       const song_ids = album.song_ids ? album.song_ids.split(",") : [];
//       const songs = song_filenames.map((song_filename, index) => ({
//         song_filename,
//         song_id: song_ids[index],
//       }));
//       return {
//         id: album.id,
//         title: album.title,
//         genre: album.genre,
//         artist: album.artist,
//         coverImage: album.coverImage,
//         releaseYear: album.releaseYear,
//         songs,
//       };
//     });
//     callback(null, albumsWithSongs);
//   });
// };



const db = require("./model");

exports.createuser = async (userdetails) => {
  const { Name, Email, Password } = userdetails;
  const query1 = `SELECT * FROM users WHERE Email='${Email}'`;

  try {
    const result = await db.query(query1);
    if (result.length > 0) {
      return { alreadyExists: true };
    }

    const query = `INSERT INTO users (Name, Email, Password) VALUES ("${Name}", "${Email}", "${Password}")`;
    await db.query(query);
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
};

exports.LoginUser = async (Logindata) => {
  const { Email, Password } = Logindata;
  const query = `SELECT * FROM users WHERE Email='${Email}'`;

  try {
    const result = await db.query(query);
    if (!result || result.length === 0) {
      return { Message: "Invalid UserName" };
    }

    const user = result[0];
    if (user.Password === Password) {
      const userInfo = {
        id: user.id,
        Name: user.Name,
        Email: user.Email,
        role: user.role,
      };
      console.log("userinfo", userInfo);
      return { Message: "Login Successful", user: userInfo };
    } else {
      return { Message: "Wrong password" };
    }
  } catch (err) {
    return { error: err.message };
  }
};

exports.getalbums = async () => {
  const query = `
    SELECT a.*, 
           GROUP_CONCAT(s.song_name) AS song_filenames,
           GROUP_CONCAT(s.song_id) AS song_ids
    FROM albums a
    LEFT JOIN Songs s ON a.id = s.album_id
    GROUP BY a.id
  `;

  try {
    const result = await db.query(query);
    const albumsWithSongs = result.map((album) => {
      const song_filenames = album.song_filenames
        ? album.song_filenames.split(",")
        : [];
      const song_ids = album.song_ids ? album.song_ids.split(",") : [];
      const songs = song_filenames.map((song_filename, index) => ({
        song_filename,
        song_id: song_ids[index],
      }));
      return {
        id: album.id,
        title: album.title,
        genre: album.genre,
        artist: album.artist,
        coverImage: album.coverImage,
        releaseYear: album.releaseYear,
        songs,
      };
    });
    return albumsWithSongs;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
