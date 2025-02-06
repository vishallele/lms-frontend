
//custom components import
import PasswordResetForm from "@/components/forms/PasswordReset";
import { ThemeSwitcher } from "@/components/themeswitcher";

export default async function PasswordReset({ params }: { params: { token: string } }) {
  return (
    <>
      <div className="flex w-full justify-end p-4 gap-4">
        <ThemeSwitcher />
      </div>
      <div className="flex items-center mx-auto justify-center mt-5">
        <PasswordResetForm token={params.token} />
      </div>
    </>
  )
}