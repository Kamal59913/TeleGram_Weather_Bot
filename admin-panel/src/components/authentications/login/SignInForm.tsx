import { Toaster } from "react-hot-toast";
import type { BaseSyntheticEvent } from "react";
import { useGlobalStates } from "@/redux/hooks/useGlobalStates";
import authService from "@/api/services/authService";
import { ToastService } from "@/utils/toastService";
import { useLoginForm } from "./hook/login.hook";
import { useNavigate } from "react-router-dom";
import Label from "../../ui/form/Label";
import InputField from "../../ui/form/input/InputField";
import { PasswordInput } from "../../ui/form/input/PasswordInput";
import Button from "../../ui/button/Button";

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
            <h1 className="mb-2 font-semibold text-black text-title-sm sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>
                  </Label>
                  <InputField
                    type="text"
                    placeholder="Enter your username"
                    register={formMethods.register}
                    registerOptions="username"
                    errors={formMethods.formState.errors}
                    autoFocus
                    maxLength={51}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <PasswordInput
                    placeholder="Enter your password"
                    register={formMethods.register}
                    registerOptions="password"
                    errors={formMethods.formState.errors}
                    maxLength={65}
                  />
                </div>
                <div>
                  <Button
                    className="w-full"
                    type="submit"
                    loadingState={isButtonLoading("login")}
                    borderRadius="rounded-lg"
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
