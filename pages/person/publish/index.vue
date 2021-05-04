<template>
	<view class="wrap">
		<u-search class="search" height="96" v-model="selectCondition.keyword" @search="search"></u-search>
		<view style="background: white;">
			<u-dropdown ref="uDropdown">
				<u-dropdown-item title="类型">
					<view class="slot-content">
						<view class="item-box">
							<view class="item" :class="[item.active ? 'active' : '']" @tap="tagClick(index)" v-for="(item, index) in typeList"
							 :key="item.label">
								{{item.label}}
							</view>
						</view>
						<view class="item-btn">
							<u-button type="primary" @click="clickEmpty" style="margin-right:20rpx;width:50%">重置</u-button>
							<u-button type="primary" @click="closeDropdown" style="width:50%">确定</u-button>
						</view>
					</view>
				</u-dropdown-item>
				<u-dropdown-item v-model="selectTime" title="时间" :options="timeList" @change="timeChange"></u-dropdown-item>
			</u-dropdown>
		</view>
		<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
			<view class="page-box">
				<view class="order" v-for="(res, index) in eventList" :key="res.event_id" @click="selectEvent({type:res.event_type,eventId:res.event_id,userId:res.event_userId})">
					<view class="top">
						<view class="left">
							<u-icon name="volume-up" :size="30" color="rgb(94,94,94)"></u-icon>
							<view class="store">{{ res.event_title }}</view>
						</view>
						<view class="right">{{ res.event_time | timeFilters}}</view>
					</view>
					<view class="item">
						<view class="content">
							<view class="title u-line-2">{{ res.event_info }}</view>
						</view>
					</view>
					<view class="total" v-show="res.event_phone!=''">
						联系电话:{{ res.event_phone}}
					</view>
					<view class="bottom">
						<view class="evaluate btn">{{res.event_type | typeFilters}}</view>
						<view class="right">
							<view class="btn btn2" @click.stop="edit(res.event_id)">编辑</view>
							<view class="btn btn2" @click.stop="delModal(res.event_id)">删除</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="loadStatus" bgColor="#f2f2f2"></u-loadmore>
			</view>
		</scroll-view>
		<u-modal v-model="show" :content="content" @confirm="del" @cancel="delCancel" :show-cancel-button="true"></u-modal>
		<u-toast ref="uToast" />
		<u-back-top :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import utils from "../../../common/utils.js"
	export default {
		filters: {
			timeFilters(val) {
				return utils.renderTime(val)
			},
			typeFilters(val) {
				return utils.typesFilters[val]
			}
		},
		data() {
			return {
				selectCondition: {
					keyword: '',
					types: [],
					time: '',
					count: 0,
				},
				timeList: [{
					label: '全部(仅1年内)',
					value: 'all'
				}, {
					label: '最近1天',
					value: 'one'
				}, {
					label: '最近3天',
					value: 'three'
				}, {
					label: '最近一周',
					value: 'week'
				}, {
					label: '最近一个月',
					value: 'month'
				}, ],
				typeList: [{
						label: '寻找物主',
						active: false,
						value: 'goods1',
					},
					{
						label: '寻找失物',
						active: false,
						value: 'goods2'
					},
					{
						label: '求取资料',
						active: false,
						value: 'datas1',
					},
					{
						label: '资料分享',
						active: false,
						value: 'datas2',
					},
					{
						label: '二手求购',
						active: false,
						value: 'secondHand1',
					},
					{
						label: '二手出售',
						active: false,
						value: 'secondHand2',
					},
					{
						label: '活动拼团',
						active: false,
						value: 'teams1',
					},
					{
						label: '活动组队',
						active: false,
						value: 'teams2',
					},
					{
						label: '求职',
						active: false,
						value: 'recruitment1',
					},
					{
						label: '招聘',
						active: false,
						value: 'recruitment2',
					},
					{
						label: '日常分享',
						active: false,
						value: 'daily1',
					},
					{
						label: '其它',
						active: false,
						value: 'other1',
					},
				],
				eventList: [],
				selectTime: 1,
				eventId: '',
				show: false,
				content: '是否确认删除！',
				status: 'loadmore',
				scrollTop: 0,
			}
		},
		onLoad() {
			this.init();
		},

		onReachBottom() {
			this.selectCondition.count += 5
			this.search()
		},
		onPullDownRefresh: function() {
			// this.selectCondition.count = 0
			this.init();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			edit(eventId){
				uni.navigateTo({
					url: './edit?eventId=' + eventId 
				})
			},
			delCancel(){
				this.show = false;
			},
			delModal(eventId) {
				this.show = true;
				this.eventId = eventId
			},
			del() {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl+'/event/' + that.eventId,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						let eventInfo = res.data;
						eventInfo.event_del = 2
						uni.request({
							url: that.$store.state.baseUrl+'/event',
							header: {
								"Content-Type": "application/x-www-form-urlencoded"
							},
							data: eventInfo,
							method: 'PUT',
							success: (res) => {
								if (res.data != "") {
									that.$refs.uToast.show({
										title: '删除成功',
										type: 'success',
									})
								}
								that.init()
							}
						})
					}
				})
			},

			search() {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl+'/event/findById?keyword=' + that.selectCondition.keyword + '&types=' + that.selectCondition.types +'&userId=' + that.$store.state.userInfo.user_id
						 + '&time=' + that.selectCondition.time,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.eventList = res.data;
					}
				})
			},
			init() {
				let that = this
				uni.request({
					url: that.$store.state.baseUrl+'/event/findById?keyword&types&time=all&userId=' + that.$store.state.userInfo.user_id,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.eventList = res.data
					}
				})
			},
			timeChange(index) {
				this.selectCondition.time = index
				this.search()
			},
			tagClick(index) {
				let typeInfo = this.typeList[index]
				typeInfo.active = !typeInfo.active;
			},
			clickEmpty() {
				let that = this
				for (const typeInfo of that.typeList) {
					typeInfo.active = false
				}
			},
			closeDropdown() {
				let that = this
				that.selectCondition.types = []
				for (const typeInfo of that.typeList) {
					if (typeInfo.active) {
						that.selectCondition.types.push(typeInfo.value);
					}
				}
				that.$refs.uDropdown.close();
				that.search();
			},
			reachBottom() {
				console.log("reachBottom")
			},
			selectEvent(val) {
				uni.navigateTo({
					url: '../../events/eventDetail/index?type=' + val.type + '&eventId=' + val.eventId + '&userId=' + val.userId
				})
			}
		}

	}
