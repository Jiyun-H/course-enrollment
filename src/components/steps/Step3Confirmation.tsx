"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { submitEnrollment } from "@/utils/api";
import { EnrollmentResponse, ErrorResponse } from "@/types/enrollment";
import { step2FormSchema } from "@/utils/validation";

import PersonalInfoSummary from "./step3/PersonalInfoSummary";
import GroupInfoSummary from "./step3/GroupInfoSummary";
import SuccessScreen from "./step3/SuccessScreen";
import CourseInfoSummary from "./step3/CourseInfoSummary";
import TermsAgreement from "./step3/TermsAgreement";

export default function Step3Confirmation() {
  const router = useRouter();
  const { formData, resetForm } = useEnrollmentStore();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<EnrollmentResponse | null>(
    null,
  );

  // 성공 화면에 보여줄 데이터를 백업
  const [finalFormData, setFinalFormData] = useState<typeof formData | null>(
    null,
  );

  // 제출 성공 시 브라우저 뒤로가기 방지
  useEffect(() => {
    if (submitSuccess) {
      window.history.pushState(null, "", window.location.href);

      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [submitSuccess]);

  const handleSubmit = async () => {
    if (!agreedToTerms) return alert("이용약관에 동의해주세요.");
    if (!formData.course) return alert("강의 정보가 없습니다.");

    try {
      const validationData = {
        type: formData.type,
        applicant: formData.applicant,
        ...(formData.type === "group" && { group: formData.group }),
      };

      const result = step2FormSchema.safeParse(validationData);

      if (!result.success) {
        console.error("Validation errors:", result.error.flatten());
        const errors = result.error.flatten();
        let errorMessage = "입력 정보를 다시 확인해주세요.\n\n";

        if (errors.fieldErrors) {
          Object.values(errors.fieldErrors)
            .flat()
            .forEach((msg) => {
              if (msg) errorMessage += `• ${msg}\n`;
            });
        }

        errorMessage += "\n2단계로 돌아가서 수정해주세요.";
        return alert(errorMessage);
      }
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return alert(
        "입력 정보 검증 중 오류가 발생했습니다. 2단계로 돌아가서 다시 확인해주세요.",
      );
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitEnrollment({ ...formData, agreedToTerms });

      // 스토어를 비우기 전, 성공 화면에 전달할 데이터를 로컬에 백업
      setFinalFormData(formData);

      //재 제출 차단
      resetForm();

      setSubmitSuccess(response);
    } catch (error) {
      const err = error as ErrorResponse;
      let errorMessage = err.message || "신청 중 오류가 발생했습니다.";

      if (err.code === "COURSE_FULL")
        errorMessage = "선택하신 강의의 정원이 마감되었습니다.";
      else if (err.code === "DUPLICATE_ENROLLMENT")
        errorMessage = "이미 신청한 강의입니다.";
      else if (err.code === "INVALID_INPUT") {
        errorMessage = "입력 정보를 다시 확인해주세요.";
        if (err.details) {
          const detailMessages = Object.entries(err.details)
            .map(([field, message]) => `${field}: ${message}`)
            .join("\n");
          errorMessage += `\n\n상세 내용:\n${detailMessages}`;
        }
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewEnrollment = () => {
    router.push("/enrollment/step/1");
  };

  const handleEdit = (step: number) => {
    router.push(`/enrollment/step/${step}`);
  };

  if (submitSuccess && finalFormData) {
    return (
      <SuccessScreen
        submitSuccess={submitSuccess}
        formData={finalFormData}
        onNewEnrollment={handleNewEnrollment}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">3단계: 확인 및 제출</h2>

      <CourseInfoSummary
        course={formData.course}
        type={formData.type}
        onEdit={() => handleEdit(1)}
      />

      <PersonalInfoSummary
        applicant={formData.applicant}
        onEdit={() => handleEdit(2)}
      />

      {formData.type === "group" && formData.group && (
        <GroupInfoSummary
          group={formData.group}
          applicant={formData.applicant}
          onEdit={() => handleEdit(2)}
        />
      )}

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="flex-1 text-red-800 font-medium mb-2 whitespace-pre-line">
              {submitError}
            </p>
          </div>
        </div>
      )}

      <TermsAgreement
        agreedToTerms={agreedToTerms}
        onAgreeChange={setAgreedToTerms}
      />

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => handleEdit(2)}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isSubmitting
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "text-gray-700 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          이전 단계
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!agreedToTerms || isSubmitting}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            !agreedToTerms || isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "text-white bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              제출 중...
            </>
          ) : (
            "제출하기"
          )}
        </button>
      </div>
    </div>
  );
}
