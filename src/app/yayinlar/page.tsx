import type { Metadata } from "next";
import YayinlarClient from "./YayinlarClient";

export const metadata: Metadata = {
  title: "Yayınlar",
  description:
    "Oğuzhan Kapukaya'nın akademik yayınları. Dergi makaleleri, konferans bildirileri ve tezler.",
};

export default function YayinlarPage() {
  return <YayinlarClient />;
}
