# お絵かきマップ（基本機能）
「お絵かきマップ」は、<a href="http://maps.gsi.go.jp/">地理院地図のデータ（地理院タイル）</a>を利用した、マップ用の図形データを作成するための Web サービスです。

##
サンプルは <a href="https://tknpow22.github.io/mapmkr/">こちら(ja)</a> です。

##
a exsample is <a href="https://tknpow22.github.io/mapmkr/index_en.html">hire(en)</a>.

## 
開発は Google Chrome で行いました。Internet Explorer、Microsoft Edge、Mozilla Firefox、Opera でも簡単な確認はしています。
正しく動作させるには、必ずブラウザの最新バージョンをお使いください。

##
作成・保存した図形データは、地理院地図の「作図・ファイル」ツールで読み込むことができます（※1）。
また、地理院地図の「作図・ファイル」ツールで作成・保存した図形データを、「お絵かきマップ」で読み込むこともできます（※2）。

※1 「お絵かきマップ」が対応しているのは GeoJSON 形式のみです。
また、「お絵かきマップ」の保存ファイルは ZIP 形式にまとめられているため、
ZIP ファイルを展開し、抽出した GeoJSON 形式ファイルのみを読み込む必要があります。

※2 地理院地図の「作図・ファイル」ツールから GeoJSON 形式で保存した図形データのみ読み込めます。

##
「お絵かきマップ」で図形データを保存する際に「公開に必要なファイルを含める」にチェックを入れると、
地理院地図を使って図形データをマップ表示するためのファイルも同梱するため、
保存した ZIP ファイルを展開し、ご自身の Web サーバーにアップロードするだけで、マップとして公開することができます。

##
「お絵かきマップ」の作成にあたり、下記の素晴らしいソフトウェアおよびリソースを利用させていただきました。
敬意を表すとともに、厚く御礼申し上げます。

なお、「お絵かきマップ」が利用しているソフトウェアについては、個々のソフトウェアが持つライセンスが適用されます。
また、「お絵かきマップ」（基本機能）は 2 条項 BSD ライセンスを適用して公開します。

- <a href="http://maps.gsi.go.jp/">地理院地図</a>
- <a href="https://github.com/gsi-cyberjapan/gsimaps">gsimaps</a>
- <a href="http://leafletjs.com/">Leaflet</a>
- <a href="https://github.com/Leaflet/Leaflet.draw">Leaflet.draw</a>
- <a href="https://github.com/aratcliffe/Leaflet.contextmenu">Leaflet.contextmenu</a>
- <a href="https://jquery.com/">jQuery</a>
- <a href="https://jqueryui.com/">jQuery UI</a>
- <a href="http://malsup.com/jquery/block/">jQuery BlockUI Plugin</a>
- <a href="http://honokak.osaka/">Honoka</a>
- <a href="http://getbootstrap.com/">Bootstrap</a>
- <a href="https://itsjavi.com/bootstrap-colorpicker/">Bootstrap Colorpicker</a>
- <a href="http://plugins.krajee.com/file-input">Bootstrap File Input</a>
- <a href="http://fontawesome.io/">Font Awesome</a>
- <a href="https://stuk.github.io/jszip/">JSZip</a>
- <a href="https://github.com/eligrey/FileSaver.js/">FileSaver.js</a>
- <a href="http://momentjs.com/">Moment.js</a>
- <a href="https://alex-d.github.io/Trumbowyg/">Trumbowyg</a>
