<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input placeholder="请输计划名称" v-model="filters.planName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入负责人" v-model="filters.operator" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择起始日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择截止日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="test:plan:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="test:plan:add"
            type="primary"
            @click="addDisplay"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            label="测试计划查看"
            perms="admin:plan:view"
            type="primary"
            @click="adminSeeF()"
          />
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="pageResult.content"
        stripe
        size="small"
        style="width: 100%"
        @selection-change="selectionChange"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          v-for="column in columns"
          header-align="center"
          align="center"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :key="column.prop"
          :type="column.type"
          :formatter="column.formatter"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" width="270" header-align="center">
          <template slot-scope="scope">
            <kt-button
              icon="fa fa-plus"
              label="测试"
              perms="test:term:test"
              :size="size"
              @click="handleAddPhoto(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-eye"
              label="查看"
              perms="test:term:view"
              :size="size"
              @click="handleSee(scope.$index, scope.row)"
            />
            <!-- <kt-button
              icon="fa fa-edit"
              :label="$t('action.edit')"
              perms="test:plan:edit"
              :size="size"
              @click="lcdDeit(scope.$index, scope.row)"
            /> -->
            <kt-button
              icon="fa fa-trash"
              :label="$t('action.delete')"
              perms="test:plan:delete"
              :size="size"
              type="danger"
              @click="lcdDelete(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="toolbar" style="padding:10px;">
        <kt-button
          :label="$t('action.batchDelete')"
          perms="up:record:view"
          :size="size"
          type="danger"
          :disabled="this.selections.length===0"
          style="float:left;"
          @click="lcdAllDelete"
        />
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="refreshPageRequest"
          :current-page="pageRequest.pageNum"
          :page-size="pageRequest.pageSize"
          :total="pageResult.totalSize"
          style="float:right;"
        ></el-pagination>
      </div>
    </div>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="40%"
      :visible.sync="lcdEditFalg"
      :close-on-click-modal="false"
    >
      <el-form
        :model="lcdEditFrom"
        label-width="100px"
        :rules="lcdEditFromRules"
        ref="lcdEditFrom"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="lcdEditFrom.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="测试模板" prop="onetestNames">
          <el-select
            v-model="lcdEditFrom.onetestNames"
            clearable
            placeholder="请选择测试模板"
            style="width:100%"
            @change="changeSe"
          >
            <el-option
              v-for="item in onetestNames"
              :key="item.id"
              :label="item.testName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试速度" prop="attribute">
                <el-select v-model="lcdEditFrom.attribute" placeholder="请选择测试速度" style="width:100%">
                  <el-option label="快速模板" value="0"></el-option>
                  <el-option label="正常模板" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试类型" prop="type">
                <el-select v-model="lcdEditFrom.type" placeholder="请选择测试类型" style="width:100%">
                  <el-option label="民用" value="0"></el-option>
                  <el-option label="工业" value="1"></el-option>
                </el-select>
              </el-form-item>
        <el-form-item label="计划名称" prop="planName">
          <el-input placeholder="请输计划名称" v-model="lcdEditFrom.planName" clearable></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="operator">
          <el-input placeholder="请输负责人" v-model="lcdEditFrom.operator" clearable></el-input>
        </el-form-item>
        <el-form-item label="预计完成时间" prop="planCompleteTime">
          <el-date-picker
            style="width:100%"
            v-model="lcdEditFrom.planCompleteTime"
            type="date"
            placeholder="选择预计完成时间"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="测试项" prop="testNames">
          <el-select
            v-model="lcdEditFrom.testNames"
            multiple
            clearable
            placeholder="请选择测试项"
            style="width:100%"
          >
            <el-option
              v-for="item in testNames"
              :key="item.id"
              :label="item.testName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="lcdEditFrom.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="lcdEditFalg = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitlcdEditFrom"
          :loading="lcdEditLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!-- 查看界面 -->
    <el-dialog
      :title="dialogTitle"
      custom-class="dialogStyle"
      :visible.sync="handleSeeFalg"
      :close-on-click-modal="false"
      :fullscreen="true"
      @close="closeDia"
    >
      <el-tabs tabPosition="left">
        <el-tab-pane :label="item.testName" v-for="item in termResult" :key="item.id">
          <el-scrollbar style="height:100%">
            <el-form label-width="100px">
              <el-form-item label="负责人">
                <el-input :disabled="true" v-model="operator"></el-input>
              </el-form-item>
              <el-form-item label="测试目标">
                <el-input :disabled="true" v-model="item.testTarget" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="测试流程">
                <el-input :disabled="true" v-model="item.content" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="测试结果">
                <el-radio-group v-model="item.success">
                  <el-radio
                    v-for="(type, index) in successList"
                    :label="index"
                    :key="index"
                  >{{ type }}</el-radio>
                </el-radio-group>
                <editor @getContent="getContent" :editorContent="item.testResult" :show="false"></editor>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 查看界面 -->
    <el-dialog
      title="测试计划查看"
      custom-class="dialogStyle"
      :visible.sync="adminSee"
      :close-on-click-modal="false"
      :fullscreen="true"
      @close="closeDia"
    >
    <el-form :inline="true" :model="termFilters" :size="size" style="marginLeft:31%">
              <el-form-item>
                <el-date-picker
                  type="date"
                  placeholder="选择起始日期"
                  v-model="termFilters.startTime"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  type="date"
                  placeholder="选择截止日期"
                  v-model="termFilters.endTime"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-select v-model="termFilters.success" placeholder="请选择测试状态">
                  <el-option label="成功" value="0"></el-option>
                  <el-option label="失败" value="1"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item>
                <el-input placeholder="请输负责人" v-model="termFilters.operator" clearable></el-input>
              </el-form-item> -->
              <el-form-item>
                <kt-button
                  icon="fa fa-search"
                  :label="$t('action.search')"
                  perms="up:record:view"
                  type="primary"
                  @click="testTermView()"
                />
              </el-form-item>
            </el-form>
      <el-tabs tabPosition="left">
        <el-tab-pane :label="item.testName" v-for="item in adminTermResult" :key="item.id">
          <el-scrollbar style="height:100%">
            
            <el-form label-width="100px">
              <el-form-item label="负责人">
                <el-input :disabled="true" v-model="item.operator"></el-input>
              </el-form-item>
              <el-form-item label="测试目标">
                <el-input :disabled="true" v-model="item.testTarget" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="测试流程">
                <el-input :disabled="true" v-model="item.content" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="测试结果">
                <el-radio-group v-model="item.success">
                  <el-radio
                    v-for="(type, index) in successList"
                    :label="index"
                    :key="index"
                  >{{ type }}</el-radio>
                </el-radio-group>
                <editor @getContent="getContent" :editorContent="item.testResult" :show="false"></editor>
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 测试计划 -->
    <el-dialog
      :title="dialogTitle"
      custom-class="dialogStyle"
      :fullscreen="true"
      @close="closeDia"
      :visible.sync="photoAddFalg"
      :close-on-click-modal="false"
    >
      <el-tabs tabPosition="left">
        <el-tab-pane :label="item.testName" v-for="(item,index) in termResult" :key="item.id">
          <el-form
            label-width="100px"
            :model="photoAddFrom"
            ref="photoAddFrom"
            :size="size"
            :rules="photoAddFromRules"
          >
            <el-form-item label="负责人">
              <el-input :disabled="true" v-model="operator"></el-input>
            </el-form-item>
            <el-form-item label="测试目标">
              <el-input :disabled="true" v-model="item.testTarget" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="测试流程">
              <el-input :disabled="true" v-model="item.content" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="测试结果" prop="testResult">
              <el-radio-group v-model="photoAddFrom.success">
                <el-radio
                  v-for="(type, index) in successList"
                  :label="index"
                  :key="index"
                >{{ type }}</el-radio>
              </el-radio-group>
              <editor @getContent="getContent" :editorContent="item.testResult" :show="true"></editor>
            </el-form-item>
            <el-form-item>
              <el-button
                style="marginLeft:35%"
                size="medium"
                type="primary"
                @click.native="submitphotoAddFrom(index,item.id)"
                :loading="photoFromLoading"
              >{{$t('action.submit')}}</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import KtButton from "@/views/Core/KtButton";
