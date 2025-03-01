import LoginForm from "../../components/LoginForm";
import Logo from "../../components/Logo";

const Login = () => {
  return (
    <div className="p-4 h-screen flex flex-col justify-center items-center gap-10">
      <Logo />
      <LoginForm />
    </div>
  );
};

export default Login;
