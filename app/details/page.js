"use client";

import { Suspense } from "react";
import DetailsContent from "./DetailsContent";

export default function DetailsPage() {
  return (
    <Suspense fallback={<div>Loading details...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
