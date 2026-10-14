import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { useFocusEffect } from '@react-navigation/native';
import { APP_UA, WEB_BASE, colors } from '../config';

export default function WebScreen({ path }: { path: string }) {
  const ref = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!canGoBack) return false;
        ref.current?.goBack();
        return true;
      });
      return () => sub.remove();
    }, [canGoBack]),
  );

  const onShouldStart = (req: ShouldStartLoadRequest) => {
    if (req.url.startsWith(WEB_BASE) || req.url.startsWith('about:')) return true;
    Linking.openURL(req.url).catch(() => {});
    return false;
  };

  return (
    <View style={styles.wrap}>
      <WebView
        ref={ref}
        source={{ uri: `${WEB_BASE}${path}` }}
        applicationNameForUserAgent={APP_UA}
        onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
        onLoadEnd={() => setLoading(false)}
        onShouldStartLoadWithRequest={onShouldStart}
        setSupportMultipleWindows={false}
        geolocationEnabled
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled
        style={styles.web}
      />
      {loading && <ActivityIndicator style={styles.spinner} color={colors.primary} size="large" />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.white },
  web: { flex: 1 },
  spinner: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
});
