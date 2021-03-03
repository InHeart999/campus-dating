<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<u-search class="search" height="96" v-model="keyword" search="search"></u-search>

		<view class="comment" v-for="(res, index) in commentList" @click.stop="comment(res)">
			<view class="right">
				<view style="display: flex;margin-left: 15rpx;margin-top: 15rpx;">
					<u-avatar @click="userinfo(res)" :src="res.u_ava"></u-avatar>
					<view style="flex: 1;margin-left: 20rpx;display: flex;flex-direction: column;">
						<view style="display: flex;align-items: center;">{{res.u_name}}
							<u-icon style="margin-left: 10rpx;" v-show="res.u_gender == '男'" size="30" name="../../../static/boy.png"></u-icon>
							<u-icon style="margin-left: 10rpx;" v-show="res.u_gender == '女'" size="30" name="../../../static/girl.png"></u-icon>
						</view>
						<view style="display: flex;">
							<view>{{res.pub_date}}
							</view>
						</view>
					</view>
				</view>
				<view class="content">{{ res.content }}</view>
				<view class="reply-box" v-if="res.url != false">
					<view v-if="res.url.length == 1" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click="previewImage(index1,res.url)" v-for="(res1, index1) in res.url" :src="res1" mode="aspectFill"
						 style="width: 100%;"></image>
					</view>
					<view v-if="res.url.length == 2 || res.url.length == 4" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click="previewImage(index1,res.url)" v-for="(res1, index1) in res.url" :src="res1" mode="aspectFill"
						 style="width:334rpx;height:334rpx;margin-bottom: 10rpx;"></image>
					</view>
					<view v-if="res.url.length == 3" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click="previewImage(index1,res.url)" v-for="(res1, index1) in res.url" :src="res1" mode="aspectFill"
						 style="width:220rpx;height:220rpx;margin-bottom: 10rpx;"></image>
					</view>
				</view>
				<view style="margin-left: 20rpx;font-size: 25rpx;color: gray;margin-bottom: 10rpx;">
					<view>
						最新回复于{{res.rep_date}}
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" />

	</view>
</template>

