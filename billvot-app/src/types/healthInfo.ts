export type Gender = "남자" | "여자";

export type AgeGroup = "10대 이하" | "20대" | "30대" | "40대" | "50대" | "60대" | "70대 이상";

export type InterestArea = 
  | "당" 
  | "다이어트" 
  | "암" 
  | "면역" 
  | "혈압" 
  | "알레르기" 
  | "수면" 
  | "스트레스" 
  | "식습관" 
  | "저속노화" 
  | "디톡스" 
  | "호르몬";

export interface UserHealthInfo {
  gender?: Gender;
  ageGroup?: AgeGroup;
  interestAreas?: InterestArea[];
}

export const GENDER_OPTIONS: Gender[] = ["남자", "여자"];

export const AGE_GROUP_OPTIONS: AgeGroup[] = [
  "10대 이하",
  "20대", 
  "30대",
  "40대",
  "50대",
  "60대",
  "70대 이상"
];

export const INTEREST_AREA_OPTIONS: InterestArea[] = [
  "당",
  "다이어트", 
  "암",
  "면역",
  "혈압",
  "알레르기",
  "수면",
  "스트레스",
  "식습관",
  "저속노화",
  "디톡스",
  "호르몬"
];
