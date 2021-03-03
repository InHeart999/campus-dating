<template>
	<view class="wrap">
		<!-- 布局 -->
		<scroll-view scroll-y="true" class="content">
			<view v-for="item in list" :key="item.ss">
				<view v-if="item.ss === '大叮当'" class="right">
					<view>
						<view style="font-size:12px;color:#999;text-align:right;">{{ item.ss }}</view>
						<view class="langcon">{{ item.con }}</view>
					</view>
					<view style="margin-left:10px;">
						<image src="../../../static/ava01.png" />
					</view>
				</view>
				<view v-else-if="item.ss!=='大叮当'" class="left">
					<view>
						<image src="../../../static/ava01.png" />
					</view>
					<view style="margin-left:10px;">
						<view style="font-size:12px;color:#999;">{{ item.ss }}</view>
						<view class="langcon">{{ item.con }}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 输入框 -->
		<view class="input">
			<view style="width: 85%;">
				<u-input v-model="value" placeholder="请输入你要发送的内容：" type="text" height="80" border="true"></u-input>
			</view>
			<view @click="submit" style="width: 90rpx;position: absolute;height: 70rpx;padding:15rpx 15rpx;right: 18rpx;color: white;background: #554d84;border-radius: 25rpx;">
				<text>发送</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				tableData: [],
				list: [{
					ss: "大叮当",
					con: "今天是个好日子"
				}, {
					ss: "潇洒",
					con: "明天是个好日子"
				}, {
					ss: "潇洒",
					con: "明天是个好日子"
				}, {
					ss: "大叮当",
					con: "今天是个好日子"
				}, {
					ss: "大叮当",
					con: "今天是个好日子"
				}, {
					ss: "大叮当",
					con: "今天是个好日子"
				}, {
					ss: "大叮当",
					con: "今天是个好日子"
				}, {
					ss: "大叮当",
					con: "今天是个好日子"
				}, {
					ss: "大叮当",
					con: "今天是个好日子"
				}],
				value: "",
				start: true
			};
		},
		methods: {
			connectSocketInit() {
				var that = this;
				uni.connectSocket({
					url: '', //请输入链接websocke.io地址
					success() {
						uni.onSocketOpen(function(res) {
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: 'Socket连接已打开！'
							});
							uni.sendSocketMessage({
								data: message, //自身定义一个发送消息对象
								success: function() {
									uni.onSocketMessage(function(res) {
										var s = JSON.parse(res.data);
										that.list.push({
											con: s.msg,
											ss: s.name
										});
									});
								},
								fail: function() {
									uni.showToast({
										icon: 'none',
										position: 'bottom',
										title: '数据发送失败'
									});
								}
							});
						});
					}
				});
			},
			clickRequest() {
				if (this.value == '') {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '不能发送空白消息'
					});
				} else {
					var _self = this;
					var ok = JSON.stringify({
						type: 'say',
						fromid: 'null',
						toid: 'null',
						name: uni.getStorageSync('name'),
						msg: this.value
					});
					uni.sendSocketMessage({
						data: ok,
						success: function() {
							uni.onSocketMessage(function(res) {
								var ret = JSON.parse(res.data);
								_self.list.push({
									con: ret.msg,
									ss: ret.name
								});
								for (var s = 0; s < _self.list.length; s++) {
									if (_self.list[s].ss == uni.getStorageSync('name')) {
										_self.start = true;
										_self.value = '';
									} else {
										_self.start = false;
									}
								}
								// 初始化
								_self.value = '';
							});
						},
						fail: function() {
							uni.showToast({
								icon: 'none',
								position: 'bottom',
								title: '数据发送失败'
							});
						}
					});
				}
			},
			// 关闭socket
			closeSocket() {
				uni.closeSocket(function(res) {
					console.log('WebSocket 已关闭！');
				});
			},
		},
		onLoad() {
			this.connectSocketInit();
		},
		computed: {
			getname() {
				return uni.getStorageSync('name');
			}
		},
		// 关闭socket
		beforeDestroy() {
			this.closeSocket();
		}
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
		.content{
			height:1050rpx;
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
		height: 30px;
		line-height: 30px;
		border-radius: 7px;
		margin-top: 5px;
		text-align: right;
		padding: 3px 10px 3px 10px;
		background: #f8f8f8;
	}
</style>
