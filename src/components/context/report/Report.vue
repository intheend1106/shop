<!--  -->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts';

// 引入lodash
import _ from 'lodash';

export default {
  data() {
    return {
      // 定图表的配置项和数据
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      result: {}
    };
  },
  // 图表初始化是在页面渲染成功后
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 获取数据
    this.$http.get('reports/type/1').then(res => {
      console.log(res.data);
      if (res.data.meta.status !== 200) return this.$message.console.error('获取数据失败');
      this.result = res.data.data;
      // console.log(this.result);

      //  合并两个数据
      this.result = _.merge(res.data.data, this.option);

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.result);
    });
  }
};
</script>

<style  scoped>
</style>
