import { loadLayer, deleteLayer, updateLayerById, changeViewByDataId } from '../common/js/layerOps'

const actions = {
  modifyCompare({commit}, newName) {
    commit('setCompare', newName);
  },
  setGlobalLayerList({commit}, data = []) {
    if(!Array.isArray(data)) return;
    data.forEach((item) => {
      loadLayer(item);
    })
    commit('UPDATE_LAYER', data);
  },
  // 增加图层 
  addLayer({commit, state}, layer) {
    // TODO 增加校验提示信息
    loadLayer(layer);
    changeViewByDataId(layer.data_id, layer.type); // 更新视图范围
    commit('UPDATE_LAYER', [ ...state.globalLayerList, layer]);
      
  },
  // 删除图层
  removeLayer({commit, state}, layerId) {
    // TODO 增加校验提示信息
    let layerNew = [];
    state.globalLayerList.forEach((item) => {
      if(item.id != layerId) {
        layerNew.push(item);
      } else {
        deleteLayer(item)
      }
    })
    commit('UPDATE_LAYER', layerNew);
  },
  // 更新图层
  updateLayer({commit, state}, newLayer) {
    // TODO 增加校验提示信息
    updateLayerById(newLayer);
    let layerList = [];
    state.globalLayerList.forEach((item, index) => {
      if(item.id != newLayer.id) {
        layerList.push(item)
      } else {
        layerList.push(newLayer)
      }
    })
    commit('UPDATE_LAYER', layerList);
  },
  // 图层顺序移动 -- 暂时先不做
  // 选中的地图Id
  setCurrentMapId({commit}, id) {
    commit('SET_MAP_ID', id);
  },
  changeLoadCount({commit, state}, num) {
    const data = state.loadCount + num;
    commit('CHANGE_GLOBAL_COUNT', data);
  },
}
export default actions