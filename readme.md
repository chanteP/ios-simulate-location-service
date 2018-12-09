# ios虚拟定位套餐

为了玩游戏也是没谁了...

思路参考[Pokemon-Go-Controller](https://github.com/kahopoon/Pokemon-Go-Controller);
1. xcode新建一个项目，run到手机上>新建gpx文件>修改坐标>debug>simulate location
2. 建一套界面让修改坐标更加方便，browser操作方向>server修改文件
3. 因为xcode贼恶心每次改完都要手动操作点击生效，所以需要一个脚本自动生效

自己写个nodejs版的用起来方便&安全

## 如何使用
1. xcode创建空白ios项目，配置好之后run到手机。创建gpx文件（文件名就叫Location），debug > simulate location选择Location
2. 脚本执行./bin/ 里面那个文件
2. node server $gpxPath
3. 找个顺手的设备打开 http://$ip:9000/
4. pc可以上下左右控制，或者拖动操作面板控制方向和速度

