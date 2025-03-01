import Input from "../Input";
import useLogin from "../../hooks/useLogin";

const LoginForm = () => {
  const { credentials, loading, error, isValid, handleChange, handleSubmit } =
    useLogin();

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Username"
          name="email"
          value={credentials.email}
          handleChange={handleChange}
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={credentials.password}
          handleChange={handleChange}
        />
      </div>
      <button
        className={`py-3 w-full text-center text-white bg-[#3797EF] ${
          !isValid || loading ? "opacity-25" : "cursor-pointer"
        }`}
        disabled={!isValid || loading}
      >
        Log in
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
};

export default LoginForm;
