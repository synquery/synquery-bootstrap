/**
 * [build assist tools] replacer.js
 * ビルド後のファイルを少し書き換えるのに利用する。
 */
(mx=>{
  
  const path = require('path'), fs = require('fs');
  const argv = process.argv.slice(2);
  const op = argv.shift();
  const packdir = process.cwd();
  const distdir = path.resolve(packdir, 'dist');
  if(!fs.existsSync(`${packdir}/package.json`)) {
    throw '(replacer.js) Must run at the project root with package.json!';
  }
  switch(op) {

    case 'relativize':
      // parcel build で絶対パスになったものを相対パスに置き換える
      // 複数ファイルを同時に指定可能
      if(argv[0] == '-a') {
        return Op_multi(distdir, Op_relativize);
      } else {
        return Op_relativize(distdir, argv).then(()=>{
          console.log(`Finished operation: ${op}`);
        });
      }
      
    default:
      console.log(`No such operation: ${op}`);
      
  }
  return;
  // <-- END-OF-MAIN <--
  
  async function Op_relativize(srcdir, files, options) {
    let fileWhen = Promise.resolve();
    ([ ].concat(files)).forEach(file=>{
      
      if(!(/\.html?$/i).test(file)) {
        return; // 対象は HTML のみ
      }
      const filepath = path.resolve(srcdir, file);
      console.log(`operating filepath: ${filepath}`);
      fileWhen = fileWhen.then(()=>{
        return fs.readFileSync(filepath)
      }).then(buf=>{
        return buf.toString().replace(/ href="\//g, ' href="./').replace(/ src="\//g, ' src="./');
      }).then(s=>{
        return fs.writeFileSync(filepath, s);
      });

    });
    return fileWhen;
  }
  
  async function Op_multi(srcdir, proc, options) {
    console.log(`(replacer.js) searching directory: ${srcdir}`);
    return Promise.resolve().then(()=>{
      return fs.readdirSync(srcdir);
    }).then(a=>{
      return proc(srcdir, a.filter(file=>{
        const fp = path.resolve(srcdir, file);
        const stat = fs.statSync(fp);
        return !stat.isDirectory();
      }));
    });
  }
  
  async function Op_mkDdir(pathname) {
    const pathdir = path.resolve(distdir, pathname);
    return new Promise((rsl, rej)=>fs.mkdir(pathdir, { recursive: true }, (er, rd)=>{ 
      if(er) console.log('[Warn](Op_mkDir)', er); rsl();
    }));
  }
  
})(module.exports);
