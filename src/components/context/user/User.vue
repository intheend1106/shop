<!--  -->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisable"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="setRolesDialogClosed"
    >
      <div>
        <p>当前的用户名称：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  </div>
</template>

<script>
export default {
  data() {
    //  验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error('请输入合法的邮箱'));
    };
    //  验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error('请输入合法的手机号码'));
    };
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的数据验证规则对象
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 打开编辑对话框
      editDialogVisable: false,
      // 编辑用户的表单数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色的对话框
      setRolesDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的名称
      rolesList: [],
      // 选中的角色
      selectedRoleId: ''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http
        .get('users', {
          params: this.queryInfo
        })
        .then(res => {
          console.log(res.data);
          if (res.data.meta.status !== 200) return this.$message.error('获取用户数据失败');
          const data = res.data.data;
          this.userList = data.users;
          this.total = data.total;
        });
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      // 再重新去调用getUserList函数
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch开关的状态改变
    userStateChange(userinfo) {
      console.log(userinfo);
      this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('更新用户状态失败');
        }
        this.$message.success('更新用户状态成功');
      });
    },
    // 点击添加对话框，关闭，并清空数据
    addDialogClosed() {
      this.$refs.addForm.resetFields();
    },
    // 点击确定，添加新用户
    addUser() {
      this.$refs.addForm.validate(valid => {
        console.log(valid);
        if (!valid) return;
        // 发起添加新用户的网络请求
        this.$http.post('users', this.addForm).then(res => {
          console.log(res.data);
          if (res.data.meta.status !== 201) return this.$message.error('添加用户失败');
          const data = res.data.data;
          this.$message.success('添加用户成功');
          this.dialogVisible = false;
          // 用户新增，则需要重新刷一下数据
          this.getUserList();
        });
      });
    },
    // 修改用户 根据id查询用户信息
    showEditDialog(id) {
      this.editDialogVisable = true;
      console.log(id);
      // 请求数据
      this.$http.get('users/' + id).then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) return this.$message.error('查询用户信息失败');
        const data = res.data.data;
        this.editForm = data;
      });
    },
    // 点击编辑对话框，关闭，并清空数据
    editDialogClosed() {
      this.$refs.editForm.resetFields();
    },
    // 修改用户数据
    editUserInfo() {
      this.$refs.editForm.validate(valid => {
        console.log(valid);
        if (!valid) return;
        // 发起修改数据的网络请求
        this.$http
          .put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(res => {
            console.log(res);
            if (res.data.meta.status !== 200) return this.$message.error('修改数据失败');
            // 修改数据对话框关闭
            this.editDialogVisable = false;
            // 修改数据成功，再请求数据更新
            this.getUserList();
            // 提示修改数据成功
            this.$message.success('修改数据成功');
          });
      });
    },
    // 根据ID删除用户
    removeUser(id) {
      console.log(id);
      // 弹框询问用户是否永久删除数据
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
          // 发起删除的网络请求
          this.$http.delete('users/' + id).then(res => {
            console.log(res.data);
            if (res.data.meta.status !== 200) return this.$message.error('删除失败');
            // 删除后 重新发起更新数据
            this.getUserList();
            this.$message.success('删除用户数据成功');
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 分配角色
    setRoles(userInfo) {
      //  获取所有角色的名称
      this.$http.get('roles').then(res => {
        console.log(res.data);
        this.rolesList = res.data.data;
      });

      this.setRolesDialogVisible = true;
      console.log(userInfo);
      this.userInfo = userInfo;
    },
    // 点击确定，保存分配的角色
    saveRoles() {
      // 先判断用户有没有选择新角色
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色');
      this.$http
        .put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId
        })
        .then(res => {
          console.log(res.data);
          if (res.data.meta.status !== 200) return this.$message.error('保存新角色失败');
          this.$message.success('保存新角色成功');
          this.getUserList();
          this.setRolesDialogVisible = false;
        });
    },
    // 分配角色对话框关闭，则清空数据
    setRolesDialogClosed() {
      this.selectedRoleId = '';
      this.userInfo = {};
    }
  }
};
</script>

<style  scoped>
</style>
