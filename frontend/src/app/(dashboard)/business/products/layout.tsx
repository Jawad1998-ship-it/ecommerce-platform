import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "Product Items",
  description: "buy products easily and quickly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
