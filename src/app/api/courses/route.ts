// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mockCourses, categories } from "@/mocks/courses";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  //로딩 상태 표시용
  await new Promise((resolve) => setTimeout(resolve, 500));

  const filteredCourses = category
    ? mockCourses.filter((course) => course.category === category)
    : mockCourses;

  return NextResponse.json({
    courses: filteredCourses,
    categories: categories,
  });
}
