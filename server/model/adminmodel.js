// // const { flushSync } = require("react-dom/cjs/react-dom.production.min");
// const db = require("./model");
// const fs = require("fs");
// const path = require("path");
// const util = require("util");
// const mm = require("music-metadata");

// const stat = util.promisify(fs.stat);
// exports.getAllUser = (callback) => {
//   let query = "select * from users;";
//   db.query(query, (err, result) => {
//     if (err) {
//       callback(null, err);
//     } else {
//       callback(result, null);
//     }
//   });
// };


// exports.updateUserDetails = (id, updateUserDetails, callback) => {
//   let query = `update users set Name='${updateUserDetails.Name}' ,Email='${updateUserDetails.Email}', Password='${updateUserDetails.Password}', role='${updateUserDetails.role}' where id=${id}`;
//   db.query(query, (err, result) => {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, result);
//     }
//   });
// };

// exports.createuser = (userdeatils, callback) => {
//   let { Name, Email, Password, role } = userdeatils;
//   let query1 = `Select * from users where Email='${Email}'`;
//   db.query(query1, (err, result) => {
//     if (err) {
//       callback(null, err);
//       return;
//     }
//     if (result.length > 0) {
//       console.log(result.length);
//       callback({ alreadyExists: true }, null);
//       return;
//     }
//     let query = `Insert into users(Name,Email,Password,role) values ("${Name}","${Email}","${Password}","${role}")`;
//     db.query(query, (err, result) => {
//       if (err) {
//         console.log(err);
//         callback(err, null);
//         return;
//       }
//       console.log(result);
//       const insertedId = result.insertId;
//       callback(null, insertedId);
//       return;
//     });
//   });
// };

// exports.deleteUser = (id, callback) => {
//   const query = `Delete From users Where id=${id};`;
//   db.query(query, (err) => {
//     if (err) {
//       callback(err);
//     }
//     callback();
//   });
// };
// exports.addAlbum = (
//   title,
//   genre,
//   artist,

//   releaseYear,
//   imageurl,
//   cb
// ) => {
//   const query =
//     "INSERT INTO albums (title, genre, artist, coverImage, releaseYear) VALUES (?, ?, ?, ?, ?)";
//   const values = [title, genre, artist, imageurl, releaseYear];
//   db.query(query, values, (err, result) => {
//     if (err) {
//       cb(err, null);
//     } else if (result.affectedRows == 1) {
//       cb(null, result.insertId);
//     }
//   });
// };
// async function getSongDuration(filePath) {
//   try {
//     const stats = await stat(filePath);
//     const metadata = await mm.parseFile(filePath);
//     return {
//       duration: metadata.format.duration,
//       size: stats.size,
//     };
//   } catch (error) {
//     console.error("Error reading song metadata:", error);
//     return null;
//   }
// }

// exports.getsingleAlbum = (id, cb) => {
//   let query = `
//       SELECT a.*, 
//              GROUP_CONCAT(s.song_name) AS song_filenames,
//              GROUP_CONCAT(s.song_id) AS song_ids
//       FROM albums a
//       LEFT JOIN Songs s ON a.id = s.album_id
//       WHERE a.id = ${id}
//       GROUP BY a.id
//   `;
//   db.query(query, async (err, result) => {
//     if (err) {
//       console.log(err);
//       cb(err, null);
//     } else if (result && result.length >= 1) {
//       const album = result[0];
//       const song_filenames = album.song_filenames
//         ? album.song_filenames.split(",")
//         : [];
//       const song_ids = album.song_ids ? album.song_ids.split(",") : [];
//       const songs = [];
//       for (let i = 0; i < song_filenames.length; i++) {
//         const song_filename = song_filenames[i];
//         const song_id = song_ids[i];
//         const songInfo = await getSongDuration(`./songs/${song_id}`);
//         songs.push({
//           song_filename,
//           song_id,
//           duration: songInfo ? songInfo.duration : null,
//         });
//       }
//       album.songs = songs;
//       cb(null, [album]);
//     } else {
//       cb(null, null);
//     }
//   });
// };
// exports.updatealbum = (updatealbum, id, cb) => {
//   let query = `update albums set title=?
//   ,genre=?,
//   artist=?,
 
