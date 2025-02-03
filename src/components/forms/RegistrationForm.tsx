'use client';

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

//custom component imports
import { Input, Button } from "@heroui/react";
import { GoogleSvg, FacebookSvg } from "../svgs";
import Notification from "../notification";
import useNotification from "@/hooks/useNotification";

interface IRegisterFormInputs {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterValidationSchema = z.object({
  fullName: z.string({ message: 'Full name is required field' }).nonempty({ message: 'Full name is required field' }),
  email: z.string({ message: "Email field is required" }).nonempty({ message: 'Email field is required' })
    .email({ message: 'Enter valid email address' })
    .refine(async (email) => {
      const isUser = await axios.get(`/api/auth/register?email=${email}`)
        .then((data) => data.data)
        .catch((error) => error);
      if (isUser.body) {
        return false;
      }
      return true;
    }, { message: "The email has already been taken" }),
  password: z.string({ message: "Password field is required" }).nonempty({ message: "Password field is required" }),
  confirmPassword: z.string({ message: "Confirm password field is required" }).nonempty({ message: "Confirm password field is required" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirm password not match with password",
  path: ['confirmPassword']
});


const RegistrationForm = () => {

  const router = useRouter();
  const { openNotification, closeNotification } = useNotification();
  const [submitting, isSubmitting] = useState<boolean>(false);
  const { handleSubmit, control, formState: { errors } } = useForm<IRegisterFormInputs>({
    resolver: zodResolver(RegisterValidationSchema), mode: "all"
  });

  const OnSubmit: SubmitHandler<IRegisterFormInputs> = async (data, e) => {

    e?.preventDefault();

    closeNotification;
    isSubmitting(true);

    try {
      const response = await axios.post(
        `/api/auth/register`,
        data
      ).then((data) => data.data).catch(error => error.response);

      if (!response.body.uid) {
        throw new Error("Failed to create account.");
      }

      await signIn(
        'credentials',
        { redirect: false, ...data, callbackUrl: '/dashboard' }
      ).then((callback) => {
        if (callback?.ok) {
          router.push('/dashboard');
        }

        if (callback?.error) {
          isSubmitting(false);
          openNotification(callback?.error, "danger");
        }
      });
    } catch (error) {
      openNotification("Failed to create account", 'danger');
      isSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0 h-screen w-full max-w-md">
      <Notification />
      <div className="flex justify-center items-center mb-2 w-full">
        <h1 className="font-extrabold dark:text-white text-black text-2xl tracking-tight leading-9">Register</h1>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(OnSubmit)}>
        <div className="flex flex-wrap w-full">
          <Controller
            name="fullName"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Enter full name"
                className="
                w-full   
                font-bold 
                text-2xl"
                size="lg"
                onChange={onChange}
              />
            )}
          />
          {errors.fullName && <p className="text-medium font-semibold text-red-600 mt-2">{errors.fullName.message}</p>}
        </div>
        <div className="flex flex-wrap w-full">
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Enter email address"
                className="
                w-full   
                font-bold 
                text-2xl"
                type="email"
                size="lg"
                onChange={onChange}
              />
            )} />
          {errors.email && <p className="text-medium font-semibold text-red-600 mt-2">{errors.email.message}</p>}
        </div>
        <div className="flex flex-wrap w-full">
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Enter password"
                className="w-full font-bold text-2xl dark:bg-black light:bg-white"
                type="password"
                size="lg"
                onChange={onChange}
              />
            )}
          />
          {errors.password && <p className="text-medium font-semibold text-red-600 mt-2">{errors.password.message}</p>}
        </div>
        <div className="flex flex-wrap w-full">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Enter Confirm password"
                className="w-full font-bold text-2xl dark:bg-black light:bg-white"
                type="password"
                size="lg"
                onChange={onChange}
              />
            )}
          />
          {errors.confirmPassword && <p className="text-medium font-semibold text-red-600 mt-2">{errors.confirmPassword.message}</p>}
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
          Sign Up
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

export default RegistrationForm;