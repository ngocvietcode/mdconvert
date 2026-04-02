const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      if (['node_modules', '.next', '.git', '.gemini'].includes(file)) {
        if (!--pending) done(null, results);
        return;
      }
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (/\.(md|json|yml|yaml|sh|mjs|ts|tsx|js|env|example)$/.test(file)) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk('.', (err, files) => {
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    if (original.includes('dugate') || original.includes('Dugate') || original.includes('DUGATE')) {
        const newer = original
          .replace(/dugate/g, 'dugate')
          .replace(/Dugate/g, 'Dugate')
          .replace(/DUGATE/g, 'DUGATE');
        fs.writeFileSync(file, newer, 'utf8');
        console.log("Updated", file);
    }
  }
});
