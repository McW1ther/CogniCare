import { Home, SmilePlus, NotebookPen, Quote, Activity } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true, tourKey: undefined },
  { to: "/check-in", label: "Check in", icon: SmilePlus, end: false, tourKey: undefined },
  { to: "/diary", label: "Diary", icon: NotebookPen, end: false, tourKey: "nav-diary" },
  { to: "/quotes", label: "Quotes", icon: Quote, end: false, tourKey: "nav-quotes" },
  { to: "/insights", label: "Insights", icon: Activity, end: false, tourKey: "nav-insights" },
] as const;
