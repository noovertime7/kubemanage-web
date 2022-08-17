<template>
  <div class="home">
    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">
      <!-- 面板1 集群资源卡片 -->
      <el-collapse-item title="集群资源" name="1">
        <el-row :gutter="10" style="margin-bottom: 10px;">
          <!-- 命名空间数量 -->
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{padding:'10px'}">
              <div style="float:left;padding-top:20%">
                <!-- 进度条 -->
                <!-- stroke-width 进度条的宽度 -->
                <!-- show-text 是否显示文字描述 -->
                <!-- percentage 进度百分比 -->
                <el-progress  :stroke-width="20" :show-text="false" type="circle" :percentage="namespaceActive/namespaceTotal * 100"></el-progress>
              </div>
              <div>
                <p class="home-node-card-title">命名空间: Active/总量</p>
                <p class="home-node-card-num">{{ namespaceActive }}/{{ namespaceTotal }}</p>
              </div>
            </el-card>
          </el-col>
          <!-- 服务数量 单个namespace中deployment的数量 -->
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{padding:'10px'}">
              <div>
                <p class="home-node-card-title">服务数</p>
                <p class="home-node-card-num">{{ deploymentTotal }}</p>
              </div>
            </el-card>
          </el-col>
          <!-- 实例数 单个namespace中pod的数量 -->
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{padding:'10px'}">
              <div>
                <p class="home-node-card-title">实例数</p>
                <p class="home-node-card-num">{{ podTotal }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- 面板2 节点资源卡片 -->
      <el-collapse-item title="节点资源" name="2">
        <el-row :gutter="10" style="margin-bottom: 10px;">
          <!-- 节点数量 -->
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{padding:'10px'}">
              <div style="float:left;padding-top:20%">
                <el-progress :stroke-width="20" :show-text="false" type="circle" :percentage="nodeTotal/nodeTotal * 100"></el-progress>
              </div>
              <div>
                <p class="home-node-card-title">节点: Ready/总数量</p>
                <p class="home-node-card-num">{{ nodeTotal }}/{{ nodeTotal }}</p>
              </div>
            </el-card>
          </el-col>
          <!-- CPU资源统计 -->
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{padding:'10px'}">
              <div style="float:left;padding-top:20%">
                <el-progress :stroke-width="20" :show-text="false" type="circle" :percentage="nodeCpuAllocatable/nodeCpuCapacity * 100"></el-progress>
              </div>
              <div>
                <p class="home-node-card-title">CPU: 可分配/容量</p>
                <p class="home-node-card-num">{{ nodeCpuAllocatable }}/{{ nodeCpuCapacity }}</p>
              </div>
            </el-card>
          </el-col>
          <!-- 内存资源统计 -->
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{padding:'10px'}">
              <div style="float:left;padding-top:20%">
                <el-progress :stroke-width="20" :show-text="false" type="circle" :percentage="nodeMemAllocatable/nodeMemCapacity * 100"></el-progress>
              </div>
              <div>
                <p class="home-node-card-title">内存: 可分配/容量</p>
                <p class="home-node-card-num">{{ specTrans(nodeMemAllocatable) }}Gi/{{ specTrans(nodeMemCapacity) }}Gi</p>
              </div>
            </el-card>
          </el-col>
          <!-- POD资源统计 -->
          <el-col :span="5">
            <el-card class="home-node-card" :body-style="{padding:'10px'}">
              <div style="float:left;padding-top:20%">
                <el-progress :stroke-width="20" :show-text="false" type="circle" :percentage="nodePodAllocatable/nodePodAllocatable * 100"></el-progress>
              </div>
              <div>
                <p class="home-node-card-title">POD: 可分配/容量</p>
                <p class="home-node-card-num">{{ nodePodAllocatable }}/{{ nodePodAllocatable }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- 面板3 资源统计画图 -->
      <el-collapse-item title="资源统计" name="3">
        <el-row :gutter="10">
          <!-- 每个namspace中pod数量的作图统计 -->
          <el-col :span="24" style="margin-bottom: 10px;">
            <el-card class="home-dash-card" :body-style="{padding:'10px'}">
              <!-- 这个div就是画图的内容，echarts初始化后会绑定到这个id上展示出来 -->
              <div id="podNumDash" style="height: 300px;">
              </div>
            </el-card>
          </el-col>
          <!-- 每个namespace中deployment数量的作图统计 -->
          <el-col :span="24">
            <el-card class="home-dash-card" :body-style="{padding:'10px'}">
              <div id="deployNumDash" style="height: 300px;">
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
//引入echarts
import * as echarts from 'echarts'
import {getNamespecelist} from "@/api/namespace";
import {getNodeList} from "@/api/node";
import {getDeploymentByNs, getdeploymentlist} from "@/api/deployment";
import {GetPodByNS, getPodList} from "@/api/pod";
export default {
  data() {
    return {
      //控制折叠面板的展开，表示打开所有的折叠面板
      activeNames: ["1", "2", "3"],
      //获取namespace的属性
      namespaceActive: 0,
      namespaceValue: 'default',
      namespaceTotal: 0,
      //获取node的属性
      nodeTotal: 0,
      //cpu可分配
      nodeCpuAllocatable: 0,
      //cpu总量
      nodeCpuCapacity: 0,
      //内存可分配
      nodeMemAllocatable: 0,
      //内存总量
      nodeMemCapacity: 0,
      //pod可分配
      nodePodAllocatable: 0,
      //pod总量
      nodePodCapacity: 0,
      getNodesData: {
        params: {}
      },
      //获取deployment的数量
      deploymentTotal: 0,
      getDeploymentsData: {
        params: {
          namespace: '',
        }
      },
      //获取pod的数量
      podTotal: 0,
      getPodsData: {
        params: {
          namespace: '',
        }
      },
      //每个namespace中pod的数量[{namespace:"default",pod_num:5}]
      podNumNp: [],
      //每个namespace中deployment的数量[{namespace:"default",deployment_num:5}]
      deploymentNumNp: [],
    }
  },
  methods: {
    //获取namespace的数量
    getNamespaces() {
      getNamespecelist()
          .then(res => {
            this.namespaceTotal = res.data.total
            let namespaceList = res.data.items
            //处理namespace active的数量
            let index
            for (index in namespaceList) {
              if (namespaceList[index].status.phase === "Active" ) {
                this.namespaceActive = this.namespaceActive + 1
              }
            }
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //用于内存数据的转换
    specTrans(num) {
      let a = num / 1024 / 1024
      //四舍五入保留小数点0位，也就是去除小数点
      return a.toFixed(0)
    },
    //获取node属性
    getNodes() {
      getNodeList(this.getNodesData.params)
          .then(res => {
            this.nodeTotal = res.data.total
            let nodeList = res.data.items
            let index
            for (index in nodeList) {
              //正则匹配纯数字，如果不是纯数字则跳过
              let isnum = /^\d+$/.test(nodeList[index].status.allocatable.cpu);
              if (!isnum) {
                continue
              }
              //计算node的cpu mem和pod的可分配及总容量数据
              this.nodeCpuAllocatable = parseInt(nodeList[index].status.allocatable.cpu) + this.nodeCpuAllocatable
              this.nodeCpuCapacity = parseInt(nodeList[index].status.capacity.cpu) + this.nodeCpuCapacity
              this.nodeMemAllocatable = parseInt(nodeList[index].status.allocatable.memory) + this.nodeMemAllocatable
              this.nodeMemCapacity = parseInt(nodeList[index].status.capacity.memory) + this.nodeMemCapacity
              this.nodePodAllocatable = parseInt(nodeList[index].status.allocatable.pods) + this.nodePodAllocatable
              this.nodePodCapacity = parseInt(nodeList[index].status.capacity.pods) + this.nodePodCapacity
            }
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //获取命名空间下的deployment总数
    getDeployments() {
      this.getDeploymentsData.params.namespace = this.namespaceValue
      getdeploymentlist(this.getDeploymentsData.params)
          .then(res => {
            this.deploymentTotal = res.data.total
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //获取命名空间下的pod总数
    getPods() {
      this.getPodsData.params.namespace = this.namespaceValue
      getPodList(this.getPodsData.params)
          .then(res => {
            this.podTotal = res.data.total
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //获取每个namespace中deployment的数量
    getDeploymentNumNp() {
      getDeploymentByNs()
          .then(res => {
            this.deploymentNumNp = res.data
            //echarts作图
            this.getDeployNumDash()
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //获取每个namespace中pod的数量
    getPodNumNp() {
      GetPodByNS()
          .then(res => {
            this.podNumNp = res.data
            //echarts作图
            this.getPodNumDash()
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    getPodNumDash(){
      //若实例已经初始化了，则销毁实例
      if (this.podNumDash != null && this.podNumDash != "" && this.podNumDash != undefined) {
        this.podNumDash.dispose()
      }
      //初始化实例，绑定到dom上
      this.podNumDash = echarts.init(document.getElementById('podNumDash'));
      console.log(this.podNumNp)
      //echarts作图配置
      this.podNumDash.setOption({
        //标题及字体颜色
        title: { text: 'Pods per Namespace', textStyle: {color:'rgb(134, 135, 136)'}},
        //图表颜色
        color: ['#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
        //提示框
        tooltip: {
          //触发类型坐标轴触发
          trigger: "axis",
          //'cross' 十字准星指示器
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#76baf1"
            }
          }
        },
        //图表中的数据类型解释
        legend: {
          data: ['Pods']
        },
        //图表数据集
        dataset: {
          //维度定义，默认第一个元素表示x轴的数据，其他都是y轴数据
          dimensions: ['namespace','pod_num'],
          //源数据
          source: this.podNumNp
        },
        //x轴属性
        xAxis: {
          //category类目轴，value数值轴，time时间轴，log对数轴
          type: 'category',
          //轴标签
          axisLabel:{
            //坐标轴刻度标签的显示间隔，在类目轴中有效.0显示所有
            interval: 0,
            //格式化轴标签
            formatter: function (value) {
              return value.length>5?value.substring(0,5)+'...':value
            }
          },
        },
        //y轴属性
        yAxis: [
          //数值轴
          {type: 'value'}
        ],
        //定义系列，用于指定一组数值以及他们映射成的图
        series: [{
          //name是legend对应的值
          name: 'Pods',
          //bar柱状图，line折线图，pie饼图等等
          type: 'bar',
          //每个类目的值标签，配置
          label: {
            //是否显示值
            show: true,
            //显示的位置
            position: 'top'
          }
        }
        ]
      });
    },
    getDeployNumDash(){
      if (this.deployNumDash != null && this.deployNumDash != "" && this.deployNumDash != undefined) {
        this.deployNumDash.dispose()
      }
      this.deployNumDash = echarts.init(document.getElementById('deployNumDash'));

      this.deployNumDash.setOption({
        title: { text: 'Deployments per Namespace', textStyle: {color:'rgb(134, 135, 136)'}},
        color: ['#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
        tooltip: { trigger: "axis", axisPointer: { type: "cross", label: { backgroundColor: "#76baf1" } } },
        legend: {
          data: ['Deployments']
        },
        dataset: {
          // 提供一份数据。
          dimensions: ['namespace','deployment_num'],
          source: this.deploymentNumNp
        },
        xAxis: {
          type: 'category',
          axisLabel:{
            interval: 0,
            formatter: function (value) {
              return value.length>5?value.substring(0,5)+'...':value
            }
          },
        },
        yAxis: [
          {type: 'value'}
        ],
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [{
          name: 'Deployments',
          type: 'bar',
          label: {
            show: true,
            position: 'top'
          }
        }
        ]
      });
    },
  },
  beforeMount() {
    this.getNamespaces()
    this.getNodes()
    this.getDeployments()
    this.getPods()
    this.getDeploymentNumNp()
    this.getPodNumNp()
  }
}
</script>

<style scoped>
/deep/ .el-collapse-item__header {
  font-size: 16px;
}
.home-node-card {
  border-radius:1px;
  text-align: center;
  background-color: rgb(250, 253, 255);
}
.home-dash-card {
  border-radius:1px;
}
.home-node-card-title {
  font-size: 12px;
}
.home-node-card-num {
  font-size: 22px;
  font-weight: bold;
  color: rgb(63, 92, 135);
}
/deep/ .el-progress-circle {
  height: 50px !important;
  width: 50px !important;
}
</style>