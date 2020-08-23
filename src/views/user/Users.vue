<template>
  <div class="users-wrap">
    <div class="users-opr">
      <div class="opr-list">
        <el-button type="primary" @click="addUserClick">添加</el-button>
        <el-button type="primary" @click="modifyUserClick">修改</el-button>
        <el-button type="primary" @click="delUserClick">删除</el-button>
      </div>
    </div>
    <div class="users-container">
      <el-table
        border
        :data="usersTableData"
        style="height:100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="'http://118.25.93.129:8083/api/v1/storages/' + scope.row.userinfo.avator_id + '?token=' + token" />
          </template>
        </el-table-column> -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="用户组" prop="groups"></el-table-column>
        <el-table-column label="角色" prop="roles" :formatter="columnFormatter"></el-table-column>
      </el-table>
      <Dialog :isShow.sync="addUserDialogVisible" title="添加用户" @confirmBtnClick="addUser">
        <div class="upload-img">
          <el-upload
            class="avatar-uploader"
            :action='joinUrl("/api/v1/storages/upload/avators")'
            
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
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeatPassword">
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
      usersTableData: [],
      selectionData: [],
      addUserDialogVisible: false,
      modifyUserDialogVisible: false,
      delUserDialogVisible: true,
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
        return "Bearer " + window.sessionStorage.getItem("access_token")
      },
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
        if(!this.addUserDialogVisible)
          this.$refs.ruleForm.resetFields();
      },
    },
  },
  methods: {
    async initUsersTable() {
      let data = await this.$axios({
        methods: "get",
        url: "/api/v1/users",
        params: {
          username: "",
        },
      });
      this.usersTableData = data.data.data;
      console.log(this.usersTableData);
    },
    columnFormatter(val) {
      let rolesArr = [];
      for (let k of val.roles) {
        rolesArr.push(k.name);
      }
      return rolesArr.join(",");
    },
    handleSelectionChange(val) {
      this.selectionData = val;
    },
    addUserClick() {
      this.addUserDialogVisible = true;
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
    addUser() {
      let requestData = this.ruleForm;
      delete requestData.repeatPassword;
      this.$axios.put("/api/v1/users/register", requestData).then((res) => {
        this.initUsersTable();
        this.addUserDialogVisible = false;
        this.$message({
          type: "success",
          message: "操作成功",
        });
      }).catch(err => {
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      });
    },
    updateAvator(res) {
      this.imageUrl = this.joinUrl(`/api/v1/storages/${res.data.file_id}`);
      this.ruleForm.userinfo.avator_id = res.data.file_id;
    },
    modifyUserClick() {
      this.modifyUserDialogVisible = true;
    },
    delUserClick() {
      this.delUserDialogVisible = true;
    },
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
</style>
