# Task 26: スプラッシュスクリーン作成

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task26 |
| フェーズ | Phase 10: リリース準備 |
| 所要時間 | 30分 |
| 依存タスク | task25（アプリアイコン） |

## 目的
アプリ起動時のスプラッシュスクリーンを作成する。

## 必要なアセット

| アセット | サイズ | 用途 |
|---------|--------|------|
| splash.png | 1284×2778px | スプラッシュスクリーン |

## デザイン仕様
- 背景色：#0A0A0A（ダーク）
- 中央にアプリアイコン配置
- アイコン下に「Putt Tempo」のロゴテキスト（オプション）

## 配置場所
```
assets/
  images/
    splash.png
```

## app.json設定
```json
{
  "splash": {
    "image": "./assets/images/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#0A0A0A"
  }
}
```

## 完了条件
- [ ] splash.png が作成されている（1284×2778px）
- [ ] app.json/app.config.ts で設定されている
- [ ] アプリ起動時にスプラッシュが表示される
