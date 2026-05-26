"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect } from "react";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import Step1CourseSelection from "@/components/steps/Step1CourseSelection";
import Step2StudentInfo from "@/components/steps/Step2StudentInfo";
import Step3Confirmation from "@/components/steps/Step3Confirmation";
import { Step } from "@/types/enrollment";

export default function StepPage() {
  const params = useParams();
  const { setStep } = useEnrollmentStore();
  const step = parseInt(params.step as string) as Step;

  if (step < 1 || step > 3) {
    notFound();
  }
  useEffect(() => {
    setStep(step);
  }, [step, setStep]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step > 1) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [step]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {step === 1 && <Step1CourseSelection />}
        {step === 2 && <Step2StudentInfo />}
        {step === 3 && <Step3Confirmation />}
      </div>
    </main>
  );
}
