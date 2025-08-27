"use client";

import { Suspense } from "react";
import ClaimGiftContent from "./ClaimGiftContent";

export default function ClaimGiftPage() {
  return (
    <Suspense fallback={<div>Loading gift...</div>}>
      <ClaimGiftContent />
    </Suspense>
  );
}
