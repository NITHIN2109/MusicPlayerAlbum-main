import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config/config";
import "./usermanagemant.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = ({ users, setUsers }) => {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    Name: "",
    Email: "",
    Password: "",
    role: "",
  });
  const [edit, setEdit] = useState(false);
  const [updateid, setUpdateId] = useState();

  useEffect(() => {
    console.log(filteredUsers);
  }, [filteredUsers]);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.Name || !newUser.Email || !newUser.Password || !newUser.role) {
      toast.error("Please fill out all fields");
      return;
    }
    axios
      .post(`${BASE_URL}/users`, newUser, { withCredentials: true })
      .then((response) => {
        if (response.status === 201) {
          setFilteredUsers((prevUsers) => [
            ...prevUsers,
            response.data.details,
          ]);
          setUsers((prevUsers) => [...prevUsers, response.data.details]);
          setNewUser({ Name: "", Email: "", Password: "", role: "" });
          toast.success("User added successfully");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast.error(error.response.data.Error);
        }
        console.error("Error adding user:", error);
      });
  };

  const handleDeleteUser = (userId) => {
    axios
      .delete(`${BASE_URL}/users/${userId}`, {
        withCredentials: true,
      })
      .then(() => {
        setFilteredUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId)
        );
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data);
      });
  };

  const handleUpdateUser = (userId, updatedUserData) => {
    axios
      .put(`${BASE_URL}/users/${userId}`, updatedUserData, {
        withCredentials: true,
      })
      .then((response) => {
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, ...response.data.details } : user
          )
        );
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, ...response.data.details } : user
          )
        );
        toast.success("User updated successfully");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Failed to update user. Please try again later.");
      });
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.Name.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchInput, users]);

  return (
    <div className="Usermanagement user-dashboard-container">
      <div className="UserList">
        <ToastContainer />
        <h1>
          UserList &nbsp;&nbsp;&nbsp;
          <input
            type="text"
            placeholder="Search user"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </h1>

        <table className="userTable">
          <thead>
            <tr>
              <th className="username-header">UserName</th>
              <th className="email-header">Email</th>
              <th className="password-header">Password</th>
              <th className="role-header">Role</th>
              <th colSpan={2} className="action-header">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={`${user.Email}-${index}`}>
                <td className="username-cell">{user.Name}</td>
                <td className="email-cell">{user.Email}</td>
                <td className="password-cell">{user.Password}</td>
                <td className="role-cell">{user.role}</td>
                <td className="delete-cell">
                  <button
                    onClick={() => {
                      handleDeleteUser(user.id);
                    }}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
                <td className="update-cell">
                  <button
                    className="update-button"
                    onClick={() => {
                      if (!showModal) {
                        toggleModal();
                      }
                      setNewUser({
                        Name: user.Name,
                        Email: user.Email,
                        Password: user.Password,
                        role: user.role,
                      });
                      setUpdateId(user.id);
                      setEdit(true);
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="adduser">
        <span className="addUserBtn">
          {showModal ? (
            <button onClick={toggleModal} className="adduserButton">
              Close
            </button>
          ) : (
            <button onClick={toggleModal} className="adduserButton">
              Add User
            </button>
          )}
        </span>
        {showModal && (
          <form className="adduser">
            <h3>Add User</h3>
            <input
              type="text"
              placeholder="Username"
              value={newUser.Name}
              onChange={(e) => setNewUser({ ...newUser, Name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.Email}
              onChange={(e) =>
                setNewUser({ ...newUser, Email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.Password}
              onChange={(e) =>
                setNewUser({ ...newUser, Password: e.target.value })
              }
              required
            />
            <div className="userrole">
              <label htmlFor="admin" className="us">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={newUser.role === "admin"}
                  onChange={() => setNewUser({ ...newUser, role: "admin" })}
                />
                Admin
              </label>

              <label htmlFor="user" className="us">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={newUser.role === "user"}
                  onChange={() => setNewUser({ ...newUser, role: "user" })}
                />
                User
              </label>
            </div>

            {!edit ? (
              <button className="bt" onClick={(e) => handleAddUser(e)}>
                Add User
              </button>
            ) : (
              <button
                className="bt"
                onClick={() => {
                  handleUpdateUser(updateid, newUser);
                  setNewUser({
                    Name: "",
                    Email: "",
                    Password: "",
                    role: "",
                  });
                  setUpdateId(null);
                  setEdit(false);
                }}
              >
                Update User
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
