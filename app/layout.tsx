import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Creova AI",
  description: "AI Product Studio",
  icons: {
    icon: [
      {
        url: '/creova-logo-icon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/creova-logo-icon.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/creova-logo-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/creova-logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/creova-logo-icon.png" />
      </head>
      <body
        className={`${syne.variable} antialiased`}
      >
        <Provider attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
