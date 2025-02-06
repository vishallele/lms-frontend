//custom components import
import ForgotPasswordForm from "@/components/forms/ForgotPassword";
import { ThemeSwitcher } from "@/components/themeswitcher";

export default function ForgotPassword() {

  return (
    <>
      <div className="flex w-full justify-end p-4 gap-4">
        <ThemeSwitcher />
      </div>
      <div className="flex items-center mx-auto justify-center mt-5">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
