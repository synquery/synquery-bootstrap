/**
 * [build assist tools] replacer.js
 * ビルド後のファイルを少し書き換えるのに利用する。
 */
(mx=>{
  
  const path = require('path'), fs = require('fs');
  const argv = process.argv.slice(2);
  const op = argv.shift();
  const packdir = path.resolve(__dirname, '..');
  const distdir = path.resolve(packdir, 'dist');
  switch(op) {

    case 'root2cdir':
      // parcel build で絶対パスになったものを相対パスに置き換える
      // 複数ファイルを同時に指定可能
      return Op_root2cdir(argv).then(()=>{
        console.log(`Finished operation: ${op}`);
      });
    
    case 'postbuild':
      return Op_root2cdir(argv[0]).then(()=>Op_mkDdir(argv[1])).then(()=>Op_mvDdirTo(argv[1])).then(()=>{
        console.log(`Finished operation: ${op}`);
      });

    default:
      console.log(`No such operation: ${op}`);
      
  }
  return;
  // <-- END-OF-MAIN <--
  
  async function Op_root2cdir(files) {
    let fileWhen = Promise.resolve();
    ([ ].concat(files)).forEach(file=>{
      const filepath = path.resolve(packdir, file);
      fileWhen = fileWhen.then(()=>{
        return fs.readFileSync(filepath)
      }).then(buf=>{
        return buf.toString().replace(/\"\//g, '"./');
      }).then(s=>{
        return fs.writeFileSync(filepath, s);
      });
    });
    return fileWhen;
  }
  
  async function Op_mkDdir(pathname) {
    const pathdir = path.resolve(distdir, pathname);
    return new Promise((rsl, rej)=>fs.mkdir(pathdir, { recursive: true }, (er, rd)=>{ 
      if(er) console.log('[Warn](Op_mkDir)', er); rsl();
    }));
  }
  
  // mkdir -p dist/whitepaper; mv dist/* dist/whitepaper;
  async function Op_mvDdirTo(pathname) {
    const pathdir = path.resolve(distdir, pathname);
    return Promise.resolve().then(()=>{
      return fs.readdirSync(distdir);
    }).then(a=>{
      let mvWhen = Promise.resolve();
      a.forEach(file=>{
        const fp = path.resolve(distdir, file);
        const mp = path.resolve(pathdir, file);
        const stat = fs.statSync(fp);
        if(stat.isDirectory()) {
          return;
        }
        mvWhen = mvWhen.then(()=>{
          return Promise.resolve().then(()=>{
            return fs.readFileSync(fp);
          }).then(buf=>{
            return fs.writeFileSync(mp, buf);
          }).then(()=>{
            return fs.unlinkSync(fp);
          });
        });
      });
      return mvWhen;
    });
  }
  
})(module.exports);