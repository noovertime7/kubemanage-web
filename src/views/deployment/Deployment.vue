<template>
  <div class="deploy">
    <el-row>
      <!-- 头部1 -->
      <el-col :span="24">
        <div>
          <!-- 包一层卡片 -->
          <el-card class="deploy-head-card" shadow="never" :body-style="{padding:'10px'}">
            <el-row>
              <!-- 命名空间的下拉框 -->
              <el-col :span="6">
                <div>
                  <span>命名空间: </span>
                  <!-- 下拉框 -->
                  <!-- filterable：带搜索功能 -->
                  <!-- placeholder 默认提示 -->
                  <!-- label 显示内容 -->
                  <!-- value 绑定到v-model的值中 -->
                  <el-select v-model="namespaceValue" filterable placeholder="请选择">
                    <el-option
                        v-for="(item, index) in namespaceList"
                        :key="index"
                        :label="item.metadata.name"
                        :value="item.metadata.name">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <!-- 刷新按钮 -->
              <el-col :span="2" :offset="16">
                <div>
                  <!-- 每次刷新，都重新调一次list接口，刷新表格中的数据 -->
                  <el-button style="border-radius:2px;" icon="Refresh" plain @click="getDeployments()">刷新</el-button>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 头部2 -->
      <el-col :span="24">
        <div>
          <!-- 包一层卡片 -->
          <el-card class="deploy-head-card" shadow="never" :body-style="{padding:'10px'}">
            <el-row>
              <!-- 创建按钮 -->
              <el-col :span="2">
                <div>
                  <!-- 点击后打开抽屉，填入创建deployment需要的数据 -->
                  <el-button style="border-radius:2px;" icon="Edit" type="primary" @click="createDeploymentDrawer = true" v-loading.fullscreen.lock="fullscreenLoading">创建</el-button>
                </div>
              </el-col>
              <!-- 搜索框和搜索按钮 -->
              <el-col :span="6">
                <div>
                  <el-input class="deploy-head-search" clearable placeholder="请输入" v-model="searchInput"></el-input>
                  <el-button style="border-radius:2px;" icon="Search" type="primary" plain @click="getDeployments()">搜索</el-button>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-col>
      <!-- 数据表格 -->
      <el-col :span="24">
        <div>
          <!-- 包一层卡片 -->
          <el-card class="deploy-body-card" shadow="never" :body-style="{padding:'5px'}">
            <!-- 数据表格 -->
            <!-- v-loading用于加载时的loading动画 -->
            <el-table
                style="width:100%;font-size:12px;margin-bottom:10px;"
                :data="deploymentList"
                v-loading="appLoading">
              <!-- 最左侧留出20px的宽度，更加没关 -->
              <el-table-column width="20"></el-table-column>
              <!-- deployment名字 -->
              <el-table-column align=left label="Deployment名">
                <!-- 插槽，scope.row获取当前行的数据 -->
                <template v-slot="scope">
                  <a class="deploy-body-deployname">{{ scope.row.metadata.name }}</a>
                </template>
              </el-table-column>
              <!-- 标签 -->
              <el-table-column align=center label="标签">
                <template v-slot="scope">
                  <!-- for循环，每个label只显示固定长度，鼠标悬停后气泡弹出框显示完整长度 -->
                  <div v-for="(val, key) in scope.row.metadata.labels" :key="key">
                    <!-- 气泡弹出框 -->
                    <!-- placement 弹出位置 -->
                    <!-- trigger 触发条件 -->
                    <!-- content 弹出框内容 -->
                    <el-popover
                        placement="right"
                        :width="200"
                        trigger="hover"
                        :content="key + ':' + val">
                      <template #reference>
                        <!-- ellipsis方法用于剪裁字符串 -->
                        <el-tag style="margin-bottom: 5px" type="warning">{{ ellipsis(key + ":" + val) }}</el-tag>
                      </template>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <!-- 容器组 -->
              <el-table-column align=center label="容器组">
                <!-- 可用数量/总数量,三元运算，若值大于0则显示值，否则显示0 -->
                <template v-slot="scope">
                  <span>{{ scope.row.status.availableReplicas>0?scope.row.status.availableReplicas:0  }} / {{ scope.row.spec.replicas>0?scope.row.spec.replicas:0 }} </span>
                </template>
              </el-table-column>
              <!-- 创建时间 -->
              <el-table-column align=center min-width="100" label="创建时间">
                <!-- timeTrans函数用于将格林威治时间转成北京时间 -->
                <template v-slot="scope">
                  <el-tag type="info">{{ timeTrans(scope.row.metadata.creationTimestamp) }} </el-tag>
                </template>
              </el-table-column>
              <!-- 容器镜像 -->
              <el-table-column align=center label="镜像">
                <!-- 与label的显示逻辑一致 -->
                <template v-slot="scope">
                  <div v-for="(val, key) in scope.row.spec.template.spec.containers" :key="key">
                    <el-popover
                        placement="right"
                        :width="200"
                        trigger="hover"
                        :content="val.image">
                      <template #reference>
                        <el-tag style="margin-bottom: 5px">{{ ellipsis(val.image.split('/')[2]==undefined?val.image:val.image.split('/')[2]) }}</el-tag>
                      </template>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
              <!-- 操作列，放按钮 -->
              <el-table-column align=center label="操作" width="400">
                <template v-slot="scope">
                  <el-button size="small" style="border-radius:2px;" icon="Edit" type="primary" plain @click="getDeploymentDetail(scope)">YAML</el-button>
                  <el-button size="small" style="border-radius:2px;" icon="Plus" type="primary" @click="handleScale(scope)">扩缩</el-button>
                  <el-button size="small" style="border-radius:2px;" icon="RefreshLeft" type="primary" @click="handleConfirm(scope, '重启', restartDeployment)">重启</el-button>
                  <el-button size="small" style="border-radius:2px;" icon="Delete" type="danger" @click="handleConfirm(scope, '删除', delDeployment)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页配置 -->
            <!-- background 背景色灰 -->
            <!-- size-change 单页大小改变后触发 -->
            <!-- current-change 页数改变后触发 -->
            <!-- current-page 当前页 -->
            <!-- page-size 单页大小 -->
            <!-- layout 分页器支持的功能 -->
            <!-- total 数据总条数 -->
            <el-pagination
                class="deploy-body-pagination"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pagesizeList"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="deploymentTotal">
            </el-pagination>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 抽屉：创建Deployment的表单 -->
    <!-- v-model 值是bool，用于显示与隐藏 -->
    <!-- direction 显示的位置 -->
    <!-- before-close 关闭时触发，点击关闭或者点击空白都会触发 -->
    <el-drawer
        v-model="createDeploymentDrawer"
        :direction="direction"
        :before-close="handleClose">
      <!-- 插槽，抽屉标题 -->
      <template #title>
        <h4>创建Deployment</h4>
      </template>
      <!-- 插槽，抽屉body -->
      <template #default>
        <!-- flex布局,居中 -->
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <!-- ref绑定控件后，js中才能用this.$ref获取该控件 -->
            <!-- rules 定义form表单校验规则 -->
            <el-form ref="createDeployment" :rules="createDeploymentRules" :model="createDeployment" label-width="80px">
              <!-- prop用于rules中的校验规则的key -->
              <el-form-item class="deploy-create-form" label="名称" prop="name">
                <el-input v-model="createDeployment.name"></el-input>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="命名空间" prop="namespace">
                <el-select v-model="createDeployment.namespace" filterable placeholder="请选择">
                  <el-option
                      v-for="(item, index) in namespaceList"
                      :key="index"
                      :label="item.metadata.name"
                      :value="item.metadata.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 数字输入框，最小为1，最大为10 -->
              <el-form-item class="deploy-create-form" label="副本数" prop="replicas">
                <el-input-number v-model="createDeployment.replicas" :min="1" :max="10"></el-input-number>
                <!-- 气泡弹出框用于提醒上限 -->
                <el-popover
                    placement="top"
                    :width="100"
                    trigger="hover"
                    content="申请副本数上限为10个">
                  <template #reference>
                    <el-icon style="width:2em;font-size:18px;color:#4795EE"><WarningFilled/></el-icon>
                  </template>
                </el-popover>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="镜像" prop="image">
                <el-input v-model="createDeployment.image"></el-input>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="标签" prop="label_str">
                <el-input v-model="createDeployment.label_str" placeholder="示例: project=ms,app=gateway"></el-input>
              </el-form-item>
              <!-- 下拉框，用于规格的选择，之后用/分割，得到cpu和内存 -->
              <el-form-item class="deploy-create-form" label="资源配额" prop="resource">
                <el-select v-model="createDeployment.resource" placeholder="请选择">
                  <el-option value="0.5/1" label="0.5C1G"></el-option>
                  <el-option value="1/2" label="1C2G"></el-option>
                  <el-option value="2/4" label="2C4G"></el-option>
                  <el-option value="4/8" label="4C8G"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="容器端口" prop="container_port">
                <el-input v-model="createDeployment.container_port" placeholder="示例: 80"></el-input>
              </el-form-item>
              <el-form-item class="deploy-create-form" label="健康检查" prop="health">
                <el-switch v-model="createDeployment.health_check" />
              </el-form-item>
              <el-form-item class="deploy-create-form" label="检查路径" prop="healthPath">
                <el-input v-model="createDeployment.health_path" placeholder="示例: /health"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </template>
      <!-- 插槽，抽屉footer -->
      <template #footer>
        <!-- 点击后赋值false，隐藏抽屉 -->
        <el-button @click="createDeploymentDrawer = false">取消</el-button>
        <el-button type="primary" @click="submitForm('createDeployment')">立即创建</el-button>
      </template>
    </el-drawer>
    <!-- 展示YAML信息的弹框 -->
    <el-dialog title="YAML信息" v-model="yamlDialog" width="45%" top="2%">
      <!-- codemirror编辑器 -->
      <!-- border 带边框 -->
      <!-- options  编辑器配置 -->
      <!-- change 编辑器中的内容变化时触发 -->
      <codemirror
          v-model:value="contentYaml"
          border
          :options="cmOptions"
          :style="{ height: '500px' }"
          :autofocus="true"
          :tab-size="2"
          @change="onChange"
      ></codemirror>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="this.yamlDialog = false">取 消</el-button>
                    <el-button type="primary" @click="updateDeployment()">更 新</el-button>
                </span>
      </template>
    </el-dialog>
    <!-- 调整副本数的弹框 -->
    <el-dialog title="副本数调整" v-model="scaleDialog" width="25%">
      <div style="text-align:center">
        <span>实例数: </span>
        <el-input-number :step="1" v-model="scaleNum" :min="0" :max="30" label="描述文字"></el-input-number>
      </div>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="scaleDialog = false">取 消</el-button>
                    <el-button type="primary" @click="scaleDeployment()">更 新</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import common from "../common/Config";
