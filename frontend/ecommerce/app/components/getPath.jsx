"use client";

import { usePathname } from "next/navigation";

export default function getPath() {
  const pathName = usePathname();
  return pathName;
}
