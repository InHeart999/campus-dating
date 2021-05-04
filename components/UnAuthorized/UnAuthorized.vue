<template>
	<view class="unauthorized">
		<u-icon name="error-circle" color="#ff0004" size="500"></u-icon>
		<p>无法进行该操作，请先前往个人中心进行学生认证！</p>
		<u-button @click.stop="authorized">前往认证</u-button>
	</view>
</template>

<script>
	export default {
		methods: {
			authorized() {
				this.$emit('authorized');
			}
		}

	}
</script>

<style lang="scss" scoped>
	.unauthorized {
		font-size: 48rpx;
		color: red;
		width: 600rpx;
		position: fixed;
		top: 60rpx;
		left: 80rpx;
		text-align: center;
		p{
			padding-bottom: 40rpx;
		}
	}
</style>
