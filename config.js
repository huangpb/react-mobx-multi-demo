const path = require('path');

const srcPath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');
const port = 8088;
const titles = {
    home: 'home主页',
    user: 'user',
    others: 'others'
};


module.exports = {
    srcPath,
    distPath,
    port,
    titles
};
