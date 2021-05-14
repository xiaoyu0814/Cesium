import api from '@/api/index.js';
import path from './path';

let _urls = path.layer

// 创建图层
export function createLayer(params) {
	return new Promise(function (resolve, reject) {
		api.post(_urls.CREATE_LAYER, null,
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

// 更新图层
export function updateLayer(params) {
	return new Promise(function (resolve, reject) {
		api.post(_urls.UPDATE_LAYER, null,
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

// 空间查询数据集数据
export function queryDataSetGeo(params) {
	return new Promise(function (resolve, reject) {
		api.post(_urls.QUERY_FEATURE_GEO, null,
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

export function findDataSet(params){
	return new Promise(function (resolve, reject) {
		api.post(_urls.FIND_DATASET, null,
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
// 查询数据集详情
export function findDataSetDetail(params){
	return new Promise(function (resolve, reject) {
		api.post(_urls.FIND_DATASET_DETAIL, null,
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
// 查询id获取数据范围
export function getBoundsByDataId(params){
	return new Promise(function (resolve, reject) {
		api.get(_urls.FIND_DATA_BOUNDS_BY_ID, null,
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