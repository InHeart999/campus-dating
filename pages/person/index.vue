<template>
	<view style="width: 100%;">
		<view class="header">
			<u-toast ref="uToast" />
			<view class="userinfo">
				<view class="face" @click="modify">
					<image :src="user_ava"></image>
				</view>
				<view class="info">
					<view class="username">{{user_name}}
						<image v-show="user_sex==1" src="../../static/boy.png"></image>
						<image v-show="user_sex==0" src="../../static/girl.png"></image>
					</view>
					<view class="setting">
						<u-tag :show="!user_status" text="未认证" shape="circle" type="error" />
						<u-tag :show="user_status" text="已认证" shape="circle" type="success" />
					</view>
				</view>
			</view>

			<view class="fans">
				<view class="fan">
					温馨提示：学生证仅供认证，不会另作它用！
				</view>
			</view>
		</view>

		<u-gap height="30" bg-color="#ececec"></u-gap>


		<view class="list">
			<view class="li" hover-class="hover" @click="modify">
				<view class="icon">
					<image src="../../static/ziliao.png"></image>
				</view>
				<view class="text">个人资料</view>
			</view>
			<view class="li" hover-class="hover" @click="publish">
				<view class="icon">
					<image src="../../static/publish.png"></image>
				</view>
				<view class="text">我的发布</view>
			</view>
			<view class="li" hover-class="hover" @click="mark">
				<view class="icon">
					<image src="../../static/mark.png"></image>
				</view>
				<view class="text">我的标记</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				// user_name: "",
				// user_ava: "",
				// user_sex:"",
				user_status: false,
			};
		},
		computed: { ...mapState({
				user_name: state => state.userInfo.user_name,
				user_ava: state => state.userInfo.user_ava,
				user_sex: state => state.userInfo.user_sex,
			})
		},
		// computed: {
		// 	...mapState({
		// 		userInfo: state => state.userInfo,
		// 	})
		// },
		onLoad() {
			this.init();
		},
		onShow() {
			this.init();
		},
		methods: {
			//信息初始化
			init() {

			},
			modify() {
				uni.navigateTo({
					url: './modify/index'
				})
			},
			publish() {
				uni.navigateTo({
					url: './publish/index'
				})
			},
			mark() {
				uni.navigateTo({
					url: './mark/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff
	}

	.header {
		position: relative;
		background: #554d84;
		width: 100%;
		height: 55vw;
		display: flex;
		align-items: center;

		.userinfo {
			position: absolute;
			top: 100rpx;
			left: 80rpx;
			//width: 100%;
			display: flex;

			.face {
				flex-shrink: 0;
				width: 15vw;
				height: 15vw;

				image {
					width: 100%;
					height: 100%;
					border-radius: 100%
				}
			}

			.info {
				display: flex;
				flex-flow: wrap;
				padding-left: 30upx;

				.username {
					width: 100%;
					color: #fff;
					font-size: 40upx;

					image {
						width: 5vw;
						height: 5vw;
						z-index: 9;
					}
				}

				.grade {
					display: flex;
					align-items: center;
					padding: 10 20upx;
					height: 60upx;
					color: #fff;
					background-color: rgba(0, 0, 0, 0.1);
					border-radius: 20upx;
					font-size: 24upx
				}

				.setting {
					margin-left: 180rpx;
					color: white;
					font-size: 40rpx;
				}
			}
		}



		.fans {
			position: absolute;
			display: flex;
			width: 100%;
			bottom: 30rpx;

			.fan {
				flex: auto;
				height: 100%;
				text-align: center;
				color: white;
				font-size: 30rpx;
			}
		}
	}

	.hover {
		background-color: #eee
	}

	.orders {
		background-color: #554d84;
		width: 100%;
		height: 11vw;
		padding: 0 4%;
		margin-bottom: calc(11vw + 40upx);
		display: flex;
		align-items: flex-start;
		border-radius: 0 0 100% 100%;
		margin-top: -1upx;

		.box {
			width: 100%;
			padding: 0 1%;
			height: 22vw;
			background-color: #fefefe;
			border-radius: 24upx;
			box-shadow: 0 0 20upx rgba(0, 0, 0, 0.15);
			margin-bottom: 40upx;
			display: flex;
			align-items: center;
			justify-content: center;

			.label {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-flow: wrap;
				width: 100%;
				height: 16vw;
				color: #666666;
				font-size: 26upx;

				.icon {
					position: relative;
					width: 7vw;
					height: 7vw;
					margin: 0 1vw;

					.badge {
						position: absolute;
						width: 4vw;
						height: 4vw;
						background-color: #ec6d2c;
						top: -1vw;
						right: -1vw;
						border-radius: 100%;
						font-size: 20upx;
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 10;
					}

					image {
						width: 7vw;
						height: 7vw;
						z-index: 9;
					}
				}
			}
		}
	}



	.list {
		width: 100%;

		.li {
			width: 100%;
			height: 100upx;
			padding: 0 4%;
			border-bottom: solid 1upx #e7e7e7;
			display: flex;
			align-items: center;

			&.noborder {
				border-bottom: 0
			}

			.icon {
				flex-shrink: 0;
				width: 50upx;
				height: 50upx;

				image {
					width: 50upx;
					height: 50upx
				}
			}

			.text {
				padding-left: 20upx;
				width: 100%;
				color: #666
			}

			.to {
				flex-shrink: 0;
				width: 40upx;
				height: 40upx
			}
		}
	}
</style>