import yaml2obj from 'js-yaml';
import json2yaml from 'json2yaml';
import {
  createDeployment, deleteDeployment,
  getdeploymentdetail,
  getdeploymentlist,
  restartdeployment,
  scaledeployment,
  updatedeployment
} from "@/api/deployment";
import {getNamespecelist} from "@/api/namespace";



export default {
  data() {
    return {
      //编辑器配置
      cmOptions: {
        // 语言及语法模式
        mode: 'text/yaml',
        // 主题
        theme: 'darcula',
        // 显示行数
        lineNumbers: true,
        smartIndent: true, //智能缩进
        indentUnit: 4, // 智能缩进单元长度为 4 个空格
        styleActiveLine: true, // 显示选中行的样式
        matchBrackets: true, //每当光标位于匹配的方括号旁边时，都会使其高亮显示
        readOnly: false,
        lineWrapping: true //自动换行
      },
      contentYaml: '',
      //分页
      currentPage: 1,
      pagesize: 10,
      pagesizeList: [10, 20, 30],
      //搜索框内容
      searchInput: '',
      //命名空间
      namespaceValue: 'default',
      namespaceList: [],
      //列表
      appLoading: false,
      deploymentList: [],
      deploymentTotal: 0,
      getDeploymentsData: {
        url: common.k8sDeploymentList,
        params: {
          filter_name: '',
          namespace: '',
          page: '',
          limit: '',
        }
      },
      //创建
      fullscreenLoading: false,
      direction: 'rtl',
      createDeploymentDrawer: false,
      createDeployment: {
        name: '',
        namespace: '',
        replicas: 1,
        image: '',
        resource: '',
        health_check: false,
        health_path: '',
        label_str: '',
        label: {},
        container_port: ''
      },
      //创建请求的参数
      createDeploymentData: {
        url: common.k8sDeploymentCreate,
        params: {}
      },
      //创建deployment的表单校验规则
      createDeploymentRules: {
        name: [{
          required: true,
          message: '请填写名称',
          trigger: 'change'
        }],
        image: [{
          required: true,
          message: '请填写镜像',
          trigger: 'change'
        }],
        namespace: [{
          required: true,
          message: '请选择命名空间',
          trigger: 'change'
        }],
        resource: [{
          required: true,
          message: '请选择配额',
          trigger: 'change'
        }],
        label_str: [{
          required: true,
          message: '请填写标签',
          trigger: 'change'
        }],
        container_port: [{
          required: true,
          message: '请填写容器端口',
          trigger: 'change'
        }],
      },
      //详情
      deploymentDetail: {},
      getDeploymentDetailData: {
        params: {
          deployment_name: '',
          namespace: ''
        }
      },
      //yaml更新
      yamlDialog: false,
      updateDeploymentData: {
        params: {
          namespace: '',
          content: ''
        }
      },
      //扩缩容
      scaleNum: 0,
      scaleDialog: false,
      scaleDeploymentData: {
        params: {
          deployment_name: '',
          namespace: '',
          scale_num: ''
        }
      },
      //重启
      restartDeploymentData: {
        params: {
          deployment_name: '',
          namespace: '',
        }
      },
      //删除
      delDeploymentData: {
        params: {
          deployment_name: '',
          namespace: '',
        }
      },
    }
  },
  methods: {
    //json转yaml方法
    transYaml(content) {
      return json2yaml.stringify(content)
    },
    //yaml转对象
    transObj(content) {
      return yaml2obj.load(content)
    },
    //编辑器内容变化时触发的方式,用于将更新的内容复制到变量中
    onChange(val) {
      this.contentYaml = val
    },
    //页面大小发生变化时触发，赋值并重新获取列表
    handleSizeChange(size) {
      this.pagesize = size;
      this.getDeployments()
    },
    //页数发生变化时触发，复制并重新获取列表
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getDeployments()
    },
    //处理抽屉的关闭，增加体验感
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
    },
    //字符串截取、拼接并返回
    ellipsis(value) {
      return value.length>15?value.substring(0,15)+'...':value
    },
    //格林威治时间转为北京时间
    timeTrans(timestamp) {
      let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
      date = date.toJSON();
      date = date.substring(0, 19).replace('T', ' ')
      return date
    },
    //获取Namespace列表
    getNamespaces() {
      getNamespecelist().then(res => {
            this.namespaceList = res.data.items
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //获取Deployment列表
    getDeployments() {
      //表格加载动画开启
      this.appLoading = true
      //getDeploymentsData是用于发起deployment列表请求的专用的对象，里面有url和params参数,以下是赋值
      this.getDeploymentsData.params.filter_name = this.searchInput
      this.getDeploymentsData.params.namespace = this.namespaceValue
      this.getDeploymentsData.params.page = this.currentPage
      this.getDeploymentsData.params.limit = this.pagesize
      getdeploymentlist(this.getDeploymentsData.params).then(res => {
            //响应成功，获取deployment列表和total
            this.deploymentList = res.data.items
            this.deploymentTotal = res.data.total
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
      //加载动画关闭
      this.appLoading = false
    },
    //获取deployment详情，e参数标识传入的scope插槽，.row是该行的数据
    getDeploymentDetail(e) {
      this.getDeploymentDetailData.params.deployment_name = e.row.metadata.name
      this.getDeploymentDetailData.params.namespace = this.namespaceValue
      getdeploymentdetail(this.getDeploymentDetailData.params).then(res => {
            //响应成功，获得deployment详情
            this.deploymentDetail = res.data
            //将对象转成yaml格式的字符串
            this.contentYaml = this.transYaml(this.deploymentDetail)
        console.log(this.contentYaml)
            //打开弹出框
            this.yamlDialog = true
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //更新deployment
    updateDeployment() {
      //将yaml格式的deployment对象转为json
      let content = JSON.stringify(this.transObj(this.contentYaml))
      this.updateDeploymentData.params.namespace = this.namespaceValue
      this.updateDeploymentData.params.content = content
      updatedeployment(this.updateDeploymentData.params)
          .then(res => {
            this.$message.success({
              message: res.msg
            })
            //更新后重新获取列表
            this.getDeployments()
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
      //关闭弹出框
      this.yamlDialog = false
    },
    //扩缩容的中间方法，用于赋值及打开弹出框
    handleScale(e) {
      this.scaleDialog = true
      this.deploymentDetail = e.row
      this.scaleNum = e.row.spec.replicas
    },
    //扩缩容deployment
    scaleDeployment() {
      this.scaleDeploymentData.params.deployment_name = this.deploymentDetail.metadata.name
      this.scaleDeploymentData.params.namespace = this.namespaceValue
      this.scaleDeploymentData.params.scale_num = this.scaleNum
      scaledeployment(this.scaleDeploymentData.params)
          .then(res => {
            this.$message.success({
              message: res.msg
            })
            //更新后重新获取列表
            this.getDeployments()
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
      //关闭弹出框
      this.scaleDialog = false
    },
    //重启deployment
    restartDeployment(e) {
      this.restartDeploymentData.params.deployment_name = e.row.metadata.name
      this.restartDeploymentData.params.namespace = this.namespaceValue
      restartdeployment(this.restartDeploymentData.params)
          .then(res => {
            this.$message.success({
              message: res.msg
            })
            this.getDeployments()
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //删除deployment
    delDeployment(e) {
      this.delDeploymentData.params.deployment_name = e.row.metadata.name
      this.delDeploymentData.params.namespace = this.namespaceValue
      deleteDeployment(this.delDeploymentData.params)
          .then(res => {
            this.$message.success({
              message: res.msg
            })
            this.getDeployments()
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
    },
    //弹出确认框，用于危险操作的double check
    //obj是行数据，opeateName是操作名，fn是操作的方法
    handleConfirm(obj, operateName, fn) {
      this.confirmContent = '确认继续 ' + operateName + ' 操作吗？'
      //$confirm用于弹出确认框
      this.$confirm(this.confirmContent,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
          .then(() => {
            fn(obj)
          })
          .catch(() => {
            this.$message.info({
              message: '已取消操作'
            })
          })
    },
    //创建deployment，加Func的原因是因为createDeploy用于属性了
    createDeployFunc() {
      //正则匹配，验证label的合法性
      let reg = new RegExp("(^[A-Za-z]+=[A-Za-z0-9]+).*")
      if (!reg.test(this.createDeployment.label_str)) {
        this.$message.warning({
          message: "标签填写异常，请确认后重新填写"
        })
        return
      }
      //加载loading动画
      this.fullscreenLoading = true
      //定义label、cpu和memory变量
      let label = new Map()
      let cpu, memory
      //将label字符串转成数组
      let a = (this.createDeployment.label_str).split(",")
      //将数组转成map
      a.forEach(item => {
        let b = item.split("=")
        label[b[0]] = b[1]
      })
      //将deployment的规格转成cpu和memory
      let resourceList = this.createDeployment.resource.split("/")
      cpu = resourceList[0]
      memory = resourceList[1] + "Gi"
      //赋值
      this.createDeploymentData.params = this.createDeployment
      this.createDeploymentData.params.container_port = parseInt(this.createDeployment.container_port)
      this.createDeploymentData.params.label = label
      this.createDeploymentData.params.cpu = cpu
      this.createDeploymentData.params.memory = memory
      createDeployment(this.createDeploymentData.params)
          .then(res => {
            this.$message.success({
              message: res.msg
            })
            //创建后重新获取列表
            this.getDeployments()
          })
          .catch(res => {
            this.$message.error({
              message: res.msg
            })
          })
      //重置表单
      this.resetForm('createDeployment')
      //关闭加载动画
      this.fullscreenLoading = false
      //关闭抽屉
      this.createDeploymentDrawer = false
    },
    //重置表单方法，element plus课程讲过的
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    //提交表单，校验参数合法性
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createDeployFunc()
        } else {
          return false;
        }
      })
    }
  },
  watch: {
    //监听namespace的值,若发生变化，则执行handler方法中的内容
    namespaceValue: {
      handler() {
        //将namespace的值存入本地，用于path切换时依旧能获取得到
        localStorage.setItem('namespace', this.namespaceValue)
        //重置当前页为1
        this.currentPage = 1
        //获取deployment列表
        this.getDeployments()
      }
    },
  },
  beforeMount() {
    //加载页面时先获取localStorage中的namespace值，若获取不到则默认default
    if (localStorage.getItem('namespace') !== undefined && localStorage.getItem('namespace') !== null) {
      this.namespaceValue = localStorage.getItem('namespace')
    }
    this.getNamespaces()
    this.getDeployments()
  }
}
</script>


<style scoped>
/* 卡片属性 */
.deploy-head-card,.deploy-body-card {
  border-radius: 1px;
  margin-bottom: 5px;
}
/* 搜索框 */
.deploy-head-search {
  width:160px;
  margin-right:10px;
}
/* 数据表格deployment名颜色 */
.deploy-body-deployname {
  color: #4795EE;
}
/* deployment名鼠标悬停 */
.deploy-body-deployname:hover {
  color: rgb(84, 138, 238);
  cursor: pointer;
  font-weight: bold;
}
</style>