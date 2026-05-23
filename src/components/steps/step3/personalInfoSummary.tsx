// src/components/steps/step3/PersonalInfoSummary.tsx
"use client";

import { Applicant } from "@/types/enrollment";
import { formatPhoneNumber } from "@/utils/formatters";

type Props = {
  applicant: Applicant;
  onEdit: () => void;
};

export default function PersonalInfoSummary({ applicant, onEdit }: Props) {
  if (!applicant) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">신청자 정보</h3>
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          수정
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <p>
          <span className="text-gray-600">이름:</span>{" "}
          <span className="font-medium">{applicant.name}</span>
        </p>
        <p>
          <span className="text-gray-600">이메일:</span>{" "}
          <span className="font-medium">{applicant.email}</span>
        </p>
        <p>
          <span className="text-gray-600">전화번호:</span>{" "}
          <span className="font-medium">
            {formatPhoneNumber(applicant.phone)}
          </span>
        </p>
        {applicant.motivation && (
          <p>
            <span className="text-gray-600">수강 동기:</span>{" "}
            <span className="font-medium">{applicant.motivation}</span>
          </p>
        )}
      </div>
    </div>
  );
}
