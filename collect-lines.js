module.exports = function(stream) {
  return new Promise(function(resolve, reject) {
    stream.on('error', reject);
    let chunks = [];
    stream.on('data', (c) => chunks.push(c));
    stream.on('end', function() {
      let data = Buffer.concat(chunks).toString();
      let lines = data.split('\n')
        .map((line) => line.trim())
        .filter(x=>x);
      resolve(lines);
    });
  });
}
