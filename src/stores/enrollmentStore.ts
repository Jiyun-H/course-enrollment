// src/stores/enrollmentStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EnrollmentFormData,
  Step,
  Course,
  EnrollmentType,
} from "@/types/enrollment";

interface EnrollmentStore {
  currentStep: Step;
  formData: EnrollmentFormData;

  // Actions
  setStep: (step: Step) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<EnrollmentFormData>) => void;
  resetForm: () => void;
  setEnrollmentType: (type: EnrollmentType) => void;
  setCourse: (course: Course) => void;
}

const initialFormData: EnrollmentFormData = {
  courseId: "",
  course: null,
  type: "personal",
  applicant: {
    name: "",
    email: "",
    phone: "",
    motivation: "",
  },
  agreedToTerms: false,
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialFormData,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3) as Step,
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1) as Step,
        })),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () =>
        set({
          currentStep: 1,
          formData: initialFormData,
        }),

      setEnrollmentType: (type) =>
        set((state) => ({
          formData: {
            ...state.formData,
            type,
            // 타입 변경 시 단체 정보 초기화
            group: type === "personal" ? undefined : state.formData.group,
          },
        })),

      setCourse: (course) =>
        set((state) => ({
          formData: {
            ...state.formData,
            courseId: course.id,
            course,
          },
        })),
    }),
    {
      name: "enrollment-storage", // localStorage key
    },
  ),
);
