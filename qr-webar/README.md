# QR + WebAR 最小サンプル

スマホの標準カメラでQRを読む → Webページを開く → 「ARを開始」を押してカメラを許可 → 同じ紙のHiroマーカーを見る → 赤い立方体がマーカー上で回転します。

安定性を優先し、**QRはURLを開くため、Hiroは位置・向きを認識するため**に使います。QRそのものを追跡する方式ではありません。QRとマーカーを同じ紙に並べて印刷します。アプリのインストール、バックエンド、ビルド、APIキーは不要です。

## ファイル構成

```text
index.html              ページ・印刷用レイアウト
assets/
  app.js                QR生成、AR開始・終了、状態表示
  hiro.png              印刷用の公式Hiro画像
  hiro.patt             認識用パターン
  camera_para.dat       ARToolKitのカメラパラメーター
  aframe.min.js         A-Frame 1.6.0
  aframe-ar.js          AR.js 3.4.7
  qrcode.min.js         QRCode.js 1.0.0
  LICENSE-*.txt         同梱ライブラリのライセンス
.nojekyll
README.md
```

ライブラリもローカル同梱しています。実行時に外部CDNやQR生成サービスへ接続せず、QR生成とカメラ映像の処理はブラウザ内で行います。GitHub Pagesからファイルを取得する通信は必要です。オフライン配信・キャッシュの保証はありません。

## GitHub Pagesに公開する

1. ZIPを展開し、GitHubで公開用リポジトリ（例：`qr-webar`）を作ります。最初はPublicが簡単です。
2. **リポジトリの直下に `index.html`、`assets/`、`README.md`、`.nojekyll` を置いて**mainブランチにコミットします。ZIPの外側の`qr-webar`フォルダーごと置くとURLが変わるので、フォルダーの中身をアップロードしてください。
3. リポジトリの **Settings → Pages → Build and deployment** を開きます。
4. Sourceを **Deploy from a branch**、Branchを **main**、フォルダーを **/(root)** にしてSaveします。
5. 公開が完了するまで待ち、Pagesに表示されたURLを開きます。例：`https://USERNAME.github.io/qr-webar/`。404ならActionsの公開ジョブとファイルの位置を確認します。
6. HTTPSのURLを使ってください。設定にEnforce HTTPSが表示される場合は有効にします。

GitHubの操作画面や公開条件は変わる場合があります。公式手順：[公開元の設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## QRとマーカーを印刷する

1. PCで**公開済みのページ**を開きます。
2. 「公開済みのページURL」に現在のページURLが自動入力され、QRが生成されます。別のURLを使う場合は入力して「QRを作成・更新」を押します。
3. QRに設定したURLが正しいことを確認します。GitHubのリポジトリ画面のURLではなく、`github.io`の公開ページURLです。
4. 「マーカーとQRを印刷」を押します。A4・倍率100%を目安に、HiroとQRが同じ紙に収まるように印刷します。印刷プレビューで枠やQRが欠けていないことを確認してください。PDF保存して後で印刷しても構いません。
5. Hiro画像は白い余白込みで約8cm四方になる設定です。黒枠・Hiro文字・周囲の白い余白を残し、QRは隣に配置します。画像を加工したりQRを黒枠内に埋め込んだりしないでください。

白い無光沢の紙に濃い黒で印刷し、平らな場所に置きます。光沢紙、折り目、反射、暗い場所は避けます。単独のマーカー画像は`assets/hiro.png`です。別途QRを作る場合も公開ページのURLを使い、同じ紙に並べてください。

## スマホで試す

1. スマホ標準カメラで印刷物の**QR**を読み、表示されたリンクを開きます。
2. 「ARを開始（カメラを許可）」を押し、カメラの利用を許可します。ページを開いただけではカメラは起動しません。
3. 同じ紙の**Hiroマーカー**に背面カメラを向けます。まず20〜40cmほど離し、黒枠の四隅すべてを画面内に入れて、距離と角度を調整します。
4. 「認識しました！」と表示され、赤い立方体がHiroの上に出れば成功です。マーカーが画面外に出ると立方体は消えます。
5. 「終了」でカメラのトラックを停止し、ページを再読み込みします。

印刷前の簡易チェックはPCの画面にマーカーを表示してスマホで見る方法でもできますが、反射や画面の縞で認識が不安定になる場合があります。

## iPhone / Androidの注意点

- **iPhone:** まずSafariで公開URLを直接開いて試してください。アプリ内ブラウザではカメラが使えない場合があるため「Safariで開く」を使います。カメラを拒否した場合はSafariのサイト設定やiOSの権限設定を確認して再読み込みしてください。設定画面の名称はOSバージョンで異なります。
- **Android:** まずChromeで試してください。サイトのカメラ権限と、Android側のChromeのカメラ権限の両方を確認します。アプリ内ブラウザならChromeへ切り替えてください。
- このサンプルは通常のカメラ映像とマーカー追跡を使用します。WebXRのimmersive-ar、ARCore、ARKitへの対応を前提にしません。
- カメラAPIにはHTTPS等の安全なコンテキストが必要です。スマホから`http://192.168...`にアクセスする方法では通常起動できません。`file://`で開いたファイルを完成確認に使わず、GitHub Pagesで試してください。[カメラAPIの条件](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- ブラウザを最新版へ更新し、他のカメラ使用アプリを閉じます。背面カメラはAR.jsが`facingMode: environment`で要求しますが、端末によって選択結果が異なる場合があります。
- 画面回転後に映像と立方体の位置がずれた場合は「終了」から再開します。基本は縦持ちで試してください。端末の性能によって描画速度・追跡の揺れは変わります。

## うまく動かない場合

| 症状 | 確認すること |
| --- | --- |
| ページが404 | Pagesの公開完了、main / root、index.htmlの位置 |
| QRで違うページが開く | 公開URLを再入力してQRを再生成・再印刷 |
| カメラが起動しない | HTTPS、権限、Safari / Chrome、assetsの配置 |
| カメラ準備中のまま | 許可ダイアログ、OSの権限、別アプリのカメラ使用。終了して再試行 |
| 立方体が出ない | QRではなくHiroを映す。黒枠全体と余白、明るさ、距離を確認 |
| 立方体が揺れる | 紙を平らにし、反射を避け、カメラをゆっくり動かす |

## 変更例

`assets/app.js`の`<a-box>`の`material`の色、`width / height / depth`、回転アニメーションを変更できます。`position="0 0.55 0"`のYはマーカー面からの高さです。複数のQRを使っても、現状はすべて同じHiroと同じ立方体を表示します。

## 検証と制限

デスクトップブラウザでページ表示、公開URLからのQR生成、ARシーンの初期化を確認しています。スマホ実機でのカメラ映像・印刷マーカー追跡は未検証です。公開と印刷後、上記の手順でiPhone / Android実機を確認してください。標準カメラのQR認識とARの位置追跡は別工程です。

## 出典・ライセンス

- [AR.js公式マーカー追跡ドキュメント](https://ar-js-org.github.io/AR.js-Docs/marker-based/)
- A-Frame 1.6.0: https://aframe.io/ / MIT、`assets/LICENSE-aframe.txt`
- AR.js 3.4.7: https://github.com/AR-js-org/AR.js / MIT、`assets/LICENSE-arjs.txt`。Hiro画像、パターン、カメラパラメーターも同リポジトリの同タグから取得。
- QRCode.js 1.0.0: https://github.com/davidshimjs/qrcodejs / MIT、`assets/LICENSE-qrcodejs.txt`。配布ファイルはcdnjsのバージョン固定URLから取得。

同梱ライブラリのライセンス表記を維持して配布してください。
