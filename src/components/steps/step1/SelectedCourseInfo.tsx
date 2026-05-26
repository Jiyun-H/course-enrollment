"use client";

import { Course } from "@/types/enrollment";

interface SelectedCourseInfoProps {
  course: Course | null;
}

export default function SelectedCourseInfo({
  course,
}: SelectedCourseInfoProps) {
  if (!course) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString)
      .toLocaleDateString("ko-KR")
      .replace(/\. /g, ".")
      .replace(/\.$/, "");

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">선택한 강의</h3>
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
          <span className="font-medium">{course.price.toLocaleString()}원</span>
        </p>
        <p>
          <span className="text-gray-600">일정:</span>{" "}
          <span className="font-medium">
            {formatDate(course.startDate)} ~ {formatDate(course.endDate)}
          </span>
        </p>
      </div>
    </div>
  );
}
