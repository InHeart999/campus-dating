<template>
	<view class="wrap">
		<view v-show="!user_status==1">
			<un-authorized @authorized="authorized"></un-authorized>
		</view>
		<view v-show="user_status==1">
			<u-swipe-action @click="click" @content-click="info(item)" v-for="(item,index) in chatlist" :key="item.roomId"
			 :index="index" :options="options">
				<view class="box">
					<image :src="item.user_ava" />
					<view style="margin-left:10px;">
						<view class="name">{{item.user_name}}
							<view class="badge" v-show="item.chatlist_read == 0">
								<u-badge type="error" :is-dot="true"></u-badge>
							</view>
						</view>
						<view class="msg">{{item.chatrecord_info}}</view>
					</view>
					<view class="time">{{item.chatrecord_time | timeFilters}}</view>
				</view>
			</u-swipe-action>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import UnAuthorized from '../../components/UnAuthorized/UnAuthorized.vue'
	import utils from "../../common/utils.js"
	export default {
		components: {
			UnAuthorized
		},
		filters:{
			timeFilters(val){
				return utils.renderTime(val)
			}
		},
		computed: {
			user_status() {
				return this.$store.state.userInfo.user_status
			}
		},
		data() {
			return {
				chatlist:[],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			};
		},
		onLoad(){
			this.init()
		},
		
		onPullDownRefresh: function() {
			this.init()
		},
		
		methods: {
			authorized() {
				uni.navigateTo({
					url: '../person/certification/index'
				})
			},
			click(index, index1) {
				// let that=this
				// if (index1 == 0) {
				// 	let that=this
				// 	let Info=that.chatlist[index]
				// 	let info={
				// 		chatlist_id: Info.roomId,
				// 		chatlist_userId1: Info.chatlist_userId1,
				// 		chatlist_userId2: Info.chatlist_userId2,
				// 		chatlist_del: 2
				// 	}
				// 	uni.request({
				// 		url: that.$store.state.baseUrl+'/chatlist',
				// 		header: {
				// 			"Content-Type": "application/x-www-form-urlencoded"
				// 		},
				// 		method: 'PUT',
				// 		data: info,
				// 		success: (res) => {
				// 			if(res.data==""){
				// 				that.$refs.uToast.show({
				// 					title: '删除失败！',
				// 					type: 'error',
				// 				}) 
				// 			}else{
				// 				that.$refs.uToast.show({
				// 					title: '删除成功！',
				// 					type: 'success',
				// 				}) 
				// 				that.init()
				// 			}
				// 		}
				// 	})
				// }
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			// open(index) {
			// 	// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 	// 原本为'false'，再次设置为'false'会无效
			// 	this.list[index].show = true;
			// 	this.list.map((val, idx) => {
			// 		if (index != idx) this.list[idx].show = false;
			// 	})
			// },
			init(){
				let that=this
				uni.request({
					url: that.$store.state.baseUrl+'/chatlist/findByUserId?userId=' + that.$store.state.userInfo.user_id,
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'GET',
					success: (res) => {
						that.chatlist=res.data
						// if(res.data==""){
						// 	that.$refs.uToast.show({
						// 		title: '查询列表失败！',
						// 		type: 'error',
						// 	})
						// }else{
						// 	that.chatlist=res.data
						// }
					}
				})
			},
			info(val) {
				uni.navigateTo({
					url: './chat/index?userId=' + val.user_id + '&userName=' + val.user_name + '&userAva=' + val.user_ava + '&roomId=' + val.roomId
				});
			}
		},
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
		
		.badge{
			position: absolute;
			scale: 1.5;
			top: 0;
		}

		.time {
			position: absolute;
			right: 20rpx;
			bottom: 30rpx;
		}
	}
</style>
