/**
 * [synquery-bootstrap] cmd/setup.js
 * cmd/setup.sh の中で呼び出される、synquery 環境をセットアップするコマンド
 */
const fs = require('fs');
(()=>{
  
  const filepath = `${process.cwd()}/package.json`;
  const pkgjson = require(filepath);
  pkgjson['_main_' ] = pkgjson.main;
  delete pkgjson.main;
  pkgjson['scripts'] = {
    "parcel": "npx parcel src/index.html --no-cache --no-hmr", 
    "parcel-hmr": "npx parcel src/index.html --no-cache",
    "build": "rm -Rf dist; npx parcel build src/index.html --no-cache --no-source-maps;",
    "st": "st -nc"
  };
  fs.writeFileSync(filepath, JSON.stringify(pkgjson, null, '  '));
  console.log(`[synquery-bootstrap]✨ Let's run: ✨ npm run parcel-hmr`);
  
})();
