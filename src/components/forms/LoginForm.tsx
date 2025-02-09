'use client';

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, Button, Link } from "@heroui/react";

//custom component imports
import { GoogleSvg, FacebookSvg } from "../svgs";
import Notification from "../notification";
import useNotification from "@/hooks/useNotification";



interface ILoginFormInputs {
  email: string;
  password: string;
};

const LoginValidationSchema = z.object({
  email: z.string({ message: "Email field is required" }).nonempty({ message: 'Email field is required' })
    .email({ message: 'Enter valid email address' }),
  password: z.string({ message: "Password field is required" }).nonempty({ message: "Password field is required" })
});

const LoginForm = () => {

  const router = useRouter();
  const { openNotification, closeNotification } = useNotification();
  const [submitting, isSubmitting] = useState<boolean>(false);
  const { handleSubmit, control, formState: { errors } } = useForm<ILoginFormInputs>({
    resolver: zodResolver(LoginValidationSchema), mode: "all"
  });

  const OnSubmit: SubmitHandler<ILoginFormInputs> = (data, e) => {

    e?.preventDefault();

    closeNotification;
    isSubmitting(true);

    signIn('credentials', { redirect: false, ...data, callbackUrl: '/dashboard' })
      .then((callback) => {
        if (callback?.ok) {
          router.push('/dashboard');
        }

        if (callback?.error) {
          isSubmitting(false);
          openNotification(callback?.error, "danger");
        }

      });
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0 h-full w-full mt-14 max-w-md">
      <Notification />
      <div className="flex justify-center items-center mb-5 w-full">
        <h1 className="font-extrabold dark:text-white text-black text-2xl tracking-tight leading-9">Log In</h1>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(OnSubmit)}>
        <div className="flex w-full flex-wrap">
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Enter email address"
                type="email"
                size="lg"
                onChange={onChange}
              />
            )}
          />
          {errors.email && <p className="text-medium font-semibold text-red-600 mt-2">{errors.email.message}</p>}
        </div>
        <div className="flex w-full flex-wrap">
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Enter password"
                type="password"
                size="lg"
                onChange={onChange}
              />
            )}
          />
          <div className="flex justify-end items-center w-full mt-3">
            <Link className="text-black dark:text-sky-500 font-bold" href="/forgot-password">Forgot Password?</Link>
          </div>
          {errors.password && <p className="text-medium font-semibold text-red-600 mt-2">{errors.password.message}</p>}
        </div>
        <Button
          className="
          font-bold 
          bg-sky-500 
          w-full
          text-sm 
          text-neutral-800
          hover:bg-sky-300
          tracking-wide
          uppercase
          focus:ring-0
        "
          type="submit"
          isLoading={submitting}
        >
          Log In
        </Button>
      </form>
      <div className="flex items-center space-x-1">
        <div className="flex-1 h-1 sm:w-16 dark:bg-gray-500 bg-gray-700"></div>
        <p className="px-3 text-sm font-bold dark:text-gray-500 text-gray-700">OR</p>
        <div className="flex-1 h-1 sm:w-16 dark:bg-gray-500 bg-gray-700"></div>
      </div>
      <div className="flex items-center justify-between w-full gap-2">
        <Button
          className="w-full border border-gray-500 text-gray-500 font-bold"
          variant="bordered"
          isDisabled={submitting}
          onPress={() => {
            isSubmitting(true);
            signIn('google', { callbackUrl: '/dashboard' });
          }}
        >
          <GoogleSvg />
          GOOGLE
        </Button>
        <Button
          className="w-full border border-gray-500 font-bold text-gray-500"
          variant="bordered"
          isDisabled={submitting}
          onPress={() => {
            isSubmitting(true);
            signIn('facebook', { callbackUrl: '/dashboard' });
          }}
        >
          <FacebookSvg />
          FACEBOOK
        </Button>
      </div>
    </div>

  );
}

export default LoginForm;