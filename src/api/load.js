import api from '@/api/index.js';
// import { promises } from 'dns';


export function post(url, params) {
	var headers = {
		token: window.localStorage.getItem("token")
	}
	return new Promise(function (resolve, reject) {
		api.post(
			url,
			headers,
			params,
			successRes => {
				//console.log(successRes)
				resolve(successRes);
			},
			failureRes => {
				//console.log(failureRes)
				resolve(failureRes);
			}
		)
	})
}
export function get(url, params) {// 展示类型
	var headers = {
		token: window.localStorage.getItem("token")
	}
	return new Promise(function (resolve, reject) {
		api.get(
			url,
			headers,
			params ? params : null,
			successRes => {
				resolve(successRes);
			},
			failureRes => {
				resolve(failureRes);
			}
		)
	})
}
export function getStartExtract(url,params) {// 开始分割
	var headers = {
		token: window.localStorage.getItem("token")
	}
	return new Promise(function (resolve, reject) {
		api.post(			
			url,
			headers,
			params,
			null,
			successRes => {
				resolve(successRes);
			},
			failureRes => {
				resolve(failureRes);
			}
		)
	})
}

export function getDataSetFieldList(url,params) {// 获取数据集字段列表
	return new Promise(function (resolve, reject) {
		api.get(url, null,
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
