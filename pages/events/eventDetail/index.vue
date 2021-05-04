<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="comment">
			<view class="right">
				<view class="top" @click="findUser(userInfo.user_id)">
					<u-avatar :src="userInfo.user_ava"></u-avatar>
					<view class="name">{{ userInfo.user_name }}</view>

				</view>
				<view class="content">{{ eventInfo.event_info }}</view>
				<view class="reply-box" v-show="eventUrl!=''">
					<view v-if="eventUrl.length == 1" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click="previewImage(index1,eventUrl)" v-for="(res1, index1) in eventUrl" :src="res1" mode="aspectFill"
						 style="width: 100%;"></image>
					</view>
					<view v-if="eventUrl.length == 2 || eventUrl.length == 4" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click="previewImage(index1,eventUrl)" v-for="(res1, index1) in eventUrl" :src="res1" mode="aspectFill"
						 style="width:334rpx;height:334rpx;margin-bottom: 10rpx;"></image>
					</view>
					<view v-if="eventUrl.length == 3" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click="previewImage(index1,eventUrl)" v-for="(res1, index1) in eventUrl" :src="res1" mode="aspectFill"
						 style="width:220rpx;height:220rpx;margin-bottom: 10rpx;"></image>
					</view>
				</view>
				<view class="bottom">
					{{ eventInfo.event_time |timeFilters}}
				</view>
			</view>
		</view>


		<view v-show="eventInfo.event_type!='daily1' && userInfo.user_id!=userId && userStatus!=0">
			<view class="operation">
				<view class="right">
					<u-button @click="checkChatlist" type="success">联系TA</u-button>
				</view>
				<view class="left">
					<u-button @click="checkMark" type="warning">标记</u-button>
				</view>
			</view>
		</view>
	</view>



</template>

<script>
	import utils from "../../../common/utils.js"
	export default {
		filters: {
			timeFilters(val) {
				return utils.renderTime(val)
			},
		},
		computed: {
			userId() {
				return this.$store.state.userInfo.user_id
			},
			userStatus() {
				return this.$store.state.userInfo.user_status
			}
		},
		data() {
			return {
				selectType: '',
				userInfo: {},
				eventInfo: {},
				chatInfo:{},
				eventUrl: [],
				roomId:'',
			}
		},
		onLoad(options) {
			this.selectType = options.type
			this.init1(options.eventId)
			this.init2(options.userId)
		},
		methods: {
			init1(eventId) {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl+'/event/' + eventId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.eventInfo = res.data
						that.eventUrl = res.data.event_img.split(',')
					}
				})
			},
			init2(userId) {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl+'/user/' + userId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.userInfo = res.data
					}
				})
			},
			chatPage(){
				let that=this
				// let info=that.chatInfo
				// info.chatlist_del=1
				// uni.request({
				// 	url: that.$store.state.baseUrl+'/chatlist',
				// 	header: {
				// 		"Content-Type": "application/x-www-form-urlencoded"
				// 	},
				// 	method: 'PUT',
				// 	data: info,
				// 	success: (res) => {
				// 		if(res.data==""){
				// 			that.$refs.uToast.show({
				// 				title: '创建房间失败！',
				// 				type: 'error',
				// 			}) 
				// 		}
				// 	}
				// })
				uni.navigateTo({
					url: '../../news/chat/index?userId=' + that.userInfo.user_id + '&userName=' + that.userInfo.user_name + '&userAva=' + that.userInfo.user_ava + '&roomId=' + that.roomId
				})
			},
			//联系Ta
			chat(){
				let that=this
				uni.request({
					url: that.$store.state.baseUrl+'/chatlist',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data:{
						chatlist_userId1: that.userId,
						chatlist_userId2: that.userInfo.user_id	
					},
					success: (res) => {
						if(res.data==""){
							that.$refs.uToast.show({
								title: '创建房间失败！',
								type: 'error',
							})
						}else{
							that.roomId=res.data.chatlist_id
							that.chaiInfo=res.data
						}
					}
				})
			},
			checkChatlist(){
				let that=this
				uni.request({
					url: that.$store.state.baseUrl+'/chatlist/check?userId1=' + that.userId + '&userId2=' +that.userInfo.user_id,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						if(res.data==""){
							that.chat()
						}else{
							that.roomId=res.data[0].chatlist_id
							that.chaiInfo=res.data[0]
						}
						that.chatPage()
					}
				})
			},
			//检查是否标记
			checkMark(){
				let that = this
				uni.request({
					url: that.$store.state.baseUrl+'/mark/check?userId='+that.userId+'&eventId='+that.eventInfo.event_id,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						if(res.data!=""){
							that.$refs.uToast.show({
								title: '该事件已标记过！',
								type: 'warning',
							})
						}else{
							that.mark()
						}
					}
				})
			},
			//标记
			mark(){
				let that = this
				const markInfo={
					mark_userId: that.userId,
					mark_eventId: that.eventInfo.event_id,
				}
				uni.request({
					url: that.$store.state.baseUrl+'/mark',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					data: markInfo,
					method: 'POST',
					success: (res) => {
						if(res.data!=""){
							that.$refs.uToast.show({
								title: '标记成功',
								type: 'success',
							})
						}
					}
				})
			},
			
			findUser(userId) {
				uni.navigateTo({
					url: '../../userinfo/index?userId=' + userId
				})
			},
			//图片预览
			previewImage(current, photos) {
				uni.previewImage({
					current,
					urls: photos
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.operation {
		position: fixed;
		width: 100%;
		bottom: 60rpx;
		padding: 0rpx 30rpx;
		display: flex;
		flex-direction: row-reverse;

		.left {
			padding-right: 20rpx;
		}
	}

	.wrap {
		//padding: 10rpx;
		height: 100%;
		width: 100%;
	}

	.button {
		position: absolute;
		top: 35rpx;
		right: 30rpx;

	}

	.num {
		display: inline;
	}

	.comment {
		display: flex;
		//padding: 30rpx;
		margin-top: 10rpx;
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
					color: #5677fc;
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
				margin-bottom: 10rpx;
				margin-left: 10rpx;
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
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;
				position: absolute;
				padding-top: 90rpx;
				right: 30rpx;



				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}

				.weibo-handle {
					display: flex;
					position: absolute;
					right: 0;
					//padding-top: 15rpx;
					font-size: 28rpx;
					padding-bottom: 25rpx;
				}

				.weibo-handle image {
					width: 40rpx;
					height: 40rpx;
					//margin-right: 20rpx;
					margin-left: 20rpx;
				}

				.weibo-handle view {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
	}


	.reply {
		display: flex;
		//padding: 30rpx;
		margin-top: 10rpx;

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
				display: inline;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
					position: relative;
					left: 10rpx;
					color: #5677fc;
				}

				.time {
					position: relative;
					left: 10rpx;
					font-size: 20rpx;
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
				margin-bottom: 10rpx;
				margin-left: 10rpx;
				margin-top: 10rpx;
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
				margin-top: 20rpx;
				margin-left: 10rpx;
				display: flex;
				font-size: 24rpx;
				color: #eeeeee;
				margin-bottom: 10rpx;
				line-height: 50rpx;

				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}

			}
		}
	}
</style>
