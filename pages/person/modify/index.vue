<template>
	<view class="wrap">
		<u-form :model="userInfo" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item label="头像" prop="user_ava">
				<view style="position: relative;left: 450rpx;">
					<u-upload ref="uUpload" :file-list="fileList" :form-data="file_id" @on-success="onSuccess" @on-remove="onRemove"
					 @on-list-change="onChange" :action="action" max-count="1" :show-progress="false" width="150rpx" height="150rpx"></u-upload>
				</view>
			</u-form-item>
			<u-form-item label="昵称" prop="user_name">
				<u-input input-align="right" :border="border" placeholder="请输入昵称" v-model="userInfo.user_name" type="text"></u-input>
			</u-form-item>
			<u-form-item label="性别">
				<u-input input-align="right" :border="border" type="select" :select-open="actionSheetShow" v-model="user_sex"
				 placeholder="请选择性别" @click="actionSheetShow = true"></u-input>
			</u-form-item>
			<u-form-item label="手机号码(选填)" prop="user_phone" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="手机号码" v-model="userInfo.user_phone" type="text"></u-input>
			</u-form-item>
			<u-form-item label="微信号(选填)" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="微信号" v-model="userInfo.user_wx" type="text"></u-input>
			</u-form-item>
			<u-form-item label="个人简介" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="请输入个人简介(最多50字)" v-model="userInfo.user_info" type="textarea"
				 height="12rpx" maxlength="50" />
			</u-form-item>
		</u-form>
		<view class="submit" @click="submit">
			<view class="text">
				<text>保存资料</text>
			</view>
		</view>
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import store from "../../../store/index.js"
	export default {
		data() {
			return {
				userInfo: {},
				fileList: [],
				rules: {
					user_ava: [{
						required: true,
						message: '请上传头像',
						trigger: 'blur',
					}],
					user_name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur',
					}],
					user_phone: [{
						type: 'number',
						message: '手机号必须是数字',
						trigger: 'blur',
					}, {
						len: 11,
						message: '手机号必须为11位！',
						trigger: 'blur'
					}],
				},
				border: false,
				actionSheetList: [{
						text: '女'
					},
					{
						text: '男'
					}
				],
				actionSheetShow: false,
				errorType: ['toast'],
			};
		},
		computed: {
			action() {
				return this.$store.state.baseUrl + '/upload'
			},
			file_id() {
				return {
					'id': this.$store.state.userInfo.user_id
				}
			},
			user_sex: {
				get() {
					let obj = {
						0: '女',
						1: '男',
					}
					return obj[this.userInfo.user_sex]
				},
				set(val) {
					return val
				}
			}
		},
		onLoad() {
			this.init()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			init(){
				let that = this
				uni.request({
					url: that.$store.state.baseUrl+'/user/' + that.$store.state.userInfo.user_id,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						res.data['user_phone'] = res.data['user_phone'] === null||'null' ? "":res.data['user_phone']
						that.userInfo = res.data;
						if (that.userInfo.user_ava != "") {
							this.fileList.push({
								'url': that.userInfo.user_ava
							})
						}
					}
				})
			},
			
			onSuccess(res, index, lists) {
				let that = this
				if (res != "success") {
					that.$refs.uToast.show({
						title: '图片上传失败',
						type: 'error',
					})
				}
			},
			onRemove(index, lists) {
				this.fileList = []
				this.userInfo.user_ava = ""
			},
			onChange(lists) {
				let that = this
				if (lists.length > 0 && that.userInfo['user_ava']!==that.$store.state.baseUrl+"/static/ava01.png") {
					that.userInfo['user_ava'] = that.$store.state.baseUrl+'/static/users/' + that.$store.state.userInfo.user_id + '.png'
				}
			},
			submit() {
				let that = this 
				that.$refs.uForm.validate(valid => {
					if (valid) {
						if(that.userInfo['user_ava']!==that.$store.state.baseUrl+"/static/ava01.png"){
							that.$refs.uUpload.upload();
						}
						uni.request({
							url: that.$store.state.baseUrl+'/user',
							header: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							method: 'POST',
							data: that.userInfo,
							success: (res) => {
								if (res.data.user_id != "") {
									store.commit('getUserInfo',res.data)
									that.$refs.uToast.show({
										title: '修改成功',
										type: 'success',
										duration: 8000,
										callback: that.reload()
									})
								} else {
									that.$refs.uToast.show({
										title: '修改失败',
										type: 'error',
										duration: 8000,
										callback: that.reload()
									})
								}
							}
						})

					}
				});
			},
			// 点击actionSheet回调
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.user_sex = this.actionSheetList[index].text
				this.userInfo.user_sex = index;
			},
			reload() {
				uni.redirectTo({
					url: '/pages/person/modify/index'
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
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
