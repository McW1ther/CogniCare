import { Home, SmilePlus, NotebookPen, Quote, Activity } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/check-in", label: "Check in", icon: SmilePlus, end: false },
  { to: "/diary", label: "Diary", icon: NotebookPen, end: false },
  { to: "/quotes", label: "Quotes", icon: Quote, end: false },
  { to: "/insights", label: "Insights", icon: Activity, end: false },
] as const;
