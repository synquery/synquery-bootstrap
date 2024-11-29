/**
 * [build assist tools] replacer.js
 * ビルド後のファイルを少し書き換えるのに利用する。
 */
(mx=>{
  
  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  const path = require('path'), fs = require('fs');

  const argv = require('argv');
  argv.option([ {
    name: 'all',
    short: 'A',
    type: 'boolean',
    description: 'ディレクトリ内部ファイル全体を一括処理したい場合に指定する'
  }, {
    name: 'opdir',
    short: 'd',
    type: 'string',
    description: '操作するディレクトリを取得する'
  }]);

  const jsdom = require("jsdom");
  const { targets, options } = argv.run(); 
  console.log(targets, options);
  
  const op = targets.shift();
  const packdir = process.cwd()
  if(!fs.existsSync(`${packdir}/package.json`)) {
    throw '(replacer.js) Must run at the project root with package.json!';
  }
  const config = Object.assign({  }, require(`${packdir}/package.json`).sb_replacer || { });
  const opdir = path.resolve(packdir, options.opdir || config.opdir || 'dist');
  const amode = options['all'];
  const Ops = {
    // parcel build で絶対パスになったものを相対パスに置き換える
    relativize: Op_relativize,
    // tag を追加する、入れ替える
    add: Op_add,
    // tag　を削除する
    del: Op_del
  };
  const fnc = Ops[op];
  if(!fnc) {
    console.log(`No such operation: ${op}`);
  }
  Op_multi(opdir, fnc, { amode }).then(()=>{
    console.log(`Finished operation: ${op}`);
  });
  return;
  // <-- END-OF-MAIN <--
  
  async function Op_multi(srcdir, proc, options) {
    const opts = Object.assign({  }, options);
    console.log(`(replacer.js) searching directory: ${srcdir}`);
    return Promise.resolve().then(()=>{
      if(opts.amode) {
        return fs.readdirSync(srcdir);
      } else {
        return [ targets.shift() ];
      }
    }).then(a=>{
      let fileWhen = Promise.resolve();
      a.filter(file=>fileWhen = fileWhen.then(()=>{
        
        if(!(/\.html?$/i).test(file)) {
          return; // HTML 以外は処理しない
        }
        const filepath = path.resolve(srcdir, file);
        const stat = fs.statSync(filepath);
        if(stat.isDirectory()) {
          return; // ディレクトリはもちろん対象外
        }
        console.log(`(replacer.js) operating filepath: ${filepath}`);
        return Promise.resolve().then(()=>{
          return fs.readFileSync(filepath)
        }).then(buf=>{
          return proc(buf.toString(), opts);
        }).then(s=>{
          return fs.writeFileSync(filepath, s);
        });

      }));
      return fileWhen;
    });
  }
  
  /**
   * parcel build で絶対パスになったものを相対パスに置き換える
   * また parcel 中は : で区切っていた相対パスを / に置き換える。 => foonyah ではディレクトリ形式でアクセスできる。
   * e.g.) node .sb/etc/replacer.js relativize -A
   */
  async function Op_relativize(str, options) {
    const opts = Object.assign({ }, options);
    return Promise.resolve().then(()=>{
      str = str.replace(/ (href|src)(="\/)/g, (a0, a1)=>` ${a1}="./`);
      str = str.replace(/ (href|src)=".\/(["]+)"/g, (a0, a1, a2)=>a2.includes(':') ? ` ${a1}="./${a2.replace(/:/g, '/')}"`: a0);
      return str;
    })['catch'](e=>{
      console.error(`Op_relativize error: ${e ? e.message || e: 'unknown'}`);
      throw e;
    });
  }
  
  /**
   * タグを追加する、入れ替える
   * ヒットした場合はその次の場所に入れることで、
   * e.g.) node .sb/etc/replacer.js add -A head content-type "<meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\">"
   */
  async function Op_add(str, options) {
    const opts = Object.assign({ }, options);
    const pos = targets[0].trim(), kwd = targets[1].split(',').filter(t=>!!t.trim());
    const add = targets[2].trim(), tag = add.split(/\s/)[0].substring(1);
    return Promise.resolve().then(()=>{
      if(pos.length == 0) {
        throw 'Position name is not specified.';
      }
      if(tag.length == 0) {
        throw 'Tag name is not specified.';
      }
      if(kwd.length == 0) {
        throw `Keywords must be specified at least 1.`;
      }
      const win = (new jsdom.JSDOM(str)).window, doc = win.document;
      const pEl = doc.querySelector(pos);
      const can = Array.from(pEl.children).filter(el=>{
        if(el.tagName.toLowerCase() != tag.toLowerCase()) {
          return;
        }
        const s = el.outerHTML;
        return kwd.filter(kw=>new RegExp(kw, 'i').test(s)).length != 0;
      });
      // console.log('Op_add can?', can, 'pos?', pos, 'add?', add);
      if(can.length > 1) {
        throw `Too many matched elements for tag: ${tag} and keywords: ${kwd.join(',')}`;
      }
      const addEls = new win.DOMParser().parseFromString(add, 'text/xml').children;
      if(can.length) {
        Array.from(addEls).forEach(aEl=>pEl.insertBefore(aEl, can[0]));
      } else {
        pEl.append(...addEls);
      }
      can.forEach(el => el.remove());
      return replaceHTML(str, pos, doc[pos].innerHTML);
    })['catch'](e=>{
      console.error(`Op_add error: ${e ? e.message || e: 'unknown'}`);
      throw e;
    });
  }
  
  /**
   * タグを削除する
   * e.g.) node .sb/etc/replacer.js del -A head meta,content-type
   */
  async function Op_del(str, options) {
    const opts = Object.assign({ }, options); 
    const pos = targets[0].trim(), kwd = targets[1].split(',').filter(t=>!!t.trim());
    const tag = kwd.shift().trim() || '';
    return Promise.resolve().then(()=>{
      if(pos.length == 0) {
        throw 'Position name is not specified.';
      }
      if(tag.length == 0) {
        throw 'Tag name is not specified.';
      }
      if(kwd.length == 0) {
        throw `Keywords must be specified at least 1.`;
      }
      const win = (new jsdom.JSDOM(str)).window, doc = win.document;
      const pEl = doc.querySelector(pos);
      const can = Array.from(pEl.children).filter(el=>{
        if(el.tagName.toLowerCase() != tag.toLowerCase()) {
          return;
        }
        const s = el.outerHTML;
        return kwd.filter(kw=>new RegExp(kw, 'i').test(s)).length != 0;
      });
      // console.log('Op_del can?', can, 'pos?', pos);
      if(can.length > 1) {
        throw `Too many matched elements for tag: ${tag} and keywords: ${kwd.join(',')}`;
      }
      can.forEach(el => el.remove());
      return replaceHTML(str, pos, doc[pos].innerHTML);
    })['catch'](e=>{
      console.error(`Op_del error: ${e ? e.message || e: 'unknown'}`);
      throw e;
    });
  }
  
  async function Op_mkDdir(pathname) {
    const pathdir = path.resolve(opdir, pathname);
    return new Promise((rsl, rej)=>fs.mkdir(pathdir, { recursive: true }, (er, rd)=>{ 
      if(er) console.log('[Warn](Op_mkDir)', er); rsl();
    }));
  }
  
  function replaceHTML(str, pos, alt) {
    const idx_0 = str.indexOf(`<${pos}`);
    const idx_1 = str.substring(idx_0 + `<${pos}`.length).indexOf('>') + idx_0 + `<${pos}`.length + 1;
    const idx_2 = str.indexOf(`</${pos}>`);
    return `${str.substring(0, idx_1)}\n${alt.trim().split("\n").filter(t=>!!t.trim()).map(t=>`    ${t.trim()}`).join("\n")}\n  ${str.substring(idx_2)}`;
  }
  
})(module.exports = { });
