// src/components/steps/Step3Confirmation.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { submitEnrollment } from "@/utils/api";
import { EnrollmentResponse, ErrorResponse } from "@/types/enrollment";
import PersonalInfoSummary from "./step3/personalInfoSummary";
import GroupInfoSummary from "./step3/groupInfoSummary";
import { step2FormSchema } from "@/utils/validation"; // ✅ 추가

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export default function Step3Confirmation() {
  const router = useRouter();
  const { formData, resetForm } = useEnrollmentStore();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<EnrollmentResponse | null>(
    null,
  );

  const handleSubmit = async () => {
    if (!agreedToTerms) {
      alert("이용약관에 동의해주세요.");
      return;
    }

    if (!formData.course) {
      alert("강의 정보가 없습니다.");
      return;
    }

    // ✅ 제출 전 최종 유효성 검증
    try {
      const validationData = {
        type: formData.type,
        applicant: formData.applicant,
        ...(formData.type === "group" && { group: formData.group }),
      };

      const result = step2FormSchema.safeParse(validationData);

      if (!result.success) {
        console.error("Validation errors:", result.error.flatten());

        // ✅ 에러 객체 구조 확인
        const errors = result.error.flatten();
        let errorMessage = "입력 정보를 다시 확인해주세요.\n\n";
        const errorDetails: string[] = [];

        // fieldErrors 순회하며 에러 메시지 수집
        if (errors.fieldErrors) {
          Object.entries(errors.fieldErrors).forEach(([field, messages]) => {
            if (messages && Array.isArray(messages) && messages.length > 0) {
              messages.forEach((msg) => {
                errorDetails.push(`• ${msg}`);
              });
            }
          });
        }

        if (errorDetails.length > 0) {
          errorMessage += errorDetails.join("\n");
          errorMessage += "\n\n2단계로 돌아가서 수정해주세요.";
        }

        alert(errorMessage);
        return;
      }
    } catch (validationError) {
      console.error("Validation error:", validationError);
      alert(
        "입력 정보 검증 중 오류가 발생했습니다. 2단계로 돌아가서 다시 확인해주세요.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitEnrollment({
        ...formData,
        agreedToTerms,
      });

      setSubmitSuccess(response);
    } catch (error) {
      const err = error as ErrorResponse;

      // 에러 코드별 메시지
      let errorMessage = err.message || "신청 중 오류가 발생했습니다.";

      if (err.code === "COURSE_FULL") {
        errorMessage = "선택하신 강의의 정원이 마감되었습니다.";
      } else if (err.code === "DUPLICATE_ENROLLMENT") {
        errorMessage = "이미 신청한 강의입니다.";
      } else if (err.code === "INVALID_INPUT") {
        errorMessage = "입력 정보를 다시 확인해주세요.";

        if (err.details) {
          const detailMessages = Object.entries(err.details)
            .map(([field, message]) => `${field}: ${message}`)
            .join("\n");
          errorMessage += `\n\n상세 내용:\n${detailMessages}`;
        }
      }

      setSubmitError(errorMessage);
      console.error("Enrollment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleNewEnrollment = () => {
    resetForm();
    router.push("/enrollment/step/1");
  };

  const handlePrevStep = () => {
    router.push("/enrollment/step/2");
  };

  const handleEdit = (step: number) => {
    router.push(`/enrollment/step/${step}`);
  };

  // 제출 성공 화면
  if (submitSuccess) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            수강 신청이 완료되었습니다!
          </h2>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-sm text-gray-600 mb-2">신청 번호</div>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              {submitSuccess.enrollmentId}
            </div>

            <div className="text-sm text-gray-600 mb-2">신청 일시</div>
            <div className="text-gray-900">
              {new Date(submitSuccess.enrolledAt).toLocaleString("ko-KR")}
            </div>
          </div>

          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">신청 내역</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">강의명:</span>{" "}
                <span className="font-medium">{formData.course?.title}</span>
              </p>
              <p>
                <span className="text-gray-600">신청자:</span>{" "}
                <span className="font-medium">{formData.applicant.name}</span>
              </p>
              <p>
                <span className="text-gray-600">신청 유형:</span>{" "}
                <span className="font-medium">
                  {formData.type === "personal" ? "개인 신청" : "단체 신청"}
                </span>
              </p>
              {formData.type === "group" && formData.group && (
                <p>
                  <span className="text-gray-600">단체명:</span>{" "}
                  <span className="font-medium">
                    {formData.group.organizationName}
                  </span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleNewEnrollment}
            className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            새 신청하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">3단계: 확인 및 제출</h2>

      {/* 강의 정보 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">강의 정보</h3>
          <button
            onClick={() => handleEdit(1)}
            className="text-sm text-blue-600 hover:text-blue-700 underline"
          >
            수정
          </button>
        </div>

        {formData.course ? (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-600">강의명:</span>{" "}
              <span className="font-medium">{formData.course.title}</span>
            </p>
            <p>
              <span className="text-gray-600">강사:</span>{" "}
              <span className="font-medium">{formData.course.instructor}</span>
            </p>
            <p>
              <span className="text-gray-600">수강료:</span>{" "}
              <span className="font-medium">
                {formData.course.price.toLocaleString()}원
              </span>
            </p>
            <p>
              <span className="text-gray-600">일정:</span>{" "}
              <span className="font-medium">
                {formatDate(formData.course.startDate)} ~{" "}
                {formatDate(formData.course.endDate)}
              </span>
            </p>
            <p>
              <span className="text-gray-600">신청 유형:</span>{" "}
              <span className="font-medium">
                {formData.type === "personal" ? "개인 신청" : "단체 신청"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">강의 정보가 없습니다.</p>
        )}
      </div>

      {/* 신청자 정보 - 별도 컴포넌트 사용 */}
      <PersonalInfoSummary
        applicant={formData.applicant}
        onEdit={() => handleEdit(2)}
      />

      {/* 단체 정보 (조건부) - 별도 컴포넌트 사용 */}
      {formData.type === "group" && formData.group && (
        <GroupInfoSummary
          group={formData.group}
          applicant={formData.applicant}
          onEdit={() => handleEdit(2)}
        />
      )}

      {/* 에러 메시지 */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-medium mb-2 whitespace-pre-line">
                {submitError}
              </p>
              <button
                onClick={handleRetry}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이용약관 동의 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
          />
          <span className="ml-3 text-sm text-gray-700">
            <span className="font-medium">이용약관 및 개인정보 처리방침</span>에
            동의합니다. (필수)
            <br />
            <span className="text-gray-500 text-xs">
              수강 신청을 위해서는 이용약관 및 개인정보 처리방침에 동의가
              필요합니다.
            </span>
          </span>
        </label>
      </div>

      {/* 버튼 */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={isSubmitting}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-colors
            ${
              isSubmitting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            }
          `}
        >
          이전 단계
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!agreedToTerms || isSubmitting}
          className={`
            px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2
            ${
              !agreedToTerms || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "text-white bg-blue-600 hover:bg-blue-700"
            }
          `}
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
