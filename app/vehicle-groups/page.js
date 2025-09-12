"use client";

import { Suspense } from "react";
import VehicleGroupsContent from "./VehicleGroupsContent";

export default function VehicleGroupsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading vehicle groups...</p>
        </div>
      </div>
    }>
      <VehicleGroupsContent />
    </Suspense>
  );
}
