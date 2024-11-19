#
# [synquery-bootstrap] cmd/setup.sh
# synquery 環境をセットアップするコマンド（最上位）
#
# 下準備
git clone https://github.com/synquery/synquery-bootstrap.git
npm i -g yarn
npm i -g shx
shx mv synquery-bootstrap .sb
shx cd .sb
npm i
shx cd ..
# セットアップ本文
yarn init -y
yarn add -D parcel
yarn add -D sass
yarn add -D yaml-js
yarn add st
yarn add -D @parcel/optimizer-data-url 
yarn add -D @parcel/transformer-inline-string
yarn add -D @parcel/transformer-sass
shx echo '{ "minifySvg": false }' > .htmlnanorc
shx mkdir src; 
shx echo "<html><head></head><body><div> HELLO, WORLD! </div><script>console.log('HELLO, WORLD!');</script></body></html>" > src/index.html
node .sb/cmd/setup.js