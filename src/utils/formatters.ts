// src/utils/formatters.ts

/**
 * 전화번호를 한국 형식으로 자동 포맷팅
 * 01011112222 -> 010-1111-2222
 * 010-1111-2222 -> 010-1111-2222 (유지)
 */
export function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, "");

  // 숫자가 없으면 빈 문자열 반환
  if (!numbers) return "";

  // 11자리 숫자인 경우 (010-1234-5678)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 10자리 숫자인 경우 (02-1234-5678)
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 입력 중인 경우 부분 포맷팅
  if (numbers.length > 7) {
    return numbers
      .replace(/(\d{3})(\d{3,4})(\d{0,4})/, "$1-$2-$3")
      .replace(/-$/, "");
  }

  if (numbers.length > 3) {
    return numbers.replace(/(\d{3})(\d{0,4})/, "$1-$2").replace(/-$/, "");
  }

  return numbers;
}
