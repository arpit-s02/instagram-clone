import { InputProps } from "./types";

const Input = ({
  type,
  placeholder,
  name,
  value,
  handleChange,
}: InputProps) => {
  return (
    <input
      className="py-3 px-4 w-full bg-[#FAFAFA] placeholder-[rgba(0,0,0,0.2)] border border-[rgba(0,0,0,0.1)] rounded focus:outline-none"
      type={type || "text"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
    />
  );
};

export default Input;