</script>

<style>
	page {
		background-color: #eeeeee;
	}
</style>

<style lang="scss" scoped>
	.slot-content {
		background-color: #FFFFFF;
		padding: 24rpx;

		.item-box {
			margin-bottom: 50rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.item {
				border: 1px solid $u-type-primary;
				color: $u-type-primary;
				padding: 8rpx 40rpx;
				border-radius: 100rpx;
				margin-top: 30rpx;
			}

			.active {
				color: #FFFFFF;
				background-color: $u-type-primary;
			}
		}
		
		.item-btn {
			display:flex;
			justify-content: flex-end;	
		}
	}


	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.store {
					margin: 0 10rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}

			.right {
				color: $u-type-warning-dark;
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				.title {
					font-size: 28rpx;
					line-height: 50rpx;
				}

				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}

				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
			}
		}

		.bottom {
			display: flex;
			margin-top: 20rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;

			.btn1 {
				width: 160rpx;
			}

			.btn2 {
				width: 120rpx;
				color: $u-type-error;
				border-color: $u-type-error;
			}

			.right {
				display: flex;
			}

			.btn {
				line-height: 52rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}

			.evaluate {
				width: 160rpx;
				color: $u-type-warning-dark;
				border-color: $u-type-warning-dark;
			}
		}
	}

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
		background: #eeeeee;
	}
</style>
