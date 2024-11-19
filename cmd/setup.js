/**
 * [synquery-bootstrap] cmd/setup.js
 * cmd/setup.sh の中で呼び出される、synquery 環境をセットアップするコマンド
 */
const fs = require('fs');
(()=>{
  
  const pkgjson = require('./package.json');
  pkgjson['_main_' ] = pkgjson.main;
  delete pkgjson.main;
  pkgjson['scripts'] = {
    "parcel": "npx parcel src/index.html --no-cache --no-hmr", 
    "parcel-hmr": "npx parcel src/index.html --no-cache",
    "build": "rm -Rf dist; npx parcel build src/index.html --no-cache --no-source-maps;",
    "st": "st -nc"
  };
  console.log('Ready to run: npm run parcel-hmr');
  
})();
