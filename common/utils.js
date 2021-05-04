function formatDateTime() {
	var date = new Date();
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

function renderTime(date) {
	var dateee = new Date(date).toJSON();
	return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

const typesFilters = {
	goods1: '寻找物主',
	goods2: '寻找失物',
	datas1: '求取资料',
	datas2: '资料分享',
	secondHand1: '二手求购',
	secondHand2: '二手出售',
	teams1: '活动拼团',
	teams2: '活动组队',
	recruitment1: '求职通知',
	recruitment2: '招聘通知',
	daily1: '日常分享',
	other1: '其它',
}

module.exports = {
	formatDateTime,
	renderTime,
	typesFilters
}
