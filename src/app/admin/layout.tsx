import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/AdminUI";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Oğuzhan Kapukaya",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
