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

const Appendix = styled("div", {
  marginTop: "32px",
  color: "$cg600",
  fontSize: "13px",
});

const Introduction = styled("p", {
  marginBottom: "24px",
  color: "$cg700",
  lineHeight: "1.8",
});

const UnorderedList = styled("ul", {
  paddingLeft: "20px",
  marginTop: "8px",
  marginBottom: "8px",
  "& li": {
    marginBottom: "8px",
    listStyleType: "disc",
  },
});

function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <PageHeader
        title="서비스 이용약관"
        leftButton={{ icon: "back", onClick: () => navigate(-1) }}
        bottomBorder
      />
      <Content>
        <Title>이용약관</Title>

        <Introduction>
          본 약관은 푸드스캐너(이하 "회사")가 제공하는 미디어 서비스 및 스캐너 앱을 통한 AI 분석 서비스(이하 "서비스")의 이용 조건과 절차, 회사와 회원 간 권리·의무 및 책임사항 등을 규정함을 목적으로 합니다.
        </Introduction>

        <Section>
          <SubTitle>제1조 (목적)</SubTitle>
          <p>
            본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 회원의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </Section>

        <Section>
          <SubTitle>제2조 (용어의 정의)</SubTitle>
          <p>"서비스"란 회사가 운영하는 푸드스캐너 미디어 플랫폼 및 스캐너 앱을 통하여 제공되는 모든 온라인/모바일 기반의 콘텐츠, 정보, AI 분석 기능을 의미합니다.</p>
          <p>"회원"이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.</p>
          <p>"아이디(ID)"란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 문자와 숫자의 조합을 말합니다.</p>
          <p>"비밀번호"란 회원의 개인정보 보호를 위하여 회원이 설정한 문자와 숫자의 조합을 말합니다.</p>
        </Section>

        <Section>
          <SubTitle>제3조 (약관의 효력 및 변경)</SubTitle>
          <p>본 약관은 서비스를 이용하고자 하는 모든 회원에게 효력이 발생합니다.</p>
          <p>회사는 필요 시 관련 법령을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있습니다.</p>
          <p>회사가 약관을 개정할 경우, 변경 사항을 회원에게 고지하며, 회원이 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</p>
        </Section>

        <Section>
          <SubTitle>제4조 (서비스의 제공 및 변경)</SubTitle>
          <p>회사는 회원에게 다음과 같은 서비스를 제공합니다.</p>
          <UnorderedList>
            <li>뉴스, 기사, 콘텐츠 제공</li>
            <li>식품 성분 인식 및 AI 분석 서비스</li>
            <li>이미지 스캔 기능</li>
          </UnorderedList>
          <p>회사는 서비스의 내용, 운영상·기술상 필요에 따라 일부 또는 전부를 변경할 수 있습니다.</p>
        </Section>

        <Section>
          <SubTitle>제5조 (회원가입)</SubTitle>
          <p>회원가입은 이용자가 본 약관에 동의하고, 회사가 요구하는 정보를 기입하여 신청하며, 회사가 이를 승인함으로써 완료됩니다.</p>
          
          <p>회원가입 시 수집되는 개인정보는 다음과 같습니다.</p>
          <p>필수항목: 이름, 휴대폰 번호, 이메일 주소</p>
          
          <p>회사는 다음 각 호의 경우 회원가입 신청을 거부하거나 사후에 이용계약을 해지할 수 있습니다.</p>
          <UnorderedList>
            <li>타인의 명의 또는 정보를 도용한 경우</li>
            <li>허위 정보를 기재한 경우</li>
            <li>기타 사회질서 및 법령을 위반할 우려가 있는 경우</li>
          </UnorderedList>
        </Section>

        <Section>
          <SubTitle>제6조 (회원의 의무)</SubTitle>
          <p>회원은 서비스 이용 시 다음 행위를 하여서는 안 됩니다.</p>
          <UnorderedList>
            <li>허위 정보 입력, 타인 정보 도용</li>
            <li>회사의 지식재산권, 제3자의 권리를 침해하는 행위</li>
            <li>음란, 불법, 청소년 유해 콘텐츠 게시</li>
            <li>해킹, 악성 프로그램 배포 등 서비스 운영 방해</li>
          </UnorderedList>
          <p>회원은 본 약관 및 관계 법령을 준수하여야 하며, 위반 시 서비스 이용이 제한될 수 있습니다.</p>
        </Section>

        <Section>
          <SubTitle>제7조 (회사의 의무)</SubTitle>
          <p>회사는 회원의 개인정보를 보호하기 위하여 개인정보처리방침을 준수합니다.</p>
          <p>회사는 안정적인 서비스 제공을 위하여 최선의 노력을 다합니다.</p>
          <p>회사는 회원이 제기한 의견에 대해 진중히 검토합니다.</p>
        </Section>

        <Section>
          <SubTitle>제8조 (개인정보 보호)</SubTitle>
          <p>회사는 서비스 제공을 위해 필요한 최소한의 개인정보만 수집하며, 그 외 사항은 개인정보처리방침에 따릅니다.</p>
          <p>회원의 개인정보는 관련 법령 및 회사의 개인정보처리방침에 따라 안전하게 관리됩니다.</p>
        </Section>

        <Section>
          <SubTitle>제9조 (사용자 생성 콘텐츠 및 커뮤니티 안전)</SubTitle>
          
          <p><strong>1. 사용자 생성 콘텐츠(UGC) 정책</strong></p>
          <p>회원이 서비스 내에서 작성, 게시, 업로드하는 모든 콘텐츠(텍스트, 이미지, 댓글, 리뷰 등)는 다음 기준을 준수해야 합니다.</p>
          
          <UnorderedList>
            <li><strong>금지 콘텐츠:</strong> 폭력, 혐오, 차별, 괴롭힘, 성적 콘텐츠, 불법 활동, 개인정보 노출, 스팸, 사기, 허위정보</li>
            <li><strong>미성년자 보호:</strong> 아동 및 청소년에게 유해한 콘텐츠는 즉시 삭제되며, 관련 법령에 따라 신고됩니다</li>
            <li><strong>저작권 보호:</strong> 타인의 저작권, 상표권, 초상권을 침해하는 콘텐츠는 금지됩니다</li>
            <li><strong>개인정보 보호:</strong> 타인의 개인정보를 무단으로 수집, 공개, 이용하는 행위는 금지됩니다</li>
          </UnorderedList>
          
          <p><strong>2. 콘텐츠 신고 및 검토</strong></p>
          <UnorderedList>
            <li>모든 회원은 부적절한 콘텐츠를 발견 시 앱 내 신고 기능을 통해 즉시 신고할 수 있습니다</li>
            <li>신고된 콘텐츠는 24시간 이내에 검토되며, 위반이 확인될 경우 즉시 삭제됩니다</li>
            <li>회사는 AI 및 인력 기반의 사전 필터링 시스템을 운영하여 유해 콘텐츠를 차단합니다</li>
            <li>긴급한 경우(아동 학대, 자해, 폭력 등) 즉시 관련 기관에 신고하고 해당 콘텐츠 및 계정을 차단합니다</li>
          </UnorderedList>
          
          <p><strong>3. 사용자 차단 및 제재</strong></p>
          <UnorderedList>
            <li>회원은 다른 사용자를 차단하여 해당 사용자의 콘텐츠를 보지 않을 수 있습니다</li>
            <li>약관 위반 시 경고, 콘텐츠 삭제, 계정 정지(1-30일), 영구 정지 등의 조치가 취해집니다</li>
            <li>심각한 위반(불법 콘텐츠, 아동 학대 등)의 경우 즉시 영구 정지 및 법적 조치가 진행됩니다</li>
          </UnorderedList>
          
          <p><strong>4. 미성년자 보호 강화</strong></p>
          <UnorderedList>
            <li>만 14세 미만 사용자는 법정대리인의 동의가 필요합니다</li>
            <li>청소년 유해 콘텐츠는 자동 필터링되며, 접근이 제한됩니다</li>
            <li>청소년 대상 괴롭힘, 성적 착취 등은 즉시 신고 및 계정 영구 정지됩니다</li>
          </UnorderedList>
        </Section>
        
        <Section>
          <SubTitle>제10조 (저작권 및 지식재산권)</SubTitle>
          <p>회사가 작성한 기사, 이미지, 데이터 등 콘텐츠의 저작권은 회사에 귀속됩니다.</p>
          <p>회사가 제공하는 콘텐츠는 사전 허가없이는 무단 복제, 배포, 전송, 전시할 수 없습니다.</p>
          <p>회원이 게시한 콘텐츠의 저작권은 해당 회원에게 있으나, 회사는 서비스 제공 목적으로 이를 사용할 수 있습니다.</p>
        </Section>

        <Section>
          <SubTitle>제11조 (서비스 이용 제한 및 계약 해지)</SubTitle>
          <p>회사는 회원이 본 약관 또는 법령을 위반한 경우, 서비스 이용을 제한하거나 이용계약을 해지할 수 있습니다.</p>
          <p>회원은 언제든지 회원 탈퇴 절차를 통하여 이용계약을 해지할 수 있습니다.</p>
          <p>제재 조치는 위반의 경중에 따라 경고, 콘텐츠 삭제, 계정 일시정지, 영구정지 등으로 구분되며, 회원에게 사전 통지됩니다.</p>
        </Section>

        <Section>
          <SubTitle>제12조 (면책조항)</SubTitle>
          <p>회사는 천재지변, 전쟁, 기술적 장애 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</p>
          <p>회사는 회원이 서비스 이용 과정에서 게재한 정보, 자료, 사실의 신뢰도 및 정확성에 대해 보증하지 않습니다.</p>
          <p>회사는 회원 간 또는 회원과 제3자 간 발생한 분쟁에 개입하지 않으며, 그로 인한 손해에 대해 책임을 지지 않습니다.</p>
          <p>단, 회사는 사용자 생성 콘텐츠로 인한 피해를 최소화하기 위해 신고 및 검토 시스템을 성실히 운영합니다.</p>
        </Section>

        <Section>
          <SubTitle>제13조 (분쟁 해결 및 신고 프로세스)</SubTitle>
          <UnorderedList>
            <li><strong>신고 접수:</strong> 앱 내 신고 버튼 또는 고객센터(1foodscanner@gmail.com)를 통해 24시간 신고 가능</li>
            <li><strong>검토 시간:</strong> 일반 신고는 24시간 이내, 긴급 신고(폭력, 아동학대 등)는 즉시 처리</li>
            <li><strong>조치 결과:</strong> 신고자에게 처리 결과 통보 및 필요 시 추가 조치 안내</li>
            <li><strong>이의 제기:</strong> 제재 조치에 이의가 있을 경우 7일 이내 이의 신청 가능</li>
          </UnorderedList>
        </Section>

        <Section>
          <SubTitle>제14조 (준거법 및 재판관할)</SubTitle>
          <p>본 약관은 대한민국 법령에 따라 해석되고 적용됩니다.</p>
          <p>회사와 회원 간 발생한 분쟁에 대해 소송이 제기될 경우, 회사 본사의 소재지를 관할하는 법원을 전속 관할로 합니다.</p>
        </Section>

        <Appendix>
          <SubTitle>부칙</SubTitle>
          <p>본 약관은 2025년 10월 1일부터 시행됩니다.</p>
          <p>본 약관은 2025년 12월 14일 개정되어 즉시 시행됩니다. (사용자 생성 콘텐츠 안전 정책 강화)</p>
          <p>회사는 필요 시 관련 법령 및 정책에 따라 약관을 개정할 수 있으며, 변경 사항은 서비스 내 공지사항을 통해 고지합니다.</p>
          
          <p style={{ marginTop: "16px", fontWeight: "bold" }}>
            문의 및 신고: 1foodscanner@gmail.com
          </p>
        </Appendix>
      </Content>
    </Container>
  );
}

export default TermsOfServicePage;
