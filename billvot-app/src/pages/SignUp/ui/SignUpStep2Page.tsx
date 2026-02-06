import { useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { styled } from "@app/styles";
import BaseInput from "@app/components/BaseInput";
import BaseButton from "@app/components/BaseButton";
import PageHeader from "@app/components/PageHeader";
import HealthInfoSection from "@app/components/HealthInfoSection";
import { useAuthStore } from "@app/store/useAuthStore";
import { route } from "@app/pages/route";
import { authService } from "@app/api/rest/services";
import GenderModal from "@app/pages/MyInfo/ui/GenderModal";
import AgeGroupModal from "@app/pages/MyInfo/ui/AgeGroupModal";
import InterestAreaModal from "@app/pages/MyInfo/ui/InterestAreaModal";
import { GENDER_OPTIONS, AGE_GROUP_OPTIONS, INTEREST_AREA_OPTIONS } from "@app/types/healthInfo";

import { Capacitor } from "@capacitor/core";

const SignUpContainer = styled("div", {
  height: "100dvh",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const SignUpForm = styled("div", {
  flex: 1,
  padding: "24px 16px",
  paddingBottom: "calc(100px + env(safe-area-inset-bottom))",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
});

const FormTitle = styled("h1", {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000",
  margin: "0 0 8px 0",
});

const FormSubtitle = styled("p", {
  fontSize: "16px",
  color: "#000",
  margin: "0 0 32px 0",
});

const InputGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  marginBottom: "32px",
});

const ErrorMessage = styled("div", {
  color: "#d93025",
  fontSize: "12px",
  marginTop: "4px",
});

const ButtonGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "32px",
  flexShrink: 0,
});


const CompleteButton = styled(BaseButton, {
  backgroundColor: "#f0f0f0",
  color: "#999",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    backgroundColor: "#e0e0e0",
  },

  "&:disabled": {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
});

