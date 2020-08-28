<template>
  <div class="users-wrap">
    <div class="users-opr">
      <div class="opr-list">
        <el-button type="primary" @click="addUserClick">添加</el-button>
        <el-button type="primary" @click="modifyUserClick">修改</el-button>
        <el-button type="primary" @click="delUserClick">删除</el-button>
        <el-input placeholder="请输入用户名" prefix-icon="el-icon-search" class="user-search" v-model="keyword" @change="queryUser"></el-input>
      </div>
    </div>
    <div class="users-container">
      <el-table
        border
        :data="usersTableData"
        style="height:calc(100% - 62px)"
        stripe
        @selection-change="handleSelectionChange"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.6)"
      >
        <!-- <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="'http://118.25.93.129:8083/api/v1/storages/' + scope.row.userinfo.avator_id + '?token=' + token" />
          </template>
        </el-table-column>-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="用户组" prop="groups"></el-table-column>
        <el-table-column label="角色" prop="roles" :formatter="columnFormatter"></el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        background
      ></el-pagination>
      <Dialog
        :isShow.sync="addUserDialogVisible"
        :title="userDialogTitle"
        @confirmBtnClick="userDialogClick"
      >
        <div class="upload-img">
          <el-upload
            class="avatar-uploader"
            :action="joinUrl('/api/v1/storages/upload/avators')"
            :show-file-list="false"
            :on-success="updateAvator"
          >
            <img :src="imageUrl" class="avatar" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="small" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请输入用户名" v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="姓" prop="userinfo.first_name" class="first-name">
            <el-input placeholder="姓氏" v-model="ruleForm.userinfo.first_name"></el-input>
          </el-form-item>
          <el-form-item label="名" prop="userinfo.last_name" class="last-name">
            <el-input placeholder="名字" v-model="ruleForm.userinfo.last_name"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="userinfo.age">
            <el-input placeholder="年龄" v-model.number="ruleForm.userinfo.age"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="userinfo.sex">
            <el-radio v-model="ruleForm.userinfo.sex" :label="1">男</el-radio>
            <el-radio v-model="ruleForm.userinfo.sex" :label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-show="!isModify">
            <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeatPassword" v-show="!isModify">
            <el-input type="password" placeholder="请再次输入密码" v-model="ruleForm.repeatPassword"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenum">
            <el-input placeholder="请输入手机号码" v-model="ruleForm.phonenum"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="ruleForm.email"></el-input>
          </el-form-item>
        </el-form>
      </Dialog>
    </div>
  </div>
</template>

