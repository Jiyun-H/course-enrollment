"use client";

import { Course } from "@/types/enrollment";

interface CourseInfoSummaryProps {
  course: Course | null;
  type: "personal" | "group";
  onEdit: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export default function CourseInfoSummary({
  course,
  type,
  onEdit,
}: CourseInfoSummaryProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">강의 정보</h3>
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          수정
        </button>
      </div>

      {course ? (
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-600">강의명:</span>{" "}
            <span className="font-medium">{course.title}</span>
          </p>
          <p>
            <span className="text-gray-600">강사:</span>{" "}
            <span className="font-medium">{course.instructor}</span>
          </p>
          <p>
            <span className="text-gray-600">수강료:</span>{" "}
            <span className="font-medium">
              {course.price.toLocaleString()}원
            </span>
          </p>
          <p>
            <span className="text-gray-600">일정:</span>{" "}
            <span className="font-medium">
              {formatDate(course.startDate)} ~ {formatDate(course.endDate)}
            </span>
          </p>
          <p>
            <span className="text-gray-600">신청 유형:</span>{" "}
            <span className="font-medium">
              {type === "personal" ? "개인 신청" : "단체 신청"}
            </span>
          </p>
        </div>
      ) : (
        <p className="text-gray-500">강의 정보가 없습니다.</p>
      )}
    </div>
  );
}
