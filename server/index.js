const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const ip = require('./getIpAddress');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');
const {updateFileWithDegAndSpeed, getCurrentLatlon} = require('./updateGpx');

let gpxPath = process.argv[2] || `/Users/chante/ios/test/Location.gpx`;
if(!fs.existsSync(gpxPath)){
    throw `参数文件不存在，少了gpx文件路径弄撒子勒`;
}

const app = new Koa;
const router = new Router;

const port = 9000;

// api
router.get('/goDegWithSpeed', (ctx, next) => {
    console.log('receive ', ctx.url);
    const {deg, speed} = ctx.query;
    if(!deg || !speed){return;}
    let latlon = updateFileWithDegAndSpeed(gpxPath, {deg, speed});
    ctx.body = {...latlon};
});
router.get('/getCurrentPosition', (ctx, next) => {
    console.log('receive ', ctx.url);
    let latlon = getCurrentLatlon(gpxPath);
    ctx.body = {...latlon};
});

app.use(router.routes());
app.use(serve(path.resolve(__dirname, '../public/')));
app.listen(port, _ => {
    console.log(`server runnning @ http://${ip}:${port}/index.html`);
    exec(`open http://${ip}:${port}/index.html`);
});


