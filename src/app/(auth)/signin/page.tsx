
import { Button, Link } from "@heroui/react";

//custom components import
import LoginForm from "@/components/forms/LoginForm";
import { ThemeSwitcher } from "@/components/themeswitcher";

export default function SignIn() {

  return (
    <>
      <div className="flex w-full justify-end p-4 gap-4">
        <Button
          as={Link}
          variant="bordered"
          href="/signup"
          className="font-bold text-sm dark:text-sky-500 light:text-black tracking-tight uppercase">
          Sign Up
        </Button>
        <ThemeSwitcher />
      </div>
      <div className="flex items-center mx-auto justify-center mt-5">
        <LoginForm />
      </div>
    </>
  );
}
