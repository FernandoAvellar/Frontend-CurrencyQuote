import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Currency Quote App",
  description: "Created by Fernando Avellar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col`}>
        <AuthProvider>
          <Header />
          <ToastContainer position="top-center" autoClose={3000} theme="colored" />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
