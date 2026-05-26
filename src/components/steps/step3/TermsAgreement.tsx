"use client";

interface TermsAgreementProps {
  agreedToTerms: boolean;
  onAgreeChange: (checked: boolean) => void;
}

export default function TermsAgreement({
  agreedToTerms,
  onAgreeChange,
}: TermsAgreementProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <label className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => onAgreeChange(e.target.checked)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
        />
        <span className="ml-3 text-sm text-gray-700">
          <span className="font-medium">이용약관 및 개인정보 처리방침</span>에
          동의합니다. (필수)
          <br />
          <span className="text-gray-500 text-xs">
            수강 신청을 위해서는 이용약관 및 개인정보 처리방침에 동의가
            필요합니다.
          </span>
        </span>
      </label>
    </div>
  );
}
