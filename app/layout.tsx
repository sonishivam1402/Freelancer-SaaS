import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper"; 

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper> 
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
