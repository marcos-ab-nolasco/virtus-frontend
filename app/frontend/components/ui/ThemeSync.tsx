"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeSync() {
  // Apply persisted/system theme on client mount.
  useTheme();
  return null;
}
