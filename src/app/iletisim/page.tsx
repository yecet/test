import type { Metadata } from "next";
import IletisimClient from "./IletisimClient";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Oğuzhan Kapukaya ile iletişime geçin. Sorularınız, ders talepleriniz veya araştırma iş birliği için.",
};

export default function IletisimPage() {
  return <IletisimClient />;
}
