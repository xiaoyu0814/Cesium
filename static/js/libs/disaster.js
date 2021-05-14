let PageInfo = {
    viewer: null,
    handler:null,
    view:null,
    rainSpeed:1,
    rainType:1,//0:小雨，1:中雨,2:大雨，3:暴雨，4:大暴雨，5:特大暴雨
    Clouds: [],
    CloudRun: true,
    rainTimeVal:false,
    rainTime:1,
    rainNum:null,
    rainSC:3,
    snowImg: 'static/img/snowflake_particle.png',
    rainImg: 'static/img/circular_particle.png',
    weatherHelper:null,
    init: function () {
        Ext.getCmp('mapType').setSrc('resources/images/3D.png');
        //切换3D地图
        setTimeout(function () {
            Ext.getCmp('map2Div').getLayout().setActiveItem(1);
        },1000);
        if (conf.map.instance3d) {
            return;
        }
        let options = {containerid: 'tdtMap3d', zoom: 7, center: [-122.514426, 37.562984]};
        let swMap1 = commonHelper.initMap2(options);
        let swMap = swMap1.map;
        PageInfo.view = swMap1.view;
        swMap.on("load", function () {
            PageInfo.viewer = swMap.map._cesiumViewer;
            PageInfo.handler=new Cesium.ScreenSpaceEventHandler(PageInfo.viewer.canvas)
            let viewer = PageInfo.viewer;
            let scene = viewer.scene;
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjE5ZTIzYy0zN2JkLTRjNzEtYmQ5NC02NjMzZjI0MWRhOTUiLCJpZCI6MjU5LCJzY29wZXMiOlsiYXNyIiwiZ2MiXSwiaWF0IjoxNTY5OTM5MjkyfQ.JBBkmCCcbd4De9AawCQStH0IzQXIimYn0wmhZ4YD2Ts';
            PageInfo.worldTerrain = Cesium.createWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
            });

            // set lighting to true
            //viewer.scene.globe.enableLighting = true;
            viewer.scene.globe.depthTestAgainstTerrain = true;
            PageInfo.viewer.terrainProvider = PageInfo.worldTerrain;
            let grid = new PIE.GridTileLayer({
                projection: "EPSG:4326",
                url: 'http://www.google.cn/maps/vt?lyrs=s@800&x={x}&y={y}&z={z}',

            });
            swMap.add(grid);

            let mgrid = new PIE.GridTileLayer({
                projection: "EPSG:3857",

                url: 'http://piecloud.piesat.cn/dataservices/service/v1/tile?map=googleimageVect&x={x}&y={y}&z={z}',
            });
            // swMap.add(mgrid);
            conf.map.instance3d = swMap;
        });
    },
    initView: function () {//初始视图
        PageInfo.viewer = conf.map.instance3d.map._cesiumViewer;
        let destination = Cesium.Rectangle.fromDegrees(73, 3, 137, 54);
        let heading = Cesium.Math.toRadians(0);
        let pitch = Cesium.Math.toRadians(-90);
        let roll = Cesium.Math.toRadians(0);
        let duration = 5;
        let fn = PageInfo.addCloudImage;
        PageInfo.flyTo(destination, heading, pitch, roll, duration);
    },
    locationAddress: function () {
        //定位到浙江省永嘉县山早村
        // let dingwei = document.getElementById("dingwei");
        // if (dingwei.checked) {
        let destination = Cesium.Cartesian3.fromDegrees(120.67318975925447, 28.534031233980677, 1000.0);
        let heading = Cesium.Math.toRadians(0.0);
        let pitch = Cesium.Math.toRadians(-90);
        let roll = Cesium.Math.toRadians(0);
        let duration = 5;
        let fn = function () {
            //增加降雨的DEMO
            //  let boundRectangle = new Cesium.Rectangle(Cesium.Math.toRadians(119), Cesium.Math.toRadians(27), Cesium.Math.toRadians(122), Cesium.Math.toRadians(30));
            //  let snowRadius = 100000;// map.map._cesiumViewer.camera.positionCartographic.height;
            //  let snowSize =0//if(snowSize=="0")小雪,if(snowSize=="1")中雪,否则大雪
            //  let rain = new rainFall({ viewer: conf.map.instance3d.map._cesiumViewer, boundRectangle: boundRectangle, snowRadius: snowRadius, snowSize: snowSize });
            //  rain.getSnow();
        };
        PageInfo.flyTo(destination, heading, pitch, roll, duration, fn);

        // }
        // else {

        //     PageInfo.initView();
        // }

    },
    getMoHuangPopulation:function(){//墨煌人口热力图
        if(moHuangPopulationHeatMap==null){
            // 矩形坐标
            let bounds = {
                west: 118.35, south:29.183333333333334, east: 120.5, north:30.55
                //west: -109.0, south: 30.0, east: -80.0, north: 50.0
            };

            // 初始化CesiumHeatmap
            moHuangPopulationHeatMap = CesiumHeatmap.create(
                PageInfo.viewer, // 视图层
                bounds, // 矩形坐标
                { // heatmap相应参数
                    maxOpacity: .5,
                    minOpacity: 0,
                    blur: .75
                }
            );

            let camera = PageInfo.viewer.camera;
            let r= camera.positionCartographic.height/5000;
            PageInfo.getData("resources/data/populationFever.json", function (numData, numID) {
                let sourceData=[];
                for (let i = 0; i <numData.data.length; i++) {
                    let x =numData.data[i].lng;
                    let y =numData.data[i].lat;
                    let value =numData.data[i].mannum;
                    if(value!==0){
                        sourceData.push({ x: x, y: y, value: value, radius:r})
                    }
                }

                //console.log(sourceData, 'sourceData');
                // 添加数据 最小值，最大值，数据集
                moHuangPopulationHeatMap.setWGS84Data(0, 100,sourceData);

                // 鼠标滚轮事件
                PageInfo.handler.setInputAction(function(wheelment) {
                    let height = camera.positionCartographic.height;
                    sourceData.forEach(function(v) {
                        if(height/5000>1){
                            v.radius = height/5000
                        }else{
                            v.radius =1
                        }
                    })
                    moHuangPopulationHeatMap.setWGS84Data(0, 100,sourceData);
                }, Cesium.ScreenSpaceEventType.WHEEL)
            })

        }else{
            PageInfo.viewer.entities.remove(moHuangPopulationHeatMap._layer);
            moHuangPopulationHeatMap=null;
            PageInfo.initView();
        }
    },
    getDisasterContrast: function ()//灾沙江灾前灾后对比
    {
        mPieSlider = document.getElementById('slider');
        conf.map.instance3d.map._cesiumViewer.scene.imagerySplitPosition = (mPieSlider.offsetLeft) / mPieSlider.parentElement.offsetWidth;
        pieHandler = new Cesium.ScreenSpaceEventHandler(mPieSlider);

        // let disastercontrast = document.getElementById("disasterContrast");
        //   if (disastercontrast.checked) {
        //       if(beforeDisaster==null && postDisaster==null){
        //灾前
        // s {longitude: 1.7228175893045983, latitude: 0.5426416772749661, height: 2994.4657039556887}

        beforeDisaster = new PIE.GridTileLayer({
            projection: "EPSG:3857",
            url: 'http://piecloud.piesat.cn:9000/dataservices/map-editor/tiles/node1_test/tif_7e0f402c89d846e8abfbe57f03c5b5c6/{z}/{x}/{y}?tms=false'
        });
        conf.map.instance3d.add(beforeDisaster);

        //灾后
        postDisaster = new PIE.GridTileLayer({
            id: "disastersplit",
            projection: "EPSG:3857",
            url: 'http://piecloud.piesat.cn:9000/dataservices/map-editor/tiles/node1_test/tif_ee1b3a3bca1e4fc69255db5c5314c272/{z}/{x}/{y}?tms=false'
        });
        conf.map.instance3d.add(postDisaster);

        let destination = Cesium.Cartesian3.fromRadians(1.7224175893045983, 0.5434416772749661, 5000);
        let heading = 2.731089976107251;
        let pitch = -0.32003481981370063;
        let roll = Cesium.Math.toRadians(0);
        let duration = 3;
        let fn = function () {
            mPieSlider.style.visibility = "visible";
        };

        PageInfo.flyTo(destination, heading, pitch, roll, duration, fn);


        //增加卷帘效果
        let maplayers = conf.map.instance3d.map._cesiumViewer.imageryLayers._layers;
        let splitLayer = null;
        for (let i = 0; i < maplayers.length; i++) {
            if (maplayers[i].id === "disastersplit") {
                splitLayer = maplayers[i];
                break;
            }
        }
        splitLayer.splitDirection = Cesium.ImagerySplitDirection.LEFT; // Only show to the left of the mPieSlider.

        let moveActive = false;

        function move(movement) {
            if (!moveActive) {
                return;
            }

            let relativeOffset = movement.endPosition.x;
            let splitPosition = (mPieSlider.offsetLeft + relativeOffset) / mPieSlider.parentElement.offsetWidth;
            mPieSlider.style.left = 100.0 * splitPosition + '%';
            conf.map.instance3d.map._cesiumViewer.scene.imagerySplitPosition = splitPosition;
        }

        pieHandler.setInputAction(function () {
            moveActive = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        pieHandler.setInputAction(function () {
            moveActive = true;
        }, Cesium.ScreenSpaceEventType.PINCH_START);

        pieHandler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        pieHandler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

        pieHandler.setInputAction(function () {
            moveActive = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
        pieHandler.setInputAction(function () {
            moveActive = false;
        }, Cesium.ScreenSpaceEventType.PINCH_END);
        // }
        // }
        // else {
        //     mPieSlider.style.visibility="hidden";
        //       if(beforeDisaster!=null && postDisaster!=null){
        //          map.remove(beforeDisaster);
        //          beforeDisaster=null;
        //          map.remove(postDisaster);
        //          postDisaster=null;
        //       };
        //     handler.destroy();
        //     PageInfo.initView();
        // }

    },
    setCloudStop: function () {
        PageInfo.CloudRun = false;
    },
    setCloudStart: function () {
        PageInfo.CloudRun = true;
    },
    addCloudImage: function () {
        let num = 0;
        let baseLayerNum_cloud = 0;
        let utcTimes = [20190811080000, 20190811090000, 20190811100000, 20190811110000, 20190811110000]

        function animat() {
            if (PageInfo.CloudRun) {
                if (num % utcTimes.length === 0)//代表第一次进入
                {
                    conf.map.instance3d.map._cesiumViewer.imageryLayers._layers[num % utcTimes.length + baseLayerNum_cloud].alpha = 1;
                    conf.map.instance3d.map._cesiumViewer.imageryLayers._layers[utcTimes.length + baseLayerNum_cloud - 1].alpha = 0;
                }
                else {
                    conf.map.instance3d.map._cesiumViewer.imageryLayers._layers[num % utcTimes.length + baseLayerNum_cloud].alpha = 1;
                    conf.map.instance3d.map._cesiumViewer.imageryLayers._layers[(num - 1) % utcTimes.length + baseLayerNum_cloud].alpha = 0;
                }
                num++;
                setTimeout(animat, 1000)
            }

        }


        baseLayerNum_cloud = conf.map.instance3d.map._cesiumViewer.imageryLayers._layers.length
        for (let i = 0; i < utcTimes.length; i++) {
            let utcTime = utcTimes[i];
            let url = "http://rsapp.nsmc.org.cn/swapQuery/public/tileServer/getTile/fy-4a/prj_gll/NatureColor_NoLit/" + utcTime + "/jpg/{z}/{y}/{Timex}.png";
            PageInfo.addCesFY4(url);
        }
        setTimeout(animat, 1000)

    },
    getPoint: function (data, id, icon_name) {
        //读取JSON文件的公共方法
        //console.log(data);

        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };

        for (let i = 0; i < data.length; i++) {
            let dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [data[i].lng, data[i].lat]
                },
                "properties": {
                    "name": data[i].name,
                    "address": data[i].address,
                    "icon": icon_name
                }
            };
            GEOJSON.features.push(dataset);
        }
        let testWindLayer = new PIE.MetoStyle.IconLayer({
            data: GEOJSON,
            iconUrl: "icon",
            id: id,
            opacity: 1,
            size: 0.8,
            visible: true
        });
        conf.map.instance3d.add(testWindLayer);
        return testWindLayer;

    },
    getGeoJson: function (data, id) {
        //读取JSON文件的公共方法
        //console.log(data);
        let geojson = data[0].geom;
        delete geojson["crs"];
        for (let i = 0; i < geojson.features.length; i++) {
            geojson.features[i].geometry.coordinates = geojson.features[i].geometry.coordinates[0];
            geojson.features[i].geometry.type = "Polygon";
            if (geojson.features[i].properties.WaveH && geojson.features[i].properties.WaveH === "3") {
                geojson.features[i].properties.colorIndex = "rgb(0,0,255)";
                geojson.features[i].properties.perPositionHeight = true;
                //geojson.features[i].properties.extrudedHeight = 1000
            }
            if (geojson.features[i].properties.WaveH && geojson.features[i].properties.WaveH === "4") {
                geojson.features[i].properties.colorIndex = "rgb(255,255,0)";
                geojson.features[i].properties.perPositionHeight = true;
                //geojson.features[i].properties.extrudedHeight = 2000
            }

        }
        let _Fills = new PIE.MetoStyle.FillLayer({
            data: geojson,
            id: id,
            opacity: 0.6
        });
        conf.map.instance3d.add(_Fills);
        return _Fills;

    },
    addFill: function (data, id) {
        //读取JSON文件的公共方法
        //console.log(data);
        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };

        let features = data.contours;
        for (let i = 0; i < features.length; i++) {

            for (let j = 0; j < features[i].latAndLong.length; j++) {
                let tenpy = features[i].latAndLong[j][0];
                let tenpx = features[i].latAndLong[j][1];
                features[i].latAndLong[j][0] = tenpx;
                features[i].latAndLong[j][1] = tenpy;

            }
            features[i].latAndLong.push(features[i].latAndLong[0])
            let dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [features[i].latAndLong]
                },
                "properties": {
                    "index": i,
                    "colorIndex": "rgb(" + features[i].color + ")"
                }
            };
            GEOJSON.features.push(dataset);

        }

        //console.log(GEOJSON);
        let _Fills = new PIE.MetoStyle.FillLayer({
            data: GEOJSON,
            id: id,
            //color:"#00ff00",
            opacity: 0.5
        });
        conf.map.instance3d.add(_Fills);
        return _Fills;
    },
    getSchool: function (data, id, icon_name) {
        //console.log(data);

        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };

        for (let i = 0; i < data.features.length; i++) {
            let dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(data.features[i]['geometry']['x']), parseFloat(data.features[i]['geometry']['y'])]
                },
                "properties": {
                    "OBJECTID": data.features[i].OBJECTID
                }
            };
            GEOJSON.features.push(dataset);
        }

        let testWindLayer = new PIE.MetoStyle.IconLayer({
            data: GEOJSON,
            imageName: icon_name,
            id: id,
            opacity: 1,
            size: 0.5,
            visible: true
        });
        conf.map.instance3d.add(testWindLayer);
        return testWindLayer;
    },
    getPopulation: function (data, id) {
        let _Fills = null;
        let geoJson = PageInfo.getPopulationArea(data, id);
        PageInfo.getDataAsync("resources/data/populationNum.json", function (numData, numID) {
            for (let i = 0; i < numData.year.datas.length; i++) {
                let cityname = numData.year.datas[i].cityname;
                let population = numData.year.datas[i].population;
                for (let j = 0; j < geoJson.features.length; j++) {
                    let obj = geoJson.features[j];
                    if (obj.properties.name === cityname) {
                        obj.properties.population = population;
                        obj.properties.extrudedHeight = population / 5000;
                        obj.properties.colorIndex = PageInfo.getAdministrativeDisisonColor(cityname, population);
                    }
                }

            }
            //console.log(geoJson);

            _Fills = new PIE.MetoStyle.FillLayer({
                data: geoJson,
                id: id,
                opacity: 0.5
            });
            conf.map.instance3d.add(_Fills)

        });
        return _Fills;
    },
    getPopulationArea: function (data, id) {
        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };

        for (let i = 0; i < data.data.child.length; i++) {
            //
            let pointsArray = data.data.child[i].points;
            for (let k = 0; k < pointsArray.length; k++) {
                let dataset = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": PageInfo.getArray(data.data.child[i].points[k].region)
                    },
                    "properties": {
                        "perPositionHeight": true,

                        "name": data.data.child[i].name
                    }
                };
                GEOJSON.features.push(dataset);
            }

        }
        return GEOJSON;

    },
    getAdministrativeDisisonColor: function (name, data) {
        let count = data;
        if (parseInt(count) < 12938693) {
            return '#FFFF00';
        }
        if (parseInt(count) < 28846170 && parseInt(count) >= 12938693) {
            return '#FFE100';
        }
        if (parseInt(count) < 46023761 && parseInt(count) >= 28846170) {
            return '#FFC300';
        }
        if (parseInt(count) < 65700762 && parseInt(count) >= 46023761) {
            return '#FFA600';
        }
        if (parseInt(count) < 80417528 && parseInt(count) >= 65700762) {
            return '#FF8800';
        }
        if (parseInt(count) < 104320459 && parseInt(count) >= 80417528) {
            return '#FF7500';
        }
        if (parseInt(count) >= 104320459) {
            return '#FF6600';
        } else {
            return 'rgba(255,255,255,0)';
        }
    },
    getQiXiangAlarmPoint: function (data, id) {
        //console.log(data);

        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };

        for (let i = 0; i < data.length; i++) {
            let dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": data[i].coordinates
                },
                "properties": {
                    "province": data[i].province,
                    "icon": data[i].img
                }
            };
            GEOJSON.features.push(dataset);
        }
        let qxLayer = new PIE.MetoStyle.IconLayer({
            data: GEOJSON,
            iconUrl: "icon",
            id: id,
            opacity: 1,
            size: 0.5,
            visible: true
        });
        map.add(qxLayer)

    },
    getQiXiangAlarmPolygon: function (data, id) {
        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };

        for (let i = 0; i < data.length; i++) {
            let dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": PageInfo.getArray(data[i].region)
                },
                "properties": {
                    "province": data[i].province,
                    "SIGNALLEVEL": data[i].SIGNALLEVEL,
                    "colorIndex": PageInfo.getXiangAlarmColor(data[i].SIGNALLEVEL)
                }
            };
            GEOJSON.features.push(dataset);
        }

        let _Fills = new PIE.MetoStyle.FillLayer({
            data: GEOJSON,
            id: id,
            opacity: 1
        });
        map.add(_Fills)

    },
    getXiangAlarmColor: function (SIGNALLEVEL) {

        let color = 'rgba(0,0,255,0.5)';
        if (SIGNALLEVEL === '1') {
            color = 'rgba(0,0,255,0.5)';
        }
        if (SIGNALLEVEL === '2') {
            color = 'rgba(255,255,0,0.5)';
        }
        if (SIGNALLEVEL === '3') {
            color = 'rgba(255,165,0,0.5)';
        }
        if (SIGNALLEVEL === '4') {
            color = 'rgba(255,0,0,0.5)';
        }

        return color
    },
    getDamage: function (data, id) {
        //console.log(data);

        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };
        let points = data[0].disasterInfo;
        for (let i = 0; i < points.length; i++) {
            let dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": points[i].point
                },
                "properties": {
                    "provinceName": points[i].provinceName,
                    "affectedPopulation": points[i].affectedPopulation,
                    "deaths": points[i].deaths,
                    "missingPopulation": points[i].missingPopulation,
                    "emergencyTransferPopulation": points[i].emergencyTransferPopulation,
                    "populationNeedEmergencyAid": points[i].populationNeedEmergencyAid,
                    "economicLoss": points[i].economicLoss,
                    "collapsedHouse": points[i].collapsedHouse,
                    "seriouslyDamagedHouse": points[i].seriouslyDamagedHouse,
                    "generalDamageToHousing": points[i].generalDamageToHousing,
                    "icon": "WSel"
                }
            };
            GEOJSON.features.push(dataset);
        }
        let testWindLayer = new PIE.MetoStyle.IconLayer({
            data: GEOJSON,
            iconUrl: "icon",
            id: id,
            opacity: 1,
            size: 0.5,
            visible: true
        });
        map.add(testWindLayer);

        let labelPrimitives = map.map._cesiumViewer.scene.primitives.add(new Cesium.LabelCollection());
        view.listentoMouseEvent.on("pick", function (position, propertys, model, pix) {
            labelPrimitives.removeAll();
            if (propertys && propertys.provinceName !== undefined) {
                let content = '省份：' + propertys.provinceName + '\n';
                content += '受灾人口：' + propertys.affectedPopulation + '\n';
                content += '死亡人口：' + propertys.deaths + '\n';
                content += '失踪人口' + propertys.missingPopulation + '\n';
                content += '紧急转移安置人口：' + propertys.emergencyTransferPopulation + '\n';
                content += '需紧急救助人口：' + propertys.populationNeedEmergencyAid + '\n';
                content += '经济损失：' + propertys.economicLoss + '\n';
                content += '倒塌房屋：' + propertys.collapsedHouse + '\n';
                content += '严重损坏房屋：' + propertys.seriouslyDamagedHouse + '\n';
                content += '一般损坏房屋：' + propertys.generalDamageToHousing + '\n';

                let cartesian = Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.height);
                //´´Ôì±êÇ©µÄ¼¯ºÏ

                //ÐÂÔö±êÇ©µ½±êÇ©¼¯ºÏÖÐ
                labelPrimitives.add({
                    position: cartesian,
                    font: '18px Helvetica',
                    showBackground: true,
                    fillColor: Cesium.Color.WHITE,
                    //eyeOffset: new Cesium.Cartesian3(0.0, 11.0, 0.0),
                    pixelOffset: new Cesium.Cartesian2(10.0, 10),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000000.0),
                    text: content
                });

            }
            else {
                // labelPrimitives.removeAll();
            }


        })
        //
        conf.map.instance3d.map._cesiumViewer.screenSpaceEventHandler.setInputAction(function (event) {
            labelPrimitives.removeAll();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        conf.map.instance3d.map._cesiumViewer.screenSpaceEventHandler.setInputAction(function (event) {
            labelPrimitives.removeAll();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        return testWindLayer;
    },
    getArray: function (coordinates) {
        let coordinatesArray = coordinates.split(',');
        //ÉùÃ÷Ò»¸öÐÂµÄÊý×é
        let coordinatesPolygon = [];

        for (let j = 0; j < coordinatesArray.length; j++) {
            let points = coordinatesArray[j].split(' ');
            let pointTransform = [parseFloat(points[0]), parseFloat(points[1]), 0];
            coordinatesPolygon.push(pointTransform);
        }
        return [coordinatesPolygon];
    },
    getData: function (url, fn) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let result = JSON.parse(xhr.response);
                if (result.length === 0) {
                    //console.log('Êý¾Ý¶ÁÈ¡Ê§°Ü');
                    // reject('Êý¾Ý¶ÁÈ¡Ê§°Ü');
                    return false;
                }

                let data = result;
                //console.log(123123456456789798, data)
                fn(data, url);
            } else {

            }
        };
        xhr.onerror = function () {

        };
        xhr.send(null);
    },
    getDataAsync: function (url, fn) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        let data = JSON.parse(xhr.response);
        fn(data, url);
    },
    flyTo: function (destination, head, pitch, roll, duration, call) {
        if (PageInfo.viewer) {
            PageInfo.viewer.camera.flyTo({
                destination: destination,    //Cartesian3 | Rectangle
                orientation: {
                    heading: head,
                    pitch: pitch,
                    roll: roll,
                },
                duration: duration,
                complete: function ()//飞行完毕后执行的动作
                {
                    if (call)//如果有回调函数
                    {
                        call();
                    }
                }
            });
        } else {
            PageInfo.viewer.camera.flyTo({
                destination: destination,    //Cartesian3 | Rectangle
                orientation: {
                    heading: head,
                    pitch: pitch,
                    roll: roll,
                },
                duration: duration,
                complete: function ()//飞行完毕后执行的动作
                {
                    if (call)//如果有回调函数
                    {
                        call();
                    }
                }
            });
        }
    },
    addWater: function (lon, lat) {
        let waterFace = [lon, lat, 200, lon + 0.005, lat + 0.005, 200, lon + 0.005, lat, 200];
        primitive = new PrimitiveWaterFace({
            'viewer': map.map._cesiumViewer,
            'normalMapUrl': './image/waterNormals.png',
            'DegreesArrayHeights': waterFace
        });
    },
    //添加风云4云图
    addCesFY4: function (url) {
        let newImageLayer = new Cesium.UrlTemplateImageryProvider({
            url: url,
            tileWidth: 450,
            tileHeight: 450,
            tilingScheme: new Cesium.GeographicTilingScheme({
                rectangle: Cesium.Rectangle.fromDegrees(-111.3, -72, 176.7, 72),
            }),
            customTags: {
                Timex: function (imageryProvider, x, y, level) {
                    let pow = Math.pow(2, level);
                    if (x > pow) {
                        x = x - pow
                    } else {
                        x = pow - x
                    }
                    return x
                }
            },
            hasAlphaChannel: true,
            alpha: 0,
            rectangle: Cesium.Rectangle.fromDegrees(32.7, -72, 176.7, 72)
        });
        let layer = conf.map.instance3d.map._cesiumViewer.imageryLayers.addImageryProvider(newImageLayer);
        layer.alpha = 0;
        PageInfo.Clouds.push(layer)
    },
    removeFY4: function () {
        for (let i = PageInfo.Clouds.length - 1; i >= 0; i--) {
            conf.map.instance3d.map._cesiumViewer.imageryLayers.remove(PageInfo.Clouds[i], true);
            PageInfo.Clouds.pop();
        }
    },

    //洪涝淹没示例
    addFillTo2: function () {
        let destination = Cesium.Cartesian3.fromDegrees(116.430299, 24.504776, 14000.0);
        let heading = Cesium.Math.toRadians(0.0);
        let pitch = Cesium.Math.toRadians(-90);
        let roll = Cesium.Math.toRadians(0);
        let duration = 5;
        let fn = function () {
            PageInfo.getFillData()
        };
        PageInfo.flyTo(destination, heading, pitch, roll, duration, fn);

    },
    getFillData: function () {
        PageInfo.getData("./resources/data/meihe.geojson", function (data) {
            //console.log(data);
            let i = 360;
            let coordinates = data.features[0].geometry.coordinates;
            let point = turf.point([coordinates[i][0], coordinates[i][1]]);
            let buffered = turf.buffer(point, 0.5, {units: 'miles'});
            let _geo = buffered;
            let viewer = conf.map.instance3d.map._cesiumViewer;
            let timer = window.setInterval(function () {
                if (i < coordinates.length + 20) {
                    if (i < coordinates.length) {
                        let point = turf.point([coordinates[i][0], coordinates[i][1]]);
                        let buffered = turf.buffer(point, 0.5, {units: 'miles'});
                        if (_geo) {
                            _geo = turf.union(_geo, buffered)
                        } else {
                            _geo = buffered;
                        }
                        _geo.properties.extrudedHeight = 128;
                        _geo.properties.perPositionHeight = true;
                        _geo.properties.lineColor = "#00f";
                    } else {
                        let num = (i - coordinates.length) + 1;
                        let point = turf.point([coordinates[coordinates.length - 1][0], coordinates[coordinates.length - 1][1]]);
                        let buffered = turf.buffer(point, 0.5 * num, {units: 'miles'});
                        if (_geo) {
                            _geo = turf.union(_geo, buffered)
                        } else {
                            _geo = buffered;
                        }

                    }
                    let da = [];
                    for (let k = 0; k < _geo.geometry.coordinates[0].length; k++) {
                        da.push(_geo.geometry.coordinates[0][k])
                    }

                    if (i < coordinates.length + 19) {
                        PageInfo.addRrr(da, "test" + i)
                    } else {
                        PageInfo.addRrr(da, "test" + i, true)
                    }

                    i++;
                } else {
                    window.clearInterval(timer);
                }
            }, 100);

        })
    },
    addRrr: function (_gData, id, status) {
        let River1Point = [_gData.toString()];
        River1Point = River1Point[0].split(",");

        //河道1多边形
        let polygon1 = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(River1Point)),
            extrudedHeight: 100,
            height: 0,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });
        let River1 = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: polygon1
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: true
            }),
            show: true
        });
        let River1_Material = new Cesium.Material({
            fabric: {
                type: 'Water',
                uniforms: {
                    normalMap: './resources/images/waterNormals.jpg',
                    frequency: 100.0,
                    animationSpeed: 0.01,
                    amplitude: 10.0
                },
                fragmentShaderSource: 'varying vec3 v_positionMC;\nvarying vec3 v_positionEC;\nvarying vec2 v_st;\nvoid main()\n{\nczm_materialInput materialInput;\nvec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n#ifdef FACE_FORWARD\nnormalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n#endif\nmaterialInput.s = v_st.s;\nmaterialInput.st = v_st;\nmaterialInput.str = vec3(v_st, 0.0);\nmaterialInput.normalEC = normalEC;\nmaterialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\nvec3 positionToEyeEC = -v_positionEC;\nmaterialInput.positionToEyeEC = positionToEyeEC;\nczm_material material = czm_getMaterial(materialInput);\n#ifdef FLAT\ngl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n#else\ngl_FragColor = czm_phong(normalize(positionToEyeEC), material);\
gl_FragColor.a=0.5;\n#endif\n}\n'
            }
        });
        let scene = conf.map.instance3d.map._cesiumViewer.scene;
        River1.appearance.material = River1_Material;
        River1.id = id;
        scene.primitives.add(River1);
        setTimeout(function () {
            if (status) {
                PageInfo.River = River1;
                return;
            }
            scene.primitives.remove(River1)
        }, 1000)
    },

    removeRiver: function () {
        let scene = conf.map.instance3d.map._cesiumViewer.scene;
        if (PageInfo.River) {
            scene.primitives.remove(PageInfo.River)
        }
    },
    //地质灾害相关的：两江形变
    addPointPrimitives: function (year) {
        PageInfo.pointPrimitives = PageInfo.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
        let destination = Cesium.Rectangle.fromDegrees(98.69702778230281, 30.999224196420383, 98.87500147642012, 31.038191457144238);
        let heading = Cesium.Math.toRadians(-50.0);//
        let pitch = Cesium.Math.toRadians(-25);
        let roll = Cesium.Math.toRadians(0);
        let duration = 3;
        let fn = function () {
                PageInfo.SettlementePoints("http://211.154.196.253:6080/arcgis/rest/services/EDATA/Sink/MapServer/" + year + "/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelOverlaps&relationParam=&outFields=VEL%2CHEIGHT+&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=json")
            };
        PageInfo.viewer.terrainProvider = PageInfo.worldTerrain;
        PageInfo.flyTo(destination, heading, pitch, roll, duration, fn);


        //view.listentoMouseEvent.on("pick", function (position, propertys, model, pix) {
        //	//console.log(position,propertys)
        //})
    },
    SettlementePoints: function (url) {
        PageInfo.getData(url, function (numData, numID) {
            for (let i = 0; i < numData.features.length; i++) {
                let obj = numData.features[i].geometry;
                let height = numData.features[i].attributes.HEIGHT;
                let VEL = numData.features[i].attributes.VEL;
                let color = new Cesium.Color();
                let colorArray = [[255, 0, 0, 255], [255, 38, 0, 255], [255, 60, 0, 255], [255, 77, 0, 255],
                    [255, 89, 0, 255], [255, 102, 0, 255], [255, 119, 0, 255], [255, 132, 0, 255],
                    [255, 145, 0, 255], [255, 157, 0, 255], [255, 170, 0, 255], [255, 187, 0, 255],
                    [255, 200, 0, 255], [255, 213, 0, 255], [255, 225, 0, 255], [255, 238, 0, 255],
                    [255, 251, 0, 255], [251, 255, 0, 255], [240, 252, 0, 255], [227, 252, 0, 255],
                    [217, 250, 0, 255], [208, 250, 0, 255], [194, 247, 0, 255], [186, 247, 0, 255],
                    [175, 245, 0, 255], [166, 242, 0, 255], [153, 242, 0, 255], [144, 240, 0, 255],
                    [132, 240, 0, 255], [123, 237, 0, 255], [109, 235, 0, 255], [97, 232, 0, 255],
                    [85, 232, 0, 255], [77, 230, 11, 255], [79, 227, 39, 255], [81, 224, 56, 255],
                    [84, 222, 71, 255], [84, 222, 87, 255], [83, 219, 99, 255], [82, 217, 111, 255],
                    [81, 214, 128, 255], [80, 212, 142, 255], [77, 209, 154, 255], [74, 207, 167,
                        255], [70, 207, 182, 255], [63, 204, 197, 255], [56, 201, 209, 255], [47, 201,
                        224, 255], [36, 197, 237, 255], [0, 195, 255, 255], [0, 195, 255, 255]];
                let index = Math.floor((VEL + 118) / 5);
                if (index >= colorArray.length) {
                    index = colorArray.length - 1;
                }
                if (index < 0) {
                    index = 0;
                }

                //新增点到点集合中
                let position = Cesium.Cartesian3.fromDegrees(Number(obj.x), Number(obj.y), height);
                PageInfo.pointPrimitives.add({
                    id: "pointTest" + i,
                    position: position,
                    pixelSize: 5,
                    color: Cesium.Color.fromBytes(colorArray[index][0], colorArray[index][1], colorArray[index][2], colorArray[index][3])
                });
            }

        })
    },
    removePointPrimitives: function () {
        if (PageInfo.pointPrimitives) {
            PageInfo.pointPrimitives.removeAll();
        }
        PageInfo.initView();
    },
    /**
     * 处理地质隐患点
     * @param lng
     * @param lat
     */
    cameraToDizhi: function (lng, lat) {
        let destination = Cesium.Cartesian3.fromDegrees(lng, lat, 1200.0);
        let heading = Cesium.Math.toRadians(0.0);
        let pitch = Cesium.Math.toRadians(-90);
        let roll = Cesium.Math.toRadians(0);
        let duration = 0.1;
        PageInfo.flyTo(destination, heading, pitch, roll, duration);
    },

    addDizhi: function (data, index) {
        let GEOJSON = {
            "type": "FeatureCollection",
            "features": []
        };
        let points = data;
        let disasterTypes = {
            "0000": "未知",
            "1000": "崩塌",
            "1001": "不稳定斜坡",
            "1002": "地面塌陷",
            "1003": "泥石流",
            "1004": "滑坡",
            "1005": "地裂缝",
            "1006": "地面沉降"
        };
        let disasterLevels = {
            "S": "小型",
            "M": "中型",
            "B": "大型",
            "G": "特大型"
        };

        for (let i = 0; i < points.length; i++) {
            let _ocurrFactor = points[i].ocurrFactor === "N" ? "人为因素" : "自然因素";
            let _disasterType = disasterTypes[points[i].disasterType];
            let _disasterLevel = disasterLevels[points[i].disasterLevel];
            let dataset = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [points[i].longitude, points[i].latitude]
                },
                "properties": {
                    "createUserId": points[i].createUserId,
                    "updateDate": points[i].updateDate,
                    "latitude": points[i].latitude,
                    "ocurrDate": points[i].ocurrDate,
                    "baseDataId": points[i].baseDataId,
                    "cityId": points[i].cityId,
                    "townId": points[i].townId,
                    "ocurrFactor": _ocurrFactor,
                    "directEconomicLoss": points[i].directEconomicLoss,
                    "countyId": points[i].countyId,
                    "deathPopulation": points[i].deathPopulation,
                    "disasterScale": points[i].disasterScale,
                    "disasterObject": points[i].disasterObject,
                    "createDate": points[i].createDate,
                    "longitude": points[i].longitude,
                    "losePopulation": points[i].losePopulation,
                    "proviceId": points[i].proviceId,
                    "disasterType": _disasterType,
                    "updateUserId": points[i].updateUserId,
                    "descr": points[i].descr,
                    "shardingType": points[i].shardingType,
                    "geologyDisasterSituationId": points[i].geologyDisasterSituationId,
                    "location": points[i].location,
                    "disasterPopulation": points[i].disasterPopulation,
                    "shardingId": points[i].shardingId,
                    "disasterLevel": _disasterLevel,
                    "ocurrTime": points[i].ocurrTime,
                    "icon": "school_red"
                }
            };
            GEOJSON.features.push(dataset);
        }
        let testWindLayer = new PIE.MetoStyle.IconLayer({
            data: GEOJSON,
            iconUrl: "icon",
            id: "dizhi",
            opacity: 1,
            size: 2,
            visible: true
        });
        setTimeout(function(){ conf.map.instance3d.add(testWindLayer);},3000);
        this.cameraToDizhi(GEOJSON.features[index].properties.longitude, GEOJSON.features[index].properties.latitude);
        this.addLabelToMap(GEOJSON.features[index]);

        return testWindLayer;

    },
