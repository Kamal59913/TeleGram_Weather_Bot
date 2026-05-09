import { z } from "zod";

export const validationUtils = {
  email: (prefix: string) =>
    z
      .string()
      .min(1, `Please enter ${prefix} email`)
      .email("Please enter a valid email"),

  customField: (fieldName: string, min: number, max: number) =>
    z
      .string()
      .min(min, `Please enter ${fieldName}`)
      .max(max, `${fieldName} must be less than ${max} characters`),

  password: (prefix: string) =>
    z
      .string()
      .min(1, `Please enter ${prefix} password`)
      .min(6, "Password must be at least 6 characters"),
};
