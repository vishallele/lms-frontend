'use client';

import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Button className="font-extrabold">{session.user.fullName}</Button>
        <Button className="font-extrabold ml-5" onPress={() => {
          signOut();
        }}>
          Sign Out
        </Button>
      </>
    );
  }

  if (!session) {
    return (
      <Button className="font-extrabold">You are not logged in.</Button>
    );
  }


}
