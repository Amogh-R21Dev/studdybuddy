import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./Sidebar";
import SessionWrapper from "./SessionWrapper";

export const metadata: Metadata = {
  title: "StudyBuddy",
  description: "Your feed, summarized. No more accidental scrolling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: "flex" }}>
        <SessionWrapper>
          <Sidebar />
          <div style={{ flex: 1, position: "relative" }}>{children}</div>
        </SessionWrapper>
      </body>
    </html>
  );
}