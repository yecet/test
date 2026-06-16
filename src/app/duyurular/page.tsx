import type { Metadata } from "next";
import DuyurularClient from "./DuyurularClient";

export const metadata: Metadata = {
  title: "Duyurular",
  description: "Oğuzhan Kapukaya'nın ders ve akademik duyuruları.",
};

export default function DuyurularPage() {
  return <DuyurularClient />;
}
