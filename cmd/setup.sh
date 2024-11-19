#
# [synquery-bootstrap] cmd/setup.sh
# synquery 環境をセットアップするコマンド（最上位）
#
# 下準備
git clone https://github.com/synquery/synquery-bootstrap.git
npm i -g yarn
mv synquery-bootstrap .sb
cd .sb
npm i
cd ..
# セットアップ本文
yarn init -y
yarn add -D parcel
yarn add -D sass
yarn add -D yaml-js
yarn add st
yarn add -D @parcel/optimizer-data-url 
yarn add -D @parcel/transformer-inline-string
yarn add -D @parcel/transformer-sass
echo '{ "minifySvg": false }' > .htmlnanorc
mkdir src; echo "<html><head></head><body><div> HELLO, WORLD! </div><script>console.log('HELLO, WORLD!');</script></body></html>" > src/index.html
node .sb/cmd/setup.js