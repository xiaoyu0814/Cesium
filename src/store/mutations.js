const mutations = {
  setCompare(state, newName) {
    state.close_Compare = newName;
  },
  UPDATE_LAYER(state, data) {
    state.globalLayerList = data;
  },
  SET_MAP_ID(state, data) {
    state.currentMapId = data;
  },
  CHANGE_GLOBAL_COUNT(state, data) {
    state.loadCount = data;
  },

}
export default mutations