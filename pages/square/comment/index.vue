<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="comment" v-for="(res, index) in commentList">
			<view class="right">
				<view class="top" @click="userinfo(res.u_id)">
					<u-avatar :src="res.u_ava"></u-avatar>
					<view class="name">{{ res.u_name }}</view>

				</view>
				<view class="content" @click="reply(res)">{{ res.content }}</view>
				<view class="reply-box">
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
				<view class="bottom">
					{{ res.pub_date }} {{res.place}}
				</view>
				<view style="padding: 10rpx;">
					<view style="display: flex;">
						<view style="margin-right: 25rpx;">评论</view>
						<view>{{res.com_num}}条</view>
					</view>
				</view>
				<view>
				</view>
			</view>
		</view>




		<view style="margin-bottom: 150rpx;margin-left: 15rpx;margin-right: 15rpx;">
			<view class="reply" v-for="(ies,idx) in replyList">
				<view class="left" @click="userinfo(ies.u_id)">
					<image :src="ies.r_ava" mode="aspectFill"></image>
				</view>
				<view class="right">
					<view class="top">
						<view class="name">{{ies.r_name}}
						</view>
						<view class="time">{{ies.r_date}}</view>
					</view>
					<view class="content" @click="reply1(ies)">{{ies.r_cont}}</view>
					<view class="reply-box">
					</view>
					<view class="bottom">
						<view style="background: #ececec;height:100%;width: 100%;color: #000000;border-radius: 15rpx;">
							<view v-if="inx.r_id == ies.id" @click="reply2(inx)" v-for="(inx,index) in replys" style="margin-left: 10rpx;">
								<text style="margin-right: 10rpx;color: #007AFF;">{{inx.name}}</text> 回复 <text style="margin-left: 10rpx;">{{inx.r_name}}</text>
								：
								{{inx.content}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="text-align: center;font-size: 20rpx;color: #d0d0d0;margin-top: 50rpx;">
				<text>我也是有底线的~</text>
			</view>
		</view>

		<view class="input">
			<view style="width: 85%;">
				<u-input v-model="value" :placeholder="'回复：'+placeholder" type="text" height="80" border="true"></u-input>
			</view>
			<view @click="submit" style="width: 90rpx;position: absolute;height: 70rpx;padding:15rpx 15rpx;right: 18rpx;color: white;background: #554d84;border-radius: 25rpx;">
				<text>发布</text>
			</view>
		</view>
		<u-action-sheet :list="list" @click="shanchu1" v-model="show"></u-action-sheet>
		<u-action-sheet :list="list2" @click="shanchu2" v-model="show2"></u-action-sheet>
	</view>



</template>

<script>
	export default {
		data() {
			return {
				time: '',
				id: null,
				list: [{
					text: '删除'
				}],
				list2: [{
					text: '删除'
				}],
				show2: false,
				show: false,
				u_id: '',
				r_id: null,
				m_id: '',
				res_id: null,
				type: 0,
				name: 'kristen',
				rename: null,
				ava: '',
				placeholder: '',
				value: '',
				commentList: [{
					id:1,
					u_id:'xx',
					u_name:'name01',
					u_ava:'../../../static/ava01.png',
					u_gender:'男',
					content:'今天是个好日子！',
					com_num:10,
					like_num:66,
					pub_date:'2021-01-05 16:36:41',
					url:['../../../static/test01.png'],
					rep_date:'2021-01-05 16:36:41'
			    }],
				replyList: [],
				replys: [],
				com_num: ''
			}
		},


		onLoad(res) {
			// this.id = res.id;
			// this.placeholder = res.name;
			// this.get();
			// this.init();
		},
		onShow() {
			// this.init();
		},
		methods: {
			//用户信息初始化
		// 	init() {
		// 		uni.getStorage({
		// 			key: 'userinfo',
		// 			fail: (res) => {
		// 				uni.navigateTo({
		// 					url: '../user/login'
		// 				})
		// 			}
		// 		})
		// 	},
		// 	//删除评论
		// 	shanchu1(res) {
		// 		if (res == 0) {
		// 			uni.request({
		// 				url: api.baseUrl+'/delrep',
		// 				method: 'GET',
		// 				data: {
		// 					id: this.r_id,
		// 					t_id: this.id,
		// 					time: this.time
		// 				},
		// 				success: (res) => {
		// 					if (res.data.code == 1) {
		// 						this.$refs.uToast.show({
		// 							title: '删除回复成功',
		// 							type: 'success',
		// 						})
		// 						this.get();
		// 					} else {
		// 						console.log('删除失败')
		// 					}
		// 				}
		// 			})
		// 		}
		// 	},
		// 	//删除回复
		// 	shanchu2(res) {
		// 		if (res == 0) {
		// 			uni.request({
		// 				url: api.baseUrl+'/delreps',
		// 				method: 'GET',
		// 				data: {
		// 					id: this.res_id,
		// 					time: this.time
		// 				},
		// 				success: (res) => {
		// 					if (res.data.code == 1) {
		// 						this.$refs.uToast.show({
		// 							title: '删除回复成功',
		// 							type: 'success',
		// 						})
		// 						this.get();
		// 					} else {
		// 						console.log('删除失败')
		// 					}
		// 				}
		// 			})
		// 		}
		// 	},
		// 	//初始化评论信息
		// 	get() {
		// 		uni.getStorage({
		// 			key: 'userinfo',
		// 			success: (res) => {
		// 				this.name = res.data.nickName;
		// 				this.ava = res.data.avatarUrl;
		// 				this.u_id = res.data.openid;
		// 				//console.log(this.u_id)
		// 			}
		// 		})

		// 		uni.request({
		// 			url: api.baseUrl+'/comment',
		// 			method: 'GET',
		// 			data: {
		// 				id: this.id
		// 			},
		// 			success: (res) => {
		// 				this.commentList = res.data
		// 				this.m_id = res.data[0].u_id;
		// 				//console.log(this.m_id)
		// 			}
		// 		})
		// 		uni.request({
		// 			url: api.baseUrl+'/reply',
		// 			method: 'GET',
		// 			data: {
		// 				id: this.id
		// 			},
		// 			success: (res) => {
		// 				this.replyList = res.data
		// 				//console.log(res.data)
		// 			}
		// 		})
		// 		uni.request({
		// 			url: api.baseUrl+'/replys',
		// 			method: 'GET',
		// 			data: {
		// 				id: this.id
		// 			},
		// 			success: (res) => {
		// 				this.replys = res.data
		// 				//console.log(res.data)
		// 			}
		// 		})
		// 	},
		// 	//提交评论或回复
		// 	submit() {
		// 		if (this.type == 2 || this.type == 1) {
		// 			if (this.value == '') {
		// 				this.$refs.uToast.show({
		// 					title: '内容不能为空',
		// 					type: 'error'
		// 				})
		// 			} else {
		// 				uni.request({
		// 					url: api.baseUrl+'/pubreplys',
		// 					method: 'GET',
		// 					data: {
		// 						u_id: this.u_id,
		// 						t_id: this.id,
		// 						r_id: this.r_id,
		// 						m_id: this.m_id,
		// 						m_ava: this.ava,
		// 						name: this.name,
		// 						rename: this.rename,
		// 						content: this.value
		// 					},
		// 					success: (res) => {
		// 						if (res.data.code == 1) {
		// 							//console.log("评论成功")
		// 							this.get();
		// 							this.$refs.uToast.show({
		// 								title: '评论成功',
		// 								type: 'success'
		// 							})
		// 							this.value = '';
		// 						} else if (res.data.code == 0) {
		// 							console.log("评论失败")
		// 						}

		// 					}
		// 				})
		// 			}
		// 		} else {
		// 			if (this.value == '') {
		// 				this.$refs.uToast.show({
		// 					title: '内容不能为空',
		// 					type: 'error'
		// 				})
		// 			} else {
		// 				uni.request({
		// 					url: api.baseUrl+'/pubreply',
		// 					method: 'GET',
		// 					data: {
		// 						u_id: this.u_id,
		// 						name: this.name,
		// 						ava: this.ava,
		// 						m_id: this.m_id,
		// 						content: this.value,
		// 						id: this.id
		// 					},
		// 					success: (res) => {
		// 						if (res.data.code == 1) {
		// 							console.log("评论成功")
		// 							this.get();
		// 							this.$refs.uToast.show({
		// 								title: '评论成功',
		// 								type: 'success'
		// 							})
		// 							this.value = '';
		// 						} else if (res.data.code == 0) {
		// 							console.log("评论失败")
		// 						}

		// 					}
		// 				})
		// 			}

		// 		}


		// 	},
		// 	//回复评论
		// 	reply1(res) {
		// 		if (this.u_id == res.u_id) {
		// 			this.r_id = res.id;
		// 			this.time = res.r_date;
		// 			this.show = true;
		// 			console.log(this.time)
		// 			//console.log(this.r_id)
		// 		} else {
		// 			this.placeholder = res.r_name;
		// 			this.rename = res.r_name;
		// 			this.r_id = res.id;
		// 			this.m_id = res.u_id;
		// 			this.type = 1;
		// 			this.$refs.uToast.show({
		// 				title: '当前回复：' + this.placeholder,
		// 				type: 'success',
		// 			})
		// 		}


		// 	},
		// 	reply2(res) {
		// 		if (this.u_id == res.u_id) {
		// 			this.r_id = res.r_id;
		// 			this.res_id = res.id;
		// 			this.time = res.r_date;
		// 			this.show2 = true;
		// 			//console.log(this.r_id)
		// 		} else {
		// 			this.placeholder = res.name;
		// 			this.rename = res.name;
		// 			this.r_id = res.r_id;
		// 			this.m_id = res.u_id;
		// 			this.type = 2;
		// 			this.$refs.uToast.show({
		// 				title: '当前回复：' + this.placeholder,
		// 				type: 'success',
		// 			})
		// 		}


		// 	},
		// 	reply(res) {
		// 		this.placeholder = res.u_name
		// 		this.m_id = res.u_id
		// 		this.time = res.r_date
		// 		this.type = 0
		// 		this.$refs.uToast.show({
		// 			title: '当前回复：' + this.placeholder,
		// 			type: 'success',
		// 		})
		// 	},
		// 	//图片预览
		// 	previewImage(current, photos) {
		// 		uni.previewImage({
		// 			current,
		// 			urls: photos
		// 		})
		// 	},
		// 	//个人中心跳转
		// 	userinfo(res) {
		// 		console.log(res)
		// 		uni.navigateTo({
		// 			url: '../user/userinfo/userinfo?u_id=' + res
		// 		})
		// 	},

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
				font-size: 24rpx;
				color: #9a9a9a;
				margin-bottom: 10rpx;
				position: relative;


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
