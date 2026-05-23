// src/app/enrollment/layout.tsx
"use client";

import StepIndicator from "@/components/common/StepIndicator";
import { usePathname, useRouter } from "next/navigation";
import { Step } from "@/types/enrollment";

export default function EnrollmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // URL에서 현재 step 추출
  const currentStep = parseInt(pathname.split("/").pop() || "1") as Step;

  const handleStepClick = (step: Step) => {
    router.push(`/enrollment/step/${step}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          수강 신청
        </h1>

        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {children}
      </div>
    </main>
  );
}
