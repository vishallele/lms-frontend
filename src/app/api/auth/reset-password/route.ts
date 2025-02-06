import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

async function handler(request: Request) {

  try {
    const { email, token, password, confirmPassword } = await request.json();

    //get csrf token cookie
    const csrf_res = await axios.get(`${process.env.BACKEND_SERVER_URL}sanctum/csrf-cookie`);
    const csrf_token = getCsrfToken(csrf_res);

    const res = await axios.post(
      `${process.env.BACKEND_SERVER_URL}api/reset-password`,
      {
        "email": email,
        "token": token,
        "password": password,
        "password_confirmation": confirmPassword
      },
      {
        headers: {
          "Content-Type": "application/json",
          'X-XSRF-TOKEN': csrf_token
        }
      }
    ).then((data) => data).catch((error) => error.response);

    if (res.status !== 200) {
      throw new Error(res?.data?.message);
    }

    return NextResponse.json({ body: res?.data?.status }, { status: 200 });

  } catch (err) {

    return NextResponse.json({ error: `${err}` }, { status: 500 });
  }

}

const getCsrfToken = (response: any) => {
  return decodeURIComponent(response.headers['set-cookie'][0].split(';')[0].replace('XSRF-TOKEN=', ''));
}

export { handler as POST }