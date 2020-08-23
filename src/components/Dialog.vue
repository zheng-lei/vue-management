<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :show="isShow" @close="cancelFun" width='500px'>
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelFun" v-show="cancelBtnVisible">取消</el-button>
      <el-button type="primary" @click="confirmFun" v-show="confirmBtnVisible">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "Dialog",
  props: {
    title: {//弹窗标题
      type: String,
      default: "",
    },
    cancelBtnVisible: {//是否显示取消按钮
      type: Boolean,
      default: true,
    },
    confirmBtnVisible: {//是否显示确认按钮
      type: Boolean,
      default: true,
    },
    isShow: {//是否显示弹窗
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: this.isShow,
    };
  },
  watch: {
    isShow: {
      immediate: true, //表示首次绑定时是否执行handler
      handler() {
        this.dialogVisible = this.isShow;
      },
    },
  },
  methods: {
    cancelFun() {
      this.$emit("update:isShow", false);
    },
    confirmFun() {
      this.$emit("confirmBtnClick");
    }
  },
};
</script>