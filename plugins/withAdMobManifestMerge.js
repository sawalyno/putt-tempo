/**
 * Expo Config Plugin: AdMob DELAY_APP_MEASUREMENT_INIT マージエラー解消
 *
 * react-native-google-mobile-ads のネイティブ側マニフェストとマージ時に
 * DELAY_APP_MEASUREMENT_INIT の value が衝突するため、アプリ側で必ずこの meta-data を
 * tools:replace="android:value" 付きで追加し、マージ時にアプリの値を優先させる。
 */
const { withAndroidManifest } = require('@expo/config-plugins');
const Manifest = require('@expo/config-plugins/build/android/Manifest');

const DELAY_APP_MEASUREMENT_INIT = 'com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT';
const DEFAULT_VALUE = 'true'; // マージ衝突を避けるため固定値。必要なら app.config から渡すことも可。

function withAdMobManifestMerge(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    Manifest.ensureToolsAvailable(manifest);

    const mainApplication = Manifest.getMainApplicationOrThrow(manifest);
    mainApplication['meta-data'] = mainApplication['meta-data'] ?? [];

    const existing = mainApplication['meta-data'].find(
      (item) => item.$ && item.$['android:name'] === DELAY_APP_MEASUREMENT_INIT
    );

    if (existing) {
      existing.$['android:value'] = DEFAULT_VALUE;
      existing.$['tools:replace'] = 'android:value';
    } else {
      mainApplication['meta-data'].push({
        $: {
          'android:name': DELAY_APP_MEASUREMENT_INIT,
          'android:value': DEFAULT_VALUE,
          'tools:replace': 'android:value',
        },
      });
    }

    return config;
  });
}

module.exports = withAdMobManifestMerge;
