<template>
	<view class="wrap">
		<u-form :model="userInfo" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item label="真实姓名" prop="user_realName" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="请输入姓名" v-model="userInfo.user_realName" type="text"></u-input>
			</u-form-item>
			<u-form-item label="学生证号" prop="user_cardNumber" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="请输入学校简写+学生证号(例:fjut317191)" v-model="userInfo.user_cardNumber"
				 type="text"></u-input>
			</u-form-item>
			<u-form-item label="上传学生证" prop="user_card" label-width="200rpx" >
				<view style="position: relative;left: 280rpx;">
					<u-upload ref="uUpload" :file-list="fileList" :form-data="file_id" @on-success="onSuccess" @on-remove="onRemove" @on-list-change="onChange"
					 :action="action" max-count="1" :show-progress="false"></u-upload>
				</view>
			</u-form-item>
		</u-form>
		<view class="submit" @click="submit">
			<view class="text">
				<text>保存资料</text>
			</view>
		</view>
		<view class="result">
			<view v-if="userInfo.user_status==1" style="color:green">审核已通过</view>
			<view v-if="userInfo.user_status==2" style="color:red">正在审核中，请耐心等待！审核过程中可多次更改信息！</view>	
		</view>
		<u-toast ref="uToast" />
		<u-modal v-model="modelShow" :content="modelContent" @confirm="modelConfirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				fileList: [],
				rules: {
					user_realName: [{
						required: true,
						message: '请输入真实姓名',
						trigger: 'blur',
					}],
					user_cardNumber: [{
						required: true,
						message: '请输入学生账号',
						trigger: 'blur',
					}],
					user_card: [{
						required: true,
						message: '请上传学生证',
						trigger: 'blur',
					}],
				},
				border: false,
				errorType: ['toast'],
				modelShow:false,
				modelContent:"您已通过认证，是否修改信息重新认证？"
			};
		},
		onLoad() {
			this.init()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		computed: {
			action(){
				return this.$store.state.baseUrl + '/upload'
			},
			file_id() {
				return {
					'id': this.$store.state.userInfo.user_id + '_userCard'
				}
			}
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
						let userInfo = res.data;
						that.userInfo = userInfo;
						if (userInfo.user_card != "") {
							that.fileList.push({
								'url': userInfo.user_card
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
				this.userInfo.user_card=""
			},
			onChange(lists){
				let that=this
				if(lists.length>0){
					that.userInfo['user_card'] = that.$store.state.baseUrl+'/static/users/' + that.$store.state.userInfo.user_id +
						'_userCard.png'
				}
			},
			submit() {
				let that=this
				that.$refs.uForm.validate(valid => {
					if (valid) {
						if(that.userInfo.user_status==1){
							that.modelShow=true;
						}else{
							that.submit1()
						}
					}
				});
			},
			submit1() {
				let that=this
				that.$refs.uUpload.upload();
				let userInfo = that.userInfo
				userInfo['user_status']=2
				uni.request({
					url: that.$store.state.baseUrl+'/user',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data: userInfo,
					success: (res) => {
						if (res.data.user_id != "") {
							that.$refs.uToast.show({
								title: '修改成功',
								type: 'success',
								duration: 8000,
								callback: that.reload()
							})
							that.init()
						}else{
							that.$refs.uToast.show({
								title: '修改失败',
								type: 'error',
								duration: 8000,
								callback: that.reload()
							})
						}
					}
				})
			},
			modelConfirm(){
				let that=this
				that.userInfo.user_status=0
				that.modelShow=false
				that.submit1()
			},
			reload(){
				uni.redirectTo({
				    url: '/pages/person/certification/index'
				});
			}

		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.result{
		text-align: center;
		font-size: 40rpx;
		padding: 100rpx 80rpx;
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
