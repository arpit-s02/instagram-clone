import { useState } from "react";
import Logo from "../../components/Logo";
import Input from "../../components/Input";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="p-4 h-screen flex flex-col justify-center items-center gap-10">
      <Logo />
      <form className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            handleChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button className="py-3 w-full text-center text-white bg-[#3797EF]">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
