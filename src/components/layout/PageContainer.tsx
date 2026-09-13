import type { ReactNode } from "react";

export function PageContainer({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`mx-auto w-full px-5 py-8 sm:px-8 sm:py-12 ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
      {children}
    </div>
  );
}
