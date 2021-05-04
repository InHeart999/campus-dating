<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<u-search class="search" height="96" v-model="selectCondition.keyword" @search="search"></u-search>
	
		<view class="comment" v-for="(res, index) in eventList" @click="comment(res)">
			<view class="right">
				<view style="display: flex;margin-left: 15rpx;margin-top: 15rpx;">
					<u-avatar @click.stop="findUser(res.user_id)" :src="res.user_ava"></u-avatar>
					<view style="flex: 1;margin-left: 20rpx;display: flex;flex-direction: column;">
						<view @click.stop="findUser(res.user_id)" style="display: flex;align-items: center;">{{res.user_name}}
							<u-icon style="margin-left: 10rpx;" v-show="res.user_sex == 1" size="30" name="../../../static/boy.png"></u-icon>
							<u-icon style="margin-left: 10rpx;" v-show="res.user_sex == 0" size="30" name="../../../static/girl.png"></u-icon>
						</view>
						<view style="display: flex;">
							<view>{{res.event_event_time |timeFilters}}
							</view>
						</view>
					</view>
				</view>
				<view class="content">{{ res.event_event_info }}</view>
				<view class="reply-box" v-show="res.event_event_img!=''">
					<view v-if="res.event_event_img.length == 1" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click.stop="previewImage(index1,res.event_event_img)" v-for="(res1, index1) in res.event_event_img" :src="res1" mode="aspectFill"
						 style="width: 100%;"></image>
					</view>
					<view v-if="res.event_event_img.length == 2 || res.event_event_img.length == 4" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click.stop="previewImage(index1,res.event_event_img)" v-for="(res1, index1) in res.event_event_img" :src="res1" mode="aspectFill"
						 style="width:334rpx;height:334rpx;margin-bottom: 10rpx;"></image>
					</view>
					<view v-if="res.event_event_img.length == 3" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
						<image @click.stop="previewImage(index1,res.event_event_img)" v-for="(res1, index1) in res.event_event_img" :src="res1" mode="aspectFill"
						 style="width:220rpx;height:220rpx;margin-bottom: 10rpx;"></image>
					</view>
				</view>
				<!-- <view style="margin-left: 20rpx;font-size: 25rpx;color: gray;margin-bottom: 10rpx;">
					<view>
						最新回复于{{res.rep_date}}
					</view>
				</view> -->
			</view>
		</view>
		<u-loadmore :status="status" />
		<u-modal v-model="modalInfo.show" :content="modalInfo.content" @confirm="modalConfirm"></u-modal>
	
	</view>
</template>

<script>
	import store from "../../store/index.js"
	import utils from "../../common/utils.js"
	export default {
		filters:{
			timeFilters(val){
				return utils.renderTime(val)
			}
		},
		data() {
			return {
				selectCondition:{
					keyword:'',
					count:0
				},
				eventUrl: [],
				status: 'loadmore',
				Page: '1',
				eventList: [],
				scrollTop: 0,
				current: 0,
				modalInfo:{
					show:false,
					content:"小程序将会自动绑定您的微信号！"
				}
			}
		},
		onLoad() {
			this.login()
			this.init()
		},
		
		onPullDownRefresh: function() {
			this.init()
		},
		
		//返回顶层
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			init() {
				let that=this
				uni.request({
					url: that.$store.state.baseUrl+'/event/findInner?keyword',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.eventList=res.data
						for(let event of res.data){
							event['event_event_img']=event['event_event_img'].split(',')
						}
					}
				})
			},
			
			search() {
				let that=this
				uni.request({
					url: that.$store.state.baseUrl+'/event/findInner?keyword='+that.selectCondition.keyword,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.eventList=res.data
						for(let event of res.data){
							event['event_event_img']=event['event_event_img'].split(',')
						}
					}
				})
			},
			
			login(){
				let that=this
				uni.login({
					provider: 'weixin',
					success: (res)=>{
						uni.request({
							url: that.$store.state.baseUrl+'/user/getOpenid?loginCode='+res.code,
							header: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							method: 'GET',
							success: (res) => {
								if(res.data!=""){	
									store.commit('getUserInfo',res.data)
								}else{
									that.modalInfo.show=true
								}
							}
						})
					},
					fail: (res) => {
						console.log(res,'fail')
					}
				})
			},
			
			modalConfirm(){
				this.login();
				this.modalInfo.show=false
			},
			
			//图片预览
			previewImage(current, photos) {
				uni.previewImage({
					current,
					urls: photos
				})
			},
			//个人中心
			findUser(userId) {
				uni.navigateTo({
					url: '../userinfo/index?userId=' + userId
				})
			},

			//评论详情
			comment(res) {
				uni.navigateTo({
					url: './comment/index?event_id='+res.event_event_id+'&user_id='+res.user_id+'&user_name='+res.user_name+'&user_ava='+res.user_ava
				})
			},
		}
	}
</script>


<style>
	page {
		background-color: #eeeeee;
	}
</style>

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
				margin-left: 20rpx;
				margin-top: 15rpx;
				margin-bottom: 45rpx;
				margin-right: 20rpx;
			}

			.reply-box {

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
