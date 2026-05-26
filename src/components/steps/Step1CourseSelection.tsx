"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/enrollment";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { fetchCourses } from "@/utils/api";
import CategoryFilter from "./step1/CategoryFilter";
import CourseCard from "./step1/CourseCard";
import Pagination from "./step1/Pagination";
import SelectedCourseInfo from "./step1/SelectedCourseInfo";
import EnrollmentTypeSelector from "./step1/EnrollmentTypeSelector";

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
        setCurrentPage(1);

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
  const currentCourses = courses.slice(
    startIndex,
    startIndex + COURSES_PER_PAGE,
  );

  const getCategoryCount = (category: string) => {
    if (category === "") return allCourses.length;
    return allCourses.filter((course) => course.category === category).length;
  };

  const handleNext = () => {
    if (!formData.course) {
      alert("강의를 선택해주세요.");
      return;
    }
    router.push("/enrollment/step/2");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">1단계: 강의 선택</h2>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        getCategoryCount={getCategoryCount}
      />

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">강의 목록을 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setSelectedCategory(selectedCategory)}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {courses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg mb-8">
              <p className="text-gray-600">해당 카테고리에 강의가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isSelected={formData.course?.id === course.id}
                    onSelect={setCourse}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          <SelectedCourseInfo course={formData.course} />

          <EnrollmentTypeSelector
            selectedType={formData.type}
            onChange={setEnrollmentType}
          />

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!formData.course}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                formData.course
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              다음 단계
            </button>
          </div>
        </>
      )}
    </div>
  );
}
