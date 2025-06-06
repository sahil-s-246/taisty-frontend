import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy authentication (Replace with real authentication API)
    if (username === "admin" && password === "admin") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      setError("Invalid credentials. Try again!");
    }
  };

  const handleSignup = () => {
    navigate("/signup"); // Change the route as per your app
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Taisty</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />

          <div className="flex justify-between gap-2 mb-3">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleSignup}
              className="w-1/2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p
          onClick={() => navigate("/res")} // Change this route if needed
          className="text-sm text-blue-600 text-center mt-4 cursor-pointer hover:underline"
        >
          Skip Sign Up
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
