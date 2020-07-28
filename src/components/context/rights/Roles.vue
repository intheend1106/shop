<!--  -->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-button type="primary" style="font-size:12px">添加角色</el-button>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter','bdbottom', index1===0 ? 'bdtop':'']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  class="vcenter"
                  :class="index2===0 ? '':'bdtop'"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightTag(scope.row,item1.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      @close="removeRightTag(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <pre>
            {{scope.row}}
            </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="settingDialogVisible"
        width="50%"
        @close="RightsDialogClose"
      >
        <!-- 树形控件 -->
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="settingDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRolesRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      settingDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的数组
      defKeys: [],
      // 角色的ID
      roleId: ''
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 获取角色数据
    getRoles() {
      this.$http.get('roles').then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) return this.$message.error('获取角色数据失败');
        this.rolesList = res.data.data;
      });
    },
    // 根据tag的id来删除标签
    removeRightTag(role, rightId) {
      console.log(role.id, rightId);
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除权限成功!'
          });
          this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(res => {
            console.log(res.data);
            // this.getRoles();
            // 为当前角色重新更新一下权限
            role.children = res.data.data;
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消该操作'
          });
        });
    },
    // 分配权限
    setRightDialog(role) {
      // 获取所有权限列表的数据
      this.$http.get('rights/tree').then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) return this.$message.error('获取所有权限列表的数据失败');
        this.rightsList = res.data.data;
      });
      // 获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
      this.settingDialogVisible = true;
      this.roleId = role.id;
      console.log(this.roleId);
    },
    // 通过递归的形式，获取角色下的所有三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 判断是否为三级节点
      if (!node.children) return arr.push(node.id);
      // 若不是三级节点
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 每次关闭分配权限的时候，清空数组
    RightsDialogClose() {
      this.defKeys = [];
    },
    // 给角色授权
    setRolesRights() {
      // 获取所有选中的和半选中的节点的key值
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()];
      console.log(keys);
      const idStr = keys.join(',');
      console.log(idStr);
      this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr }).then(res => {
        console.log(res.data);
        if (res.data.meta.status !== 200) return this.$message.error('分配权限失败');
        this.$message.success('分配权限成功');
        this.getRoles();
        this.settingDialogVisible = false;
      });
    }
  }
};
</script>

<style  scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
