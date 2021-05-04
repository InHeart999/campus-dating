<template>
	<view class="wrap">
		<u-form :model="eventInfo" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item label="标题" prop="event_title" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="请输入标题" v-model="eventInfo.event_title" type="text"></u-input>
			</u-form-item>
			<u-form-item label="类别">
				<u-input input-align="right" :border="border" type="select" v-model="event_type" placeholder="请选择类别"
				 @click="actionShow"></u-input>
			</u-form-item>
			<u-form-item label="联系电话" prop="event_phone" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="联系方式(选填)" v-model="eventInfo.event_phone" type="text"></u-input>
			</u-form-item>
			<u-form-item label="信息描述" prop="event_info" label-width="200rpx">
				<u-input input-align="right" :border="border" placeholder="请输入描述信息(不得超过100字)" v-model="eventInfo.event_info" type="textarea"
				 maxlength="100" height="200"/>
			</u-form-item>
			<view style="position: relative;left: 150rpx;width: 500rpx">
				<u-upload ref="uUpload" :file-list="fileList" :form-data="files" @on-success="onSuccess" @on-remove="onRemove" :auto-upload="false"
				 @on-list-change="onChange" :action="action" max-count="4" :show-progress="false" width="200rpx" height="200rpx"></u-upload>
			</view>
		</u-form>
		<view class="submit" @click="submit">
			<view class="text">
				<text>修改</text>
			</view>
		</view>
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import utils from "../../../common/utils.js"
	export default {
		data() {
			return {
				files:{},
				fileCount:0,
				fileUrl:[],
				fileList:[],
				fileList1:[],
				eventInfo: {
					event_userId:'',
					event_title: '',
					event_type: '',
					event_phone: '',
					event_info: '',
					event_time: '',
					event_img: [],
					filesArr: []
				},
				rules: {
					event_title: [{
						required: true,
						message: '请输入标题',
						trigger: 'blur',
					},{
						max:10,
						message: '标题最多不超过10个字！',
						trigger: 'blur',
					}],
					event_phone: [{
						type: 'number',
						message: '手机号必须是数字',
						trigger: 'blur',
					},{
						len: 11,
						message: '手机号必须为11位！',
						trigger: 'blur'
					}],
					event_info: [{
						required: true,
						message: '请输入信息描述',
						trigger: 'blur'
					},{
						max:100,
						message:'内容最多不超过100个字',
						trigger: 'blur',
					}],
				},
				selectType: '',
				actionSheetList: [],
				actionSheetShow: false,
				border: false,
				show: false,
				errorType: ['toast'],
			};
		},
		computed: {
			action() {
				return this.$store.state.baseUrl + '/upload1'
			},
			user_id() {
				return this.$store.state.userInfo.user_id
			},
			event_type: {
				get() {
					return utils.typesFilters[this.eventInfo.event_type]
				},
				set(val) {
					return val
				}
			}
		},
		onLoad(options) {
			this.init(options.eventId)
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			init(eventId){
				let that=this
				uni.request({
					url: that.$store.state.baseUrl+'/event/' + eventId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						let type=res.data.event_type
						that.selectType= type.substr(0,type.length-1)
						if(res.data.event_img!=''){
							let fileList2= res.data.event_img.split(',')
							for(let file of fileList2){
								that.fileList.push({url:file})
								that.fileList1.push({url:file})
							}
						}
						that.eventInfo = res.data;
					}
				})
			},
			onSuccess(res, index, lists) {
				let that = this
				if(res==""){
					that.$refs.uToast.show({
						title: '上传失败',
						type: 'error',
					})
				}else{
					that.fileUrl.push(that.$store.state.baseUrl+'/static/events/'+that.user_id+res+'.png')
					that.fileCount--
					if(that.fileCount==0){
						that.submitform()
					}
				}
			},
			onRemove(index, lists) {
				this.fileList.splice(index,1)
				this.fileCount--;
			},
			onChange(lists) {
				if (lists.length > 0 ) {
					this.fileCount=lists.length
					this.files={id: this.user_id }
				}
			},
			submit() {
				let that = this
				that.eventInfo.event_time=utils.formatDateTime()
				if(that.fileCount!=0){
					console.log('submit1')
					that.$refs.uUpload.upload();
				}else{
					console.log('submit2')
					that.submitform()
				}
			},
			submitform(){
				let that=this
				that.$refs.uForm.validate(valid => {
					if (valid) {
						let eventInfo1 = that.eventInfo
						eventInfo1['event_img']=that.fileUrl
						uni.request({
							url: that.$store.state.baseUrl+'/event',
							header: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							method: 'PUT',
							data: eventInfo1,
							success: (res) => {
								if (res.data.event_id != "") {
									that.$refs.uToast.show({
										title: '修改成功',
										type: 'success',
										duration: 1000,
										url: '/pages/person/publish/index'
									})
								}else{
									that.$refs.uToast.show({
										title: '修改失败',
										type: 'error',
									})
								}
							}
						})
						
					}
				});
			},
			// 选择类别
			actionSheetCallback(index) {
				uni.hideKeyboard();
				this.eventInfo.event_type = this.selectType+((index+1).toString());
			},
			actionShow() {
				this.actionSheetShow = true;
				let arr = [];
				switch (this.selectType) {
					case 'daily':
						arr = [{
							text: '日常分享'
						}];
						break;
					case 'goods':
						arr = [{
							text: '寻找物主'
						}, {
							text: '寻找失物'
						}];
						break;
					case 'datas':
						arr = [{
							text: '求取资料'
						}, {
							text: '资料分享'
						}];
						break;
					case 'secondHand':
						arr = [{
							text: '二手求购'
						}, {
							text: '二手出售'
						}];
						break;
					case 'teams':
						arr = [{
							text: '活动拼团'
						}, {
							text: '活动组队'
						}];
						break;
					case 'recruitment':
						arr = [{
							text: '求职'
						}, {
							text: '招聘'
						}];
						break;
					case 'other':
						arr = [{
							text: '其它'
						}]
				}
				this.actionSheetList = arr;
			},
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
