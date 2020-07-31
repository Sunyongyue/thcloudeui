<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" label-width="80px">
        <el-form-item label="收寄类型" style="marginLeft:-2%">
          <el-select v-model="filters.type" clearable placeholder="请选择收寄类型">
            <el-option label="收件" value="收件"></el-option>
            <el-option label="寄件" value="寄件"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物类型">
          <el-select v-model="filters.modelType" clearable placeholder="请选择货物类型">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='modelType'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件公司">
          <el-select v-model="filters.receiveCompany" clearable placeholder="请选择收件公司">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='receiveCompany'"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="快递公司">
          <el-select v-model="filters.expressCompany" clearable placeholder="请选择快递公司">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='expressCompany'"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="快递单号" style="marginLeft:-27%">
          <el-input placeholder="请输入快递单号" v-model="filters.expressNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input placeholder="请输入收件人" v-model="filters.receiveBy" clearable></el-input>
        </el-form-item>

        <el-form-item label="寄件人">
          <el-input placeholder="请输入寄件人" v-model="filters.sendBy" clearable></el-input>
        </el-form-item>
        <br />
        <el-form-item label="上传时间" style="marginLeft:-43%">
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
            perms="fast:mail:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="fast:mail:add"
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
            <kt-button
              icon="fa fa-edit"
              label="查看"
              perms="fast:mail:view"
              :size="size"
              @click="handleSee(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-edit"
              label="编辑"
              perms="fast:mail:edit"
              :size="size"
              @click="handleEdit(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-trash"
              :label="$t('action.delete')"
              perms="fast:mail:delete"
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
          perms="fast:mail:delete"
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
      <el-form
        :model="addFrom"
        label-width="80px"
        :rules="addFromRules"
        ref="addFrom"
        :size="size"
        :inline="true"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="addFrom.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="收寄类型" prop="type">
          <el-select v-model="addFrom.type" clearable placeholder="请选择收寄类型">
            <el-option label="收件" value="收件"></el-option>
            <el-option label="寄件" value="寄件"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物类型" prop="modelType">
          <el-select v-model="addFrom.modelType" clearable placeholder="请选择货物类型">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='modelType'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货物详情" prop="datail">
          <el-input placeholder="请输入货物详情" v-model="addFrom.datail" clearable></el-input>
        </el-form-item>
        <el-form-item label="寄件人" prop="sendBy">
          <el-input placeholder="请输入寄件人" v-model="addFrom.sendBy" clearable></el-input>
        </el-form-item>
        <el-form-item label="寄件日期" prop="date">
          <el-date-picker
            v-model="addFrom.date"
            type="date"
            placeholder="选择起始日期"
            value-format="yyyy-MM-dd"
            style="width:93%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收件公司" prop="receiveCompany">
          <el-select
            v-model="addFrom.receiveCompany"
            clearable
            placeholder="请选择收件公司"
            value-key="id"
            @change="companyChange"
          >
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item"
              v-if="item.type=='receiveCompany'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件地址" prop="receiveCompanyAddress">
          <el-input placeholder="请输入收件地址" v-model="addFrom.receiveCompanyAddress" clearable></el-input>
        </el-form-item>
        <el-form-item label="收件人" prop="receiveBy">
          <el-input placeholder="请输入收件人" v-model="addFrom.receiveBy" clearable></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="expressCompany">
          <el-select v-model="addFrom.expressCompany" clearable placeholder="请选择快递公司">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.label"
              v-if="item.type=='expressCompany'"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="快递单号" prop="expressNum">
          <el-input placeholder="请输入快递单号" v-model="addFrom.expressNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="addFrom.remarks" placeholder="请输入备注" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" v-if="false">
          <el-input v-model="addFrom.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片预览" v-if="operation!='新增'">
          <el-image v-for="item in addFrom.paths" :key="item" :src="item" fit="fill" style="width: 100px;height: 100px" :preview-src-list="addFrom.paths" :z-index="500"></el-image>
        </el-form-item>
        <el-form-item label="图片上传" v-if="operation!='查看'">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-preview="handlePreview"
            :on-change="handChang"
            :on-remove="handleRemove"
            list-type="picture"
            :data="getPhotoAddFrom()"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="operation!='查看'">
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
        type: "",
        modelType: "",
        sendBy: "",
        receiveBy: "",
        receiveCompany: "",
        expressCompany: "",
        expressNum: "",
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
        type: "",
        modelType: "",
        datail: "",
        path: "",
        sendBy: "",
        receiveBy: "",
        link: "",
        receiveCompany: "",
        receiveCompanyAddress: "",
        expressCompany: "",
        expressNum: "",
        date: "",
        remarks: "",
        paths:[],
        sort: 0
      },
      addFromRules: {
        //新增规则
        type: [{ required: true, message: "请选择收寄类型", trigger: "blur" }],
        modelType: [
          { required: true, message: "请选择货物类型", trigger: "blur" }
        ],
        datail: [
          { required: true, message: "请输入货物详情", trigger: "blur" }
        ],
        sendBy: [{ required: true, message: "请输入寄件人", trigger: "blur" }],
        receiveBy: [
          { required: true, message: "请输入收件人", trigger: "blur" }
        ],
        receiveCompany: [
          { required: true, message: "请选择收件公司", trigger: "blur" }
        ],
        receiveCompanyAddress: [
          { required: true, message: "请输入收件地址", trigger: "blur" }
        ],
        expressCompany: [
          { required: true, message: "请选择快递公司", trigger: "blur" }
        ],
        expressNum: [
          { required: true, message: "请输入快递单号", trigger: "blur" }
        ],
        date: [{ required: true, message: "请输入时间", trigger: "blur" }]
      },
      columns: [
        // {
        //   prop: "id",
        //   label: "ID",
        //   minWidth: 50
        // },
        {
          prop: "type",
          label: "收寄类型",
          minWidth: 80
        },
        {
          prop: "modelType",
          label: "货物类型",
          minWidth: 120
        },
        {
          prop: "datail",
          label: "详情",
          minWidth: 120
        },
        {
          prop: "sendBy",
          label: "寄件人",
          minWidth: 120
        },
        {
          prop: "receiveBy",
          label: "收件人",
          minWidth: 80
        },
        {
          prop: "receiveCompany",
          label: "收件公司",
          minWidth: 120
        },
        {
          prop: "receiveCompanyAddress",
          label: "公司地址",
          minWidth: 120
        },
        {
          prop: "expressCompany",
          label: "快递公司",
          minWidth: 120
        },
        {
          prop: "expressNum",
          label: "快递单号",
          minWidth: 120
        },
        {
          prop: "remarks",
          label: "备注",
          minWidth: 120
        },
        {
          prop: "date",
          label: "日期",
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
        type: "",
        modelType: "",
        datail: "",
        path: "",
        sendBy: "",
        receiveBy: "",
        link: "",
        receiveCompany: "",
        receiveCompanyAddress: "",
        expressCompany: "",
        expressNum: "",
        date: "",
        remarks: "",
        sort: 0
      };
    },
    companyChange(val) {
      this.addFrom.receiveCompany = val.label;
      this.addFrom.receiveCompanyAddress = val.value;
      this.addFrom.receiveBy = val.description;
      this.addFrom.link = val.remarks;
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
      fd.append("type", map.type);
      fd.append("modelType", map.modelType);
      fd.append("datail", map.datail);
      fd.append("sendBy", map.sendBy);
      fd.append("receiveBy", map.receiveBy);
      fd.append("link", map.link);
      fd.append("receiveCompany", map.receiveCompany);
      fd.append("receiveCompanyAddress", map.receiveCompanyAddress);
      fd.append("expressCompany", map.expressCompany);
      fd.append("expressNum", map.expressNum);
      fd.append("date", map.date);
      fd.append("remarks", map.remarks);
      fd.append("sort", map.sort);

      //传其他参数
      this.$api.fastMail.uploadFile(fd).then(res => {
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
        fastMail: Object.assign({}, this.filters)
      };
      this.pageRequest.pageSize = 10;
      this.$api.fastMail.findPage(this.pageRequest).then(res => {
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
    //查看
    handleSee(index, row) {
      this.addFalg = true;
      this.operation = "查看";
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
            console.log(this.fileList.length);
            if (this.fileList.length == 0) {
              this.$api.fastMail.save(params).then(res => {
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
            
              let fd = new FormData();
                this.fileList.forEach(element => {
                  fd.append("file",element.raw)
                });
              let map = Object.assign({}, this.addFrom);
              fd.append("id", map.id);
              fd.append("type", map.type);
              fd.append("modelType", map.modelType);
              fd.append("datail", map.datail);
              fd.append("sendBy", map.sendBy);
              fd.append("receiveBy", map.receiveBy);
              fd.append("link", map.link);
              fd.append("receiveCompany", map.receiveCompany);
              fd.append("receiveCompanyAddress", map.receiveCompanyAddress);
              fd.append("expressCompany", map.expressCompany);
              fd.append("expressNum", map.expressNum);
              fd.append("date", map.date);
              fd.append("remarks", map.remarks);
              fd.append("sort", map.sort);

              //传其他参数
              this.$api.fastMail.uploadFile(fd).then(res => {
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
              this.fileList=[];
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
        this.$api.fastMail.del(params).then(res => {
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