"use client";

import { Suspense } from "react";
import FuelFormContent from "./FuelFormContent";

export default function FuelFormPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <FuelFormContent />
    </Suspense>
  );
}
