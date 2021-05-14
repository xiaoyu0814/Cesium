import Vue from 'vue';
import Vuex from 'vuex';
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
// import moduleA from './modules/moduleA';
// import moduleB from './modules/moduleB';
Vue.use(Vuex);

export default new Vuex.Store({
    // modules: {
    //     moduleA, moduleB,
    // },
    state,
    getters,
    actions,
    mutations,
});