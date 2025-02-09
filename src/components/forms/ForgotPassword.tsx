'use client';

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

//custom component imports
import { Input, Button } from "@heroui/react";
import Notification from "../notification";
import useNotification from "@/hooks/useNotification";
import { forgotPassword } from "@/actions/auth";

interface IForgotPasswordFormInputs {
  email: string;
};

const ResetValidationSchema = z.object({
  email: z.string({ message: "Email field is required" })
    .nonempty({ message: 'Email field is required' })
    .email({ message: 'Enter valid email address' })
});

const ForgotPasswordForm = () => {

  const { openNotification, closeNotification } = useNotification();
  const [submitting, isSubmitting] = useState<boolean>(false);
  const { handleSubmit, control, formState: { errors } } = useForm<IForgotPasswordFormInputs>({
    resolver: zodResolver(ResetValidationSchema), mode: "onSubmit"
  });

  const OnSubmit: SubmitHandler<IForgotPasswordFormInputs> = async (data, e) => {

    e?.preventDefault();

    closeNotification;
    isSubmitting(true);

    try {

      const forgotPasswordRes = await forgotPassword(data.email);

      if (forgotPasswordRes.error) {
        throw new Error(forgotPasswordRes.error);
      }

      isSubmitting(false);
      openNotification(`${forgotPasswordRes.success}`, 'success');

    } catch (err) {
      openNotification(`${err}`, 'danger');
      isSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0 h-screen w-full max-w-md">
      <Notification />
      <div className="flex justify-center items-center mb-2 w-full">
        <h1 className="font-extrabold dark:text-white text-black text-2xl tracking-tight leading-9">Forgot your password</h1>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(OnSubmit)}>
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
          focus:ring-0"
          type="submit"
          isLoading={submitting}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;