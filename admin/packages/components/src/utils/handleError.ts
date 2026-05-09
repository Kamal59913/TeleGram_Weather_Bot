export const handleError = (error: any) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

  console.error("API Error:", error);

  return {
    success: false,
    message,
  };
};
