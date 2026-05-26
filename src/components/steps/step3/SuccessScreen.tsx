"use client";

import { EnrollmentResponse, EnrollmentFormData } from "@/types/enrollment";

interface SuccessScreenProps {
  submitSuccess: EnrollmentResponse;
  formData: EnrollmentFormData;
  onNewEnrollment: () => void;
}

export default function SuccessScreen({
  submitSuccess,
  formData,
  onNewEnrollment,
}: SuccessScreenProps) {
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
              <>
                <p>
                  <span className="text-gray-600">단체명:</span>{" "}
                  <span className="font-medium">
                    {formData.group.organizationName}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">신청인원:</span>{" "}
                  <span className="font-medium">
                    {formData.group.headCount}명
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onNewEnrollment}
          className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          새 신청하기
        </button>
      </div>
    </div>
  );
}
