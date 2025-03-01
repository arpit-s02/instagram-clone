import React from "react";

export type InputProps = {
  type?: string;
  placeholder: string;
  name: string;
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
