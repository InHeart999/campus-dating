<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="user-wrap">
			<view class="info">
				<image class="avatar" mode="aspectFill" :src="ava"></image>
				<view class="nickname">{{username}}
					<u-icon size="30" name="../../../static/boy.png"></u-icon>
				</view>
				<view class="nickname">
					<u-tag :show="!status" text="未认证" shape="circle" type="error" />
					<u-tag :show="status" text="已认证" shape="circle" type="success" />
				</view>
			</view>
			<view class="info4" v-if="m_id != u_id">
				<u-button v-if="mode == 0" type="primary" shape="circle" size="mini" @click="focus(u_id)">关注</u-button>
				<u-button v-if="mode == 1" type="success" shape="circle" size="mini" @click="ufocus(u_id)">已关注</u-button>
			</view>
		</view>
		<u-gap height="20" bg-color="#ececec"></u-gap>
		<view class="production">
			<view class="p_title">个人简介</view>
			<u-line color="black" length="40%" margin="20rpx 30%"></u-line>
			<view class="p_content">这里数数刚好有十个字这里数数刚好有十个字这里数数刚好有十个字这里数数刚好有十个字这里数数刚好有十个字</view>
		</view>
		<view class="callUser">
			<u-button type="success" shape="circle">打个招呼</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				u_id: '',
				m_id: '',
				m_ava: require('static/ava01.png'),
				m_gender: '',
				m_name: '',
				mode: 0,
				ava: require('static/ava01.png'),
				username: 'name01',
				status:true,
				gender: '男',
				fans: '',
				urls: [],
				windowswidth: '',
				newwidth: '',
				two: '',
				scrollTop: 0,
				commentList: [],
				yuepaiList: [],
				list: [],
				current: 0
			}
		},
		onLoad(res) {
			//获取动态列表
			//console.log(res.u_id)
			// this.u_id = res.u_id;
			// this.getUser();
			//this.getTopic();
		},
		onPullDownRefresh: function() {
			// this.getUser();
			//this.getTopic();
		},
		methods: {
			//图片预览
			previewImage(current, photos) {
				uni.previewImage({
					current,
					urls: photos
				})
			},
			//发布
			btnClick() {
				uni.navigateTo({
					url: './pub'
				})
			},
			//信息初始化
			// getUser() {
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})
			// 	uni.getStorage({
			// 		key: 'userinfo',
			// 		success: (res) => {
			// 			this.m_id = res.data.openid
			// 			this.m_ava = res.data.avatarUrl
			// 			this.m_name = res.data.nickName
			// 			this.m_gender = res.data.gender
			// 			//console.log(this.m_id)

			// 			uni.request({
			// 				url: api.baseUrl+'/users/gettopic',
			// 				method: 'GET',
			// 				data: {
			// 					u_id: this.u_id,
			// 					m_id: this.m_id
			// 				},
			// 				success: (res) => {
			// 					this.commentList = res.data
			// 				}
			// 			})

			// 			uni.request({
			// 				url: api.baseUrl+'/users/getfocus',
			// 				method: 'POST',
			// 				data: {
			// 					u_id: this.u_id,
			// 					m_id: this.m_id,
			// 				},
			// 				success: (res) => {
			// 					//console.log(res)
			// 					if (res.data.length == 0) {
			// 						this.mode = 0
			// 					} else {
			// 						this.mode = 1
			// 					}
			// 				}
			// 			})

			// 		}
			// 	})

			// 	uni.request({
			// 		url: api.baseUrl+'/users/userinfo',
			// 		method: 'GET',
			// 		data: {
			// 			u_id: this.u_id,
			// 		},
			// 		success: (res) => {
			// 			console.log(res)
			// 			this.username = res.data[0].nickName;
			// 			this.ava = res.data[0].avatarUrl;
			// 			this.gender = res.data[0].gender;
			// 			this.fans = res.data[0].fans;
			// 			this.follow = res.data[0].follow;
			// 			uni.hideNavigationBarLoading();
			// 			uni.stopPullDownRefresh();
			// 			uni.hideLoading();
			// 		}
			// 	})
			// },
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
		height: 60vw;
		padding: 30rpx;
		z-index: 9;
		//border-radius: 0 0 20% 20%;
		//background: url('https://handsel.oss-cn-shenzhen.aliyuncs.com/1588938371592.jpg') no-repeat;
		//background-image: linear-gradient(to top right, #f7797d, #fbd786);
		background: #554d84;
		background-size: cover;

		.info2 {
			position: absolute;
			top: 250rpx;

			.identity {
				//color: #fff;
				font-size: 28rpx;
			}
		}

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
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}

			.nickname {
				color: #fff;
				font-size: 36rpx;
			}
		}

	}

	.callUser {
		margin: 50rpx 35%;
		width: 30%;
	}
</style>