<script>
	import store from '../../store/index.js'
	export default {
		data() {
			return {
				userInfo:{},
				keyword: '',
				topiccount: '',
				followtopiccount: '',
				status: 'loadmore',
				isLike: false,
				isSc: false,
				u_id: '',
				Page: '1',
				Fpage: '1',
				urls: [],
				windowswidth: '',
				newwidth: '',
				two: '',
				scrollTop: 0,
				commentList: [{
					id: 1,
					u_id: 'xx',
					u_name: 'name01',
					u_ava: '../../../static/ava01.png',
					u_gender: '男',
					content: '今天是个好日子！',
					com_num: 10,
					like_num: 66,
					pub_date: '2021-01-05 16:36:41',
					url: [require('static/test01.png')],
					rep_date: '2021-01-05 16:36:41'
				}, {
					id: 2,
					u_id: 'xx',
					u_name: 'name01',
					u_ava: '../../../static/ava01.png',
					u_gender: '男',
					content: '今天是个好日子！',
					com_num: 10,
					like_num: 66,
					pub_date: '2021-01-05 16:36:41',
					url: [require('static/test01.png'), require('static/test02.png')],
					rep_date: '2021-01-05 16:36:41'
				}, {
					id: 3,
					u_id: 'xx',
					u_name: 'name01',
					u_ava: '../../../static/ava01.png',
					u_gender: '男',
					content: '今天是个好日子！',
					com_num: 10,
					like_num: 66,
					pub_date: '2021-01-05 16:36:41',
					url: [require('static/test01.png'), require('static/test02.png'), require('static/test01.png')],
					rep_date: '2021-01-05 16:36:41'
				}, {
					id: 4,
					u_id: 'xx',
					u_name: 'name01',
					u_ava: '../../../static/ava01.png',
					u_gender: '男',
					content: '今天是个好日子！',
					com_num: 10,
					like_num: 66,
					pub_date: '2021-01-05 16:36:41',
					url: [require('static/test01.png'), require('static/test02.png'), require('static/test01.png'), require(
						'static/test02.png')],
					rep_date: '2021-01-05 16:36:41'
				}],
				flag: true,
				flag2: true,
				current: 0
			}
		},
		onLoad() {
			let that = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					// 获取用户信息				
					uni.getUserInfo({
						provider: 'weixin',
						success: function(res) {
							store.commit('getUserInfo',res.userInfo) 
						}
					});
				}
			});
			//获取动态列表
			// this.getComment();
			// this.get();
		},
		onShow() {
			// this.getComment();
			// this.get();
		},
		onPullDownRefresh: function() {
			// this.Page = '1'
			// this.Fpage = '1'
			// this.getComment();
			// this.get();

		},
		//触底事件
		// onReachBottom() {
		// 	let a = (this.topiccount / 10)
		// 	let b = (this.followtopiccount / 10)
		// 	//console.log(b)
		// 	//console.log(a)
		// 	if (this.current == 0 && this.Page < a) {
		// 		this.Page++
		// 		console.log(this.Page)
		// 		setTimeout(() => {
		// 			if (this.flag) {
		// 				uni.request({
		// 					url: api.baseUrl+'/topic',
		// 					method: 'GET',
		// 					data: {
		// 						Page: this.Page,
		// 						u_id: this.u_id
		// 					},
		// 					success: (res) => {
		// 						//console.log(res.data)
		// 						this.commentList = res.data

		// 						if (this.Page >= a) {
		// 							this.status = 'nomore'
		// 							return
		// 						}
		// 					}
		// 				})
		// 			}

		// 			this.status = 'loading';
		// 		}, 1500)
		// 	} else if (this.current == 1 && this.Fpage < b) {
		// 		this.Fpage++
		// 		console.log(this.Fpage)
		// 		setTimeout(() => {

		// 			uni.request({
		// 				url: api.baseUrl+'/followtopic',
		// 				method: 'GET',
		// 				data: {
		// 					Fpage: this.Fpage,
		// 					u_id: this.u_id
		// 				},
		// 				success: (res) => {
		// 					//console.log(res.data)

		// 					this.commentList = res.data

		// 					if (this.Fpage >= b) {
		// 						this.status = 'nomore'
		// 					}

		// 				}
		// 			})


		// 			this.status = 'loading';
		// 		}, 1500)
		// 	}

		// },
		//返回顶层
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			search() {
				console.log('search')
			},
			//获取数据条数
			// get() {
			// 	uni.request({
			// 		url: api.baseUrl+'/gettopic',
			// 		method: 'GET',
			// 		success: (res) => {
			// 			this.topiccount = res.data[0].count
			// 			//console.log(this.topiccount)
			// 		}
			// 	})
			// 	uni.request({
			// 		url: api.baseUrl+'/getfollowtopic',
			// 		method: 'GET',
			// 		data: {
			// 			u_id: this.u_id
			// 		},
			// 		success: (res) => {
			// 			//console.log(res)
			// 			this.followtopiccount = res.data[0].count
			// 		}
			// 	})
			// },
			//取消点赞
			// unLike(res) {
			// 	console.log('取消点赞')
			// 	let t_id = res
			// 	uni.request({
			// 		url: api.baseUrl+'/udianzan',
			// 		method: 'POST',
			// 		data: {
			// 			id: t_id,
			// 			u_id: this.u_id
			// 		},
			// 		success: (res) => {
			// 			if (res.data.code == '1') {
			// 				this.getComment();
			// 				// this.$refs.uToast.show({
			// 				// 	title: '取消点赞',
			// 				// 	type: 'warning',
			// 				// 	duration: '1000'
			// 				// })
			// 			}

			// 		}
			// 	})
			// },
			//点赞
			// getLike(res) {
			// 	let t_id = res
			// 	uni.request({
			// 		url: api.baseUrl+'/dianzan',
			// 		method: 'POST',
			// 		data: {
			// 			id: t_id,
			// 			u_id: this.u_id
			// 		},
			// 		success: (res) => {
			// 			if (res.data.code == '1') {
			// 				this.getComment();
			// 				// this.$refs.uToast.show({
			// 				// 	title: '点赞成功',
			// 				// 	type: 'success',
			// 				// 	duration: '1000'
			// 				// })
			// 			}

			// 		}
			// 	})
			// },
			//图片预览
			previewImage(current, photos) {
				// const urls = 
				uni.previewImage({
					current,
					urls: photos
				})
			},
			//个人中心
			userinfo(res) {
				uni.navigateTo({
					url: '../userinfo/index?u_id=' + res.u_id
				})
			},

			//评论详情
			comment(res) {
				uni.navigateTo({
					url: './comment/index?id=' + res.id + '&name=' + res.u_name
				})
			},
			//信息初始化			
			// getComment() {
			// 	uni.getStorage({
			// 		key: 'userinfo',
			// 		success: (res) => {
			// 			this.u_id = res.data.openid;
			// 			this.get();
			// 			if (this.current == 1) {
			// 				uni.request({
			// 					url: api.baseUrl+'/followtopic',
			// 					method: 'GET',
			// 					data: {
			// 						u_id: this.u_id,
			// 						Fpage: this.Fpage
			// 					},
			// 					success: (res) => {

			// 						this.commentList = res.data
			// 						uni.hideNavigationBarLoading();
			// 						uni.stopPullDownRefresh();
			// 						uni.hideLoading();
			// 					}
			// 				})
			// 			} else if (this.current == 0) {
			// 				uni.request({
			// 					url: api.baseUrl+'/topic',
			// 					method: 'GET',
			// 					data: {
			// 						Page: this.Page,
			// 						u_id: this.u_id
			// 					},
			// 					success: (res) => {

			// 						//console.log(res.data)
			// 						this.commentList = res.data;
			// 						//console.log(this.commentList)
			// 						uni.hideNavigationBarLoading();
			// 						uni.stopPullDownRefresh();
			// 						uni.hideLoading();
			// 					}
			// 				})
			// 			}
			// 		},
			// 		fail: (res) => {
			// 			uni.showToast({
			// 				title: '您尚未登录！'
			// 			})
			// 			setTimeout(() => {
			// 				uni.navigateTo({
			// 					url: '../user/login'
			// 				})
			// 			}, 1500)
			// 		}
			// 	})
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})

			// }

		}
	}
