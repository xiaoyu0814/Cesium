import Vue from 'vue';
import { Photoshop, Slider } from 'vue-color'

const components = require.context('./', false, /\.vue$/)

components.keys().forEach(key => {
	if(key === './index.js') return;
	const name = key.slice(key.indexOf('/') + 1, key.lastIndexOf('.'));
	Vue.component(name, components(key).default);
})
Vue.component('slider-picker', Slider);