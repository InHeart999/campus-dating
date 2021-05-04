<template>
	<view class="recommended">
		<view v-show="user_status!=1">
			<un-authorized @authorized="authorized"></un-authorized>
		</view>
		<view v-show="user_status==1">
			<u-notice-bar type="error" mode="horizontal" :list="list"></u-notice-bar>
			<view class="card">
				<view class="card-item" @click="publish('daily')">
					<view style="margin-left: 30rpx;">
						<u-icon size="170" name="../../../static/publish.png"></u-icon>
					</view>
				
					<view class="text1" style="margin-left: 25rpx;">日常分享
						<view class="text">
							同学们都来分享点校园新鲜事吧！
						</view>
					</view>
				</view>
				
				<view class="card-item" @click="publish('goods')">
					<view style="margin-left: 30rpx;">
						<u-icon size="170" name="../../../static/xiaoyuan.png"></u-icon>
					</view>

					<view class="text1" style="margin-left: 25rpx;">发布失物信息
						<view class="text">
							请注明丢失物品，丢失地点、联系方式等信息！
						</view>
					</view>
				</view>
				<view class="card-item" @click="publish('datas')">
					<view style="margin-left: 30rpx;">
						<u-icon size="150" name="../../../static/xiangji.png"></u-icon>
					</view>

					<view class="text1">发布资料信息
						<view class="text">
							请注明资料名称、内容简介等信息！
						</view>
					</view>
				</view>
				<view class="card-item" @click="publish('secondHand')">
					<view style="margin-left: 30rpx;">
						<u-icon size="150" name="../../../static/xiangce.png"></u-icon>
					</view>

					<view class="text1">
						发布二手物品
						<view class="text">
							请注明物品信息、物品新旧程度等信息！
						</view>
					</view>
				</view>
				<view class="card-item" @click="publish('teams')">
					<view style="margin-left: 30rpx;">
						<u-icon size="150" name="../../../static/didian.png"></u-icon>
					</view>

					<view class="text1">发布拼团信息
						<view class="text">
							请注明团体项目、团队人数等信息！
						</view>
					</view>
				</view>

				<view class="card-item" @click="publish('recruitment')">
					<view style="margin-left: 30rpx;">
						<u-icon size="150" name="../../../static/dd.png"></u-icon>
					</view>

					<view class="text1">发布招聘信息
						<view class="text">
							请注明具体工作、联系方式等信息！
						</view>
					</view>
				</view>
				
				<view class="card-item" @click="publish('other')">
					<view style="margin-left: 30rpx;">
						<u-icon size="150" name="../../../static/help.png"></u-icon>
					</view>
				
					<view class="text1">发布其它信息
						<view class="text">
							若以上没有找到合适选项，请选择此项！
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	import UnAuthorized from '../../components/UnAuthorized/UnAuthorized.vue'
	//VM：协调者调度器
	export default {
		components:{
			UnAuthorized
		},
		//Model所有的数据
		data() {
			return {
				list: [
					'诚邀各位同学共建绿色平台，严禁发布违法违规内容！！！'
				]
			}
		},
		computed:{
			user_status(){
				return this.$store.state.userInfo.user_status
			}
		},
		methods: {
			authorized(){
				uni.navigateTo({
					url: '../person/certification/index'
				})
			},
			publish(type) {
				uni.navigateTo({
					url: './eventDescription/index?type=' + type
				})
			},
		}
	}
</script>


<style lang="scss" scoped>
	@keyframes fade-in {
		0% {
			opacity: 0;
		}

		/*初始状态 透明度为0*/
		40% {
			opacity: 0;
		}

		/*过渡状态 透明度为0*/
		100% {
			opacity: 1;
		}

		/*结束状态 透明度为1*/
	}

	@-webkit-keyframes fade-in {

		/*针对webkit内核*/
		0% {
			opacity: 0;
		}

		40% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.recommended {
		animation: fade-in;
		/*动画名称*/
		animation-duration: 1.5s;
		/*动画持续时间*/
		-webkit-animation: fade-in 1.5s;
		/*针对webkit内核*/
	}



	.recommended {
		.card {
			width: 100%;
			height: 100vh;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 0;
			padding: 10rpx 30rpx;
			box-sizing: border-box;
			background: #eeeeee;

			.card-item {
				//position: relative;
				background: #ffffff;
				width: 100%;
				height: 22vh;
				//border: 1px solid red;
				margin-top: 20rpx;
				//background-image: linear-gradient(to top right, #f7797d, #fbd786);
				border-radius: 15rpx;
				box-shadow: 0 0 5px 3px #c8c8c8;
				display: flex;
				align-items: center;

				.text1 {
					margin-left: 45rpx;
					font-size: 40rpx;
					margin-top: -25rpx;

					.text {
						font-size: 25rpx;
						color: gray;
					}
				}




















			}
		}
	}
</style>
