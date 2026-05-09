import { z } from "zod";

const weatherConfigValidation = z.object({
  api: z
    .string()
    .min(1, { message: "API key is required" })
    .max(100, { message: "API key cannot exceed 100 characters" })
    .trim(),
});

export default weatherConfigValidation;
