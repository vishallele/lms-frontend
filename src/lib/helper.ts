"use server"

import { apiClient } from "./interceptor";
//import { cookies } from "next/headers";

export async function getCsrfToken() {
  try {
    /*const cookieStore = await cookies();
    const csrfToken = cookieStore.get('XSRF-TOKEN')?.value;
    if (csrfToken) {
      return decodeURIComponent(csrfToken);
    }*/
    const csrfResponse = await apiClient.get('sanctum/csrf-cookie');
    const responseToken = getCsrfTokenFromCookie(csrfResponse);
    return responseToken;
  } catch (error) {
    return null;
  }
}

const getCsrfTokenFromCookie = (response: any) => {
  return decodeURIComponent(response.headers['set-cookie'][0].split(';')[0].replace('XSRF-TOKEN=', ''));
}