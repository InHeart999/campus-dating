import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    state:{//存放状态
        "userInfo":{
			nickName:"",
			avataUrl:"",
			gender:"",
		},
    },
	mutations:{
		getUserInfo(state,userInfo){
			state.nickName=userInfo.nickName;
			state.avataUrl=userInfo.avataUrl;
			state.gender=userInfo.gender;
		}
	}
})
export default store