// src/components/steps/step3/GroupInfoSummary.tsx
"use client";

import { GroupInfo } from "@/types/enrollment";
import { formatPhoneNumber } from "@/utils/formatters";

type Props = {
  group: GroupInfo;
  onEdit: () => void;
};

export default function GroupInfoSummary({ group, onEdit }: Props) {
  if (!group) {
    return null;
  }
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">단체 정보</h3>
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          수정
        </button>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <p>
          <span className="text-gray-600">단체명:</span>{" "}
          <span className="font-medium">{group.organizationName}</span>
        </p>
        <p>
          <span className="text-gray-600">신청 인원:</span>{" "}
          <span className="font-medium">{group.headCount}명</span>
        </p>
        <p>
          <span className="text-gray-600">담당자 연락처:</span>{" "}
          <span className="font-medium">
            {formatPhoneNumber(group.contactPerson)}
          </span>
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="text-sm font-medium text-gray-700 mb-3">
          참가자 명단
        </div>
        <div className="space-y-2">
          {group.participants.map((participant, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm bg-gray-50 rounded p-2"
            >
              <span className="text-gray-600">참가자 {index + 1}</span>
              <span className="font-medium">
                {participant.name} ({participant.email})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
