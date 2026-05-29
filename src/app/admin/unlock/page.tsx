import { Suspense } from "react";
import { UnlockForm } from "@/components/UnlockForm";

export default function AdminUnlockPage() {
  return (
    <Suspense>
      <UnlockForm mode="admin" />
    </Suspense>
  );
}
