<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="user-wrap">
			<view class="info">
				<image class="avatar" mode="aspectFill" :src="userInfo.user_ava"></image>
				<view class="nickname">{{userInfo.user_name}}
					<u-icon size="30" name="../../../static/boy.png"></u-icon>
				</view>
				<view class="nickname">
					<u-tag :show="!userInfo.user_status" text="未认证" shape="circle" type="error" />
					<u-tag :show="userInfo.user_status" text="已认证" shape="circle" type="success" />
				</view>
				<view v-show="userInfo.user_phone!=null && userInfo.user_phone!=''" class="phone">手机号码：{{userInfo.user_phone}}</view>
				<view v-show="userInfo.user_wx!=null && userInfo.user_wx!='' " class="phone">微信：{{userInfo.user_wx}}</view>
			</view>
		</view>
		<u-gap height="20" bg-color="#ececec"></u-gap>
		<view class="production">
			<view class="p_title">个人简介</view>
			<u-line color="black" length="40%" margin="20rpx 30%"></u-line>
			<view class="p_content">{{userInfo.user_info}}</view>
		</view>
		<view class="callUser">
			<u-button @click="checkChatlist" type="success" shape="circle">打个招呼</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
				chatInfo:{},
			}
		},
		onLoad(options) {
			this.init(options.userId)
		},
		methods: {
			init(userId){
				let that=this
				uni.request({
					url: that.$store.state.baseUrl+'/user/'+userId,
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
					url: '../news/chat/index?userId=' + that.userInfo.user_id + '&userName=' + that.userInfo.user_name + '&userAva=' + that.userInfo.user_ava + '&roomId=' + that.roomId
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
					url: that.$store.state.baseUrl+'/chatlist/check?userId1=' + that.$store.state.userInfo.user_id + '&userId2=' +that.userInfo.user_id,
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
	.production {
		margin: 20rpx 0rpx;
		text-align: center;

		.p_title {
			font-size: 36rpx;
			font-weight: bold;
		}

		.p_content {
			font-size: 32rpx;
			padding: 10rpx 100rpx;
		}
	}

	.comment2 {
		display: flex;
		padding: 30rpx;

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
			padding-left: 20rpx;
			font-size: 30rpx;

			.title {
				margin-bottom: 20rpx;
				margin-top: 15rpx;
				font-size: 35rpx;
				color: gray;
			}

			.top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;

				.name {
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
				display: flex;
				font-size: 24rpx;
				color: #9a9a9a;

				.reply {
					color: #5677fc;
					margin-left: 10rpx;
				}
			}
		}
	}

	.content1 {
		padding: 10px;
		background: #eeeeee;

		.cnt {
			padding: 10px;
			position: relative;

			.title {
				font-size: 15px;
			}

			.text {
				font-size: 15px;
				margin-top: 5px;
				display: flex;
				position: relative;
			}


		}
	}


	.contents {
		text-align: center;
	}

	.comment {
		background: #ffffff;
		display: flex;
		border-radius: 20rpx;
		//padding: 30rpx;
		//margin-top: 10rpx;
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
				margin-left: 10rpx;
				margin-top: 15rpx;
				margin-bottom: 15rpx;
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
			}
		}
	}



	.user-wrap {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 70vw;
		padding: 30rpx;
		z-index: 9;
		//border-radius: 0 0 20% 20%;
		//background: url('https://handsel.oss-cn-shenzhen.aliyuncs.com/1588938371592.jpg') no-repeat;
		//background-image: linear-gradient(to top right, #f7797d, #fbd786);
		background: #554d84;
		background-size: cover;


		.info4 {
			position: absolute;
			top: 300rpx;
		}

		.setting {
			color: #fff;
			position: absolute;
			top: 60rpx;
			left: 60rpx;
			font-size: 50rpx;
		}

		.info {
			position: absolute;
			text-align: center;
			top: 105rpx;

			.avatar {
				background-color: white;
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}

			.nickname {
				color: #fff;
				font-size: 36rpx;
			}
			.phone{
				color:#fff;
				font-size:30rpx;
				margin-top:25rpx;
			}
		}

	}

	.callUser {
		margin: 50rpx 35%;
		width: 30%;
	}
</style>
