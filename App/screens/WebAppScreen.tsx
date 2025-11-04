// screens/WebAppScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import FooterNav from '../components/FooterNav';

export default function WebAppScreen() {
  return (
    <View style={styles.container}>
      {/* WebView entre label et footer */}
      <WebView
        source={{ uri: 'https://ruleweaver-flow.vercel.app/' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        injectedJavaScript={`
          const meta = document.createElement('meta');
          meta.setAttribute('name', 'viewport');
          meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
          document.head.appendChild(meta);
        `}
      />

      {/* Footer */}
      <FooterNav active="web" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
});
