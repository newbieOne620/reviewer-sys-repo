import localFont from "next/font/local";
import "./globals.css";
import Mainlayout from "./mainlayout";
import SessionProviderWrapper from "./sessionprovider";
export const metadata = {
  title: "Reviewer system",
  description: "Reviewer system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <Mainlayout>{children}</Mainlayout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
