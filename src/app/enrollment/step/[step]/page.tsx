// src/app/enrollment/step/[step]/page.tsx
"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { useEffect } from "react";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import Step1CourseSelection from "@/components/steps/Step1CourseSelection";
import Step2StudentInfo from "@/components/steps/Step2StudentInfo";
import Step3Confirmation from "@/components/steps/Step3Confirmation";
import { Step } from "@/types/enrollment";

export default function StepPage() {
  const params = useParams();
  const router = useRouter();
  const { setStep } = useEnrollmentStore();

  const step = parseInt(params.step as string) as Step;

  // 유효하지 않은 step이면 404
  if (step < 1 || step > 3) {
    notFound();
  }

  // URL 변경 시 store 동기화
  useEffect(() => {
    setStep(step);
  }, [step, setStep]);

  // 브라우저 뒤로가기 방지 (입력 중일 때)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Step 1이 아니고 데이터가 있으면 경고
      if (step > 1) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step]);

  return (
    <>
      {step === 1 && <Step1CourseSelection />}
      {step === 2 && <Step2StudentInfo />}
      {step === 3 && <Step3Confirmation />}
    </>
  );
}
