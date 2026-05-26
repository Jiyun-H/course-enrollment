"use client";

interface EnrollmentTypeSelectorProps {
  selectedType: "personal" | "group";
  onChange: (type: "personal" | "group") => void;
}

export default function EnrollmentTypeSelector({
  selectedType,
  onChange,
}: EnrollmentTypeSelectorProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        신청 유형 선택
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange("personal")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            selectedType === "personal"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-semibold text-gray-900 mb-1">개인 신청</div>
          <div className="text-sm text-gray-600">
            개인 자격으로 수강 신청합니다
          </div>
        </button>
        <button
          onClick={() => onChange("group")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            selectedType === "group"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-semibold text-gray-900 mb-1">단체 신청</div>
          <div className="text-sm text-gray-600">
            2명 이상 단체로 수강 신청합니다
          </div>
        </button>
      </div>
    </div>
  );
}
