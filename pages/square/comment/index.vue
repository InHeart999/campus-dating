<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<scroll-view scroll-y="true" :scroll-top="scrollTop" style="height:1080rpx">
			<view class="comment">
				<view class="right">
					<view class="top" @click="findUser(userInfo.user_id)">
						<u-avatar :src="userInfo.user_ava"></u-avatar>
						<view class="name">{{ userInfo.user_name }}</view>

					</view>
					<view class="content">{{ eventInfo.event_info }}</view>
					<view v-show="eventInfo.event_img[0]!=''">
						<view class="reply-box">
							<view v-if="eventInfo.event_img.length == 1" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
								<image @click="previewImage(index1,eventInfo.event_img)" v-for="(res1, index1) in eventInfo.event_img" :src="res1"
								 mode="aspectFill" style="width: 100%;"></image>
							</view>
							<view v-if="eventInfo.event_img.length == 2 || eventInfo.event_img.length == 4" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
								<image @click="previewImage(index1,eventInfo.event_img)" v-for="(res1, index1) in eventInfo.event_img" :src="res1"
								 mode="aspectFill" style="width:334rpx;height:334rpx;margin-bottom: 10rpx;"></image>
							</view>
							<view v-if="eventInfo.event_img.length == 3" style="padding: 20rpx;display: flex;justify-content: space-between;flex-wrap: wrap;">
								<image @click="previewImage(index1,eventInfo.event_img)" v-for="(res1, index1) in eventInfo.event_img" :src="res1"
								 mode="aspectFill" style="width:220rpx;height:220rpx;margin-bottom: 10rpx;"></image>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view @click="comment" style="color: #5677fc;padding-left: 20rpx;">评论</view>
						{{ eventInfo.event_time | timeFilters}}
					</view>
					<!-- 	<view style="padding: 10rpx;">
					<view style="display: flex;">
						<view style="margin-right: 25rpx;">评论</view>
						<view>{{res.com_num}}条</view>
					</view>
				</view> -->
				</view>
			</view>

			<view style="margin-bottom: 150rpx;margin-left: 15rpx;margin-right: 15rpx;">
				<view class="reply" v-for="cmt in cmtList" :key="cmt.cmt_cmt_id">
					<view class="left" @click="findUser(cmt.cmt_cmt_userId)">
						<image :src="cmt.user_ava" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="top">
							<view @click="findUser(cmt.cmt_cmt_userId)" class="name">{{cmt.user_name}}
							</view>
							<view class="time">{{cmt.cmt_cmt_time | timeFilters}}</view>
						</view>
						<view class="content">
							{{cmt.cmt_cmt_info}}
							<!-- <view @click="reply({cmtId:cmt.cmt_cmt_id,userName:cmt.user_name})" style="color: #5677fc;">
							回复
						</view> -->
						</view>
						<view class="reply-box">
						</view>
						<view class="bottom">
							<view style="background: #ececec;height:100%;width: 100%;color: #000000;border-radius: 15rpx;">
								<view v-for="rpl in rplList" :key="rpl.rpl_id" style="margin-left: 10rpx;">
									<text style="margin-right: 10rpx;color: #007AFF;">{{rpl.user_name}}</text> 回复 <text style="margin-left: 10rpx;">{{rpl.user_name}}</text>
									{{rpl.rpl_rpl_info}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="text-align: center;font-size: 20rpx;color: #d0d0d0;margin-top: 50rpx;">
					<text>我也是有底线的~</text>
				</view>
			</view>
		</scroll-view>

		<view v-show="user_status==1">
			<view class="input">
				<view style="width: 85%;">
					<u-input v-model="value" :placeholder="placeholder" type="text" height="80" border="true" maxlength="50"></u-input>
				</view>
				<view @click="submit" style="width: 90rpx;position: absolute;height: 70rpx;padding:15rpx 15rpx;right: 18rpx;color: white;background: #554d84;border-radius: 25rpx;">
					<text>发布</text>
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
			}
		},
		data() {
			return {
				userInfo: {},
				eventInfo: {},
				cmtList: [],
				rplList: [],
				eventId: '',
				value: '',
				//0代表评论 1代表回复
				flag: 0,
				scrollTop: 0,
				placeholder: '评论(仅限50个字以内！)',
			}
		},
		computed: {
			user_status() {
				return this.$store.state.userInfo.user_status
			}
		},
		onPullDownRefresh: function() {
			this.initEvent()
			this.initCmt()
		},
		onLoad(options) {
			this.userInfo = {
					user_id: options.user_id,
					user_name: options.user_name,
					user_ava: options.user_ava,
				},
				this.eventId = options.event_id
			this.initEvent()
			this.initCmt()
		},
		methods: {
			comment() {
				let that = this
				that.flag = 0
				that.placeholder = '评论'
				if(that.user_status==0){
					that.$refs.uToast.show({
						title: '请先进行学生认证！',
						type: 'warning',
					})
				}
			},
			// reply(val){
			// 	let that=this
			// 	that.cmtId=val.cmtId
			// 	that.flag=1
			// 	that.placeholder='回复用户：'+val.userName
			// },
			//评论 + 回复
			submit() {
				let that = this
				const userId = that.$store.state.userInfo.user_id;
				const time = utils.formatDateTime();
				const publishValue = that.value;
				if (that.flag == 0) {
					const info = {
						cmt_userId: userId,
						cmt_eventId: that.eventId,
						cmt_info: publishValue,
						cmt_time: time,
					}
					uni.request({
						url: that.$store.state.baseUrl + '/cmt',
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						data: info,
						method: 'POST',
						success: (res) => {
							if (res.data != "") {
								that.$refs.uToast.show({
									title: '发布成功',
									type: 'success',
									callback: that.initCmt()
								})
								that.scrollTop = that.cmtList.length * 80
							} else {
								that.$refs.uToast.show({
									title: '发布失败',
									type: 'error',
								})
							}
						}
					})
				} else {
					const info = {
						rpl_userId: userId,
						rpl_cmtId: that.cmtId,
						rpl_info: publishValue,
						rpl_time: time,
					}
					uni.request({
						url: that.$store.state.baseUrl + '/rpl',
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						data: info,
						method: 'POST',
						success: (res) => {
							if (res.data != "") {
								that.$refs.uToast.show({
									title: '发布成功',
									type: 'success',
								})
							} else {
								that.$refs.uToast.show({
									title: '发布失败',
									type: 'error',
								})
							}
						}
					})
				}
				that.value = ''
			},
			initEvent() {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl + '/event/' + that.eventId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.eventInfo = res.data
						that.eventInfo['event_img'] = that.eventInfo['event_img'].split(',')
					}
				})
			},
			initCmt() {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl + '/cmt/findByEventId?eventId=' + that.eventId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.cmtList = res.data
						// for(let cmt of res.data){
						// 	that.initRpl(cmt['cmt_cmt_id'])
						// 	console.log(that.rplList)
						// 	Object.assign(cmt,{rplList:that.rplList})
						// 	that.cmtList.push(cmt)
						// }
					}
				})
			},
			initRpl(cmtId) {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl + '/rpl/findByCmtId?cmtId=' + cmtId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.rplList = res.data
						console.log(that.rplList)
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
			//个人中心跳转
			findUser(userId) {
				uni.navigateTo({
					url: '../../userinfo/index?userId=' + userId
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
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

	.input {
		display: flex;
		position: fixed;
		bottom: 10rpx;
		width: 100%;
		z-index: 999;
		//background: red;
		left: 10rpx;
		background: #fff;
		align-items: center;
		//padding: 20rpx;
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
				//margin-top: 20rpx;
				margin-left: 10rpx;
				display: flex;
				// font-size: 24rpx;
				color: #9a9a9a;
				margin: 40rpx 10rpx;
				position: relative;
				flex-direction: row-reverse;


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
				display: flex;
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
