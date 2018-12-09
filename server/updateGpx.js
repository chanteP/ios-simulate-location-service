const fs = require('fs');

module.exports = {
    updateFileWithDegAndSpeed,
    getCurrentLatlon,
};

function calcOffset(deg, speed = 2){
    // let r = deg / 360 * 2 * Math.PI;
    let d = deg.split(',');
    let dir = [+d[0], +d[1]];
    let dis = dir.map(d => d * speed);
    let fix = 0.00002;
    let offset = {
        lat: dis[1] * fix,
        lon: dis[0] * fix,
    }
    console.log(offset);
    return offset;
}

function updateFile(filePath, {lat: latOffset, lon: lonOffset}){
    {/* <wpt lat="37.897405" lon="139.043237"></wpt> */}
    let content = fs.readFileSync(filePath, 'utf8');
    let rsLat, rsLon;

    content = content.replace(/<wpt lat="([\w\.]+)" lon="([\w\.]+)">/i, (match, lat, lon) => {
        rsLat = (+lat + latOffset).toFixed(6);
        rsLon = (+lon + lonOffset).toFixed(6);
        return `<wpt lat="${rsLat}" lon="${rsLon}">`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    return {
        lat: rsLat,
        lon: rsLon,
    }
}

function updateFileWithDegAndSpeed(filePath, {deg, speed}){
    return updateFile(filePath, calcOffset(deg, speed));
}

function getCurrentLatlon(filePath){
    let content = fs.readFileSync(filePath, 'utf8');
    let [match, lat, lon] = /<wpt lat="([\w\.]+)" lon="([\w\.]+)">/i.exec(content) || [];
    return {lat, lon}
}