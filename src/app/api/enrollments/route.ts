// src/app/api/enrollments/route.ts
import { NextRequest, NextResponse } from "next/server";

const enrollments: Array<{
  enrollmentId: string;
  courseId: string;
  courseCurrentEnrollment: number;
  courseMaxCapacity: number;
  type: "personal" | "group";
  applicant: {
    name: string;
    email: string;
    phone: string;
    motivation?: string;
  };
  group?: {
    organizationName: string;
    headCount: number;
    participants: Array<{ name: string; email: string }>;
    contactPerson: string;
  };
  status: "confirmed" | "pending";
  enrolledAt: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (
      !body.courseId ||
      !body.type ||
      !body.applicant ||
      !body.agreedToTerms
    ) {
      return NextResponse.json(
        {
          code: "INVALID_INPUT",
          message: "필수 정보가 누락되었습니다.",
        },
        { status: 400 },
      );
    }

    const isDuplicate = enrollments.some(
      (enrollment) =>
        enrollment.courseId === body.courseId &&
        enrollment.applicant.email === body.applicant.email,
    );

    if (isDuplicate) {
      return NextResponse.json(
        {
          code: "DUPLICATE_ENROLLMENT",
          message: "이미 신청한 강의입니다.",
        },
        { status: 409 },
      );
    }

    const incomingCount =
      body.type === "group" ? body.group?.headCount || 0 : 1;
    const currentEnrollment = body.courseCurrentEnrollment;
    const maxCapacity = body.courseMaxCapacity;

    if (currentEnrollment + incomingCount > maxCapacity) {
      return NextResponse.json(
        {
          code: "COURSE_FULL",
          message: "선택하신 강의의 정원이 마감되었습니다.",
        },
        { status: 409 },
      );
    }

    const enrollmentId = `ENR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const enrolledAt = new Date().toISOString();

    const newEnrollment = {
      enrollmentId,
      courseId: body.courseId,
      courseCurrentEnrollment: body.courseCurrentEnrollment,
      courseMaxCapacity: body.courseMaxCapacity,
      type: body.type,
      applicant: body.applicant,
      ...(body.group && { group: body.group }),
      status: "confirmed" as const,
      enrolledAt,
    };

    enrollments.push(newEnrollment);

    return NextResponse.json({
      enrollmentId,
      status: "confirmed",
      enrolledAt,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      {
        code: "UNKNOWN_ERROR",
        message: "신청 처리 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
