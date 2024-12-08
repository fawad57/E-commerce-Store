import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styles/vendorpages/vendorprofile.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import profileImage from "../../assets/profile-icon.png"; // Default profile image

const VendorProfile = () => {
  const [view, setView] = useState("profile"); // To toggle between views
  const [profilePic, setProfilePic] = useState("");
  const [originalProfile, setOriginalProfile] = useState({}); // Store original data
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");

  // For password update functionality
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [accountSettings, setAccountSettings] = useState({
    notifications: true,
    accountVisibility: "public", // Options: "public", "private"
    accountStatus: "active", // Options: "active", "disabled"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      window.location.href = "/login";
    } else {
      axios
        .post(
          "http://localhost:5000/api/protected/get_id",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          const user = response.data.user;
          setOriginalProfile(user);
          setEmail(user.email); // Keep email non-editable
          setPhone(user.phone);
          setName(user.name);
          setUsername(user.username);
          setProfilePic(user.profilePicture);
          setAddress(user.address || "");
          setBio(user.bio || "");
        })
        .catch(() => {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        });
    }
  }, []);

  const isProfileChanged = () => {
    return (
      name !== originalProfile.name ||
      username !== originalProfile.username ||
      phone !== originalProfile.phone ||
      address !== originalProfile.address ||
      bio !== originalProfile.bio
    );
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("profilePic", file);
      formData.append("email", email);

      axios
        .post(
          "http://localhost:5000/api/vendor/userprofile/upload-profile-picture",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          setProfilePic(response.data.profilePicPath);
        })
        .catch((error) => {
          console.error("Error uploading the image:", error);
        });
    }
  };

  const handleSaveChanges = () => {
    if (!isProfileChanged()) {
      alert("No changes detected!");
      return;
    }

    const updatedProfile = { name, username, email, phone, address, bio };

    axios
      .post(
        "http://localhost:5000/api/vendor/userprofile/update-profile",
        updatedProfile
      )
      .then(() => {
        alert("Profile updated successfully!");
        setOriginalProfile({
          ...originalProfile,
          name,
          username,
          phone,
          address,
          bio,
        }); // Update original data to reflect changes
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/vendor/userprofile/update-password",
        {
          currentPassword,
          newPassword,
          email,
        }
      );

      if (response.data.success) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setView("profile"); // Return to profile view after success
      } else {
        alert(response.data.message || "Password update failed.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  // Reset password fields when the view changes
  useEffect(() => {
    if (view !== "update-password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [view]);

  const handleLogout = () => {
    // Ask for user confirmation
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const handleAccountSettingsChange = (key, value) => {
    setAccountSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSaveAccountSettings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/vendor/userprofile/update-account-settings",
        { accountSettings, email }
      );
      if (response.data.success) {
        alert("Account settings updated successfully!");
      } else {
        alert("Failed to update account settings.");
      }
    } catch (error) {
      console.error("Error updating account settings:", error);
      alert("An error occurred while saving account settings.");
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container_1">
        <aside className="profile-sidebar">
          <h3>Profile Actions</h3>
          <ul>
            <li onClick={() => setView("profile")}>
              <a href="#">Profile Details</a>
            </li>
            <li onClick={() => setView("update-password")}>
              <a href="#">Update Password</a>
            </li>
            <li onClick={() => setView("account-settings")}>
              <a href="#">Account Settings</a>
            </li>
            <li onClick={handleLogout}>
              <a href="#">Logout</a>
            </li>
          </ul>
        </aside>
        <main className="profile-main">
          {view === "profile" && (
            <>
              <h2 className="profile-title">My Profile</h2>
              <div className="profile-header">
                <div className="upload-section">
                  <img
                    src={
                      profilePic
                        ? `http://localhost:5000/${profilePic}`
                        : profileImage
                    }
                    alt="Profile"
                    className="profile-image"
                  />
                  <label htmlFor="profilePicInput" className="upload-label">
                    Change Picture
                  </label>
                  <input
                    type="file"
                    id="profilePicInput"
                    onChange={handleProfilePicChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="profile-info">
                  <input
                    type="text"
                    value={name}
                    placeholder="Full Name"
                    onChange={(e) => setName(e.target.value)}
                    className="profile-input"
                  />
                  <input
                    type="text"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="profile-input"
                  />
                  <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    className="profile-input"
                    readOnly // Prevent editing email
                  />
                  <input
                    type="text"
                    value={phone}
                    placeholder="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    className="profile-input"
                  />
                </div>
              </div>
              <textarea
                value={bio}
                placeholder="Write a short bio..."
                onChange={(e) => setBio(e.target.value)}
                className="profile-bio"
              ></textarea>
              <input
                type="text"
                value={address}
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                className="profile-input"
              />
              <button
                className="save-profile-btn"
                onClick={handleSaveChanges}
                //disabled={!isProfileChanged()} // Disable button if no change
              >
                Save Changes
              </button>
            </>
          )}
          {view === "update-password" && (
            <>
              <h2 className="profile-title">Update Password</h2>
              <input
                type="password"
                value={currentPassword}
                placeholder="Current Password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="profile-input"
              />
              <input
                type="password"
                value={newPassword}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="profile-input"
              />
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm New Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="profile-input"
              />
              <button
                className="save-profile-btn"
                onClick={handleUpdatePassword}
              >
                Update Password
              </button>
            </>
          )}

          {view === "account-settings" && (
            <>
              <h2 className="profile-title">Account Settings</h2>
              <div className="account-settings-section">
                {/* Notifications */}
                <div className="form-group">
                  <label>
                    <strong>Enable Notifications</strong>
                    <input
                      type="checkbox"
                      checked={accountSettings.notifications}
                      onChange={(e) =>
                        handleAccountSettingsChange(
                          "notifications",
                          e.target.checked
                        )
                      }
                    />
                  </label>
                </div>

                {/* Account Visibility */}
                <div className="form-group">
                  <label>
                    <strong>Account Visibility</strong>
                    <select
                      value={accountSettings.accountVisibility}
                      onChange={(e) =>
                        handleAccountSettingsChange(
                          "accountVisibility",
                          e.target.value
                        )
                      }
                      className="form-select"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </label>
                </div>

                {/* Account Status */}
                <div className="form-group">
                  <label>
                    <strong>Account Status</strong>
                    <select
                      value={accountSettings.accountStatus}
                      onChange={(e) =>
                        handleAccountSettingsChange(
                          "accountStatus",
                          e.target.value
                        )
                      }
                      className="form-select"
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </label>
                </div>

                {/* Save Settings Button */}
                <button
                  className="save-profile-btn_2"
                  onClick={handleSaveAccountSettings}
                >
                  Save Settings
                </button>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default VendorProfile;
