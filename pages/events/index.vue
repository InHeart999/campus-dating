<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<u-search class="search" height="96" v-model="keyword" search="search"></u-search>
		<view style="background: white;">
			<u-dropdown ref="uDropdown">
				<u-dropdown-item title="类型">
					<view class="slot-content">
						<view class="item-box">
							<view class="item" :class="[item.active ? 'active' : '']" @tap="tagClick(index)" v-for="(item, index) in typeList"
							 :key="item.label">
								{{item.label}}
							</view>
						</view>
						<u-button type="primary" @click="closeDropdown">确定</u-button>
					</view>
				</u-dropdown-item>
				<u-dropdown-item v-model="selectTime" title="时间" :options="timeList" @change="timeChange"></u-dropdown-item>
			</u-dropdown>
		</view>
		<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
			<view class="page-box">
				<view class="order" v-for="(res, index) in eventList" :key="res.id" @click="selectEvent">
					<view class="top">
						<view class="left">
							<u-icon name="volume-up" :size="30" color="rgb(94,94,94)"></u-icon>
							<view class="store">{{ res.title }}</view>
						</view>
						<view class="right">{{ res.time }}</view>
					</view>
					<view class="item">
						<view class="content">
							<view class="title u-line-2">{{ res.info }}</view>
						</view>
					</view>
					<view class="total">
						联系人:{{ res.phone}}
					</view>
					<view class="bottom">
						<view class="evaluate btn">{{res.type}}</view>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#f2f2f2"></u-loadmore>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectTime: 1,
				timeList: [{
					label: '全部',
					value: 1
				}, {
					label: '今天',
					value: 2
				}, {
					label: '最近3天',
					value: 3
				}, {
					label: '最近一周',
					value: 4
				}, {
					label: '最近一个月',
					value: 5
				}, ],
				typeList: [{
						label: '寻找物主',
						active: false,
					},
					{
						label: '寻找失物',
						active: false,
					},
					{
						label: '求取资料',
						active: false,
					},
					{
						label: '资料分享',
						active: false,
					},
					{
						label: '二手求购',
						active: false,
					},
					{
						label: '二手出售',
						active: false,
					},
					{
						label: '活动拼团',
						active: false,
					},
					{
						label: '活动组队',
						active: false,
					},
					{
						label: '其它(活动)',
						active: false,
					},
					{
						label: '求职',
						active: false,
					},
					{
						label: '招聘',
						active: false,
					},{
						label: '清空',
						active: false
					}
				],
				eventList:[{
					id: 1,
					title: "教学楼U盘",
					info: "今天是个好日子！今天是个好日子！今天是个好日子！",
					phone: 123456,
					type: "失物招领",
					time:"2021-2-2"
				}, {
					id: 2,
					title: "教学楼U盘",
					info: "今天是个好日子！今天是个好日子！今天是个好日子！",
					phone: 123456,
					type: "失物招领",
					time:"2021-2-2"
				}, {
					id: 3,
					title: "教学楼U盘",
					info: "今天是个好日子！今天是个好日子！今天是个好日子！",
					phone: 123456,
					type: "失物招领",
					time:"2021-2-2"
				}],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 'orange',
				yuepaicount: '',
				page: '1',
				flag: true,
				status: 'loadmore',
				u_id: '',
				scrollTop: 0,
				yuepaiList: [],
				//status: null,
				//标签索引

				text1: null,
				text2: null,
				text3: null,
				//标签


			}
		},
		// onLoad() {
		// 	this.getYuepai();
		// 	this.init();
		// },
		// onShow() {
		// 	this.getYuepai();
		// 	this.init();
		// },
		// onReachBottom() {
		// 	let a = (this.yuepaicount / 10)
		// 	console.log(a)


		//console.log(this.page)
		// 	if (this.page < a) {
		// 		setTimeout(() => {

		// 			this.page++
		// 			//console.log(this.page)
		// 			uni.request({
		// 				url: api.baseUrl + '/users/select',
		// 				method: 'POST',
		// 				data: {
		// 					text1: this.text1,
		// 					text2: this.text2,
		// 					text3: this.text3,
		// 					page: this.page
		// 				},
		// 				success: (res) => {
		// 					console.log(res)

		// 					this.yuepaiList = res.data

		// 					if (this.page >= a) {
		// 						this.status = 'nomore'
		// 						return
		// 					}
		// 				}
		// 			})

		// 			this.status = 'loading'
		// 		}, 1500)
		// 	}
		// },
		// onPullDownRefresh: function() {
		// 	this.page = '1'
		// 	this.flag = true
		// 	this.getYuepai();
		// },
		// onPageScroll(e) {
		// 	this.scrollTop = e.scrollTop;
		// },
		methods: {
			tagClick(index) {
				this.typeList[index].active = !this.typeList[index].active;
				console.log(this.typeList[index])
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			reachBottom() {
				console.log("reachBottom")
			},
			selectEvent() {
				uni.navigateTo({
					url:'./eventDetail/index'
				})
			}
			// init() {
			// 	uni.getStorage({
			// 		key: 'userinfo',
			// 		success: (res) => {
			// 			this.u_id = res.data.openid
			// 			uni.request({
			// 				url: api.baseUrl + '/user',
			// 				method: 'GET',
			// 				data: {
			// 					openid: this.u_id
			// 				},
			// 				success: (res) => {
			// 					this.status = res.data[0].status;
			// 				}
			// 			})
			// 		},
			// 		fail: (res) => {
			// 			uni.showToast({
			// 				title: '您尚未登录，请登录后操作！'
			// 			})
			// 		}
			// 	})
			// 	uni.request({
			// 		url: api.baseUrl + '/getyuepai',
			// 		method: 'GET',
			// 		success: (res) => {
			// 			this.yuepaicount = res.data[0].count
			// 			//console.log(this.yuepaicount)
			// 		}
			// 	})
			// },
			// place() {
			// 	uni.navigateTo({
			// 		url: 'place/place'
			// 	})
			// },
			// model() {
			// 	uni.navigateTo({
			// 		url: 'model/model'
			// 	})
			// },
			// photo() {
			// 	uni.navigateTo({
			// 		url: 'photo/photo'
			// 	})
			// },
			// qiandao() {
			// 	if (this.status == 0) {
			// 		uni.request({
			// 			url: api.baseUrl + '/qiandao',
			// 			method: 'POST',
			// 			data: {
			// 				id: this.u_id
			// 			},
			// 			success: (res) => {
			// 				if (res.data.code == 1) {
			// 					this.$refs.uToast.show({
			// 						title: '签到成功,积分+1',
			// 						type: 'success'
			// 					})
			// 					this.init();
			// 				} else if (res.data.code == 0) {
			// 					this.$refs.uToast.show({
			// 						title: '签到失败',
			// 						type: 'error'
			// 					})
			// 				}
			// 			}
			// 		})
			// 	} else {
			// 		this.$refs.uToast.show({
			// 			title: '您今天已完成签到！',
			// 			type: 'warning'
			// 		})
			// 	}

			// },
			// previewImage(current, photos) {

			// 	//console.log(current)
			// 	//console.log(photos)



			// 	// const urls = 
			// 	uni.previewImage({
			// 		current,
			// 		urls: photos
			// 	})
			// },
			// userinfo(res) {
			// 	//console.log(res)
			// 	uni.navigateTo({
			// 		url: '../user/userinfo/userinfo?u_id=' + res
			// 	})
			// },
			// //点击详情页
			// console(res) {
			// 	//console.log(res)
			// 	uni.navigateTo({
			// 		url: './detail/detail?id=' + res
			// 	})
			// },
			// //发布
			// btnClick() {
			// 	uni.navigateTo({
			// 		url: './publish/publish'
			// 	})
			// },
			// //读取约拍动态
			// getYuepai() {
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})

			// 	uni.request({
			// 		url: api.baseUrl + '/users/select',
			// 		method: 'POST',
			// 		data: {
			// 			text1: this.text1,
			// 			text2: this.text2,
			// 			text3: this.text3,
			// 			page: this.page
			// 		},
			// 		success: (res) => {
			// 			//console.log(res.data)
			// 			this.yuepaiList = res.data
			// 			uni.hideNavigationBarLoading();
			// 			uni.stopPullDownRefresh();
			// 			uni.hideLoading();
			// 		}
			// 	})
			// },
			// //点击下拉标签事件
			// change1(res) {
			// 	if (res == 1) {
			// 		this.text1 = null
			// 		this.page = '1'
			// 		//console.log(this.text1)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 2) {
			// 		this.page = '1'
			// 		this.text1 = '摄影师'
			// 		//console.log(this.text1)
			// 		//console.log(this.text1, this.text2, this.text3)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 3) {
			// 		this.page = '1'
			// 		this.text1 = '模特'
			// 		//console.log(this.text1)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 4) {
			// 		this.page = '1'
			// 		this.text1 = '化妆师'
			// 		//console.log(this.text1)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 5) {
			// 		this.page = '1'
			// 		this.text1 = '摄像师'
			// 		//console.log(this.text1)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 6) {
			// 		this.page = '1'
			// 		this.text1 = '商家'
			// 		//console.log(this.text1)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 7) {
			// 		this.page = '1'
			// 		this.text1 = '修图师'
			// 		//console.log(this.text1)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	}
			// },
			// change2(res) {
			// 	if (res == 1) {
			// 		this.page = '1'
			// 		this.text2 = null
			// 		//console.log(this.text2)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 2) {
			// 		this.page = '1'
			// 		this.text2 = '男'
			// 		//console.log(this.text2)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	} else if (res == 3) {
			// 		this.page = '1'
			// 		this.text2 = '女'
			// 		//console.log(this.text2)
			// 		uni.request({
			// 			url: api.baseUrl + '/users/select',
			// 			method: 'POST',
			// 			data: {
			// 				text1: this.text1,
			// 				text2: this.text2,
			// 				text3: this.text3,
			// 				page: this.page
			// 			},
			// 			success: (res) => {
			// 				this.yuepaiList = res.data
			// 			}
			// 		})
			// 	}

			// },
		}

	}
</script>

<style lang="scss" scoped>
	.slot-content {
		background-color: #FFFFFF;
		padding: 24rpx;

		.item-box {
			margin-bottom: 50rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				border: 1px solid $u-type-primary;
				color: $u-type-primary;
				padding: 8rpx 40rpx;
				border-radius: 100rpx;
				margin-top: 30rpx;
			}

			.active {
				color: #FFFFFF;
				background-color: $u-type-primary;
			}
		}
	}


	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;
		.top {
			display: flex;
			justify-content: space-between;
			.left {
				display: flex;
				align-items: center;
				.store {
					margin: 0 10rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}
			.right {
				color: $u-type-warning-dark;
			}
		}
		.item {
			display: flex;
			margin: 20rpx 0 0;
			.left {
				margin-right: 20rpx;
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}
			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}
				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}
				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}
			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;
				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}
				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}
		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;
			.total-price {
				font-size: 32rpx;
			}
		}
		.bottom {
			display: flex;
			margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;
			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}
			.evaluate {
				color: $u-type-warning-dark;
				border-color: $u-type-warning-dark;
			}
		}
	}
	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		background: #eeeeee;
	}
</style>
