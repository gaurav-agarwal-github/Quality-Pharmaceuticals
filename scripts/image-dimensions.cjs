// Read dimensions without decoding or changing the image. Optimized assets use WebP.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const cache = new Map();
module.exports = function dimensions(src) {
    const relative = src.replace(/^\.\.\//, '');
    if (cache.has(relative)) return cache.get(relative);
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) throw new Error('Image outside website: ' + src);
    const bytes = fs.readFileSync(file);
    let size;
    if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') {
        for (let offset = 12; offset + 8 <= bytes.length;) {
            const type = bytes.toString('ascii', offset, offset + 4);
            const length = bytes.readUInt32LE(offset + 4);
            const payload = offset + 8;
            if (type === 'VP8X') size = {width: 1 + bytes.readUIntLE(payload + 4, 3), height: 1 + bytes.readUIntLE(payload + 7, 3)};
            if (type === 'VP8 ') size = {width: bytes.readUInt16LE(payload + 6) & 0x3fff, height: bytes.readUInt16LE(payload + 8) & 0x3fff};
            if (type === 'VP8L') {
                const bits = bytes.readUInt32LE(payload + 1);
                size = {width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1};
            }
            if (size) break;
            offset = payload + length + (length & 1);
        }
    } else if (bytes.toString('ascii', 1, 4) === 'PNG') {
        size = {width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20)};
    }
    if (!size?.width || !size?.height) throw new Error('Unsupported image dimensions: ' + src);
    cache.set(relative, size);
    return size;
};
