'use client';

import styled from 'styled-components';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  padding: 60px 24px 48px;
`;

const HeaderInner = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Kicker = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 10px;
`;

const UpdatedAt = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.4);
`;

const Body = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px 80px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 10px;

  li {
    font-size: 14px;
    line-height: 1.85;
    color: ${({ theme }) => theme.colors.gray700};
    padding-left: 14px;
    position: relative;
    margin-bottom: 4px;

    &::before {
      content: '–';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.colors.gray400};
    }
  }
`;

export default function TermsPage() {
  return (
    <Page>
      <Navbar />
      <Header>
        <HeaderInner>
          <Kicker>Legal</Kicker>
          <Title>이용약관</Title>
          <UpdatedAt>최종 업데이트: 2025년 4월 1일</UpdatedAt>
        </HeaderInner>
      </Header>

      <Body>
        <Section>
          <SectionTitle>제1조 (목적)</SectionTitle>
          <Text>
            본 약관은 아온미디어(이하 &quot;회사&quot;)가 제공하는 스콜라(Scola) 서비스(이하 &quot;서비스&quot;)의
            이용 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제2조 (정의)</SectionTitle>
          <List>
            <li>&quot;서비스&quot;란 회사가 운영하는 사우나·찜질방·스파 정보 검색 및 후기 플랫폼 스콜라(scola.kr)를 의미합니다.</li>
            <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
            <li>&quot;회원&quot;이란 서비스에 가입하여 회원 아이디를 부여받은 자를 말합니다.</li>
            <li>&quot;콘텐츠&quot;란 이용자가 서비스 내에 게시한 후기, 평점 등의 정보를 말합니다.</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>제3조 (약관의 효력 및 변경)</SectionTitle>
          <Text>
            본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
            회사는 합리적인 사유가 있는 경우 관련 법령을 위반하지 않는 범위 내에서 본 약관을 변경할 수 있으며,
            변경된 약관은 공지 후 7일 이후부터 효력이 발생합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제4조 (회원 가입)</SectionTitle>
          <Text>
            이용자는 회사가 정한 가입 양식에 따라 정보를 기입한 후 본 약관에 동의함으로써 회원 가입을 신청합니다.
            회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 거부할 수 있습니다.
          </Text>
          <List>
            <li>실명이 아니거나 타인의 명의를 사용한 경우</li>
            <li>허위 정보를 기재하거나 회사가 요구하는 정보를 기재하지 않은 경우</li>
            <li>이전에 서비스 이용 제한 조치를 받은 경우</li>
            <li>기타 회사가 정한 이용 신청 요건이 충족되지 않은 경우</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>제5조 (회원의 의무)</SectionTitle>
          <Text>회원은 다음 행위를 해서는 안 됩니다.</Text>
          <List>
            <li>타인의 개인정보 도용 또는 허위 정보 등록</li>
            <li>서비스 내 허위 후기 또는 비방·명예훼손 콘텐츠 게시</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>회사의 사전 승낙 없이 서비스를 이용한 영리 행위</li>
            <li>기타 관련 법령 및 본 약관에 위반되는 행위</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>제6조 (서비스의 제공 및 변경)</SectionTitle>
          <Text>
            회사는 서비스를 연중무휴 24시간 제공함을 원칙으로 합니다.
            단, 시스템 점검·고장·통신 장애 등의 사유가 있는 경우 서비스 제공을 일시 중단할 수 있으며,
            이 경우 사전에 공지합니다. 부득이한 사정이 있는 경우 사후 공지할 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제7조 (콘텐츠의 관리)</SectionTitle>
          <Text>
            이용자가 서비스 내에 게시한 콘텐츠의 저작권은 해당 이용자에게 귀속됩니다.
            단, 이용자는 서비스 내 게시 및 관련 홍보 목적으로 회사가 해당 콘텐츠를 사용할 수 있도록
            비독점적이고 무상의 이용 권한을 회사에 부여합니다.
          </Text>
          <Text>
            회사는 다음에 해당하는 콘텐츠를 사전 통지 없이 삭제하거나 이용을 제한할 수 있습니다.
          </Text>
          <List>
            <li>타인의 명예를 훼손하거나 권리를 침해하는 내용</li>
            <li>음란하거나 폭력적인 내용</li>
            <li>허위 사실을 포함하거나 오해를 유발하는 내용</li>
            <li>법령 또는 본 약관에 위반되는 내용</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>제8조 (서비스 이용 제한)</SectionTitle>
          <Text>
            회사는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우,
            경고·일시 중지·영구 이용 정지 등의 조치를 취할 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제9조 (면책 조항)</SectionTitle>
          <Text>
            회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를
            제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
          </Text>
          <Text>
            서비스에 게재된 장소 정보(영업시간, 요금 등)는 실제와 다를 수 있으며,
            회사는 해당 정보의 정확성에 대해 책임을 지지 않습니다. 방문 전 직접 확인을 권장합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제10조 (분쟁 해결)</SectionTitle>
          <Text>
            서비스 이용과 관련하여 회사와 이용자 간에 분쟁이 발생한 경우,
            회사와 이용자는 분쟁의 해결을 위해 성실히 협의합니다.
            협의가 이루어지지 않는 경우, 관련 법령에 따른 관할 법원에 소를 제기할 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제11조 (준거법 및 재판 관할)</SectionTitle>
          <Text>
            본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련한 분쟁에 대해서는
            회사의 본사 소재지를 관할하는 법원을 제1심 관할 법원으로 합니다.
          </Text>
        </Section>
      </Body>

      <Footer />
    </Page>
  );
}
