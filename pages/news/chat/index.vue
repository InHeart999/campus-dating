<template>
	<view class="wrap">
		<u-top-tips ref="uTips"></u-top-tips>
		<!-- 布局 -->
		<scroll-view scroll-y="true" class="content" :scroll-top="scrollTop">
			<view v-for="item in list" :key="item.chatrecord_sendId_time">
				<view v-if="item.chatrecord_sendId === user_id" class="right">
					<view>
						<view style="font-size:12px;color:#999;text-align:right;">{{ user_name }}</view>
						<view class="langcon">{{ item.chatrecord_info }}</view>
					</view>
					<view style="margin-left:10px;">
						<image :src="user_ava" />
					</view>
				</view>
				<view v-else-if="item.chatrecord_sendId!=user_id" class="left">
					<view>
						<image :src="userInfo.user_ava" />
					</view>
					<view style="margin-left:10px;">
						<view style="font-size:12px;color:#999;">{{ userInfo.user_name }}</view>
						<view class="langcon">{{ item.chatrecord_info }}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 输入框 -->
		<view class="input">
			<view style="width: 85%;">
				<u-input v-model="value" placeholder="请输入聊天内容(50字以内!)" type="text" height="80" border="true" maxlength="50"></u-input>
			</view>
			<view @click="submit" style="width: 90rpx;position: absolute;height: 70rpx;padding:15rpx 15rpx;right: 18rpx;color: white;background: #554d84;border-radius: 25rpx;">
				<text>发送</text>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		computed: {
			...mapState({
				user_id: state => state.userInfo.user_id,
				user_name: state => state.userInfo.user_name,
				user_ava: state => state.userInfo.user_ava,
			})
		},
		data() {
			return {
				userInfo: {},
				roomId: '',
				value: '',
				list: [],
				chatInfo:[],
				read:1,
				flag:false,
				scrollTop: 0,
			};
		},
		onLoad(options) {
			this.userInfo = {
				user_id: options.userId,
				user_name: options.userName,
				user_ava: options.userAva
			}
			this.roomId = options.roomId
			this.get_data()
			this.init()
			this.getChatInfo()
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: this.userInfo.user_name
			});
			this.$refs.uTips.show({
				title: '聊天仅保存2天内消息记录！',
				type: 'warning',
				duration: '8000'
			})
		},
		methods: {
			init() {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl + '/chatrecord/findByRoomId?roomId=' + that.roomId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.list = res.data
						that.scrollTop = that.list.length * 80
					}
				})
			},
			getChatInfo(){
				let that=this
				uni.request({
					url: that.$store.state.baseUrl + '/chatlist/' + that.roomId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.chatInfo = res.data
						that.isRead(res.data)
					}
				})
			},
			isRead(info){
				let that=this
				console.log(info)
				info['chatlist_read']=this.read
				uni.request({
					url: that.$store.state.baseUrl + '/chatlist' ,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					data:info,
					method: 'PUT',
					success: (res) => {}
				})
			},
			saveData(data) {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl + '/chatrecord',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data: data,
					success: (res) => {
						if (res.data == "") {
							that.$refs.uToast.show({
								title: '发送失败！',
								type: 'warning',
							})
						}
					}
				})
			},
			submit() {
				let that = this
				if (that.value == '') {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '不能发送空白消息'
					});
				} else {
					let infos = {
						chatrecord_roomId: that.roomId,
						chatrecord_sendId: that.user_id,
						chatrecord_info: that.value,
					}
					that.socket.emit('send_data', infos)

				}
				that.value = ""
			},
			get_data() {
				let that = this
				that.socket.on('get_data', (content) => {
					that.list.push(content)
					if(!that.flag){
						that.flag = true
						that.read=0
						that.isRead(that.chatInfo)
					}
					that.saveData(content)
					that.scrollTop = that.scrollTop+80
				});
			},
			//关闭socket
			// closeSocket() {
			// 	const socket=io('ws://192.168.3.103:5555/socket')
			// 	socket.on('disconnect',()=>{
			// 		console.log('socket连接断开')
			// 	})
			// },
		},
	};
</script>

<style lang="scss" scoped>
	.wrap {
		image {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			border: 1px solid #aaa;
		}

		.content {
			height: 1050rpx;
		}

		.input {
			display: flex;
			position: fixed;
			bottom: 10rpx;
			width: 100%;
			z-index: 999;

			left: 10rpx;
			background: #fff;
			align-items: center;

		}
	}



	.center {
		text-align: center;
		font-size: 12px;
		color: #aaa;
		margin-top: 10px;
		letter-spacing: 1px;
	}

	.left {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		margin-left: 10px;
		margin-top: 10px;
	}

	.right {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-end;
		margin-right: 10px;
		margin-top: 10px;
	}

	.langcon {
		border: 1px solid #333333;
		font-size: 14px;
		color: #414141;
		line-height: 30px;
		border-radius: 7px;
		margin-top: 5px;
		text-align: right;
		padding: 3px 10px 3px 10px;
		background: #f8f8f8;
		word-break:break-all;
		max-width:500rpx;
	}
</style>
