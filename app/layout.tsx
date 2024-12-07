import React from 'react';
import type { Metadata } from 'next';
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from '@/components/layout/sidebar';
import { TodoProvider } from '@/contexts/TodoContext';
import { LocaleProvider } from '@/contexts/LocaleContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: '任务管理系统',
  description: '个人任务管理系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LocaleProvider>
          <TodoProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <div className="p-6">{children}</div>
              </main>
            </div>
          </TodoProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