//   releaseYear=?
//   where id=?`;
//   db.query(
//     query,
//     [
//       updatealbum.title,
//       updatealbum.genre,
//       updatealbum.artist,
//       updatealbum.releaseYear,
//       id,
//     ],
//     (err, result) => {
//       if (err) {
//         cb(err, null);
//       } else {
//         console.log(result);
//         cb(null, result);
//       }
//     }
//   );
// };
// exports.deletealbum = (id, cb) => {
//   let query1 = `SELECT coverImage FROM albums WHERE id=${id}`;
//   db.query(query1, (err, result) => {
//     if (err) {
//       return cb(err, null);
//     }
//     if (result.length === 0) {
//       return cb("Album not found", null);
//     }
//     let imagepath = result[0].coverImage;
//     let filePath = path.join(__dirname, `../uploads/${imagepath}`);
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         return cb(err, null);
//       }

//       let query2 = `SELECT  song_id FROM Songs WHERE album_id=${id}`;
//       db.query(query2, (err, songs) => {
//         if (err) {
//           console.log(err);
//           return cb(err, null);
//         }
//         songs.forEach((song) => {
//           let songFilePath = path.join(__dirname, `../songs/${song.song_id}`);
//           fs.unlink(songFilePath, (err) => {
//             if (err) {
//               console.log(err);
//             }
//           });
//         });

//         let query3 = `DELETE FROM songs WHERE album_id=${id}`;
//         db.query(query3, (err, res) => {
//           if (err) {
//             console.log(err);
//             return cb(err, null);
//           }

//           let query4 = `DELETE FROM albums WHERE id=${id}`;
//           db.query(query4, (err, res) => {
//             if (err) {
//               console.log(err);
//               return cb(err, null);
//             }
//             if (res.affectedRows === 0) {
//               return cb("Failed to delete the album", null);
//             }
//             cb(null, res);
//           });
//         });
//       });
//     });
//   });
// };
// exports.addSong = (songDetails, cb) => {
//   const query =
//     "INSERT INTO Songs ( song_id,album_id,song_name) VALUES (?, ?,?)";
//   const values = [
//     songDetails.song_id,
//     songDetails.album_id,
//     songDetails.song_name,
//   ];
//   db.query(query, values, async (err, result) => {
//     const songInfo = await getSongDuration(`./songs/${songDetails.song_id}`);
//     if (err) {
//       cb(err, null);
//     } else if (result.affectedRows == 1) {
//       cb(null, {
//         song_filename: songDetails.song_name,
//         song_id: songDetails.song_id,
//         duration: songInfo.duration,
//       });
//     }
//   });
// };
// exports.deleteSongById = (songId, callback) => {
//   const filePath = path.join(__dirname, "..", "songs", `${songId}`);
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       return callback(err, null);
//     }
//     db.query("DELETE FROM Songs WHERE song_id = ?", [songId], (err, result) => {
//       if (err) {
//         return callback(err, null);
//       }
//       return callback(null, { message: "Song deleted successfully" });
//     });
//   });
// };
const db = require("./model");
const fs = require("fs").promises;
const path = require("path");
const mm = require("music-metadata");

exports.getAllUser = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from users;";
    db.query(query)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

exports.updateUserDetails = (id, updateUserDetails) => {
  const { Name, Email, Password, role } = updateUserDetails;
  const query = `update users set Name=?, Email=?, Password=?, role=? where id=?`;
  return db.query(query, [Name, Email, Password, role, id]);
};

