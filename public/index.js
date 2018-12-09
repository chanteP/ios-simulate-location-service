


(async _ => {
    const wrap = document.getElementById('app');
    const control = document.getElementById('control');
    const randomNode = document.getElementById('random');
    const currentPos = document.getElementById('currentPos');
    let {lat, lon} = await fetchApi('/getCurrentPosition');
    const marks = [];
    let timer;
    const {abs, atan, sqrt, floor, PI, random} = Math;
    let speed = 0;
    let deg = 0;
    let enableRandom = false;

    const map = new AMap.Map('container', {
        zoom: 20,//级别
        center: [lon, lat],//中心点坐标
        viewMode: '3D'//使用3D视图
    });
    setMark([lon, lat]);

    initMap(map);

    timer = setInterval(sendRoute, 300);
    
    let controlLock = false;
    (function interval(){
        setTimeout(interval, 1000);
        if(controlLock || !enableRandom){return;}
        deg = `${(random() - 0.5).toFixed(1)},${(random() - 0.5).toFixed(1)}`;
        speed = 4;
    })();

    randomNode.addEventListener('click', (e) => {
        enableRandom = !enableRandom;
        randomNode.style.backgroundColor = enableRandom ? '#fff' : '#333';
    });
    window.addEventListener('keydown', e => {
        controlLock = true;
        let d = ({38: '0,1',39: '1,0',40: '0,-1', 37: '-1,0'})[e.keyCode];
        if(d !== undefined){
            deg = d;
            speed = 6;
        }
    });
    window.addEventListener('keyup', e => {
        controlLock = false;
        deg = 0;
        speed = 0;
    });
    wrap.addEventListener('touchstart', e => {
        controlLock = true;
    });
    wrap.addEventListener('touchmove', e => {
        let {pageX, pageY} = e.touches[0];
        let {top, left} = wrap.getBoundingClientRect();
        let offsetX = (pageX - left) - wrap.clientWidth * .5;
        let offsetY = wrap.clientHeight * .5 - (pageY - top);
        deg = `${(offsetX / wrap.clientWidth * 2).toFixed(1)},${(offsetY / wrap.clientHeight * 2).toFixed(1)}`;
        speed = floor(sqrt(offsetX * offsetX + offsetY * offsetY)) / 10;

        control.style.transform = `translate(${offsetX}px,${-offsetY}px)`;
    });
    wrap.addEventListener('touchend', e => {
        controlLock = false;
        speed = deg = 0;
        control.style.transform = `translate(0)`;
    });

    async function sendRoute(){
        if(!speed){return;}
        console.log('move', `deg: ${deg}, speed: ${speed}`)
        let {lat, lon} = await fetchApi(`/goDegWithSpeed?speed=${speed / 10}&deg=${deg}`, 1);
        setMark([lon, lat]);
    }
    function setMark([lon, lat]){
        if(!lon){return;}
        currentPos.innerHTML = `lon: ${lon}; lat: ${lat}`;
        let marker = buildMarker([lon, lat]);
        map.add(marker);
        map.setCenter(new AMap.LngLat(lon, lat));
        marks.push(marker);
        if(marks.length > 1000){marks.shift().setMap(null)}
    }
    function buildMarker([lon, lat]){
        // 构造矢量圆形
        return new AMap.Circle({
            center: new AMap.LngLat(lon, lat), // 圆心位置
            radius: 1,  //半径
            strokeColor: "#1202ff",  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 0,  //线粗细度
            fillColor: "#878cff",  //填充颜色
            fillOpacity: 0.7 //填充透明度
        });
    }

    function fetchApi(api, ignoreError){
        return fetch(api).then(res => {
            return res.json();
        }).catch(e => {
            if(ignoreError){
                console.error(e);
            }
            else{
                alert(e);
                throw e;
            }
        });
    }
    function initMap(){
        AMap.plugin([
            'AMap.ToolBar',
            'AMap.Scale',
            'AMap.OverView',
        ], function(){
            // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
            map.addControl(new AMap.ToolBar());

            // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
            map.addControl(new AMap.Scale());

            // 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
            map.addControl(new AMap.OverView({isOpen:true}));
        });
    }
})();
