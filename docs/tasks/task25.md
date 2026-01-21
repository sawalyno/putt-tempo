# Task 25: アプリアイコン作成

## 概要
| 項目 | 内容 |
|------|------|
| タスクID | task25 |
| フェーズ | Phase 10: リリース準備 |
| 所要時間 | 1時間 |
| 依存タスク | なし |

## 目的
App Store / Google Play用のアプリアイコンを作成する。

## 必要なアセット

| アセット | サイズ | 用途 |
|---------|--------|------|
| icon.png | 1024×1024px | App Store、Expo |
| adaptive-icon.png | 1024×1024px | Android Adaptive Icon（フォアグラウンド） |
| adaptive-icon-background.png | 1024×1024px | Android Adaptive Icon（背景） |
| favicon.png | 48×48px | Web |

## デザインコンセプト

### アイコンイメージ
- パターヘッドをモチーフにしたシンプルなデザイン
- ダークブルー（#3B82F6）をメインカラー
- ゴルフボールのディンプル模様をアクセントに
- 視認性の高いシンプルな形状

### AI画像生成プロンプト（英語）
```
A minimal app icon design for a golf putting metronome app.
Features a stylized putter head in blue (#3B82F6) color.
Dark background (#0A0A0A).
Clean, modern, flat design style.
No text, icon only.
1024x1024 pixels, high resolution.
```

### AI画像生成プロンプト（日本語）
```
ゴルフパッティング用メトロノームアプリのミニマルなアイコンデザイン。
青色（#3B82F6）のスタイライズされたパターヘッドをフィーチャー。
ダーク背景（#0A0A0A）。
クリーンでモダンなフラットデザインスタイル。
テキストなし、アイコンのみ。
1024x1024ピクセル、高解像度。
```

## 配置場所
```
assets/
  images/
    icon.png
    adaptive-icon.png
```

## app.json設定
```json
{
  "icon": "./assets/images/icon.png",
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#0A0A0A"
    }
  }
}
```

## 完了条件
- [ ] icon.png が作成されている（1024×1024px）
- [ ] adaptive-icon.png が作成されている（1024×1024px）
- [ ] app.json/app.config.ts で設定されている
- [ ] Expoでプレビュー確認できる

## 推奨ツール
- Midjourney
- DALL-E 3
- Leonardo.ai
- Figma（手動作成の場合）
