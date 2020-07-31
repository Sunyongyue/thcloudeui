<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-select v-model="filters.model" clearable placeholder="请选择类别">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              v-if="item.type=='model'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="ex:code:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="ex:code:add"
            type="primary"
            @click="addExCode"
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
        <el-table-column type="index" width="50"></el-table-column>
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
        <el-table-column fixed="right" label="操作" width="180" header-align="center">
          <template slot-scope="scope">
            <kt-button
              icon="fa fa-edit"
              label="编辑"
              perms="ex:code:edit"
              :size="size"
              @click="handleEdit(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-trash"
              :label="$t('action.delete')"
              perms="ex:code:delete"
              :size="size"
              type="danger"
              @click="codeDelete(scope.$index, scope.row)"
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
          @click="codeAllDelete"
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
      :visible.sync="addFalg"
      :close-on-click-modal="false"
    >
      <el-form :model="addFrom" label-width="80px" :rules="addFromRules" ref="addFrom" :size="size">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="addFrom.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="表具类型" prop="model">
          <el-select
            v-model="addFrom.model"
            clearable
            placeholder="请选择表具类型"
            :style="{width:'100%'}"
          >
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              v-if="item.type=='model'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常代码" prop="code">
          <el-input v-model="addFrom.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="addFrom.reason" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="报警功能" prop="alarm">
          <el-input v-model="addFrom.alarm" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="addFrom.remarks" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="addFrom.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="addFalg = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitAddFrom"
          :loading="addLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import KtButton from "@/views/Core/KtButton";
import { format } from "@/utils/datetime";
export default {
  components: {
    KtButton
  },
  data() {
    return {
      addLoading: false,
      operation: true,
      addFalg: false,
      size: "small",
      selections: [],
      filters: {
        model: ""
      },
      dictData: {},
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      pageResult: {},
      addFrom: {
        id: 0,
        model: "",
        code: "",
        reason: "",
        alarm: "",
        remarks: "",
        sort: 0
      },
      addFromRules: {
        //图片新增规则
        code: [{ required: true, message: "请输入异常代码", trigger: "blur" }],
        model: [{ required: true, message: "请选择表具类型", trigger: "blur" }],
        reason: [{ required: true, message: "请输入原因", trigger: "blur" }],
        sort: [{ required: true, message: "请输入顺序", trigger: "blur" }]
      },
      columns: [
        // {
        //   prop: "id",
        //   label: "ID",
        //   minWidth: 50
        // },
        {
          prop: "model",
          label: "表具类型",
          minWidth: 120
        },
        {
          prop: "code",
          label: "异常代码",
          minWidth: 120
        },
        {
          prop: "reason",
          label: "原因",
          minWidth: 120
        },
        {
          prop: "alarm",
          label: "报警功能",
          minWidth: 120
        },
        {
          prop: "remarks",
          label: "备注",
          minWidth: 80
        },
        // {
        //   prop: "createBy",
        //   label: "创建人",
        //   minWidth: 100
        // },
        // {
        //   prop: "createTime",
        //   label: "创建时间",
        //   minWidth: 130,
        //   formatter: this.dateFormat
        // }
      ]
    };
  },
  methods: {
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
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.params = {
        model: this.filters.model
      };
      this.pageRequest.pageSize=10;
      this.$api.exceptionCode.findPage(this.pageRequest).then(res => {
        this.pageResult = res.data;
      });
    },
    //新增
    addExCode() {
      this.operation = true;
      this.addFalg = true;
    },
    //编辑
    handleEdit(index, row) {
      console.log(row.id);
      this.addFalg = true;
      this.operation = false;
      this.addFrom = Object.assign({}, row);
    },
    //单删
    codeDelete: function(index, row) {
      this.delete(row.id);
    },
    //群删
    codeAllDelete: function() {
      let ids = this.selections.map(item => item.id).toString();
      this.delete(ids);
    },
    //提交表单
    submitAddFrom: function() {
      this.$refs.addFrom.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let params = Object.assign({}, this.addFrom);
            this.addLoading = true;
            this.$api.exceptionCode.save(params).then(res => {
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.findPage(null);
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
            this.addLoading = false;
            this.addFalg = false;
          });
        }
      });
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
        this.$api.exceptionCode.del(params).then(res => {
          if (res.code == 200) {
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({
              message: "操作失败, " + res.msg,
              type: "error"
            });
          }
          this.findPage(null);
        });
      });
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },
    //数据字典信息获取
    dictDataFindPage: function() {
        let	pageRequest= { pageNum: 1, pageSize: 100000 };
      this.$api.dict.findPage(pageRequest).then(res => {
        this.dictData = res.data.content;
      });
    }
  },
  mounted() {
    this.dictDataFindPage();
    this.findPage(null);
  }
};
</script>