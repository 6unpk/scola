// FCM 토큰을 저장할 변수
let storedFcmToken: string | null = null;

/**
 * FCM 토큰을 로컬에 저장합니다.
 * @param token FCM 토큰
 */
export const storeFcmToken = (token: string) => {
  console.log("FCM 토큰 저장:", token);
  storedFcmToken = token;

  // 로컬 스토리지에도 저장
  localStorage.setItem("fcmToken", token);
};

/**
 * 저장된 FCM 토큰을 가져옵니다.
 */
export const getFcmToken = (): string | null => {
  // 메모리에 없는 경우 로컬 스토리지에서 가져오기
  if (!storedFcmToken) {
    storedFcmToken = localStorage.getItem("fcmToken");
  }
  return storedFcmToken;
};

/**
 * FCM 토큰을 서버로 전송합니다.
 * @param token FCM 토큰
 */
export const sendFcmTokenToServer = async ({
  token = "",
  userId,
}: {
  token?: string;
  userId: string;
}): Promise<boolean> => {
  try {
    // 토큰이 제공되지 않은 경우 저장된 토큰 사용
    const fcmToken = token || getFcmToken();
    if (!fcmToken) {
      console.error("전송할 FCM 토큰이 없습니다.");
      return false;
    }

    // UpdateUserMutation을 사용하여 사용자 정보 업데이트
    return new Promise((resolve, reject) => {
      // UpdateUserMutation.commit(
      //   environment,
      //   {
      //     userId: userId,
      //     fcmToken: fcmToken,
      //   },
      //   () => {
      //     console.log("FCM 토큰이 서버로 성공적으로 전송되었습니다.");
      //     resolve(true);
      //   },
      //   (error) => {
      //     console.error("FCM 토큰 전송 중 오류 발생:", error);
      //     reject(error);
      //   },
      // );
    });
  } catch (error) {
    console.error("FCM 토큰 전송 중 예외 발생:", error);
    return false;
  }
};

export const removeFcmToken = ({ userId }: { userId: string }) => {
  try {
    // UpdateUserMutation을 사용하여 사용자 정보 업데이트
    // return new Promise((resolve, reject) => {
    //   UpdateUserMutation.commit(
    //     environment,
    //     {
    //       userId: userId,
    //       fcmToken: "",
    //     },
    //     () => {
    //       console.log("FCM 토큰이 서버로 성공적으로 제거되었습니다.");
    //       resolve(true);
    //     },
    //     (error) => {
    //       console.error("FCM 토큰 제거 중 오류 발생:", error);
    //       reject(error);
    //     },
    //   );
    // });
  } catch (error) {
    console.error("FCM 토큰 제거 중 오류 발생:", error);
  }
};

// FCM 토큰 리스너가 이미 등록되었는지 확인하는 플래그
let isFcmListenerSetup = false;

/**
 * Capacitor 앱에서 FCM 토큰 이벤트를 수신하기 위한 리스너를 설정합니다.
 * 중복 등록을 방지합니다.
 */
export const setupFcmTokenListener = () => {
  if (isFcmListenerSetup) {
    console.log("FCM 토큰 리스너가 이미 등록되어 있습니다.");
    return;
  }

  try {
    // Capacitor 이벤트 리스너 등록
    window.addEventListener("fcmTokenReceived", (event: any) => {
      try {
        const customEvent = event as { fcmToken: string };
        console.log("FCM 토큰 이벤트 수신:", JSON.stringify(customEvent));
        const data = customEvent.fcmToken;
        if (data) {
          storeFcmToken(data);
        }
      } catch (error) {
        console.error("FCM 토큰 이벤트 처리 중 오류 발생:", error);
      }
    });

    isFcmListenerSetup = true;
    console.log("FCM 토큰 리스너가 설정되었습니다.");
  } catch (error) {
    console.error("FCM 토큰 리스너 설정 중 오류 발생:", error);
  }
};
