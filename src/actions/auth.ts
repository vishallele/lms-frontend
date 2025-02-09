"use server";

import { apiClient } from "@/lib/interceptor";
import { getCsrfToken } from "@/lib/helper";


/**
 * Register new user
 */
export async function register({
  fullName,
  email,
  password,
  confirmPassword
}: IUserRegister) {

  try {
    const csrfToken = await getCsrfToken();
    const userRegResponse = await apiClient.post("api/register",
      {
        "full_name": fullName,
        "email": email,
        "password": password,
        "auth_type": 'email',
        "password_confirmation": confirmPassword
      },
      {
        headers: {
          "Content-Type": "application/json",
          'X-XSRF-TOKEN': csrfToken
        }
      }
    ).then((userData) => userData.data).catch((error) => error.response);

    if (!userRegResponse.uid) {
      throw new Error("Failed to create account");
    }
    return userRegResponse;
  } catch (error) {
    console.log('register function error:', error);
    return false;
  }
}

/**
 * Check if user exist or not by using email
 */
export async function CheckUserExistsOrNot(email: string) {
  try {
    const isUserExistsRes = await apiClient.get(
      `api/verify-user-email/${email}`
    ).then((data) => data.data).catch((error) => error.response);
    if (isUserExistsRes.isUserExist) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}


/**
 * Send reset password email to user
 */
export async function forgotPassword(email: string) {
  try {
    const csrfToken = await getCsrfToken();
    const forgotPassRes = await apiClient.post(
      `api/forgot-password`,
      { "email": email },
      {
        headers: {
          "Content-Type": "application/json",
          'X-XSRF-TOKEN': csrfToken
        }
      }
    ).then((data) => data).catch((error) => error.response);

    if (forgotPassRes.status !== 200) {
      return { 'error': forgotPassRes?.data?.message }
    }
    return { 'success': forgotPassRes?.data?.status };
  } catch (error) {
    return { 'error': error }
  }
}

/**
 * Reset user password
 */
export async function resetPassword({
  email,
  token,
  password,
  confirmPassword
}: IResetPassword) {

  try {
    const csrfToken = await getCsrfToken();
    const resetPassRes = await apiClient.post(
      `api/reset-password`,
      {
        'email': email,
        'token': token,
        'password': password,
        'password_confirmation': confirmPassword
      },
      {
        headers: {
          "Content-Type": "application/json",
          'X-XSRF-TOKEN': csrfToken
        }
      }
    ).then((data) => data).catch((error) => error);

    if (resetPassRes.status !== 200) {
      return { "error": resetPassRes?.data?.message };
    }

    return { "success": resetPassRes?.data?.status };
  } catch (error) {
    return { 'error': error };
  }

}