import { useNavigate } from "react-router-dom";

import { styled } from "@app/styles";
import PageHeader from "@app/components/PageHeader";

const Container = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "white",
});

const Content = styled("div", {
  padding: "20px 16px",
  fontSize: "14px",
  lineHeight: "1.6",
  color: "$cg800",
  height: "calc(100% - 54px)",
  overflowY: "auto",
});

const Title = styled("h2", {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "16px",
  color: "$cg900",
});

const SubTitle = styled("h3", {
  fontSize: "15px",
  fontWeight: "bold",
  marginBottom: "12px",
  color: "$cg900",
});

const Section = styled("div", {
  marginBottom: "24px",
});

const List = styled("ol", {
  paddingLeft: "20px",
  marginTop: "8px",
  "& li": {
    marginBottom: "8px",
  },
  "& ol": {
    paddingLeft: "20px",
    marginTop: "8px",
  },
});

const UnorderedList = styled("ul", {
  paddingLeft: "20px",
  marginTop: "8px",
  "& li": {
    marginBottom: "8px",
    listStyle: "disc",
  },
});

const Appendix = styled("div", {
  marginTop: "32px",
  color: "$cg600",
  fontSize: "13px",
});

const Introduction = styled("p", {
  marginBottom: "24px",
  lineHeight: "1.6",
});

function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <PageHeader
        title="개인정보 수집 및 이용 동의"
        leftButton={{ icon: "back", onClick: () => navigate(-1) }}
        bottomBorder
      />
      <Content>
        <Title>개인정보처리방침</Title>

        <Introduction>
          푸드스캐너(이하 "회사")는 이용자의 개인정보를 소중하게 생각하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다. 회사는 개인정보처리방침을 통하여 이용자가 제공한 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.

          본 방침은 회사가 제공하는 푸드스캐너 미디어 서비스 및 스캐너 앱 기반 AI 분석 서비스(이하 "서비스")에 적용됩니다.
        </Introduction>

        <Section>
          <SubTitle>1. 수집하는 개인정보 항목 및 수집 방법</SubTitle>
          <p><strong>회원가입 시 수집 항목</strong></p>
          <p>필수 항목: 이름, 휴대폰 번호, 이메일 주소</p>
          
          <p><strong>서비스 이용 과정에서 자동으로 수집될 수 있는 항목</strong></p>
              <UnorderedList>
            <li>서비스 이용기록(접속 로그, 이용 일시, IP 주소)</li>
            <li>기기 정보(단말기 모델명, OS 버전, 브라우저 정보)</li>
            <li>스캐너 및 카메라 기능 사용 시: 촬영 이미지 및 식품 관련 정보</li>
              </UnorderedList>
          
          <p><strong>수집 방법</strong></p>
              <UnorderedList>
            <li>회원가입 및 서비스 이용 시 이용자가 직접 입력</li>
            <li>서비스 이용 과정에서 자동 수집</li>
              </UnorderedList>
        </Section>

        <Section>
          <SubTitle>2. 개인정보의 수집 및 이용 목적</SubTitle>
          <p>회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다.</p>
          
          <p><strong>회원 관리</strong></p>
          <p>본인확인, 회원제 서비스 제공, 불량회원의 부정 이용 방지, 가입 및 탈퇴 의사 확인</p>
          
          <p><strong>서비스 제공 및 운영</strong></p>
          <p>AI 기반 식품 성분 분석 서비스 제공, 콘텐츠 및 뉴스, 광고, 이벤트 안내</p>
          
          <p><strong>고객 상담 및 민원 처리</strong></p>
          <p>문의사항 확인, 불만처리, 고지사항 전달</p>
          
          <p><strong>통계 및 서비스 개선</strong></p>
          <p>이용행태 분석, 신규 서비스 개발, 서비스 품질 개선</p>
        </Section>

        <Section>
          <SubTitle>3. 개인정보의 보유 및 이용 기간</SubTitle>
          <p>회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성되면 해당 정보를 지체 없이 파기합니다.</p>
          <p>다만, 관계 법령에 따라 보존할 필요가 있는 경우에는 일정 기간 보관합니다.</p>
          <UnorderedList>
            <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
            <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년</li>
            <li>서비스 이용 관련 로그 기록: 3개월</li>
          </UnorderedList>
        </Section>

        <Section>
          <SubTitle>4. 개인정보의 제3자 제공</SubTitle>
          <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우 예외로 합니다.</p>
          <UnorderedList>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령에 의거하여 수사기관 등 관계 기관의 요청이 있는 경우</li>
          </UnorderedList>
        </Section>

        <Section>
          <SubTitle>5. 개인정보의 처리 위탁</SubTitle>
          <p>회사는 서비스 향상을 위하여 개인정보 처리를 외부에 위탁할 수 있습니다.</p>
          <p>위탁 시, 위탁받는 자와 업무 내용을 고지하며, 개인정보 보호 관련 법령을 준수하도록 관리·감독합니다.</p>
        </Section>

        <Section>
          <SubTitle>6. 이용자의 권리와 행사 방법</SubTitle>
          <p>이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지 요구를 할 수 있습니다.</p>
          <p>개인정보 열람/정정/삭제는 contact@foodscanner.kr을 통해 요청 가능합니다.</p>
          <p>회사는 본인 여부를 확인 후 지체 없이 필요한 조치를 취합니다.</p>
        </Section>

        <Section>
          <SubTitle>7. 개인정보 파기 절차 및 방법</SubTitle>
          <p><strong>파기 절차:</strong></p>
          <p>수집 및 이용 목적 달성 후 별도의 DB로 이동하여 내부 방침 및 법령에 따라 일정 기간 저장 후 파기</p>
          
          <p><strong>파기 방법:</strong></p>
          <UnorderedList>
            <li>전자적 파일은 복구 불가능한 기술적 방법으로 삭제</li>
            <li>종이 문서는 분쇄 또는 소각</li>
          </UnorderedList>
        </Section>

        <Section>
          <SubTitle>8. 개인정보의 안전성 확보 조치</SubTitle>
          <p>회사는 개인정보의 안전성을 확보하기 위하여 다음과 같은 조치를 취하고 있습니다.</p>
          <UnorderedList>
            <li>개인정보 처리 인력 최소화 및 교육 실시</li>
            <li>해킹 및 악성코드 방지를 위한 보안 프로그램 운영</li>
            <li>개인정보 암호화(비밀번호, 주요 데이터 등)</li>
            <li>물리적 보관 장소에 대한 접근 통제</li>
          </UnorderedList>
        </Section>

        <Section>
          <SubTitle>9. 개인정보 보호책임자</SubTitle>
          <p>회사는 이용자의 개인정보를 보호하고, 불만 처리 및 관련 민원을 담당하는 개인정보 보호책임자를 지정하고 있습니다.</p>
          <p><strong>개인정보 보호책임자:</strong> 김용준</p>
          <p><strong>이메일:</strong> contact@foodscanner.kr</p>
        </Section>

        <Section>
          <SubTitle>11. 고지의 의무</SubTitle>
          <p>본 개인정보처리방침은 2025년 10월 1일부터 적용됩니다.</p>
          <p>법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 경우, 회사 홈페이지 또는 앱 공지를 통해 고지합니다.</p>
        </Section>
      </Content>
    </Container>
  );
}

export default PrivacyPolicyPage;
