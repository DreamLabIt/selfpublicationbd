import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/context/AuthContext";
import { cookies } from "next/headers";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Toaster } from "sonner";
import RefreshTokenProvider from "@/components/providers/RefreshTokenProvider";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://selfpublicationbd.com"),
  title: {
    default:
      "Self Publications | সরকারি চাকরি (১১–২০তম গ্রেড) প্রস্তুতির বিশ্বস্ত প্রকাশনী ও সেরা সমাধান",
    template: "%s | Self Preparation BD",
  },
  description:
    "মন্ত্রণালয়, বিভাগ, অধিদপ্তর, কর অঞ্চল, ডিসি অফিস সহ বিভিন্ন সরকারি দপ্তরের ১১-২০ তম গ্রেডের লিখিত ও MCQ প্রস্তুতির নির্ভরযোগ্য ও শ্রেষ্ঠ সহায়িকা সেল্ফ প্রকাশনীর বই",
  keywords: [
    "১১-২০ গ্রেড চাকরি প্রস্তুতি",
    "সেল্ফ প্রকাশনী বই",
    "Self Publications books",
    "Grade 11-20 Job Preparation",
    "Govt Job Preparation Book",
  ],
  authors: [{ name: "Muhammad Mustak" }],
  openGraph: {
    type: "website",
    siteName: "Self Preparation BD",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const hasToken = Boolean(
    cookieStore.get("refreshToken")?.value || cookieStore.get("accessToken")?.value
  );

  return (
    <html lang="en" className={hindSiliguri.variable} data-scroll-behavior="smooth">
      <body>
        <AuthProvider initialHasToken={hasToken}>
          <RefreshTokenProvider>
            <I18nProvider>
              <CartProvider>
                <Navbar />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    className: "font-sans text-sm shadow-xl rounded-xl p-4 border transition-all",
                    classNames: {
                      success: "!text-[#4ade80] !border-[#22c55e]/30",
                      error: "!text-[#f87171] !border-[#d61f1f]/40",
                      warning: "!text-[#fbbf24] !border-[#f59e0b]/30",
                      info: "!text-[#60a5fa] !border-[#3b82f6]/30",
                    },
                  }}
                />
                {children}
                <Footer />
              </CartProvider>
            </I18nProvider>
          </RefreshTokenProvider>
        </AuthProvider>
      </body>
    </html>
  );
}