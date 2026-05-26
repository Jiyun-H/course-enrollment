"use client";

import {
  UseFormRegister,
  FieldErrors,
  UseFormTrigger,
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import { formatPhoneNumber } from "@/utils/formatters";

export type ApplicantFields = {
  applicant: {
    name: string;
    email: string;
    phone: string;
    motivation?: string;
  };
};

type Props<T extends FieldValues & ApplicantFields> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  trigger: UseFormTrigger<T>;
  setValue: UseFormSetValue<T>;
};

export default function ApplicantInfoFields<
  T extends FieldValues & ApplicantFields,
>({ register, errors, trigger, setValue }: Props<T>) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);

    setValue("applicant.phone" as Path<T>, formatted as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 💡 타입 에러 해결: errors.applicant의 타입을 명시적으로 지정해줍니다. (any 아님!)
  const appErrors = errors.applicant as
    | FieldErrors<ApplicantFields["applicant"]>
    | undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">신청자 정보</h3>

      <Input
        label="이름"
        required
        {...register("applicant.name" as Path<T>)}
        onBlur={() => trigger("applicant.name" as Path<T>)}
        error={appErrors?.name?.message} // 여기서부터 깔끔하게 자동완성 & 에러 해결!
        placeholder="홍길동"
      />

      <Input
        label="이메일"
        type="email"
        required
        {...register("applicant.email" as Path<T>)}
        onBlur={() => trigger("applicant.email" as Path<T>)}
        error={appErrors?.email?.message}
        placeholder="example@email.com"
      />

      <Input
        label="전화번호"
        required
        {...register("applicant.phone" as Path<T>)}
        onChange={handlePhoneChange}
        onBlur={() => trigger("applicant.phone" as Path<T>)}
        error={appErrors?.phone?.message}
        placeholder="010-1234-5678"
      />

      <Textarea
        label="수강 동기"
        {...register("applicant.motivation" as Path<T>)}
        onBlur={() => trigger("applicant.motivation" as Path<T>)}
        placeholder="수강을 신청하게 된 동기를 간단히 작성해주세요 (선택)"
        rows={4}
        maxLength={300}
        error={appErrors?.motivation?.message}
      />
    </div>
  );
}
