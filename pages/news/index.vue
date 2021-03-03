<template>
	<view class="wrap">
		<u-swipe-action @open="open" @click="click" @content-click="info" v-for="item in news" :key="item.name" :show="item.show" :index="item.name"
		 :options="options">
			<view class="box">
				<image src="../../static/ava01.png" />
				<view style="margin-left:10px;">
					<view class="name">{{item.name}}</view>
					<view class="msg">{{item.msg}}</view>
				</view>
				<view class="badge">
					<u-badge type="error" :count="item.count"></u-badge>
				</view>
			</view>
		</u-swipe-action>
		<!-- 		<view v-for="item in news" :key="item.name" class="box" @click="info">
			<image src="../../static/ava01.png"/>
			<view style="margin-left:10px;">
				<view class="name">{{item.name}}</view>
				<view class="msg">{{item.msg}}</view>
			</view>
			<view class="badge">
				<u-badge type="error" :count="item.count"></u-badge>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: [{
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}, {
					name: "小叮当",
					msg: "奥利给！！",
					count: 7,
					show: false
				}],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			};
		},
		methods: {
			click(index, index1) {
				if (index1 == 0) {
					console.log("删除"+index)
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			info() {
				uni.navigateTo({
					url: './chat/index'
				});
			}
		},
		onLoad() {}
	};
</script>

<style scoped lang="scss">
	.box {
		border-bottom: 1px solid #f8f8f8;
		padding: 5px 10px;
	}

	.box {
		display: flex;
		flex-wrap: nowrap;
		justify-content: start;
		position: relative;

		image {
			width: 50px;
			height: 50px;
			border-radius: 50%;
		}

		.name {
			font-size: 16px;
			margin: 5px 0 0 0;
		}

		.msg {
			font-size: 14px;
			color: #999;
		}

		.badge {
			position: absolute;
			right: 20rpx;
			top: 40rpx;
		}
	}
</style>
