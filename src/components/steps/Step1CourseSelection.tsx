// src/components/steps/Step1CourseSelection.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/enrollment";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { fetchCourses } from "@/utils/api";
import { categoryLabels } from "@/mocks/courses";

const COURSES_PER_PAGE = 4;

export default function Step1CourseSelection() {
  const router = useRouter();
  const { formData, setCourse, setEnrollmentType } = useEnrollmentStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCourses(selectedCategory || undefined);
        setCourses(data.courses);
        setCategories(data.categories);
        setCurrentPage(1); // 카테고리 변경 시 첫 페이지로

        if (allCourses.length === 0) {
          const allData = await fetchCourses();
          setAllCourses(allData.courses);
        }
      } catch (err) {
        setError("강의 목록을 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [selectedCategory]);

  const totalPages = Math.ceil(courses.length / COURSES_PER_PAGE);
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
  const endIndex = startIndex + COURSES_PER_PAGE;
  const currentCourses = courses.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getCategoryCount = (category: string) => {
    if (category === "") {
      return allCourses.length;
    }
    return allCourses.filter((course) => course.category === category).length;
  };

  const handleCourseSelect = (course: Course) => {
    setCourse(course);
  };

  const handleNext = () => {
    if (!formData.course) {
      alert("강의를 선택해주세요.");
      return;
    }
    router.push("/enrollment/step/2");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setSelectedCategory(selectedCategory);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">1단계: 강의 선택</h2>

      {/* 카테고리 필터 */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          카테고리
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                selectedCategory === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            전체 ({getCategoryCount("")})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {categoryLabels[category] || category} (
              {getCategoryCount(category)})
            </button>
          ))}
        </div>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">강의 목록을 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 강의 목록 */}
      {!loading && !error && (
        <>
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">해당 카테고리에 강의가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentCourses.map((course) => {
                  const isSelected = formData.course?.id === course.id;
                  const isFull = course.currentEnrollment >= course.maxCapacity;
                  const isAlmostFull =
                    course.currentEnrollment >= course.maxCapacity * 0.8;

                  return (
                    <div
                      key={course.id}
                      onClick={() => !isFull && handleCourseSelect(course)}
                      className={`
                        border rounded-lg p-5 cursor-pointer transition-all
                        ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : isFull
                              ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.title}
                        </h3>
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

                      <p className="text-sm text-gray-600 mb-3">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          강사: {course.instructor}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {course.price.toLocaleString()}원
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {new Date(course.startDate)
                            .toLocaleDateString("ko-KR")
                            .replace(/\. /g, ".")
                            .replace(/\.$/, "")}{" "}
                          ~{" "}
                          {new Date(course.endDate)
                            .toLocaleDateString("ko-KR")
                            .replace(/\. /g, ".")
                            .replace(/\.$/, "")}
                        </span>
                        <span
                          className={`
                            font-medium
                            ${
                              isFull
                                ? "text-red-600"
                                : isAlmostFull
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }
                          `}
                        >
                          {isFull
                            ? "마감"
                            : `${course.currentEnrollment}/${course.maxCapacity}명`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    ‹
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                        ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}

          {formData.course && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                선택한 강의
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">강의명:</span>{" "}
                  <span className="font-medium">{formData.course.title}</span>
                </p>
                <p>
                  <span className="text-gray-600">강사:</span>{" "}
                  <span className="font-medium">
                    {formData.course.instructor}
                  </span>
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
                    {new Date(formData.course.startDate)
                      .toLocaleDateString("ko-KR")
                      .replace(/\. /g, ".")
                      .replace(/\.$/, "")}{" "}
                    ~{" "}
                    {new Date(formData.course.endDate)
                      .toLocaleDateString("ko-KR")
                      .replace(/\. /g, ".")
                      .replace(/\.$/, "")}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              신청 유형 선택
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setEnrollmentType("personal")}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${
                    formData.type === "personal"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="font-semibold text-gray-900 mb-1">
                  개인 신청
                </div>
                <div className="text-sm text-gray-600">
                  개인 자격으로 수강 신청합니다
                </div>
              </button>
              <button
                onClick={() => setEnrollmentType("group")}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all
                  ${
                    formData.type === "group"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <div className="font-semibold text-gray-900 mb-1">
                  단체 신청
                </div>
                <div className="text-sm text-gray-600">
                  2명 이상 단체로 수강 신청합니다
                </div>
              </button>
            </div>
          </div>

          {/* 다음 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!formData.course}
              className={`
                px-8 py-3 rounded-lg font-semibold transition-colors
                ${
                  formData.course
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              다음 단계
            </button>
          </div>
        </>
      )}
    </div>
  );
}
