const fs = require('fs');

fs.createReadStream('./test.txt').pipe(process.stdout);