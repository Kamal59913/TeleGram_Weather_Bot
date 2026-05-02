import { Toaster } from "react-hot-toast";
import type { BaseSyntheticEvent } from "react";
import { useGlobalStates } from "@/redux/hooks/useGlobalStates";
import authService from "@/api/services/authService";
import { ToastService } from "@/utils/toastService";
import { useLoginForm } from "./hook/login.hook";
import { useNavigate } from "react-router-dom";

export default function SignInForm() {
  const { isButtonLoading } = useGlobalStates();
  const formMethods = useLoginForm();
  const navigate = useNavigate();

  const handleFormSubmit = async (
    data: { username: string; password: string },
    e: BaseSyntheticEvent | undefined,
  ) => {
    e?.preventDefault();

    const response: any = await authService?.login(data);
    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Sign in success",
        "sign-in-success"
      );
      navigate("/dashboard");
    } else {
      ToastService.error(
        response.data.message || "Sign in failed",
        "sign-in-fail"
      );
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Toaster />
      <div className="w-full max-w-md pt-10 mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-black text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
              <div className="space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Username <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    {...formMethods.register("username")}
                    autoFocus
                    maxLength={51}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                  />
                  {formMethods.formState.errors.username?.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {formMethods.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Password <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    {...formMethods.register("password")}
                    maxLength={65}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white"
                  />
                  {formMethods.formState.errors.password?.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {formMethods.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                    type="submit"
                    disabled={isButtonLoading("login")}
                  >
                    {isButtonLoading("login") ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary-dark"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
