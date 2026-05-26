"use client";

import { Course } from "@/types/enrollment";

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (course: Course) => void;
}

export default function CourseCard({
  course,
  isSelected,
  onSelect,
}: CourseCardProps) {
  const isFull = course.currentEnrollment >= course.maxCapacity;
  const isAlmostFull = course.currentEnrollment >= course.maxCapacity * 0.8;

  const formatDate = (dateString: string) =>
    new Date(dateString)
      .toLocaleDateString("ko-KR")
      .replace(/\. /g, ".")
      .replace(/\.$/, "");

  return (
    <div
      onClick={() => !isFull && onSelect(course)}
      className={`
        border rounded-lg p-5 transition-all
        ${
          isSelected
            ? "border-blue-600 bg-blue-50"
            : isFull
              ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
              : "border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-md"
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
        {isSelected && (
          <svg
            className="w-6 h-6 text-blue-600 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{course.description}</p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">강사: {course.instructor}</span>
        <span className="font-semibold text-gray-900">
          {course.price.toLocaleString()}원
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {formatDate(course.startDate)} ~ {formatDate(course.endDate)}
        </span>
        <span
          className={`font-medium ${
            isFull
              ? "text-red-600"
              : isAlmostFull
                ? "text-orange-600"
                : "text-green-600"
          }`}
        >
          {isFull
            ? "마감"
            : `${course.currentEnrollment}/${course.maxCapacity}명`}
        </span>
      </div>
    </div>
  );
}
