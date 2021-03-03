<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item label="标题" prop="phone" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="请输入标题" v-model="model.title" type="text"></u-input>
			</u-form-item>
			<u-form-item label="类别" prop="sex">
				<u-input input-align="right" :border="border" type="select" v-model="model.type" placeholder="请选择类别" @click="actionShow"></u-input>
			</u-form-item>
			<u-form-item label="联系方式" prop="phone" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="联系方式" v-model="model.phone" type="text"></u-input>
			</u-form-item>
			<u-form-item label="信息描述" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="请输入描述信息(最多50字)" v-model="model.info" type="textarea"
				 maxlength="100" />
			</u-form-item>
			<u-form-item label="时间" label-width="200rpx">
				<u-input input-align="right" :border="border" type="select" v-model="model.time" placeholder="请选择时间" @click="pickerShow = true"></u-input>
			</u-form-item>
			<u-form-item label="上传图片" label-width="200rpx">
				<view style="position: relative;left: 280rpx;">
					<u-upload ref="uUpload" @on-remove="onRemove" :action="action" :auto-upload="false" max-count="1"></u-upload>
				</view>
			</u-form-item>
		</u-form>
		<view class="submit" @click="submit">
			<view class="text">
				<text>发布</text>
			</view>
		</view>
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-picker mode="time" v-model="pickerShow" @confirm="timeConfirm"></u-picker>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					year: true,
					month: true,
					day: true,
				},
				show: false,
				showTime: false,
				openid: '',
				action: 'http://www.example.com/upload',
				model: {
					title: '',
					type: '',
					time: '',
					phone: '123456',
					info: '',
					filesArr: []
				},
				rules: {
					info: [{
						required: true,
						message: '请输入信息描述',
						trigger: 'blur',
					}],
					type: [{
						required: true,
						message: '请选择类别',
						trigger: 'change'
					}, ],
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur'],
					}, ],
					time: [{
						required: true,
						message: '请输入时间',
						trigger: ['change'],
					}, ]
				},
				border: false,
				selectType: '',
				actionSheetList: [],
				actionSheetShow: false,
				pickerShow: false,
				errorType: ['message'],
			};
		},
		onShow() {
			// this.get();
		},
		onLoad(options) {
			this.selectType = options.type
		},
		methods: {

			change(e) {
				console.log(e);
			},
			// 选择类别
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.model.type = this.actionSheetList[index].text;
			},
			actionShow() {
				this.actionSheetShow = true;
				let arr = [];
				switch (this.selectType) {
					case 'goods':
						arr=[{text:'寻找物主'}, {text:'寻找失物'}];
						break;
					case 'datas':
						arr=[{text:'求取资料'}, {text:'资料分享'}];
						break;
					case 'secondHand':
						arr=[{text:'二手求购'}, {text:'二手出售'}];
						break;
					case 'teams':
						arr=[{text:'活动拼团'}, {text:'活动组队'}, {text:'其它'}];
						break;
					case 'recruitment':
						arr=[{text:'求职'}, {text:'招聘'}];
						break;
				}
				this.actionSheetList = arr;
			},
			//选择时间
			timeConfirm(e) {
				this.model.time = e.year + '-' + e.month + '-' + e.day;
			},
			onRemove(index, lists) {
				console.log('图片已被移除')
			},
			//初始化
			// get() {
			// 	const that = this;
			// 	uni.getStorage({
			// 		key: 'userinfo',
			// 		success: function(res) {

			// 			that.openid = res.data.openid;
			// 			uni.showLoading({
			// 				title: '获取信息中'
			// 			})
			// 			// that.model.birth = res.data.birth;
			// 			// that.model.wechat = res.data.wechat;
			// 			// that.model.phone = res.data.phone;
			// 			// that.model.qq = res.data.qq;
			// 		},
			// 		complete() {
			// 			that.userinfo();
			// 		}
			// 	});
			// },
			//获取用户信息
			// userinfo() {
			// 	uni.request({
			// 		url: api.baseUrl+'/modify',
			// 		method: 'GET',
			// 		data: {
			// 			openid: this.openid
			// 		},
			// 		success: (res) => {

			// 			this.model.name = res.data.nickName;
			// 			this.model.sex = res.data.gender;
			// 			this.model.birth = res.data.birth;
			// 			this.model.phone = res.data.phone;
			// 			this.model.ava = res.data.avatarUrl;
			// 			this.model.wechat = res.data.wechat;
			// 			this.model.qq = res.data.qq;
			// 			uni.hideLoading();
			// 		}
			// 	})

			// },
			//保存资料
			// submit() {
			// 	let that = this;
			// 	uni.request({
			// 		url: api.baseUrl+'/modifysubmit',
			// 		method: 'GET',
			// 		data: {
			// 			openid: this.openid,
			// 			avatarUrl: this.model.ava,
			// 			nickName: this.model.name,
			// 			sex: this.model.sex,
			// 			birth: this.model.birth,
			// 			phone: this.model.phone,
			// 			wechat: this.model.wechat,
			// 			qq: this.model.qq
			// 		},
			// 		success: (res) => {

			// 			if (res.data.code == '1') {
			// 				this.$refs.uToast.show({
			// 					title: '保存信息成功',
			// 					type: 'success'
			// 				})
			// 				console.log(this.openid)
			// 				uni.setStorage({
			// 					key:'userinfo',
			// 					data:{
			// 						openid:that.openid,
			// 						nickName:that.model.name,
			// 						avatarUrl:that.model.ava,
			// 						gender:that.model.sex,
			// 						birth: that.model.birth,
			// 						phone: that.model.phone,
			// 						wechat: that.model.wechat,
			// 						qq: that.model.qq
			// 					}
			// 				})

			// 			}else{
			// 				this.$refs.uToast.show({
			// 					title: '保存信息失败',
			// 					type: 'error'
			// 				})
			// 			}

			// 		}
			// 	})
			// },

		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 0rpx 30rpx;
	}

	.submit {
		text-align: center;
		background-image: linear-gradient(to bottom right, #554d84, #554d84);
		z-index: 888;
		width: 100%;
		color: white;

		.text {
			padding: 25rpx;
		}
	}
</style>
