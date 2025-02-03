import type { Metadata } from "next";

//custom imports
import { NextUiProvider } from "../providers/NextUiProvider";
import SessionWrapper from "../providers/SessionWrapper";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <NextUiProvider>
        {children}
      </NextUiProvider>
    </SessionWrapper>
  );
}