//添加label 组
    addLabelToMap: function (select) {
        let me = this;
        let labelPrimitives = conf.map.instance3d.map._cesiumViewer.scene.primitives.add(new Cesium.LabelCollection());
        if (select) {
            me.addLabel(labelPrimitives, me.getPropertys(select.properties), Cesium.Cartesian3.fromDegrees(select.properties.longitude, select.properties.latitude, 800));
        }

        PageInfo.view.listentoMouseEvent.on("pick", function (position, propertys, model, pix) {
            labelPrimitives.removeAll();
            if (propertys) {
                let content = me.getPropertys(propertys);
                let cartesian = Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.height);
                me.addLabel(labelPrimitives, content, cartesian);
            }
            else {
                // labelPrimitives.removeAll();
            }


        });
        //
        conf.map.instance3d.map._cesiumViewer.screenSpaceEventHandler.setInputAction(function (event) {
            labelPrimitives.removeAll();
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        conf.map.instance3d.map._cesiumViewer.screenSpaceEventHandler.setInputAction(function (event) {
            labelPrimitives.removeAll();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
//拼写打印输出
    getPropertys: function (propertys) {
        let content = '位置：' + propertys.location + '\n';
        content += '发生时间：' + propertys.ocurrDate + '\n';
        content += '引发原因：' + propertys.ocurrFactor + '\n';
        content += '受灾人口：' + propertys.disasterPopulation + '人\n';
        content += '死亡人口：' + propertys.deathPopulation + '人\n';
        content += '失踪人口：' + propertys.losePopulation + '人\n';
        content += '直接经济损失：' + propertys.directEconomicLoss + '万元\n';
        content += '受灾类型：' + propertys.disasterType + '\n';
        content += '灾情级别：' + propertys.disasterLevel + '\n';
        content += '灾情规模：' + propertys.disasterScale + '方\n';

        return content;
    },
//添加label
    addLabel: function (labelPrimitives, content, cartesian) {
        labelPrimitives.add({
            position: cartesian,
            font: '18px Helvetica',
            showBackground: true,
            fillColor: Cesium.Color.WHITE,
            pixelOffset: new Cesium.Cartesian2(10.0, 10),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 500000000.0),
            text: content
        });
    },
    addFire:function (){
        let me =this;
        let destination=Cesium.Cartesian3.fromDegrees(112.30,36.77, 30000.0);
        let  heading=Cesium.Math.toRadians(0.0);
        let  pitch=Cesium.Math.toRadians(-90);
        let  roll=Cesium.Math.toRadians(0);
        let  duration=0.1;
        PageInfo.viewer.terrainProvider = PageInfo.worldTerrain;
        PageInfo.flyTo(destination,heading,pitch,roll,duration,me.addGuohuo());

    },
    addGuohuo:function (){
        let grid = new PIE.GridTileLayer({
            projection: "EPSG:3857",
            id:"guohuoGrid",
            region : [112.19,36.67,112.49,36.87],
            url: 'http://cloud.piesat.cn:9000/dataservices/map-editor/tiles/node1_test/tif_c3e8be4bb2334291bb31ed266c0bc214/{z}/{x}/{y}?tms=false',
        });
        conf.map.instance3d.add(grid);
        PageInfo.getData("./resources/data/guohuo.geojson",function(data){
            //console.log(data);
            if(data.features[0].geometry.type === "Polygon"){
                data.features[0] = turf.polygonToLine(data.features[0]);
            }
            //console.log(data);
            let testWindLayer = new PIE.MetoStyle.LineLayer({
                data: data,
                color:"#f00",
                id: "guohuoLine",
                opacity: 1,
                width: 2,
                visible: true
            });
            conf.map.instance3d.add(testWindLayer);
        })
    },
    removeFire:function (){
        let guohuoGrid = conf.map.instance3d.getLayer("guohuoGrid");
        if(guohuoGrid){
            conf.map.instance3d.remove(guohuoGrid);
        }

        let guohuoLine = conf.map.instance3d.getLayer("guohuoLine");
        if(guohuoLine){
            conf.map.instance3d.remove(guohuoLine);
        }
    },
    addRainValue:function () {
        let raindom  = `<div id = "rainStation" style="position:absolute;bottom:310px;left:20px;width:200px;display:block;color:white;pointer-events:none;background-color: rgba(0, 0, 0, 0.4);">
        <p style="font-size: 22px; font-weight: 600;">站点降雨情况</p>
        <ul>
        <li style = "padding: 1px;"><span style="font-size: 20px;">鹤峰：</span><span class="rains">100mm<span></listy>
        <li style = "padding: 1px;"><span style="font-size: 20px;">清湖：</span><span class="rains">100mm<span></li>
        <li style = "padding: 1px;"><span style="font-size: 20px;">坪山：</span><span class="rains">100mm<span></li>
        <li style = "padding: 1px;"><span style="font-size: 20px;">燕子坪：</span><span class="rains">100mm<span></li>
        <li style = "padding: 1px;"><span style="font-size: 20px;">中坪：</span><span class="rains">100mm<span></li>
        <li style = "padding: 1px;"><span style="font-size: 20px;">下坪：</span><span class="rains">100mm<span></li>
        </ul>
        </div>` ;
        $('body').append(raindom);
        let rains = document.getElementsByClassName('rains');
        let rainNum = 0;
        let rainBase = 0;
        let rainMax = 10;
        function writeRains(){
            if(!document.getElementById('rainStation')) return
            if(rainNum>10) return;
            for(let i=0;i<rains.length;i++){
                switch(PageInfo.rainType){
                    case 0:
                        rainBase =0;
                        rainMax = 10;
                        break;
                    case 1:
                        rainBase = 10;
                        rainMax =15;
                        break;
                    case 2:
                        rainBase = 25;
                        rainMax = 25;
                        break;
                    case 3:
                        rainBase = 50;
                        rainMax = 50;
                        break;
                    case 4:
                        rainBase = 100;
                        rainMax = 150;
                        break;
                    case 5:
                        rainBase = 250;
                        rainMax = 50;
                        break;
                    default:break;
                }
                rains[i].innerText = rainBase+Math.floor(Math.random()*rainMax) +"mm"
            }
            rainNum++;
            setTimeout(writeRains,6000);
        }
        writeRains()
    },
    addDisasters:function () {
      let disasterDom = `<div id = "DisasterSituation" style="position:absolute;bottom:590px;left:20px;width:300px;display:block;color:white;pointer-events:none;    background-color: rgba(0, 0, 0, 0.4);">
        <p style="font-size: 22px; font-weight: 600;">受灾情况</p>
        <ul>
        <li style = "padding: 1px;"><span  style="font-size: 20px;">时间：</span><span class="Disasters">2019-07-19 10:00:00<span></li>
        <li style = "padding: 1px;"><span  style="font-size: 20px;">地点：</span><span style="font-size: 20px;">湖北省鹤峰县<span></li>
        <li style = "padding: 1px;"><span  style="font-size: 20px;">淹没面积：</span><span class="Disasters">0<span></li>
        <li style = "padding: 1px;"><span  style="font-size: 20px;">淹没建筑数量：</span><span class="Disasters">0<span></li>
        <li style = "padding: 1px;"><span  style="font-size: 20px;">受灾人口：</span><span class="Disasters">0<span></li>
        <li style = "padding: 1px;"><span  style="font-size: 20px;">经济损失：</span><span class="Disasters">0<span></li>
        </ul>
        </div>`;
        $('body').append(disasterDom);
        let disasters = document.getElementsByClassName('Disasters')
        let disasterDatas = [
            {people:0,area:0,num:0,time:"2019-07-18 11:00:00",eLoss:0},
            {people:8,area:2,num:4,time:"2019-07-18 11:20:00",eLoss:20},
            {people:14,area:7,num:7,time:"2019-07-18 11:40:00",eLoss:60},
            {people:22,area:15,num:10,time:"2019-07-18 12:00:00",eLoss:108},
            {people:38,area:18,num:15,time:"2019-07-18 12:20:00",eLoss:129},
            {people:100,area:22,num:22,time:"2019-07-18 12:40:00",eLoss:167},
            {people:306,area:25,num:35,time:"2019-07-18 13:00:00",eLoss:398},
            {people:820,area:28,num:41,time:"2019-07-18 13:20:00",eLoss:578},
            {people:1006,area:33,num:48,time:"2019-07-18 13:40:00",eLoss:879}
        ];
        //console.log(disasters);
        let disasterNum = 0;
        function writeDisasters(){
            if(!document.getElementById('DisasterSituation')) return
            if(disasterNum>=9) return;
            for(let i=0;i<disasters.length;i++){
                if(i === 0){
                    disasters[i].innerText = disasterDatas[disasterNum].time
                }
                if(i === 1){
                    disasters[i].innerText =  disasterDatas[disasterNum].area +"k㎡"
                }
                if(i===2){
                    disasters[i].innerText = disasterDatas[disasterNum].people +"人"
                }
                if(i === 3){
                    disasters[i].innerText = disasterDatas[disasterNum].num+"栋"
                }
                if(i === 4){
                    disasters[i].innerText = disasterDatas[disasterNum].eLoss +"万元"
                }

            }
            disasterNum++;
            //PageInfo.WaterNum++;
            //PageInfo.addRriver("testWater");
            //PageInfo.setChartData(PageInfo);
            setTimeout(writeDisasters,1000)
        }
        writeDisasters();
    },

    setSpeed:function (num) {
        PageInfo.rainSpeed = num;
    },
    setView:function(viewer){
        PageInfo.viewer = viewer;

    },
    addWaterTo:function(){

        //PageInfo.addRainState();

        let viewer =  PageInfo.viewer;
       // viewer.scene.globe.depthTestAgainstTerrain = false;

        let destination=Cesium.Cartesian3.fromDegrees( 110.029641, 29.889106 , 2000.0);
        let  heading=Cesium.Math.toRadians(0.0);
        let  pitch=Cesium.Math.toRadians(-90);
        let  roll=Cesium.Math.toRadians(0);
        let  duration=0.2;
        let fn=function(){
            //getFillData()
            PageInfo.addFillWater();
        };

        PageInfo.getData("static/3d/riverBound1206.geojson",function(data){
            PageInfo.polygon = data.features[0];
            PageInfo.polygonBase = data.features[0];
            viewer.camera.setView({
                destination : destination,
                orientation : {
                    heading : heading,
                    roll : roll,
                    pitch : pitch
                }
            });
        
        });
       // PageInfo.flyTo(destination,heading,pitch,roll,duration,fn);




    },
    addCharts: function(){
        let disasterDom = `<div id = "mainE" style="position:absolute;bottom:0px;width:600px;display:block;height:300px;pointer-events:none; background-color: rgba(0.1, 0.1, 0.1, 0.4);">
        </div>`;
        $('body').append(disasterDom);
       
        
        PageInfo.myChart = echarts.init(document.getElementById('mainE'));

        // 指定图表的配置项和数据
        let option = {
            backgroundColor:'rgba(0.1, 0.1, 0.1, 0.4)',
            title: {
                text: '水位情况',
                textStyle:{
                    //文字颜色
                    color:'#fff',
                    //字体风格,'normal','italic','oblique'
                    fontStyle:'normal',
                    //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                    fontWeight:'bold',
                    //字体系列
                    fontFamily:'sans-serif',
                    //字体大小
                    fontSize:18
                }
            },
            tooltip: {},
            legend: {
                data:['水位'],
                textStyle: {color: 'white'},
            },
            xAxis: {
                data: [],
                axisLabel: {
                    color: "white"
                }
            },
            yAxis: {
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                type: 'value',
                min: 476,
                max: 490
            },
            series: [{
                name: '水位',
                type: 'line',
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width:5, //调整 线条的宽度  5已经很宽啦
                            color : 'red' //线条颜色
                        }
                    }
                },
                data: [],

                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 481.40,
                        itemStyle : {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    color:'#00f',
                                    width:1
                                },
                            }
                          
                        },
                    }, {
                        yAxis: 483.40,
                        itemStyle : {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    color:'#ff0',
                                    width:1
                                },
                            }
                          
                        },
                    }, {
                        yAxis: 486.90,
                        itemStyle : {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    color:'#f00',
                                    width:1
                                },
                            }
                          
                        },
                    }]
                }
            }]
        };
        PageInfo.myChart.setOption(option);
    },
    addTile:function(){
        let viewer =  PageInfo.viewer;
        let terrainProvider = new Cesium.CesiumTerrainProvider({
            url: "static/3d/test"
        });
        viewer.terrainProvider = terrainProvider;
        viewer.scene.globe.depthTestAgainstTerrain = true;
    },
    addHeight: function (){
        if(PageInfo.LKTiles) return;
        let viewer =  PageInfo.viewer;
        let tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({ url: "static/3d/11/tileset.json",
            //modelMatrix: m //形状矩阵
        }));

        tileset.maximumScreenSpaceError = 0;

        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ["${height} >= 90", "rgb(180, 21, 0)"],
                    ["${height} >= 80", "rgb(180, 107, 0)"],
                    ["${height} >= 70", "rgb(180, 140, 0)"],
                    ["${height} >= 60", "rgb(171, 180, 0)"],
                    ["${height} >= 50", "rgb(157, 180, 0)"],
                    ["${height} >= 40", "rgb(25, 180, 0)"],
                    ["${height} >= 30", "rgb(0, 180, 99)"],
                    ["${height} >= 20", "rgb(0, 180, 150)"],
                    ["${height} >= 10", "rgb(0, 152, 180)"],
                    ["${height} >= 5", "rgb(0, 110, 180)"],
                    ["true", "rgb(0, 59, 180)"]
                ]
            }
        });



        PageInfo.LKTiles =viewer.scene.primitives.add(tileset);
        let lonOffset = 0.0000018;
        let latOffset = -0.0000020;
        tileset.readyPromise.then(function (tileset) {
            viewer.scene.primitives.add(tileset);
            viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 1.0));
            let boundingSphere = tileset.boundingSphere;
            let cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);//获取到倾斜数据中心点的经纬度坐标（弧度）
            let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);//倾斜数据中心点的笛卡尔坐标
            let positions = [Cesium.Cartographic.fromDegrees(cartographic.longitude,cartographic.latitude)];
            let promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions);//其中terrainProvider是当前场景使用的高程Provider
            Cesium.when(promise, function(updatedPositions) {
                let terrainHeight = updatedPositions[0].height;//高程
                terrainHeight = 460;
                let offset=Cesium.Cartesian3.fromRadians(cartographic.longitude+lonOffset, cartographic.latitude+latOffset, terrainHeight);//带高程的新笛卡尔坐标
                let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());//做差得到变换矩阵
                tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
            });
        })
    },
    addFillWater:function (){
        PageInfo.WaterSpeed = 1200;
        PageInfo.xAxis = [];
        PageInfo.series = [];
        PageInfo.Geos = [];
        PageInfo.WaterNum = 0;
        PageInfo.getData("static/3d/riverDirectionPoint.geojson",function(data){
            //console.log(data.features[0].geometry.coordinates[31]);
            let i=0;
            let num = 1;
            let _geo ;
            let coordinates = data.features[0].geometry.coordinates;
            PageInfo.getWaterData();
            let viewer = PageInfo.viewer;
            PageInfo.addRriver("testWater")
            PageInfo.rainTimeVal = window.setInterval(function() {
                if (PageInfo.WaterNum  < PageInfo.Geos.length) {
                    PageInfo.setChartData(PageInfo)
                    PageInfo.WaterNum ++;
                    PageInfo.addRriver("testWater");
                    if(PageInfo.WaterNum == PageInfo.rainNum){
                        // let  satCloudLine = new PIE.MetoStyle.LineLayer({
                        //     id: "satCloudLine" ,
                        //     color:"#ff0",
                        //     opacity:0.5,
                        //     width:2,
                        //     url: './resources/data/3d/CounterLines.geojson',
                        // });
                        //conf.map.instance3d.add(satCloudLine);
                        PageInfo.addDisasters();
                        //window.clearInterval(timer);
                    }
                } else {
                    window.clearInterval(PageInfo.rainTimeVal);
                }
            }, 1000);

        })
    },
    getPolygon:function (){
        let _gData = PageInfo.Geos[PageInfo.WaterNum];
        if(PageInfo.WaterNum >= PageInfo.Geos.length){
            _gData = PageInfo.Geos[PageInfo.Geos.length-1]
        }
        let da = []
        for(let k =0;k<_gData.geometry.coordinates[0].length;k++){
            da.push(_gData.geometry.coordinates[0][k])
        }
        let River1Point =[ da.toString()];
        River1Point = River1Point[0].split(",");

        return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(River1Point))
    },
    getWaterHeight:function (){
        if(PageInfo.WaterNum > PageInfo.series.length){
            return PageInfo.series[PageInfo.series.length-1];
        }
        return Number(PageInfo.series[PageInfo.WaterNum]) ;
    },
    addRriver:function (id){
        let  rh =  PageInfo.getPolygon();
        let heigth = PageInfo.getWaterHeight();
        let River1=new Cesium.Primitive({
            geometryInstances : new Cesium.GeometryInstance({
                geometry :new Cesium.PolygonGeometry({
                    polygonHierarchy : rh,
                    extrudedHeight:1,
                    height:heigth-10,
                    vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
                }),
            }),
            appearance : new Cesium.EllipsoidSurfaceAppearance({
                aboveGround : true,
                material : new Cesium.Material({
                    fabric : {
                        type : 'Water',
                        uniforms : {
                            baseWaterColor:Cesium.Color.fromCssColorString("#2D2D13"),
                            blendColor:Cesium.Color.fromCssColorString("#2D2D13"),
                            //blendColor: new Cesium.Color(0.0, 1.0, 0.0, 0.5),
                            normalMap: 'static/img/waterNormals.jpg',
                            frequency: 1000.0,
                            animationSpeed: 0.01,
                            amplitude: 10.0
                        }
                    }
                }),
                fragmentShaderSource:'varying vec3 v_positionMC;\nvarying vec3 v_positionEC;\nvarying vec2 v_st;\nvoid main()\n{\nczm_materialInput materialInput;\nvec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n#ifdef FACE_FORWARD\nnormalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n#endif\nmaterialInput.s = v_st.s;\nmaterialInput.st = v_st;\nmaterialInput.str = vec3(v_st, 0.0);\nmaterialInput.normalEC = normalEC;\nmaterialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\nvec3 positionToEyeEC = -v_positionEC;\nmaterialInput.positionToEyeEC = positionToEyeEC;\nczm_material material = czm_getMaterial(materialInput);\n#ifdef FLAT\ngl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\ngl_FragColor.a = 0.8;\n#else\ngl_FragColor = czm_phong(normalize(positionToEyeEC), material);\
                  gl_FragColor.a = 0.5;\n#endif\n}\n'
            })
        });
        let scene = PageInfo.viewer.scene;
        River1.id = id;
        scene.primitives.add(River1);
        //PageInfo.River = River1;
        setTimeout(function(){
            if(PageInfo.WaterNum == PageInfo.rainTime*60) {
                PageInfo.River = River1;
                return;
            }
            scene.primitives.remove(River1)
        },PageInfo.WaterSpeed)

    },
    setChartData:function (datas){
        if(!document.getElementById('mainE')) return
        let xAxis = [];
        let series = [];
        for(let k =0;k<PageInfo.WaterNum;k++){
            if(PageInfo.WaterNum>=datas.xAxis.length){
                return;
            }
            series.push(Number(datas.series[k])+Math.random()*2);
            xAxis.push(datas.xAxis[k])
        }
        PageInfo.myChart.setOption({        //加载数据图表
            xAxis: {
                data: xAxis,
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
            },
            series: [{
                scale: true,
                // 根据名字对应到相应的系列
                name: '水位',
                data: series
            }]
        });

    },
    getWaterData:function (){
        let TimeNum = PageInfo.rainTime*60;
        for(let index =0 ;index<TimeNum;index++){
            let height = 480;
            switch(PageInfo.rainType){
                case 0:
                    height =  Number(481 + index*3/TimeNum).toFixed(2);
                    break;
                case 1:
                    height = Number(481 + index*4/TimeNum).toFixed(2);
                    break;
                case 2:
                    height = Number(481 + index*6/TimeNum).toFixed(2);
                    if(height>488)
                    {
                        height = Number(486.50 + Math.random()*2)
                    }
                    break;
                case 3:
                    height = Number(481 + index*8/TimeNum).toFixed(2);
                    if(height>488)
                    {
                        height = Number(486.50 + Math.random()*2);
                        if(PageInfo.rainNum == null) PageInfo.rainNum = index;
                        PageInfo.polygon = PageInfo.waterUnion(PageInfo.polygon,index-PageInfo.rainNum + 1);
                    }
                    break;
                case 4:
                    height = Number(481 + index*12/TimeNum).toFixed(2);
                    if(height>488)
                    {
                        height = Number(487 + Math.random()*2)
                        if(PageInfo.rainNum == null) PageInfo.rainNum = index;
                        PageInfo.polygon = PageInfo.waterUnion(PageInfo.polygon,index-PageInfo.rainNum + 1);
                    }
                    break;
                case 5:
                    height = Number(481 + index*16/TimeNum).toFixed(2);
                    if(height>488)
                    {
                        height = Number(487 + Math.random()*2)
                        if(PageInfo.rainNum == null) PageInfo.rainNum = index;
                        PageInfo.polygon = PageInfo.waterUnion(PageInfo.polygon,index-PageInfo.rainNum + 1);
                    }
                    break;
            }
            PageInfo.Geos.push(PageInfo.polygon);
            PageInfo.xAxis.push(index*PageInfo.rainSC/PageInfo.rainTime);
            PageInfo.series.push(height)
        }
    },
    waterUnion:function (_geo,num){
        let startLon = 110.029641,startLat =   29.889106;
        let point = turf.point([startLon, startLat]);
        let buffered = turf.buffer(point, 0.01*num, {units: 'miles'});

        let area =0;
        if(buffered){

            _geo = turf.union(_geo,buffered);
        }
        return _geo;
    },
    addRainState:function () {

        let fragmentShaderSource =
            'uniform sampler2D colorTexture;\n' +
            'varying vec2 v_textureCoordinates; \n' +

            'float hash(float x){\n' +
            'return fract(sin(x*133.3)*13.13);\n' +
            '}\n' +

            'void main(void){\n' +

            'float time = czm_frameNumber / 60.0;\n' +
            'vec2 resolution = czm_viewport.zw;\n' +

            'vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n' +
            'vec3 c=vec3(.6,.7,.8);\n' +

            'float a=-.4;\n' +
            'float si=sin(a),co=cos(a);\n' +
            'uv*=mat2(co,-si,si,co);\n' +
            'uv*=length(uv+vec2(0,4.9))*.3+1.;\n' +

            'float v=1.-sin(hash(floor(uv.x*100.))*2.);\n' +
            'float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n' +
            'c*=v*b; \n' +

            'gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); \n' +
            '}\n';
        PageInfo.stage=new Cesium.PostProcessStage({
            name : 'czm_rain',
            fragmentShader : fragmentShaderSource
        });
        PageInfo.viewer.scene.postProcessStages.add(PageInfo.stage);
    },
    addRain:function(){
    //初始化雨雪类
    if(PageInfo.weatherHelper==null){
        PageInfo.weatherHelper= new rainSnowFall({
            viewer:PageInfo.viewer,
            snowSize:PageInfo.rainType,//0:小雨；1：中雨；2：大雨；3：暴雨；4：大暴雨；5：特大暴雨
            snowImg:PageInfo.snowImg,
            rainImg: PageInfo.rainImg
        });
    }else {
        PageInfo.weatherHelper._options.snowSize = PageInfo.rainType;
    }
    if(PageInfo.weatherHelper._rainSystem!=null){
        PageInfo.viewer.scene.primitives.remove(PageInfo.weatherHelper._rainSystem);
        PageInfo.weatherHelper._rainSystem=null;
    }
    PageInfo.weatherHelper.getRain();
},
    setRainType:function (type) {
        PageInfo.rainType = type;
        PageInfo.weatherHelper._options.snowSize = value;
    },
    addWaterSite:function(wName,lon,lat){
        //PageInfo.viewer.scene.globe.depthTestAgainstTerrain = false;
        let pinBuilder = new Cesium.PinBuilder();
        let bluePin = PageInfo.viewer.entities.add({
            position : Cesium.Cartesian3.fromDegrees(lon,lat),
            billboard : {
                image : pinBuilder.fromText(wName, Cesium.Color.GREEN, 48).toDataURL(),
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM
            }
        });
        // PageInfo.viewer.zoomTo(PageInfo.viewer.entities);
    },
    addWaterSites:function () {
        PageInfo.addWaterSite("清湖",110.279975,30.016816);//清湖
        PageInfo.addWaterSite("坪山",110.107915,29.959949);//坪山
        PageInfo.addWaterSite("燕子坪",109.786017,29.863773);//燕子坪
        PageInfo.addWaterSite("中营乡",109.987876,29.980743);//中营乡
        PageInfo.addWaterSite("下坪",109.917449,29.998798);//下坪
        PageInfo.addWaterSite("鹤峰",110.03333333333333,29.883333333333333);//鹤峰
    },
    removeRain:function () {
        let scene =  PageInfo.viewer.scene;
        if(PageInfo.River){
            scene.primitives.remove(PageInfo.River)
        }
        let arrayTemp = scene.primitives._primitives;
        for(let i=0;i<arrayTemp.length;i++){
            if(arrayTemp[i].id && (arrayTemp[i].id == "testWater"))
            {
                scene.primitives.remove(arrayTemp[i])
            }
        }
        if(PageInfo.rainNum !=null){
            PageInfo.rainNum = null;
        }
        if(PageInfo.weatherHelper&&PageInfo.weatherHelper._rainSystem!=null){
            scene.primitives.remove(PageInfo.weatherHelper._rainSystem);
            PageInfo.weatherHelper._rainSystem=null;
        }
        PageInfo.polygon = PageInfo.polygonBase;
        if(document.getElementById('mainE'))
        {
            document.getElementById('mainE').remove()
        }
        if(document.getElementById('DisasterSituation'))
        {
            document.getElementById('DisasterSituation').remove()
        }
        if(document.getElementById('rainStation'))
        {
            document.getElementById('rainStation').remove()
        }
        // if(conf.map.instance3d.getLayer("satCloudLine")){
        //     conf.map.instance3d.remove(conf.map.instance3d.getLayer("satCloudLine"));
        // }
        if(PageInfo.rainTimeVal){
            window.clearInterval(PageInfo.rainTimeVal);
        }
    },
    startRain:function (raintype,raintime,raintruetime) {
        PageInfo.rainTime = Number(raintruetime);
        PageInfo.rainType = Number(raintype);
        PageInfo.rainSC = Number(raintime);
        PageInfo.removeRain();
        PageInfo.addWaterTo();
        PageInfo.startWater();
    },
    startWater:function () {
        PageInfo.addWaterSites();
        PageInfo.addCharts();
        PageInfo.addRainValue();
        PageInfo.addFillWater();
        PageInfo.addRain();
    },
    removeWater:function () {
        PageInfo.viewer.scene.postProcessStages.remove(PageInfo.stage);
        let scene = conf.map.instance3d.map._cesiumViewer.scene;
        if (PageInfo.River) {
            scene.primitives.remove(PageInfo.River)
        }
        PageInfo.polygon = PageInfo.polygonBase;
    }
};
