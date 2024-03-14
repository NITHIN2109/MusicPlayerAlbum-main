import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./usermanagemnr.css";
import { useAlbum } from "../../contexts/alubmscontext";
import axios from "axios";
import BASE_URL from "../../config/config";
import Modal from "./addalbummodal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import "./usermanagemnr.css";
function AlbumManagement() {
  const { albums, refreshAlbums } = useAlbum();
  const [showModal, setShowModal] = useState(false);
  const [formdata, setformdata] = useState({
    title: "",
    artist: "",
    genre: "",
    releaseYear: "",
    image: {},
    songs: [],
  });
  const handleFormSubmit = (e) => {
    console.log(formdata.songs);
    e.preventDefault();
    const newformdata = new FormData();
    newformdata.append("title", formdata.title);
    newformdata.append("genre", formdata.genre);
    newformdata.append("releaseYear", formdata.releaseYear);
    newformdata.append("artist", formdata.artist);
    newformdata.append("image", formdata.image);
    for (let i = 0; i < formdata.songs.length; i++) {
      newformdata.append("song", formdata.songs[i]);
    }
    console.log(newformdata);
    axios
      .post(`${BASE_URL}/Album`, newformdata, {
        withCredentials: true,
      })

      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        refreshAlbums();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSongFileChange = (e) => {
    setformdata({ ...formdata, songs: e.target.files });
  };
  return (
    <div className="albumcontainer">
      <ToastContainer />
      <div>
        <Modal
          showModal={showModal}
          toggleModal={toggleModal}
          handleFormSubmit={handleFormSubmit}
          handleSongFileChange={handleSongFileChange}
          formdata={formdata}
          setformdata={setformdata}
        />
      </div>
      <div className="album-header">
        <h1>Album Management</h1>
        {!showModal && (
          <button onClick={toggleModal} className="btn-addalbum sin">
            Add Album
          </button>
        )}
      </div>
      <div className="album-body">
        {albums ? (
          albums.map((album) => (
            <Link to={`/dashboard/album/${album.id}`} key={album.id}>
              <div className="album-card">
                <img
                  src={`${BASE_URL}/uploads/${album.coverImage}`}
                  alt="Album Cover"
                />
                <p>
                  <strong>{album.title}</strong>
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading albums...</p>
        )}
      </div>
    </div>
  );
}

export default AlbumManagement;
