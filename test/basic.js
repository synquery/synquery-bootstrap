/**
 * [synquery-bootstrap] test/basic.js
 * 機能テスト
 */
(mx=>{ // this === module.exports

  // Common args
  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  const fileName = __filename.split('/').pop();
  // Test
  const path = require('path'), fs = require('fs'), cp = require('child_process');
  const jsdom = require('jsdom'), ci = require('foonyah-ci');
  const curDir = __dirname, srcDir = path.resolve(curDir, 'src'), tmpDir = path.resolve(curDir, 'tmp');
  module.exports = ci.testCase({
    // Data Initialize
    '_init_': t=>{
      // テストの準備
      fs.readdirSync(tmpDir).forEach(fnam=>fs.unlinkSync(path.resolve(tmpDir, fnam)));
      fs.readdirSync(srcDir).forEach(fnam=>fs.copyFileSync(path.resolve(srcDir, fnam), path.resolve(tmpDir, fnam)));
      t.ok(TRUE, `initialze stage finished.`);
      t.done();
    },
    'relativize': t=>{
      execTest('relativize -a');
      const doc1 = parseHTML('index-test1.html').doc;
      t.equals(doc1.querySelector('link').getAttribute('href'), './assets/css/styles.fc4ed811.css', 'index-test1 ok');
      const doc2 = parseHTML('index-test2.html').doc;
      t.equals(doc2.querySelector('link').getAttribute('href'), './assets/css/styles.fc4ed811.css', 'index-test2 ok');
      const doc3 = parseHTML('index-test3.txt' ).doc;
      t.equals(doc3.querySelector('link').getAttribute('href'), '/assets/css/styles.fc4ed811.css', 'index-test3 ok (not changed)');
      t.done();
    },
    'add_head': t=>{
      execTest(`add -a head content-type "<meta http-equiv=\\"Content-Type\\" content=\\"text/svg\\"/>"`);
      const doc1 = parseHTML('index-test1.html').doc;
      t.equals(doc1.querySelector('meta').getAttribute('content'), 'text/svg', 'index-test1 ok');
      const doc2 = parseHTML('index-test2.html').doc;
      t.equals(doc2.querySelector('meta').getAttribute('content'), 'text/svg', 'index-test2 ok');
      const doc3 = parseHTML('index-test3.txt' ).doc;
      t.equals(doc3.querySelector('meta').getAttribute('content'), 'text/html;charset=utf8', 'index-test3 ok (not changed)');
      t.done();
    },
    'add_body': t=>{
      execTest(`add -a body b2 "<script src=\\"b3.js\\"></script>"`);
      const doc1 = parseHTML('index-test1.html').doc;
      t.equals(doc1.querySelector('script[src=b2\\.js]'), NULL, 'index-test1-b2 ok');
      t.equals(Array.from(doc1.querySelectorAll('script[src]')).at(-1).getAttribute('src'), 'b3.js', 'index-test1-b3 ok');
      const doc2 = parseHTML('index-test2.html').doc;
      t.equals(doc2.querySelector('script[src=b2\\.js]'), NULL, 'index-test2-b2 ok');
      t.equals(Array.from(doc2.querySelectorAll('script[src]')).at(-1).getAttribute('src'), 'b3.js', 'index-test2-b3 ok');
      const doc3 = parseHTML('index-test3.txt' ).doc;
      t.equals(doc3.querySelector('script[src=b3\\.js]'), NULL, 'index-test3-b3 (not changed)');
      t.equals(Array.from(doc3.querySelectorAll('script[src]')).at(-1).getAttribute('src'), 'b2.js', 'index-test3-b2 (not changed)');
      t.done();
    },
    'del_head': t=>{
      execTest(`del -a head script,a2`);
      const doc1 = parseHTML('index-test1.html').doc;
      t.ok(doc1.querySelector('script[src=a1\\.js]') != NULL, 'index-test1-a1 ok');
      t.ok(doc1.querySelector('script[src=a2\\.js]') == NULL, 'index-test1-a2 ok');
      const doc2 = parseHTML('index-test2.html').doc;
      t.ok(doc2.querySelector('script[src=a1\\.js]') != NULL, 'index-test2-a1 ok');
      t.ok(doc2.querySelector('script[src=a2\\.js]') == NULL, 'index-test2-a2 ok');
      const doc3 = parseHTML('index-test3.txt' ).doc;
      t.ok(doc3.querySelector('script[src=a1\\.js]') != NULL, 'index-test3-a1 ok (not changed)');
      t.ok(doc3.querySelector('script[src=a2\\.js]') != NULL, 'index-test3-a2 ok (not changed)');
      t.done();
    },
    'del_body': t=>{
      execTest(`del -a body script,b1`);
      const doc1 = parseHTML('index-test1.html').doc;
      t.ok(doc1.querySelector('script[src=a1\\.js]') != NULL, 'index-test1-a1 ok (not changed)');
      t.ok(doc1.querySelector('script[src=a2\\.js]') == NULL, 'index-test1-a2 ok (not changed)');
      t.ok(doc1.querySelector('script[src=b1\\.js]') == NULL, 'index-test1-b1 ok (not changed)');
      t.ok(doc1.querySelector('script[src=b2\\.js]') == NULL, 'index-test1-b2 ok (not changed)');
      t.ok(doc1.querySelector('script[src=b3\\.js]') != NULL, 'index-test1-b3 ok (not changed)');
      const doc2 = parseHTML('index-test2.html').doc;
      t.ok(doc2.querySelector('script[src=a1\\.js]') != NULL, 'index-test2-a1 ok (not changed)');
      t.ok(doc2.querySelector('script[src=a2\\.js]') == NULL, 'index-test2-a2 ok (not changed)');
      t.ok(doc2.querySelector('script[src=b1\\.js]') == NULL, 'index-test2-b1 ok (not changed)');
      t.ok(doc2.querySelector('script[src=b2\\.js]') == NULL, 'index-test2-b2 ok (not changed)');
      t.ok(doc2.querySelector('script[src=b3\\.js]') != NULL, 'index-test2-b3 ok (not changed)');
      const doc3 = parseHTML('index-test3.txt' ).doc;
      t.ok(doc3.querySelector('script[src=a1\\.js]') != NULL, 'index-test3-a1 ok (not changed)');
      t.ok(doc3.querySelector('script[src=a2\\.js]') != NULL, 'index-test3-a2 ok (not changed)');
      t.ok(doc3.querySelector('script[src=b1\\.js]') != NULL, 'index-test3-b1 ok (not changed)');
      t.ok(doc3.querySelector('script[src=b2\\.js]') != NULL, 'index-test3-b2 ok (not changed)');
      t.ok(doc3.querySelector('script[src=b3\\.js]') == NULL, 'index-test3-b3 ok (not changed)');
      t.done();
      t.done();
    }
  }, fileName);
  // <-- module.exports = ci.testCase({ ... }) <--
    
  // ---
  function execTest(args) {
    const rd = cp.execSync(`node ./etc/replacer.js ${args}`, { stdio: [ 'pipe', 'pipe', 'pipe' ] });
    console.log(rd.toString());
  }
  function parseHTML(fnam) {
    const str = fs.readFileSync(path.resolve(tmpDir, fnam)).toString();
    const win = (new jsdom.JSDOM(str)).window, doc = win.document;
    return { win, doc };
  }
  
  // ---
  function ty(x) {
    return typeof x;
  } 
  function is(ty, x) {
    return ty( x ) == ty;
  }
  function isFunction(x) {
    return is('function', x);
  }
  function isArray(x) {
    return Array.isArray(x);
  }

})(this);

