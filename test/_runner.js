/**
 * 単体テストを実施する
 * [LASTDATE-OF-EXECUTE]
 */
const tests = [ 'basic' ]
require('foonyah-ci').run(tests, __dirname, 5000 + 100 * 800);
