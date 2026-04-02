'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardCheck, BookOpen, Users, Menu, X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

const navigation = [
  { name: '출결관리', href: '/attendance', icon: ClipboardCheck },
  { name: '클래스 관리', href: '/classes', icon: BookOpen },
  { name: '학생관리', href: '/students', icon: Users },
];

const DesktopAside = styled.aside`
  display: none;
  width: 256px;
  border-right: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
`;

const MobileOverlay = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobilePanel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 256px;
  background: ${({ theme }) => theme.colors.white};
  z-index: 50;
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform 0.2s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  h1 {
    font-size: 20px;
    font-weight: 600;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.gray700};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : 'transparent'};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryLight : theme.colors.gray100};
  }
`;

const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
  padding: 0 4px;
`;

const MobileHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  height: 64px;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.white};

  h1 {
    font-size: 18px;
    font-weight: 600;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === '/attendance' && pathname === '/') return true;
    return pathname === href;
  };

  return (
    <SidebarInner>
      <LogoArea>
        <h1>Scola</h1>
      </LogoArea>
      <Nav>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              href={item.href}
              $active={isActive(item.href)}
              onClick={onNavigate}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </Nav>
      <Footer>
        {user && <UserInfo>{user.nickname || user.email}</UserInfo>}
        <Button variant="outline" size="sm" fullWidth onClick={logout}>
          로그아웃
        </Button>
      </Footer>
    </SidebarInner>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      <DesktopAside>
        <SidebarContent />
      </DesktopAside>

      <MobileOverlay $open={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <MobilePanel $open={sidebarOpen}>
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </MobilePanel>

      <MobileHeader>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </Button>
        <h1>Scola</h1>
      </MobileHeader>
    </>
  );
}