import MyButton from "@/views/Core/MyButton";
import { format } from "@/utils/datetime";
import Editor from "@/views/Core/Editor";
import axios from "axios";
export default {
  components: {
    KtButton,
    MyButton,
    Editor
  },
  data() {
    return {
      adminSee: false,
      successList: ["成功", "失败"],
      size: "small",
      selections: [],
      operator: "",
      testNames: {},
      onetestNames:{},
      filters: {
        endTime: "",
        startTime: "",
        planName: "",
        operator: ""
      },
      termFilters: {
        endTime: "",
        startTime: new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
       
        testPlanId: 0,
        success: 0
      },
      columns: [
        {
          prop: "id",
          label: "ID",
          minWidth: 50
        },
        {
          prop: "planName",
          label: "计划名称",
          minWidth: 120
        },
        {
          prop: "testName",
          label: "测试名称",
          minWidth: 120
        },
        {
          prop: "operator",
          label: "负责人",
          minWidth: 120
        },
        {
          prop: "planProgress",
          label: "计划进度",
          minWidth: 120
        },
        {
          prop: "planCompleteTime",
          label: "预计完成时间",
          minWidth: 120
        },
        {
          prop: "sort",
          label: "排序",
          minWidth: 80
        },
        {
          prop: "createBy",
          label: "创建人",
          minWidth: 100
        },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 120,
          formatter: this.dateFormat
        }
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ],
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      pageResult: {},
      handleSeeFalg: false,
      dialogTitle: "", //弹窗标题
      termResult: {},
      adminTermResult: {},
      dispalyType: [],
      photoAddFalg: false, //图片新增标识
      photoFromLoading: false, //图片新增按钮加载标识
      photoAddFrom: {
        //图片新增信息
        id: 0,
        testResult: "",
        index: 0,
        success: 0
      },
      photoAddFromRules: {
        //图片新增规则
        testResult: [
          { required: true, message: "请输入测试结果", trigger: "blur" }
        ]
      },
      fileList: [],
      operation: true,
      lcdEditFalg: false,
      lcdEditFrom: {
        //lcd新增修改字段
        id: 0,
        planName: "",
        operator: "",
        planCompleteTime: "",
        testNames: [],
        onetestNames:[],
        attribute:"",
        type:"",
        sort: 1
      },
      lcdEditFromRules: {
        planName: [
          { required: true, message: "请输入计划名称", trigger: "blur" }
        ],
         attribute: [
          { required: true, message: "请选择测试速度", trigger: "blur" }
        ],
         type: [
          { required: true, message: "请选择测试名称", trigger: "blur" }
        ],
        operator: [
          { required: true, message: "请输入负责人", trigger: "blur" }
        ],
        testNames: [
          { required: true, message: "请选择测试项", trigger: "blur" }
        ],onetestNames: [
          { required: true, message: "请选择测试模板", trigger: "blur" }
        ],
        planCompleteTime: [
          { required: true, message: "请选择预计完成时间", trigger: "blur" }
        ]
      },
      lcdEditLoading: false //提交标识
    };
  },
  methods: {
    //获取富文本内容
    getContent: function(data) {
      this.photoAddFrom.testResult = data;
    },
    closeDia() {
      this.termFilters = {
        testPlanId: 0,
        startTime: new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
        endTime: "",
        success: 0
      };
      this.photoAddFrom = {
        id: 0,
        testResult: "",
        index: 0
      };
    },
    handleClick(row) {},
    findPage(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.params = {
        planName: this.filters.planName,
        operator: this.filters.operator,
        startTime: this.filters.startTime,
        endTime: this.filters.endTime
      };
      this.$api.testPlan.findPage(this.pageRequest).then(res => {
        this.pageResult = res.data;
      });
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections;
    },
    // 选择切换
    handleCurrentChange: function(val) {},
    // 换页刷新
    refreshPageRequest(val) {
      this.pageRequest.pageNum = val;
      let data = { pageRequest: this.pageRequest };
      this.findPage(data);
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },
    //二级模板获取
    testNamesFind: function() {
       this.$api.testTemplate.one().then(res => {
        this.onetestNames = res.data;
      });
    },
    addDisplay: function() {
      this.lcdEditFalg = true;
    },
    handleAddPhoto: function(index, row) {
      this.photoAddFrom.parentId = row.id;
      this.photoAddFalg = true;
      this.dialogTitle = row.planName;
      this.operator = row.operator;
      let termFilters = {
        testPlanId: row.id,
        startTime: "",
        endTime: "",
        success: 2
      };
      this.$api.testPlan.testTermView(termFilters).then(res => {
        this.termResult = res.data;
      });
    },
    //查看测试项界面
    handleSee: function(index, params) {
      this.handleSeeFalg = true;
      this.dialogTitle = params.planName;
      this.operator = params.operator;
      let termFilters = {
        testPlanId: params.id,
        startTime: "",
        endTime: "",
        success: 2
      };
      this.$api.testPlan.testTermView(termFilters).then(res => {
        this.termResult = res.data;
      });
    },
    //
    adminSeeF: function() {
      this.adminSee = true;
      this.testTermView();
    },
    testTermView() {
      this.$api.testPlan.testTermView(this.termFilters).then(res => {
        this.adminTermResult = res.data;
      });
    },
    //提交photoFrom
    submitphotoAddFrom: function(index, id) {
      this.$refs.photoAddFrom[index].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.photoFromLoading = true;
            this.photoAddFrom.id = id;
            this.photoAddFrom.index = index;
            let params = Object.assign({}, this.photoAddFrom);
            this.$api.testPlan.uploadFile(params).then(res => {
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.findPage(null)
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });

            this.photoFromLoading = false;
            // this.photoAddFalg = false;
           
          });
        }
      });
    },
    //提交表单
    submitlcdEditFrom: function() {
      this.$refs.lcdEditFrom.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let params = Object.assign({}, this.lcdEditFrom);
            console.log(params);
            this.lcdEditLoading = true;
            this.$api.testPlan.save(params).then(res => {
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.findPage(null)
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
            this.lcdEditLoading = false;
            this.lcdEditFalg = false;
          });
        }
      });
    },
    lcdDeit(index, row) {
      this.lcdEditFrom = Object.assign({}, row);
      this.lcdEditFalg = true;
      this.operation = false;
    },
    // 删除操作
    delete: function(ids) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = [];
        let idArray = (ids + "").split(",");
        for (var i = 0; i < idArray.length; i++) {
          params.push({ id: idArray[i] });
        }
        this.$api.testPlan.del(params).then(res => {
          if (res.code == 200) {
            this.$message({ message: "操作成功", type: "success" });
            this.findPage(null)
          } else {
            this.$message({
              message: "操作失败, " + res.msg,
              type: "error"
            });
          }
           
        });
        //  res => {
        //   if(res.code == 200) {
        //     this.$message({message: '删除成功', type: 'success'})
        //     this.findPage()
        //   } else {
        //     this.$message({message: '操作失败, ' + res.msg, type: 'error'})
        //   }
        // }
      });
    },
    //单删
    lcdDelete: function(index, row) {
      this.delete(row.id);
    },
    //群删
    lcdAllDelete: function() {
      let ids = this.selections.map(item => item.id).toString();
      this.delete(ids);
    },
    changeSe(item){
       this.$api.testTemplate.two({id:item}).then(res => {
        this.testNames = res.data;
      });
    }
  },
  mounted() {
    this.testNamesFind();
    this.findPage(null);
  }
};
</script>
<style>
.dialogStyle .el-dialog__header {
  background: #14889a;
}

.dialogStyle .el-dialog__header .el-dialog__title {
  color: #fff;
  margin-left: -90%;
}

.dialogStyle .el-dialog__body {
  margin-top: -10px;
  text-align: left;
}

.myClass {
  width: 300px;
  height: 150px;
  /* background: red; */
  margin-top: 10px;
}

.tittleSpan {
  margin-top: 10px;
}
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}

.w-e-text-container {
  height: 600px !important; /*!important是重点，因为原div是行内样式设置的高度300px*/
}
</style>
