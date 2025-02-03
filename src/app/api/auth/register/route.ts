import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

async function handler(request: Request) {

  try {
    const body = await request.json();

    const userData = {
      "full_name": body.fullName,
      "email": body.email,
      "password": body.password,
      "auth_type": 'email',
      "password_confirmation": body.confirmPassword
    };

    //get csrf token cookie
    const csrf_res = await axios.get(`${process.env.BACKEND_SERVER_URL}sanctum/csrf-cookie`);
    const csrf_token = getCsrfToken(csrf_res);

    const res = await axios.post(
      `${process.env.BACKEND_SERVER_URL}api/register`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          'X-XSRF-TOKEN': csrf_token
        }
      }
    ).then((data) => data.data).catch((error) => error.response);

    if (!res?.uid) {
      throw new Error("Failed to create account");
    }

    return NextResponse.json({ body: res }, { status: 200 });

  } catch (error) {
    console.log("in catch block:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

}

async function getUserByEmail(request: NextRequest) {
  try {

    const { nextUrl: { search } } = request;
    const urlSearhParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearhParams.entries());

    console.log("param email:", params.email);

    const res = await axios.get(
      `${process.env.BACKEND_SERVER_URL}api/verify-user-email/${params.email}`
    ).then((data) => data.data).catch((error) => error.response);

    console.log("api response", res);

    if (res.isUserExist) {
      return NextResponse.json({ body: true }, { status: 200 });
    }

    return NextResponse.json({ body: false }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ body: false }, { status: 200 });
  }
}

const getCsrfToken = (response: any) => {
  return decodeURIComponent(response.headers['set-cookie'][0].split(';')[0].replace('XSRF-TOKEN=', ''));
}


export { handler as POST, getUserByEmail as GET }