function SignUpStep2Page() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  // OAuth2 로그인에서 넘어온 idToken과 provider 또는 일반 회원가입 데이터
  const idToken = location.state?.idToken;
  const provider = location.state?.provider; // "google" | "apple"
  const signUpData = location.state || {}; // 일반 회원가입 데이터
  const phoneNumber = signUpData.phoneNumber; // 전화번호
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("");
  const [selectedInterestAreas, setSelectedInterestAreas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenderModalOpen, setIsGenderModalOpen] = useState(false);
  const [isAgeGroupModalOpen, setIsAgeGroupModalOpen] = useState(false);
  const [isInterestAreaModalOpen, setIsInterestAreaModalOpen] = useState(false);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    // 간단한 유효성 검사
    const errors: string[] = [];
    if (!value.trim()) {
      errors.push("닉네임을 입력해야 합니다.");
    }
    if (value === "test") {
      errors.push("이미 존재하는 닉네임 입니다.");
    }
    setNicknameError(errors);
  };

  const handleGenderClick = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleAgeGroupClick = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
  };

  const handleInterestAreaClick = (area: string) => {
    setSelectedInterestAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  };

  const handleAddGender = () => {
    setIsGenderModalOpen(true);
  };

  const handleAddAgeGroup = () => {
    setIsAgeGroupModalOpen(true);
  };

  const handleAddInterestArea = () => {
    setIsInterestAreaModalOpen(true);
  };

  const handleGenderUpdate = (gender: string) => {
    setSelectedGender(gender);
    setIsGenderModalOpen(false);
  };

  const handleAgeGroupUpdate = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
    setIsAgeGroupModalOpen(false);
  };

  const handleInterestAreaUpdate = (interestAreas: string[]) => {
    setSelectedInterestAreas(interestAreas);
    setIsInterestAreaModalOpen(false);
  };


  const handleComplete = async () => {
    if (!nickname.trim()) {
      setNicknameError(["닉네임을 입력해주세요."]);
      return;
    }

    setIsLoading(true);

    try {
      if (idToken) {
        // OAuth2 회원가입 (Google 또는 Apple)
        const platform = Capacitor.getPlatform();
        let clientType: "ios" | "android" | "web" = "web";
        if (platform === "ios") clientType = "ios";
        // Android도 web으로 전송

        const response = await authService.oauth2Signup({
          idToken,
          provider: provider || "google", // provider가 없으면 기본값 google (하위 호환성)
          nickname: nickname.trim(),
          client: clientType,
          userHealthInfo: {
            gender: selectedGender,
            ageGroup: selectedAgeGroup,
            interestAreas: selectedInterestAreas,
          },
        } as any);

        // 로그인 처리
        login(response.member, response.accessToken, response.refreshToken);
      } else {
        // 일반 회원가입 (기존 로직)
        // location.state에서 전달받은 데이터 사용
        if (!signUpData.name || !signUpData.email || !signUpData.password) {
          console.error(
            "회원가입 정보가 없습니다. 이이전 단계로 돌아가서 다시 입력해주세요.",
          );
          return;
        }

        const response = await authService.signUp({
          name: signUpData.name,
          nickname: nickname.trim(),
          email: signUpData.email,
          password: signUpData.password,
          phoneNumber: phoneNumber || undefined, // 전화번호 (선택사항)
          userHealthInfo: {
            gender: selectedGender,
            ageGroup: selectedAgeGroup,
            interestAreas: selectedInterestAreas,
          },
        } as any);

        login(response.member, response.accessToken, response.refreshToken);
      }

      // 메인 페이지로 이동
      navigate(route.FEED);
    } catch (err) {
      console.error("회원가입 완료 중 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = nickname.trim() && nicknameError.length === 0;

  return (
    <SignUpContainer>
      <PageHeader
        title="회원가입"
        leftButton={{ icon: "back", onClick: () => navigate(-1) }}
      />
      <SignUpForm>
        <FormTitle>회원가입</FormTitle>
        <FormSubtitle>개인설정</FormSubtitle>

        <InputGroup>
          <div>
            <BaseInput
              label="닉네임*"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={handleNicknameChange}
              height="48px"
            />
            {nicknameError.map((error, index) => (
              <ErrorMessage key={index}>{error}</ErrorMessage>
            ))}
          </div>
        </InputGroup>

        <HealthInfoSection
          title="성별"
          tags={GENDER_OPTIONS}
          selectedTags={selectedGender ? [selectedGender] : []}
          onTagClick={handleGenderClick}
          onAddClick={handleAddGender}
          addText="성별 선택하기"
        />

        <HealthInfoSection
          title="연령대"
          tags={AGE_GROUP_OPTIONS}
          selectedTags={selectedAgeGroup ? [selectedAgeGroup] : []}
          onTagClick={handleAgeGroupClick}
          onAddClick={handleAddAgeGroup}
          addText="연령대 선택하기"
        />

        <HealthInfoSection
          title="관심분야"
          tags={INTEREST_AREA_OPTIONS}
          selectedTags={selectedInterestAreas}
          onTagClick={handleInterestAreaClick}
          onAddClick={handleAddInterestArea}
          addText="관심분야 선택하기"
        />

        <ButtonGroup>
          <CompleteButton
            width="100%"
            height={48}
            onClick={handleComplete}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "처리 중..." : "회원가입 완료"}
          </CompleteButton>
        </ButtonGroup>
      </SignUpForm>

      {/* 모달들 */}
      <GenderModal
        isOpen={isGenderModalOpen}
        onClose={() => setIsGenderModalOpen(false)}
        onUpdate={handleGenderUpdate}
        initialData={selectedGender as any}
      />
      <AgeGroupModal
        isOpen={isAgeGroupModalOpen}
        onClose={() => setIsAgeGroupModalOpen(false)}
        onUpdate={handleAgeGroupUpdate}
        initialData={selectedAgeGroup as any}
      />
      <InterestAreaModal
        isOpen={isInterestAreaModalOpen}
        onClose={() => setIsInterestAreaModalOpen(false)}
        onUpdate={handleInterestAreaUpdate}
        initialData={selectedInterestAreas as any}
      />
    </SignUpContainer>
  );
}

export default SignUpStep2Page;
