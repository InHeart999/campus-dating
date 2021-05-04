import Vue from 'vue'
import App from './App'
import uview from 'uview-ui'
import store from './store'
import io from './common/uniapp.socket.io.js';

Vue.use(uview)
Vue.prototype.socket=io('ws://localhost:5555/socket')
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
