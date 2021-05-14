import { IPv4 } from "ipaddr.js"

let Ip = {
  onLine: "https://cloud.piesat.cn",
  offLine: "https://piecloud.piesat.cn:8443"
}
const defaultPrifix = process.env.NODE_ENV == 'production' ? 'https://cloud.piesat.cn' : 'https://piecloud.piesat.cn:8443'

let path = {
  map: {
    getMapInfoByUserID: Ip.offLine + "/api/v1/spatiotemporal/maps/getMapInfoByUserID",
    getMapInfoByMapID: Ip.offLine + "/api/v1/spatiotemporal/maps/getMapInfoByMapID",
    createMap: Ip.offLine + "/api/v1/spatiotemporal/maps/createMap",
    deleteMap: Ip.offLine + "/api/v1/spatiotemporal/maps/deleteMap",
    openMap: Ip.offLine + "/api/v1/spatiotemporal/maps/openMap",
    saveMap: Ip.offLine + "/api/v1/spatiotemporal/maps/saveMap",
  },
  layer: {
    CREATE_LAYER: Ip.offLine + '/api/v1/spatiotemporal/layers/createLayer', // 创建图层
    FIND_DATASET_LIST: Ip.offLine + '/api/v1/spatiotemporal/datasets/findDatasetListByUserId', // 获取数据集列表
    QUERY_FEATURE_GEO:Ip.offLine+'/api/v1/spatiotemporal/vectordatasets/queryFeatureByGeo', //空间查询数据
    FIND_LAYER_LIST: Ip.offLine + '/api/v1/spatiotemporal/layers/getLayersInfoByMapId', //根据地图编号获取图层列表
    DELETE_LAYER: Ip.offLine + '/api/v1/spatiotemporal/layers/deleteLayer',	// 删除图层
    GET_LAYERS_BY_USERID: Ip.offLine + '/api/v1/spatiotemporal/layers/getLayersInfoByUserId',	// 查询用户的所有图层
    UPDATE_LAYER: Ip.offLine + '/api/v1/spatiotemporal/layers/updateLayerById', //重命名图层->更新图层接口
    FIND_DATASET: Ip.offLine + "/api/v1/spatiotemporal/vectordatasets/queryFeatureByGeo", //根据data_id 放回geojson数据  
    FIND_DATASET_DETAIL: Ip.offLine + "/api/v1/spatiotemporal/datasets/findDatasetInfoById", //根据data_id 放回geojson数据
    RENAME_LAYER: Ip.offLine + '/api/v1/spatiotemporal/layers/updateLayerById', //重命名图层->更新图层接口
    fileUpload: Ip.offLine + "/api/v1/spatiotemporal/datasets/fileUpload", // 文件上传
    findTaskStatus: Ip.offLine + "/api/v1/spatiotemporal/datasets/findTaskStatus", // 查询上传的文件状态
    FIND_DATA_BOUNDS_BY_ID: Ip.offLine + "/api/v1/spatiotemporal/datasets/findDatasetBoundsById", // 根据id获取数据范围
  },
  dataSet: {
    addFeatureField:Ip.offLine+"/api/v1/spatiotemporal/vectordatasets/addFeatureField",//增加字段
    findDatasetInfoById:Ip.offLine+"/api/v1/spatiotemporal/datasets/findDatasetInfoById",//查询单个数据集详情
    updateFeatures:Ip.offLine+'/api/v1/spatiotemporal/vectordatasets/updateFeatures',//更新数据
    deleteFeatures:Ip.offLine+'/api/v1/spatiotemporal/vectordatasets/deleteFeatures',//删除数据
    queryFeatures:Ip.offLine+'/api/v1/spatiotemporal/vectordatasets/queryFeatures',//查询数据
    FIND_FIELD_LIST_BY_ID: Ip.offLine + "/api/v1/spatiotemporal/datasets/findFieldListByDataId", // 获取数据字段
    deleteDatasetById:Ip.offLine+'/api/v1/spatiotemporal/datasets/deleteDatasetById',//删除数据集
    updateDatasetInfoById:Ip.offLine+'/api/v1/spatiotemporal/datasets/updateDatasetInfoById',//修改数据集名称
    updateDatasetDataById:Ip.offLine+'/api/v1/spatiotemporal/vectordatasets/saveFeatures',//修改数据集名称
    moduledDataSet:Ip.offLine+'/api/v1/spatiotemporal/datasets/createDataset',//参考模板创建数据集
    requireModuled:Ip.offLine+'/api/v1/spatiotemporal/datasets/findDatasetInfoModel',//获取模板接口
    sqlQuery:Ip.offLine+'/api/v1/spatiotemporal/datasets/findDatasetListByUserId',//sql
    updataproperty:Ip.offLine+'/api/v1/spatiotemporal/layers/getLayerInfoById',//更新属性信息
    updateFeatureFieldName:Ip.offLine+'/api/v1/spatiotemporal/vectordatasets/updateFeatureFieldName',//修改数据属性字段名称
    deleteFeatureField:Ip.offLine+'/api/v1/spatiotemporal/vectordatasets/deleteFeatureField',//删除数据属性字段
  },
  tools: {

  },
  vectorService: {
    FIND_FIELD_STATISTIC: Ip.offLine + "/api/v1/spatiotemporal/vectordatasets/findFieldStatistic", // 矢量数据服务-统计最大值最小值
  },
  identification: {
    distinguish: {
      detect: Ip.onLine + "/api/v1/business_server/ai/detect",
      modelTaskListByID: Ip.onLine + "/api/v1/business_server/task/modelTaskListByID",
      getOutData: Ip.onLine + "/api/v1/business_server/data_list/getOutData",
      query_intersects: Ip.onLine + "/geographic_search/v1/geocode/query_intersects",
      queryTemp: Ip.onLine + "/api/v1/business_server/sample/queryTemp"
    },
    segmentationAndClassification: {
      // http://piecloud.piesat.cn/api/v1/mongo/feature/add
      // http://piecloud.piesat.cn/api/v1/business_server/sisa/automatic_classify
      // automatic_classify: Ip.offLine + "/api/v1/business_server/sisa/automatic_classify",
      add: Ip.offLine + "/api/v1/mongo/feature/add",
      classify: Ip.offLine + "/api/v1/business_server/sisa/classify",
      modelTaskListByID: Ip.offLine + "/api/v1/business_server/task/modelTaskListByID",
      getOutData: Ip.offLine + "/api/v1/business_server/data_list/getOutData",
      query_intersects: Ip.offLine + "/geographic_search/v1/geocode/query_intersects",
      automatic_classify: Ip.offLine + "/api/v1/business_server/sisa/automatic_classify",
      queryTemp:Ip.offLine + "/api/v1/business_server/sample/queryTemp",
      querySampleList:Ip.offLine + "/api/v1/business_server/sample/querySampleList",
      queryDetailsByTempId:Ip.offLine + "/api/v1/business_server/sample/queryDetailsByTempId",
      addTempDetails:Ip.offLine + "/api/v1/business_server/sample/addTempDetails",
      delTem:Ip.offLine +"/api/v1/business_server/sample/delTem/",
      query:Ip.offLine +"/api/v1/mongo/feature/query",
      insertTemp:Ip.offLine +"/api/v1/business_server/sample/insertTemp",
    }
  },
  other:{
    // http://piecloud.piesat.cn/geographic_search/v1/geocode/point/query_intersects
    query_intersects:Ip.offLine +"/geographic_search/v1/geocode/point/query_intersects",
    search_province: Ip.onLine + "/geographic_search/v1/region_code/search_province",
    search_city: Ip.onLine + "/geographic_search/v1/region_code/search_city",
    search_area: Ip.onLine + "/geographic_search/v1/region_code/search_area",
    query_area: Ip.onLine + "/geographic_search/v1/geocode/query_area",
  }
}

export default path 
