import { useState,useRef } from "react";
import { useApp } from "../context/AppContext"
import { useNavigate} from "react-router-dom"

function Login() {
  const { login } = useApp();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const emailRef= useRef(null);

  const [error, setError] = useState("");
  const navigate = useNavigate();

function handlechange(e){
const { name, value } = e.target;
setForm((prev)=>({...prev,[name]:value}))
}
function handleSubmit(e) {
  e.preventDefault();
  const email = form.email.trim();
  const password = form.password;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  setError("");

  if (!email || !password) {
    setError("All fields are required.");
    emailRef.current.focus()
    return;
  }
if(!emailRegex.test(email)){
    setError('Please enter a valid email address.')
    return;

}
if (password.length <= 8 || password.length >= 12) {
      setError("Password must be 9–11 characters long.");
      return;
    }


  const result = login({
    email,
    password
  });

  if (!result.success) {
    setError(result.message);
    return;
  }

  setError("");
  navigate("/posts");
 
}
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <input
      ref={emailRef}
        type="email"
        name="email"
        value={form.email}
        onChange={handlechange}
        placeholder="Your email"
      />

      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handlechange}
        placeholder="Your password"
      />
      {error && (
  <p className="text-red-500 text-sm">
    {error}
  </p>
)}

      <button type="submit">Login</button>
     
    </form>
  );
}

export default Login;