<script>
import Dialog from "@/components/Dialog";
export default {
  name: "Users",
  components: {
    Dialog,
  },
  data() {
    let validatePass = (rule, val, callback) => {
      if (val === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.repeatPassword !== "") {
          this.$refs.ruleForm.validateField("repeatPassword");
        }
        callback();
      }
    };
    let validateRepeatPass = (role, val, callback) => {
      if (val === "") {
        callback(new Error("请再次输入密码"));
      } else if (val !== this.ruleForm.password) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      userDialogTitle: "",
      usersTableData: [],
      selectionData: [],
      addUserDialogVisible: false,
      ruleForm: {
        username: "",
        password: "",
        repeatPassword: "",
        phonenum: "",
        email: "",
        userinfo: {
          first_name: "",
          last_name: "",
          sex: 1,
          age: null,
          avator_id: 2,
        },
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        repeatPassword: [
          {
            validator: validateRepeatPass,
            trigger: "blur",
          },
        ],
        userinfo: {
          age: [
            {
              type: "number",
              message: "年龄必须为数字值",
              trigger: "blur",
            },
          ],
        },
      },
      imageUrl: this.joinUrl("/api/v1/storages/2"),
      get header() {
        return "Bearer " + window.sessionStorage.getItem("access_token");
      },
      isModify: false,
      currentPage: 1,
      totalPage: null,
      loading: false,
      keyword: ""
      // token: window.sessionStorage.getItem("access_token")
    };
  },
  created() {
    this.initUsersTable();
  },
  watch: {
    addUserDialogVisible: {
      mmediate: true, //表示首次绑定时是否执行handler
      handler() {
        if (!this.addUserDialogVisible) {
          this.$refs.ruleForm.resetFields();
          this.ruleForm = {
            username: "",
            password: "",
            repeatPassword: "",
            phonenum: "",
            email: "",
            userinfo: {
              first_name: "",
              last_name: "",
              sex: 1,
              age: null,
              avator_id: 2,
            },
          };
        }
      },
    },
  },
  methods: {
    //获取表格数据
    async initUsersTable(keyword) {
      let param ={
        username: ''
      };
      if(keyword !== undefined){
        param = {
          username: this.keyword
        }
      }
      this.loading = true;
      await this.$axios({
        methods: "get",
        url: "/api/v1/users",
        params: param,
      }).then((data) => {
        this.usersTableData = data.data.data;
        this.totalPage = data.data.meta.total;
        this.loading = false;
      });
    },
    //表格角色展示处理
    columnFormatter(val) {
      let rolesArr = [];
      for (let k of val.roles) {
        rolesArr.push(k.name);
      }
      return rolesArr.join(",");
    },
    //获取表格选中项数据
    handleSelectionChange(val) {
      this.selectionData = val;
      console.log(val);
    },
    addUserClick() {
      this.userDialogTitle = "添加用户";
      this.addUserDialogVisible = true;
      this.isModify = false;
      this.imageUrl = this.joinUrl("/api/v1/storages/2");
      // this.$msgBox({
      //   title: '添加',//标题
      //   message: <p>111</p>,//正文
      //   showCancelButton: true,
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   beforeClose: (action, instance, done) => {
      //     if(action === 'confirm') {
      //       instance.confirmButtonLoading = true;
      //       instance.confirmButtonText = '执行中...';
      //       setTimeout(() => {
      //         done();
      //         setTimeout(() => {
      //           instance.confirmButtonLoading = false;
      //         },300)
      //       },3000)
      //     }else {
      //       done();
      //     }
      //   }

      // }).then(action => {
      //   console.log(action)
      //   this.$message({
      //     type: 'info',
      //     message: 'action:' + action
      //   })
      // }).catch(() => {})
    },
    userDialogClick() {
      let requestData = this.ruleForm;
      if (!this.isModify) {
        delete requestData.repeatPassword;
        this.$axios
          .put("/api/v1/users/register", requestData)
          .then((res) => {
            this.initUsersTable();
            this.addUserDialogVisible = false;
            this.$message({
              type: "success",
              message: "操作成功",
            });
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "操作失败",
            });
          });
      } else {
        delete requestData.repeatPassword;
        delete requestData.password;
        this.$axios
          .put(`/api/v1/users/${this.selectionData[0].id}`, requestData)
          .then((res) => {
            this.initUsersTable();
            this.addUserDialogVisible = false;
            this.$message({
              type: "success",
              message: "操作成功",
            });
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "操作失败",
            });
          });
      }
    },
    //头像上传成功处理
    updateAvator(res) {
      this.imageUrl = this.joinUrl(`/api/v1/storages/${res.data.file_id}`);
      this.ruleForm.userinfo.avator_id = res.data.file_id;
    },
    modifyUserClick() {
      if (this.selectionData.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择",
        });
      } else if (this.selectionData.length > 1) {
        this.$message({
          type: "warning",
          message: "只能选择一个用户",
        });
      } else {
        this.userDialogTitle = "修改用户";
        this.ruleForm.userinfo = this.selectionData[0].userinfo;
        this.ruleForm.username = this.selectionData[0].username;
        this.ruleForm.email = this.selectionData[0].email;
        this.ruleForm.phonenum = this.selectionData[0].phonenum;
        this.imageUrl = this.joinUrl(
          `/api/v1/storages/${this.selectionData[0].userinfo.avator_id}`
        );
        this.addUserDialogVisible = true;
        this.isModify = true;
      }
    },
    delUserClick() {
      if (this.selectionData.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择",
        });
      } else if (this.selectionData.length === 1) {
        this.$axios
          .delete(`/api/v1/users/${this.selectionData[0].id}`)
          .then((res) => {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.initUsersTable();
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "操作失败",
            });
          });
      } else {
        let lst = [];
        for (let val of this.selectionData) {
          lst.push(val.id);
        }
        this.$axios
          .delete("/api/v1/users", {
            data: {
              lst: lst,
            },
          })
          .then((res) => {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.initUsersTable();
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "操作失败",
            });
          });
      }
    },
    queryUser() {
      this.initUsersTable(this.keyword);
    }
  },
};
</script>

<style scoped>
.users-wrap {
  height: 100%;
}

.users-container {
  height: calc(100% - 60px);
}
.first-name {
  /* float: left; */
  display: inline-block;
}
.first-name .el-input,
.last-name .el-input {
  width: 130px;
}
.last-name {
  /* float: left; */
  display: inline-block;
}
.upload-img {
  width: 100%;
  height: 100px;
  margin-bottom: 18px;
  display: flex;
  align-content: center;
  justify-content: center;
}
.avatar-uploader {
  width: 100px;
  height: 100px;
  position: relative;
}
.el-upload {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.upload-img img {
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
  border-radius: 50px;
  text-align: center;
  line-height: 100px;
  position: absolute;
  top: 0;
}
.avatar-uploader-icon:hover {
  opacity: 1;
  animation: showicon 1s;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #eee;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  z-index: 999;
  position: absolute;
  top: 0;
  opacity: 0;
}
@keyframes showicon {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.el-pagination {
  margin-top: 10px;
  text-align: center;
}
.user-search {
  width: 290px;
  margin-left: auto;
}
</style>
