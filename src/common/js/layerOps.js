import vm from '../../main' // Vue实例
import { queryDataSetGeo, getBoundsByDataId } from '../../api/layer'
import LineLayer from '@/utils/Layers/LineLayer.js'
import PointLayer from '@/utils/Layers/PointLayer.js'
import PolygonLayer from '@/utils/Layers/PolygonLayer.js'
import TextLayer from '@/utils/Layers/TextLayer.js'
import GridTileLayer from '@/utils/Layers/GridTileLayer.js'

// 装载图层
export function loadLayer(options = {}) {
    let datasetId = options.dataId || options.data_id;
    if(datasetId && options.data_type == 'GeoJson') {
        vm.$store.dispatch('changeLoadCount', 1);
        queryDataSetGeo({
            datasetId, 
        }).then((res) => {
            vm.$store.dispatch('changeLoadCount', -1);
            if(res.code == 0) {
                const features = res.data || {} // 获取到数据集数据
                console.log('options--',options);
                const layer = _createLayer(options, features);
                vm.map.layerManager.addLayer(layer);
                if(options.style && options.style.colorProperity) layer.updataStyle();
            } else {
            }
        }).catch((err) => {
            vm.$store.dispatch('changeLoadCount', -1);
            console.error(err);
        })
    } else if (options.data_type == 'Imagery') { // 栅格数据
        const layer = _createLayer(options);
        vm.map.layerManager.addLayer(layer);
    } else {
        console.error(options.name + '没有关联的数据集')
    }
}
// 删除图层
export function deleteLayer(ops) {
    vm.map.layerManager.removeLayer(ops);
}
// 更新图层
export function updateLayerById(ops) {
    const layer = vm.map.layerManager.getLayer(ops)
    if(layer) {
        let style = ops.style || {};
        layer.updataStyle(style || {});
    }
}
// 根据数据集id调整地图显示范围
export function changeViewByDataId(id, type) {
    getBoundsByDataId({
        dataId: id,
        datasetType: type
    }).then((res) => {
        if(res.code == 0) {
            const { min_x = 0, min_y = 0, max_x = 0, max_y = 0 } = res.data || {};
            vm.map.CameraManager.setRectangle({
                west: min_x,
                east: max_x,
                north: max_y,
                south: min_y,
            })
        }
    }).catch((err) => {

    })
}

function _createLayer(options, data) { // 图层选择
    let layer = {}, style = options.style || {};
    switch(options.type) {
        case 'point':
            layer = new PointLayer({
                data,
                ...style,
                ...options
            });
            break;
        case 'line':
            layer = new LineLayer({
                data,
                ...style,
                ...options
            });
            break;
        case 'polygon':
            layer = new PolygonLayer({
                //updata:true,  //测试按范围加载
                //url:"https://piecloud.piesat.cn:8443/api/v1/spatiotemporal/vectordatasets/queryFeatureByGeo",
                data,
                ...style,
                ...options
            });
            break;
        case 'raster':
            layer = new GridTileLayer({
                url: options.data_url,
                ...style,
                ...options
            })
            break;
        case 'text':
            layer = new TextLayer({
                data,
                ...style,
                ...options
            });
            break;
    }
    return layer;
}

