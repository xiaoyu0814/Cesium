export default {
	props: {
		showModal: {
			type: Boolean,
			default: false,
			required: true
		},
		modalName: {
			type: String,
			default: '',
			required: true
		}
	},
	methods: {
		// 弹出框关闭事件
		handleModalClose(modalName) {
			this.$emit('handleModalClose', modalName); // 处理modal的显示隐藏
		}
	}
}