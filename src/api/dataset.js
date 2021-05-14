import api from '@/api/index.js';
import path from './path';

let _dataSet = path.dataSet

const defaultPrifix = 'https://piecloud.piesat.cn:8443'

const _urls = {
   FIND_DATASET_LIST: defaultPrifix + '/api/v1/spatiotemporal/datasets/findDatasetListByUserId', // 获取数据集列表
	FIND_LAYER_LIST:defaultPrifix+'/api/v1/spatiotemporal/layers/getLayersInfoByMapId', //根据地图编号获取图层列表
	DELETE_LAYER:defaultPrifix+'/api/v1/spatiotemporal/layers/deleteLayer',	// 删除图层
	GET_LAYERS_BY_USERID:defaultPrifix+'/api/v1/spatiotemporal/layers/getLayersInfoByUserId',	// 查询用户的所有图层
	RENAME_LAYER:defaultPrifix+'/api/v1/spatiotemporal/layers/updateLayerById' //重命名图层->更新图层接口
}
// 获取数据集列表
export function getDataSetList(params) {
	return new Promise(function (resolve, reject) {
		api.get(_urls.FIND_DATASET_LIST, null,
			params,
			successRes => {
				resolve(successRes);
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}
//根据地图编号获取图层列表
export function findLayerList(params){
	return new Promise(function(resolve,reject){
		api.get(_urls.FIND_LAYER_LIST,null,
			params,
			successRes =>{
				resolve(successRes)
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}

// 删除图层
export function deleteLayer(params){
	return new Promise(function(resolve,reject){
		api.get(_urls.DELETE_LAYER,null,
			params,
			successRes =>{
				resolve(successRes)
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}

// 根据用户id查图层
export function getLayersByUserId(params){
	return new Promise(function(resolve,reject){
		api.get(_urls.GET_LAYERS_BY_USERID,null,
			params,
			successRes =>{
				resolve(successRes)
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}

// 重命名图层
export function renameLayer(params) {
	return new Promise(function (resolve, reject) {
		api.post(_urls.RENAME_LAYER, null,
			params,
			successRes => {
				//console.log(successRes)
				resolve(successRes);
			},
			failureRes => {
				//console.log(failureRes)
				reject(failureRes);
			}
		)
	})
}


// 获取数据集列表
export function getFieldListById(params) {
	return new Promise(function (resolve, reject) {
		api.get(_dataSet.FIND_FIELD_LIST_BY_ID, null,
			params,
			successRes => {
				resolve(successRes);
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}
// 添加数据
export function addDatasetData(params) {
	return new Promise(function (resolve, reject) {
		api.post(_dataSet.updateDatasetDataById, null,
			params,
			successRes => {
				resolve(successRes);
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}

// 更新数据
export function updataDatasetData(params) {
	return new Promise(function (resolve, reject) {
		api.post(_dataSet.updateFeatures, null,
			params,
			successRes => {
				resolve(successRes);
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}
//删除数据
export function deleteFeatures(params){
	return new Promise(function (resolve, reject) {
		api.post(_dataSet.deleteFeatures, null,
			params,
			successRes => {
				resolve(successRes);
			},
			failureRes => {
				reject(failureRes);
			}
		)
	})
}