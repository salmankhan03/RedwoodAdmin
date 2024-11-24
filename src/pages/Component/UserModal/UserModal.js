import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap"; // Import React Bootstrap components
import { ToastContainer, toast } from 'react-toastify';
import AdminServices from "../../../Services/AdminServices";

function AddUserModal({ show, onHide, userData }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    role: "User",
    password: "",
    confirmPassword: "",
    sendEmail: false,
  });

  // Pre-fill form fields when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        name: userData.name || "",
        role: userData.role || "Administrator",
        password: "",
        confirmPassword: "",
        sendEmail: false
      });
    }
  }, [userData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
  const validateForm = () => {
    if (!formData.username.trim()) return "Username is required.";
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      return "A valid email address is required.";
    if (!formData.password.trim() || formData.password.length < 6)
      return "Password must be at least 6 characters long.";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate the form
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError, { position: "top-center", autoClose: 3000 });
      setLoading(false);
      return;
    }
    console.log("formData", formData)
    try {
      const formdata = new FormData();
      formdata.append("email", formData?.email);
      formdata.append("password", formData?.password);
      formdata.append("confirmPassword", formData?.confirmPassword);
      formdata.append("username", formData?.username);
      formdata.append("name", formData?.name);
      formdata.append("role", formData?.role);
      formdata.append("send_user_notification", "1");
      // Call API to register user
      const response = await AdminServices.addUser(formdata);
      console.log("res",response)
      if (response?.status_code === 200) {
        toast.success(response.message || "User registered successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        setFormData({
          username: "",
          name: "",
          email: "",
          role: "User",
          password: "",
          confirmPassword: "",
          sendEmail: false,
        });
        // 
        setTimeout(() => onHide(), 3000);


        // if (onSave) onSave(); // Optional callback for parent component
        // onHide();
      } else {
        throw new Error(response.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to register user.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{userData ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ height: 400, overflow: "auto" }}>
          {/* Username */}
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          {/* Name */}
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Email */}
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>



          {/* Role */}
          <Form.Group controlId="role" className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="Administrator">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="User">Member/USer</option>

              {/* Add other roles here */}
            </Form.Control>
          </Form.Group>

          {/* Password */}
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Send Email Checkbox */}
          <Form.Group className="mb-3" controlId="sendEmail">
            <Form.Check
              type="checkbox"
              name="sendEmail"
              label="Send User Notification"
              checked={formData.sendEmail}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            {userData ? "Save Changes" : "Add User"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer />

    </Modal>
  );
}

export default AddUserModal;
