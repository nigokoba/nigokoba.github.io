'use strict';
const $ = id => document.getElementById(id);
let scene;
let starting = false;
function generate() {
  $('print').disabled = true;
  $('qr').replaceChildren();
  try {
    const url = new URL($('url').value.trim());
    if (url.protocol !== 'https:') throw new Error('公開先のHTTPS URLを入力してください。');
    if (url.username || url.password) throw new Error('認証情報を含まないURLを入力してください。');
    // QRの読み取りに必要な白い余白は外側のpaddingで確保。
    new QRCode($('qr'), {text:url.href,width:220,height:220,correctLevel:QRCode.CorrectLevel.M});
    $('print-url').textContent = url.href;
    $('print').disabled = false;
    $('error').textContent = '';
  } catch (error) {
    $('print-url').textContent = 'QRを作成できませんでした。URLを確認してください。';
    $('error').textContent = error.message;
  }
}
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('ARライブラリを読み込めません。assetsフォルダーを確認してください。'));
    document.head.append(script);
  });
}
function fail(message) {
  $('error').textContent = message;
  $('status').textContent = message;
  $('stop').textContent = '戻る';
}
$('start').addEventListener('click', async () => {
  if (starting) return;
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    fail('HTTPSで公開したページをSafari / Chromeで開いてください。PCのlocalhostでも起動できます。');
    return;
  }
  starting = true;
  $('start').disabled = true;
  $('error').textContent = '';
  try {
    // ボタンを押してから初めてカメラを要求する。
    await loadScript('assets/aframe.min.js');
    await loadScript('assets/aframe-ar.js');
    document.body.classList.add('ar');
    scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'antialias: true; alpha: true');
    scene.setAttribute('arjs', 'sourceType: webcam; debugUIEnabled: false; cameraParametersUrl: assets/camera_para.dat;');
    scene.innerHTML = `<a-marker type="pattern" url="assets/hiro.patt" emitevents="true">
      <a-box position="0 0.55 0" width="0.8" height="0.8" depth="0.8" material="color: #ef445b; roughness: 0.5" animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"></a-box>
    </a-marker><a-entity camera></a-entity>`;
    const marker = scene.querySelector('a-marker');
    marker.addEventListener('markerFound', () => { $('status').textContent = '認識しました！立方体がHiroの上に現れます。'; });
    marker.addEventListener('markerLost', () => { $('status').textContent = 'Hiroの黒い枠全体をカメラに映してください。'; });
    window.addEventListener('camera-init', () => { $('status').textContent = 'Hiroの黒い枠全体をカメラに映してください。'; });
    window.addEventListener('camera-error', event => {
      const name = event.detail?.error?.name || event.detail?.name || '';
      fail(`カメラを開始できませんでした。${name} ブラウザのカメラ権限を確認し、終了後に再試行してください。`);
    });
    document.body.append(scene);
  } catch (error) {
    fail(error.message);
    starting = false;
    $('start').disabled = false;
  }
});
$('stop').addEventListener('click', () => {
  document.querySelectorAll('video').forEach(video => {
    video.srcObject?.getTracks().forEach(track => track.stop());
  });
  // AR.jsのイベント・描画ループも初期化し直す。
  location.reload();
});
$('generate').addEventListener('click', generate);
$('print').addEventListener('click', () => window.print());
if (location.protocol === 'https:') {
  const url = new URL(location.href);
  url.hash = '';
  url.search = '';
  $('url').value = url.href;
  generate();
}
