<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" label-width="80px">
        <el-form-item label="文件类别" style="marginLeft:-2%">
          <el-select v-model="filters.fileType" clearable placeholder="请选择文件类别">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='fileType'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input placeholder="请输入文件名称" v-model="filters.fileName" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="filters.department" clearable placeholder="请选择部门">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='department'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件版本">
          <el-input placeholder="请输入文件版本" v-model="filters.fileVersion" clearable></el-input>
        </el-form-item>
        <br />
        <el-form-item label="创建人" style="marginLeft:-17%">
          <el-input placeholder="请输入创建人" v-model="filters.createBy" clearable></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-col :span="11">
            <el-date-picker
              v-model="filters.startDate"
              type="date"
              placeholder="选择起始日期"
              value-format="yyyy-MM-dd"
              style="width:95%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="filters.endDate"
              type="date"
              placeholder="选择截止日期"
              value-format="yyyy-MM-dd"
              style="width:95%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="file:control:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="file:control:add"
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
            <!-- <el-link type="primary" :href="scope.row.filepath" icon="el-icon-download" >下载</el-link> -->
            <kt-button
              icon="el-icon-download"
              label="下载"
              perms="file:control:download"
              :size="size"
              @click="handleDownload(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-edit"
              label="编辑"
              perms="file:control:edit"
              :size="size"
              @click="handleEdit(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-trash"
              :label="$t('action.delete')"
              perms="file:control:delete"
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
          perms="file:control:delete"
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
      :title="operation"
      width="40%"
      :visible.sync="addFalg"
      :close-on-click-modal="false"
      @close="closeDia"
    >
      <el-form :model="addFrom" label-width="80px" :rules="addFromRules" ref="addFrom" :size="size">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="addFrom.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="文件类别" prop="fileType">
          <el-select v-model="addFrom.fileType" clearable placeholder="请选择文件类别" style="width:100%">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='fileType'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称" prop="fileName">
          <el-input placeholder="请输入文件名称" v-model="addFrom.fileName" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="addFrom.department" clearable placeholder="请选择部门" style="width:100%">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='department'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件版本" prop="fileVersion">
          <el-input placeholder="请输入文件版本" v-model="addFrom.fileVersion" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="addFrom.remarks" placeholder="请输入备注" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" v-if="false">
          <el-input v-model="addFrom.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-preview="handlePreview"
            :on-change="handChang"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            list-type="text"
            :data="getPhotoAddFrom()"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
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
      operation: "新增",
      addFalg: false,
      fileList: [],
      size: "small",
      selections: [],

      filters: {
        department: "",
        fileType: "",
        fileName: "",
        fileVersion: "",
        createBy: "",
        startDate: "",
        endDate: ""
      },
      dictData: {},
      pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      pageResult: {},
      addFrom: {
        id: 0,
        fileType: "",
        department: "",
        fileName: "",
        filepath: "",
        fileVersion: "",
        remarks: "",
        sort: 0
      },
      addFromRules: {
        //新增规则
        fileType: [
          { required: true, message: "请选择文件类别", trigger: "blur" }
        ],
        department: [
          { required: true, message: "请选择所属部门", trigger: "blur" }
        ],
        fileName: [
          { required: true, message: "请输入文件名称", trigger: "blur" }
        ],
        fileVersion: [
          { required: true, message: "请输入文件版本人", trigger: "blur" }
        ]
      },
      columns: [
        // {
        //   prop: "id",
        //   label: "ID",
        //   minWidth: 50
        // },
        {
          prop: "fileType",
          label: "文件类别",
          minWidth: 80
        },
        {
          prop: "department",
          label: "所属部门",
          minWidth: 120
        },
        {
          prop: "fileName",
          label: "文件名称",
          minWidth: 120
        },
        {
          prop: "fileVersion",
          label: "文件版本",
          minWidth: 120
        },
        {
          prop: "createBy",
          label: "创建人",
          minWidth: 80
        },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 120,
          formatter: this.dateFormat
        },
        {
          prop: "remarks",
          label: "备注",
          minWidth: 120
        }
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
    closeDia() {
      this.addFrom = {
        id: 0,
        fileType: "",
        department: "",
        fileName: "",
        filepath: "",
        fileVersion: "",
        remarks: "",
        sort: 0
      };
    },
    getPhotoAddFrom: function() {
      return Object.assign({}, this.addFrom);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePreview(file) {},
    handChang(file, fileList) {
      this.fileList = fileList;
    },
    //上传之前的操作
    beforeUpload(file) {
      let fd = new FormData();
      fd.append("file", file); //传文件
      let map = Object.assign({}, this.addFrom);
      fd.append("id", map.id);
      fd.append("fileType", map.fileType);
      fd.append("department", map.department);
      fd.append("fileName", map.fileName);
      fd.append("fileVersion", map.fileVersion);
      fd.append("remarks", map.remarks);
      fd.append("sort", map.sort);

      //传其他参数
      this.$api.fileControl.uploadFile(fd).then(res => {
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
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      this.pageRequest.params = {
        fileControl: Object.assign({}, this.filters)
      };
      this.pageRequest.pageSize = 10;
      this.$api.fileControl.findPage(this.pageRequest).then(res => {
        this.pageResult = res.data;
      });
    },
    //新增
    addExCode() {
      this.operation = "新增";
      this.addFalg = true;
    },
    //编辑
    handleEdit(index, row) {
      this.addFalg = true;
      this.operation = "编辑";
      this.addFrom = Object.assign({}, row);
    },
    handleDownload(index, row) {
      window.open(row.filepath);
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
            console.log(this.fileList.length);
            if (this.fileList.length == 0) {
              this.$api.fileControl.save(params).then(res => {
                if (res.code == 200) {
                  this.$message({ message: "操作成功", type: "success" });
                } else {
                  this.$message({
                    message: "操作失败, " + res.msg,
                    type: "error"
                  });
                }
                this.findPage(null);
                this.addLoading = false;
                this.addFalg = false;
              });
            } else {
              this.$refs.upload.submit();
              this.addLoading = false;
              this.addFalg = false;
            }
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
        this.$api.fileControl.del(params).then(res => {
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
      let pageRequest = { pageNum: 1, pageSize: 100000 };
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