</script>


<style lang="scss" scoped>
	.num {
		display: inline;
	}

	.wrap {
		background: #eeeeee;
		height: 100%;
		width: 100%;

		.search {
			margin-top: 100rpx;
		}
	}

	.comment {
		margin-top: 20rpx;
		background: #ffffff;
		display: flex;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;

		.grid-text {
			font-size: 28rpx;
			margin-top: 4rpx;
			color: $u-type-info;
		}

		.pic {
			.img_wrapper {
				width: 220upx;
				height: 150upx;
				margin-right: 15upx;
				display: inline-block;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.left {
			image {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				background-color: #f2f2f2;
			}
		}

		.right {
			flex: 1;
			//padding-left: 20rpx;
			font-size: 30rpx;

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
					position: absolute;
					left: 110rpx;

				}

				.like {
					display: flex;
					align-items: center;
					color: #9a9a9a;
					font-size: 26rpx;

					.num {
						margin-right: 4rpx;
						color: #9a9a9a;
					}
				}

				.highlight {
					color: #5677fc;

					.num {
						color: #5677fc;
					}
				}
			}

			.content {
				//margin-bottom: 10rpx;
				margin-left: 20rpx;
				margin-top: 15rpx;
				margin-bottom: 15rpx;
				margin-right: 20rpx;
			}

			.reply-box {
				//background-color: rgb(242, 242, 242);
				//border-radius: 12rpx;

				.item {
					padding: 20rpx;
					border-bottom: solid 2rpx $u-border-color;

					.username {
						font-size: 24rpx;
						color: #999999;
					}
				}

				.all-reply {
					padding: 20rpx;
					display: flex;
					color: #5677fc;
					align-items: center;

					.more {
						margin-left: 6rpx;
					}
				}
			}

			.test {
				float: left;
				padding: 15rpx;
			}

			.img {
				display: flex;
			}

			.bottom {
				//margin-top: 20rpx;
				// margin-left: 10rpx;
				// display: flex;
				// font-size: 24rpx;
				// color: #9a9a9a;
				// margin-bottom: 10rpx;

				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}

				.weibo-handle {
					display: flex;
					//padding-top: 15rpx;
					font-size: 28rpx;
					padding-bottom: 25rpx;
				}

				.weibo-handle image {
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}

				.weibo-handle view {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.weibo-handle .comment-group {
					background: #ffffff;
				}

				.weibo-handle .praise-group {
					background: #ffffff;
				}

				// .weibo-handle .favor{
				// 	background: #ffffff;
				// }
			}
		}
	}
</style>
