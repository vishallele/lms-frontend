
import { Button, Link } from "@heroui/react";

//custom components import
import RegistrationForm from "@/components/forms/RegistrationForm";
import { ThemeSwitcher } from "@/components/themeswitcher";

export default async function SignUp() {

  return (
    <>
      <div className="flex w-full justify-end p-4 gap-4">
        <Button
          as={Link}
          variant="bordered"
          href="/signin"
          className="font-bold text-sm dark:text-sky-500 light:text-black tracking-tight uppercase">
          Sign In
        </Button>
        <ThemeSwitcher />
      </div>
      <div className="flex items-center mx-auto justify-center mt-2">
        <RegistrationForm />
      </div>
    </>
  );
}
