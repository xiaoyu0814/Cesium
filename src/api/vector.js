import api from '@/api/index.js';
import path from './path';

let _urls = path.vectorService

// 统计最大值最小值
export function getFieldMinMax(params) {
	return new Promise(function (resolve, reject) {
		api.get(_urls.FIND_FIELD_STATISTIC, null,
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
