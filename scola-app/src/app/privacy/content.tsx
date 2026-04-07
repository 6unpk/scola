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

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px 20px;
  margin-top: 12px;

  p {
    font-size: 13px;
    line-height: 1.8;
    color: ${({ theme }) => theme.colors.gray700};
    margin: 0;
  }
`;

export default function PrivacyPage() {
  return (
    <Page>
      <Navbar />
      <Header>
        <HeaderInner>
          <Kicker>Legal</Kicker>
          <Title>개인정보처리방침</Title>
          <UpdatedAt>최종 업데이트: 2025년 4월 1일</UpdatedAt>
        </HeaderInner>
      </Header>

      <Body>
        <Section>
          <SectionTitle>1. 총칙</SectionTitle>
          <Text>
            아온미디어(이하 &quot;회사&quot;)는 스콜라(Scola) 서비스(이하 &quot;서비스&quot;) 이용자의 개인정보를 중요시하며,
            「개인정보 보호법」 및 관계 법령이 정하는 바에 따라 이용자의 개인정보를 보호하고,
            이와 관련한 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>2. 수집하는 개인정보 항목 및 수집 방법</SectionTitle>
          <Text>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.</Text>
          <List>
            <li>필수 항목: 이메일 주소, 비밀번호, 닉네임</li>
            <li>서비스 이용 중 자동 수집: 접속 IP, 쿠키, 서비스 이용 기록, 기기 정보</li>
          </List>
          <Text>수집 방법: 서비스 내 회원가입 양식을 통한 직접 수집</Text>
        </Section>

        <Section>
          <SectionTitle>3. 개인정보의 수집 및 이용 목적</SectionTitle>
          <List>
            <li>회원 가입 및 회원 관리 (본인 확인, 서비스 부정 이용 방지 등)</li>
            <li>서비스 제공 및 운영 (후기 작성, 장소 검색 등 기능 제공)</li>
            <li>서비스 개선 및 신규 서비스 개발을 위한 통계 분석</li>
            <li>법령 및 이용약관 위반 행위에 대한 대응</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. 개인정보의 보유 및 이용 기간</SectionTitle>
          <Text>
            회원 탈퇴 시 또는 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
            단, 관련 법령에 따라 보존이 필요한 경우 아래와 같이 보관합니다.
          </Text>
          <List>
            <li>서비스 이용 기록, 접속 로그: 3개월 (통신비밀보호법)</li>
            <li>소비자 불만 또는 분쟁 처리 기록: 3년 (전자상거래 등에서의 소비자 보호에 관한 법률)</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>5. 개인정보의 제3자 제공</SectionTitle>
          <Text>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
            다만, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의거하거나 수사기관의 요청이 있는 경우에는 예외로 합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>6. 개인정보 처리의 위탁</SectionTitle>
          <Text>
            현재 회사는 서비스 운영을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.
          </Text>
          <List>
            <li>클라우드 서버 운영: Railway (서버 인프라 제공)</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. 이용자의 권리 및 행사 방법</SectionTitle>
          <Text>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</Text>
          <List>
            <li>개인정보 열람 요청</li>
            <li>오류 정정 요청</li>
            <li>삭제 요청 (회원 탈퇴)</li>
            <li>처리 정지 요청</li>
          </List>
          <Text>권리 행사는 아래 개인정보 보호책임자에게 이메일로 요청하실 수 있습니다.</Text>
        </Section>

        <Section>
          <SectionTitle>8. 개인정보의 파기 절차 및 방법</SectionTitle>
          <Text>
            보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.
            전자적 파일 형태로 저장된 개인정보는 복원이 불가능한 방법으로 영구 삭제합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>9. 쿠키(Cookie) 운영</SectionTitle>
          <Text>
            서비스는 이용자에게 적합하고 유용한 서비스를 제공하기 위해 쿠키를 사용할 수 있습니다.
            이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나,
            이 경우 일부 서비스 이용이 제한될 수 있습니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>10. 개인정보 보호책임자</SectionTitle>
          <InfoBox>
            <p>
              성명: 박준우<br />
              소속: 아온미디어<br />
              이메일: aonmedia@aonmedia.net<br />
              주소: 경기도 고양시 덕양구
            </p>
          </InfoBox>
        </Section>

        <Section>
          <SectionTitle>11. 개인정보처리방침 변경</SectionTitle>
          <Text>
            본 방침은 법령, 정책 또는 보안 기술의 변경에 따라 내용이 추가·삭제 및 수정될 수 있습니다.
            변경 사항은 서비스 내 공지 또는 본 페이지를 통해 안내됩니다.
          </Text>
        </Section>
      </Body>

      <Footer />
    </Page>
  );
}
