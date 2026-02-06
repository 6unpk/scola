import { useEffect } from 'react';

const GoogleCallbackPage = () => {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');

    if (idToken && window.opener) {
      window.opener.postMessage(
        {
          type: 'GOOGLE_AUTH_SUCCESS',
          idToken,
        },
        window.location.origin
      );
      window.close();
    } else {
      console.error('idToken을 찾을 수 없거나 opener가 없습니다.');
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100dvh',
      fontFamily: 'sans-serif'
    }}>
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallbackPage;

