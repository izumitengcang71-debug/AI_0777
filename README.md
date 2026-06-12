# CharaChat - Vercelデプロイ手順

## フォルダ構成

```
charachat-vercel/
├── api/
│   └── chat.js          ← サーバーレス関数（APIキーをここで管理）
├── public/
│   ├── chars.js         ← キャラ画像・データ
│   ├── index.html       ← ホーム画面
│   ├── detail.html      ← キャラ詳細
│   └── chat.html        ← チャット画面（APIキー入力なし）
├── package.json
└── vercel.json
```

---

## デプロイ手順

### 1. GitHubにリポジトリを作成

1. https://github.com → 「New repository」
2. リポジトリ名（例：`charachat`）を入力
3. **Privateにする**（コードを非公開に）
4. 「Create repository」

### 2. このフォルダをGitHubにアップロード

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/charachat.git
git push -u origin main
```

### 3. Vercelにアカウント作成

1. https://vercel.com → 「Sign Up」
2. GitHubアカウントでログイン（推奨）

### 4. Vercelにプロジェクトをインポート

1. Vercelダッシュボードで「Add New → Project」
2. GitHubのリポジトリ（charachat）を選択
3. 「Import」をクリック
4. **そのままDeployはしない** → 次のステップへ

### 5. ★ 環境変数にAPIキーを設定（ここが重要）

1. 「Environment Variables」セクションを開く
2. 以下を入力：
   - **Name**：`GROQ_API_KEY`
   - **Value**：`gsk_xxxxxxxxxxxxxxxxxxxxxxxx`（あなたのGroq APIキー）
3. 「Add」をクリック
4. 「Deploy」をクリック

### 6. デプロイ完了

- `https://charachat-xxx.vercel.app` のようなURLが発行される
- そのURLにアクセスすればアプリが動く
- ユーザーにAPIキーを入力させる必要はない

---

## APIキーの確認・変更方法

1. Vercelダッシュボード → プロジェクトを選択
2. 「Settings」→「Environment Variables」
3. `GROQ_API_KEY` を編集・変更
4. 変更後は「Redeploy」で反映

---

## セキュリティ上の注意

- ✅ APIキーは環境変数に入れているのでソースコードに出てこない
- ✅ GitHubをPrivateにしていれば外部に漏れない
- ⚠️ アクセスが増えるとGroqの無料枠を超えることがある
  → Groqダッシュボードでレート制限を確認しておくこと
- ⚠️ 必要ならVercelのアクセス制限やCloudflareのWAFを追加するとより安全
