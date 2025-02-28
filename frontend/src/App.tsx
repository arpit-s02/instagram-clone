import React, { Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
// import Login from "./pages/Login";

const Login = React.lazy(() => import("./pages/Login"));

function App() {
  return (
    <Suspense fallback={<p className="font-bold text-red-500">Loading...</p>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Link to="/login">Login</Link>} />
      </Routes>
    </Suspense>
  );
}

export default App;
