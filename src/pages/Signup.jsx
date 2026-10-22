
import { useState } from "react";
import { useApp } from "../context/AppContext";
import {  useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [invalidFields, setInvalidFields] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
  });
  const navigate = useNavigate();

  function showError(field, message) {
    setInvalidFields({
      name: false,
      email: false,
      username: false,
      password: false,
      [field]: true,
    });

    setError(message);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /[0-9_]/;
  const nameRegex = /^[a-zA-Z]+$/;

  function handlechange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setInvalidFields((previous) => ({
      ...previous,
      [name]: false,
    }));

    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    const emptyFields = {
      name: !name,
      email: !email,
      username: !username,
      password: !password,
    };

    if (Object.values(emptyFields).some(Boolean)) {
      setInvalidFields(emptyFields);
      setError("All fields are required.");
      return;
    }

    if (name.length < 2) {
      showError("name", "Name must contain at least 2 characters.");
      return;
    }

    if (!nameRegex.test(name)) {
      showError("name", "Name must contain only English letters.");
      return;
    }

    if (!emailRegex.test(email)) {
      showError("email", "Please enter a valid email address.");
      return;
    }

    if (!usernameRegex.test(username)) {
      showError("username", "Username must contain a number or underscore.");
      return;
    }

    if (password.length <= 8 || password.length >= 12) {
      showError("password", "Password must be 9–11 characters long.");
      return;
    }

    const result = signup({ name, email, username, password });

    if (!result.success) {
      const message = result.message.toLowerCase();

      if (message.includes("email")) {
        showError("email", result.message);
      } else if (message.includes("username")) {
        showError("username", result.message);
      } else {
        setError(result.message);
      }

      return;
    }

    setForm({
      name: "",
      email: "",
      username: "",
      password: "",
    });

    setInvalidFields({
      name: false,
      email: false,
      username: false,
      password: false,
    });

    setError("");
    navigate("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <input
        className={
          invalidFields.name
            ? "border border-red-500"
            : "border border-gray-300"
        }
        name="name"
        value={form.name}
        onChange={handlechange}
        placeholder="Your name"
      />

      <input
        className={
          invalidFields.email
            ? "border border-red-500"
            : "border border-gray-300"
        }
        type="email"
        name="email"
        value={form.email}
        onChange={handlechange}
        placeholder="Your email"
      />

      <input
        className={
          invalidFields.username
            ? "border border-red-500"
            : "border border-gray-300"
        }
        name="username"
        value={form.username}
        onChange={handlechange}
        placeholder="Your username"
      />

      <input
        className={
          invalidFields.password
            ? "border border-red-500"
            : "border border-gray-300"
        }
        type="password"
        name="password"
        value={form.password}
        onChange={handlechange}
        placeholder="Password"
      />

      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      <button type="submit">Sign up</button>
      
    </form>
  );
}

export default Signup;