exports.createuser = async (userdetails) => {
  const { Name, Email, Password, role } = userdetails;
  const query1 = `Select * from users where Email='${Email}'`;
  try {
    const result = await db.query(query1);
    if (result.length > 0) {
      return { alreadyExists: true };
    }
    const query = `Insert into users(Name,Email,Password,role) values (?, ?, ?, ?)`;
    const insertResult = await db.query(query, [Name, Email, Password, role]);
    const insertedId = insertResult.insertId;
    return insertedId;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

exports.deleteUser = (id) => {
  const query = `Delete From users Where id=?`;
  return db.query(query, [id]);
};

exports.addAlbum = (title, genre, artist, releaseYear, imageurl) => {
  const query =
    "INSERT INTO albums (title, genre, artist, coverImage, releaseYear) VALUES (?, ?, ?, ?, ?)";
  const values = [title, genre, artist, imageurl, releaseYear];
  return db.query(query, values);
};

async function getSongDuration(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const metadata = await mm.parseFile(filePath);
    return {
      duration: metadata.format.duration,
      size: stats.size,
    };
  } catch (error) {
    console.error("Error reading song metadata:", error);
    return null;
  }
}

exports.getsingleAlbum = async (id) => {
  const query = `
      SELECT a.*, 
             GROUP_CONCAT(s.song_name) AS song_filenames,
             GROUP_CONCAT(s.song_id) AS song_ids
      FROM albums a
      LEFT JOIN Songs s ON a.id = s.album_id
      WHERE a.id = ?
      GROUP BY a.id
  `;
  try {
    console.log("Executing query...");
    const result = await db.query(query, [id]);
    console.log("Query result:", result);

    if (result && result.length >= 1) {
      const album = result[0];
      console.log("Album details:", album);

      const song_filenames = album.song_filenames
        ? album.song_filenames.split(",")
        : [];
      console.log("Song filenames:", song_filenames);

      const song_ids = album.song_ids ? album.song_ids.split(",") : [];
      console.log("Song IDs:", song_ids);

      const songs = [];
      for (let i = 0; i < song_filenames.length; i++) {
        const song_filename = song_filenames[i];
        const song_id = song_ids[i];
        console.log("Fetching song duration for:", song_filename);
        const songInfo = await getSongDuration(`./songs/${song_id}`);
        console.log("Song duration info:", songInfo);

        songs.push({
          song_filename,
          song_id,
          duration: songInfo ? songInfo.duration : null,
        });
      }

      album.songs = songs;
      console.log("Album with songs:", album);

      return [album];
    } else {
      console.log("No album found with ID:", id);
      return null;
    }
  } catch (err) {
    console.error("Error fetching single album:", err);
    throw err;
  }
};

exports.updatealbum = (updatealbum, id) => {
  const query = `update albums set title=?, genre=?, artist=?, releaseYear=? where id=?`;
  const { title, genre, artist, releaseYear } = updatealbum;
  return db.query(query, [title, genre, artist, releaseYear, id]);
};

exports.deletealbum = async (id) => {
  try {
    const coverImageResult = await db.query(
      `SELECT coverImage FROM albums WHERE id=${id}`
    );
    if (coverImageResult.length === 0) {
      throw new Error("Album not found");
    }
    const imagepath = coverImageResult[0].coverImage;
    const filePath = path.join(__dirname, `../uploads/${imagepath}`);
    await fs.unlink(filePath);

    const songsResult = await db.query(
      `SELECT song_id FROM Songs WHERE album_id=${id}`
    );
    for (const song of songsResult) {
      const songFilePath = path.join(__dirname, `../songs/${song.song_id}`);
      await fs.unlink(songFilePath);
    }

    await db.query(`DELETE FROM Songs WHERE album_id=${id}`);
    const deleteResult = await db.query(`DELETE FROM albums WHERE id=${id}`);
    if (deleteResult.affectedRows === 0) {
      throw new Error("Failed to delete the album");
    }
    return deleteResult;
  } catch (err) {
    console.error("Error deleting album:", err);
    throw err;
  }
};

exports.addSong = async (songDetails) => {
  const query =
    "INSERT INTO Songs (song_id, album_id, song_name) VALUES (?, ?, ?)";
  const { song_id, album_id, song_name } = songDetails;
  const values = [song_id, album_id, song_name];
  console.log(values);
  const songInfo = await getSongDuration(`./songs/${song_id}`);
  const result = await db.query(query, values);
  return {
    song_filename: song_name,
    song_id: song_id,
    duration: songInfo ? songInfo.duration : null,
  };
};

exports.deleteSongById = async (songId) => {
  try {
    const filePath = path.join(__dirname, "..", "songs", `${songId}`);
    await fs.unlink(filePath);
    await db.query("DELETE FROM Songs WHERE song_id = ?", [songId]);
    return { message: "Song deleted successfully" };
  } catch (err) {
    console.error("Error deleting song:", err);
    throw err;
  }
};
