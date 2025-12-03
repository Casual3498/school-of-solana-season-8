import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/WalletProvider";
import { VoteProvider } from "@/contexts/VoteContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vote D-21 | Solana Voting dApp",
  description: "Decentralized voting application on Solana blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWalletProvider>
          <VoteProvider>
            {children}
          </VoteProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
