'use client';

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

//custom component imports
import { Input, Button } from "@heroui/react";
import Notification from "../notification";
import useNotification from "@/hooks/useNotification";
import { resetPassword } from "@/actions/auth";

interface IPasswordResetFormInputs {
  password: string;
  confirmPassword: string;
  token: string;
  email: string;
};

interface PasswordResetProps {
  token: string
}

const PasswordResetValidationSchema = z.object({
  token: z.string(),
  password: z.string({ message: "Password field is required" })
    .nonempty({ message: "Password field is required" }),
  confirmPassword: z.string({ message: "Confirm password field is required" })
    .nonempty({ message: "Confirm password field is required" }),
  email: z.string({ message: "Email field is required" })
    .nonempty({ message: 'Email field is required' })
    .email({ message: 'Enter valid email address' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Confirm password not match with password",
  path: ['confirmPassword']
});

const PasswordResetForm: React.FC<PasswordResetProps> = ({ token }) => {

  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const userEmail = (emailParam !== null) ? emailParam : '';
  const { openNotification, closeNotification } = useNotification();
  const [submitting, isSubmitting] = useState<boolean>(false);
  const { handleSubmit, control, formState: { errors }, register } = useForm<IPasswordResetFormInputs>({
    resolver: zodResolver(PasswordResetValidationSchema), mode: "onSubmit"
  });

  const OnSubmit: SubmitHandler<IPasswordResetFormInputs> = async (data, e) => {

    e?.preventDefault();

    closeNotification;
    isSubmitting(true);

    try {

      const passwordResetRes = await resetPassword(data);

      if (passwordResetRes.error) {
        throw new Error(passwordResetRes.error);
      }

      isSubmitting(false);
      openNotification(`${passwordResetRes.success}`, 'success');

    } catch (err) {
      openNotification(`${err}`, 'danger');
      isSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 md:px-0 h-screen w-full max-w-md">
      <Notification />
      <div className="flex justify-center items-center mb-2 w-full">
        <h1 className="font-extrabold dark:text-white text-black text-2xl tracking-tight leading-9">Reset your password</h1>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(OnSubmit)}>
        <div className="flex flex-wrap w-full">
          <input {...register('token')} type="hidden" value={token} />
          <input {...register('email')} type="hidden" value={userEmail} />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Enter new password"
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
                placeholder="Confirm your new password"
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
          focus:ring-0"
          type="submit"
          isLoading={submitting}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default PasswordResetForm;