<template>
  <div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-select v-model="filters.use" clearable placeholder="请选择用途">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              v-if="item.type=='use'"
            ></el-option>
          </el-select>
        </el-form-item>
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
          <el-select v-model="filters.protocol" clearable placeholder="请选择匹配协议">
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              v-if="item.type=='protocol'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="lcd:info:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="lcd:info:add"
            type="primary"
            @click="addDisplay"
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
        <el-table-column fixed="right" label="操作" width="360" header-align="center">
          <template slot-scope="scope">
            <kt-button
              icon="fa fa-plus"
              label="新增"
              perms="photo:info:add"
              :size="size"
              @click="handleAddPhoto(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-eye"
              label="查看"
              perms="photo:info:view"
              :size="size"
              @click="handleSee(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-edit"
              :label="$t('action.edit')"
              perms="lcd:info:edit"
              :size="size"
              @click="lcdDeit(scope.$index, scope.row)"
            />
            <kt-button
              icon="fa fa-trash"
              :label="$t('action.delete')"
              perms="lcd:info:delete"
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
          perms="lcd:info:delete"
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
        label-width="80px"
        :rules="lcdEditFromRules"
        ref="lcdEditFrom"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="lcdEditFrom.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用途" prop="use">
          <el-select
            v-model="lcdEditFrom.use"
            clearable
            placeholder="请选择用途"
            :style="{width:'100%'}"
          >
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              v-if="item.type=='use'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="model">
          <el-select
            v-model="lcdEditFrom.model"
            clearable
            placeholder="请选择类别"
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
        <el-form-item label="匹配协议" prop="matching_protocol">
          <el-select
            v-model="lcdEditFrom.matching_protocol"
            clearable
            placeholder="请选择匹配协议"
            :style="{width:'100%'}"
          >
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              v-if="item.type=='protocol'"
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
    >
      <el-tabs type="border-card">
        <el-tab-pane :label="label" v-for="label in dispalyType" :key="label">
          <el-row :gutter="20">
            <el-col
              :span="8"
              v-for="photoInfo in photoResult.content"
              :key="photoInfo.id"
              v-if="photoInfo.dispalyType==label"
            >
              <div class="tittleSpan" v-html="photoInfo.describe"></div>
              <div class="myClass">
                <el-image :src="photoInfo.path" fit="contain"></el-image>
                <!-- <img src='static/myphoto/gywlwb_3.png'></img> -->
              </div>
              <my-button icon="fa fa-trash-o" label="删除" perms="photo:info:delete" type="danger" :style="{marginLeft:'100px',marginTop:'10px'}" @click="delPhoto(photoInfo.id,photoInfo.parentId)"/>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- photo新增 -->
    <el-dialog title="新增" width="40%" :visible.sync="photoAddFalg" :close-on-click-modal="false">
      <el-form
        :model="photoAddFrom"
        label-width="80px"
        ref="photoAddFrom"
        :size="size"
        :rules="photoAddFromRules"
      >
        <el-form-item label="显示类别" prop="dispalyType">
          <!-- <el-input :required="true" v-model="addInfoDataFrom.version" auto-complete="off"></el-input> -->
          <el-select
            v-model="photoAddFrom.dispalyType"
            clearable
            placeholder="请选择显示类别"
            :style="{width:'100%'}"
          >
            <el-option
              v-for="item in dictData"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              v-if="item.type=='dispalyType'"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传" prop="file">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            list-type="picture"
            :data="getPhotoAddFrom()"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
            <!-- <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload"
            >上传到服务器</el-button>-->
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="图片描述" prop="describe">
          <el-input v-model="photoAddFrom.describe" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="photoAddFrom.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="photoAddFalg = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitphotoAddFrom"
          :loading="photoFromLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import KtButton from "@/views/Core/KtButton";
import MyButton from "@/views/Core/MyButton"
import { format } from "@/utils/datetime";
import axios from "axios";
export default {
  components: {
    KtButton,
    MyButton
  },
  data() {
    return {
      size: "small",
      selections: [],
      dictData: {},
      filters: {
        use: "",
        protocol: "",
        model: ""
      },
      columns: [
        {
          prop: "id",
          label: "ID",
          minWidth: 50
        },
        {
          prop: "use",
          label: "用途",
          minWidth: 120
        },
        {
          prop: "model",
          label: "类别",
          minWidth: 120
        },
        {
          prop: "matching_protocol",
          label: "匹配协议",
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
      photoResult: {},
      dispalyType: [],
      photoAddFalg: false, //图片新增标识
      photoFromLoading: false, //图片新增按钮加载标识
      photoAddFrom: {
        //图片新增信息
        parentId: 0,
        describe: "",
        dispalyType: "",
        sort: 0
      },
      photoAddFromRules: {
        //图片新增规则
        describe: [
          { required: true, message: "请输入图片描述", trigger: "blur" }
        ],
        dispalyType: [
          { required: true, message: "请选择显示类别", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入顺序", trigger: "blur" }]
      },
      fileList: [],
      operation: true,
      lcdEditFalg: false,
      lcdEditFrom: {
        //lcd新增修改字段
        id: 0,
        use: "",
        model: "",
        matching_protocol: "",
        sort: 1
      },
      lcdEditFromRules: {
        use: [{ required: true, message: "请选择用途", trigger: "blur" }],
        model: [{ required: true, message: "请选择显示类别", trigger: "blur" }],
        matching_protocol: [
          { required: true, message: "请选择匹配协议", trigger: "blur" }
        ]
      },
      lcdEditLoading: false //提交标识
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    findPage: function(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
       this.pageRequest.pageSize=10
      this.pageRequest.params = {
        use: this.filters.use == "" ? "0" : this.filters.use,
        protocol: this.filters.protocol == "" ? "0" : this.filters.protocol,
        model: this.filters.model == "" ? "0" : this.filters.model
      };
      this.$api.lcd.findPage(this.pageRequest).then(res => {
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
    //数据字典信息获取
    dictDataFindPage: function() {
       let	pageRequest= { pageNum: 1, pageSize: 100000 };
      this.$api.dict.findPage(pageRequest).then(res => {
        this.dictData = res.data.content;
      });
    },
    addDisplay: function() {
      this.lcdEditFalg = true;
    },
    handleAddPhoto: function(index, row) {
      console.log(row.id + "id");
      this.photoAddFrom.parentId = row.id;
      this.photoAddFalg = true;
    },
    //查看液晶显示界面
    handleSee: function(index, params) {
      this.handleSeeFalg = true;
      this.dialogTitle = params.model;
      console.log(params.id);
      let pageRequest = {
        pageNum: 1,
        pageSize: 10000000,
        params: {
          id: params.id
        }
      };
      this.$api.lcd.photoInfoView(pageRequest).then(res => {
        this.photoResult = res.data;
        res.data.content.forEach(element => {
          if (this.dispalyType.indexOf(element.dispalyType) === -1) {
            this.dispalyType.push(element.dispalyType);
          }
        });
      });
    },
    //提交photoFrom
    submitphotoAddFrom: function() {
      this.$refs.photoAddFrom.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.photoFromLoading = true;
            let params = Object.assign({}, this.photoAddFrom);
        
            this.$refs.upload.submit();
            this.photoFromLoading = false;
            this.photoAddFalg = false;
            // this.$api.updateRecord.modifyInfoOver(params).then(res => {
            //   if (res.code == 200) {
            //     this.$message({ message: "操作成功", type: "success" });
            //   } else {
            //     this.$message({
            //       message: "操作失败, " + res.msg,
            //       type: "error"
            //     });
            //   }
            // });
          });
        }
      });
    },
    getPhotoAddFrom: function() {
      return Object.assign({}, this.photoAddFrom);
    },
    //上传之前的操作
    beforeUpload(file) {
      let fd = new FormData();
      fd.append("file", file); //传文件
      fd.append("parentId", this.photoAddFrom.parentId);
      fd.append("describe", this.photoAddFrom.describe);
      fd.append("dispalyType", this.photoAddFrom.dispalyType);
      fd.append("sort", this.photoAddFrom.sort); //传其他参数
      // axios.post('/api/up/file',fd).then(function(res){
      //         alert('成功');
      // })
      this.$api.lcd.uploadFile(fd).then(res => {
        if (res.code == 200) {
          this.$message({ message: "操作成功", type: "success" });
        } else {
          this.$message({
            message: "操作失败, " + res.msg,
            type: "error"
          });
        }
      });
      //  axios.post('127.0.0.1:8001/lcd/uploadFile', fd,{
      //       headers: {
      //        'Content-Type': 'multipart/form-data'
      //       }
      //     })
    },
    //nouse
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    //提交表单
    submitlcdEditFrom: function() {
      this.$refs.lcdEditFrom.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let params = Object.assign({}, this.lcdEditFrom);
            this.lcdEditLoading=true
            this.$api.lcd.save(params).then(res => {
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                 this.findPage(null).then(res=>{
                this.pageRequest=res.data;        
            })
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
            this.lcdEditLoading=false
            this.lcdEditFalg=false
           
            
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
        this.$api.lcd.batchDelete(params).then(res => {
           this.findPage(null).then(res=>{
                this.pageRequest=res.data;        
            })
          if (res.code == 200) {
            this.$message({ message: "操作成功", type: "success" });
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
    //删除照片
    delPhoto(ids,parentId){
    let param ={id:ids}
      this.$api.lcd.delPhoto(param).then(res=>{
          let pageRequest = {
        pageNum: 1,
        pageSize: 10000000,
        params: {
          id: parentId
        }
      };
      this.$api.lcd.photoInfoView(pageRequest).then(res => {
        this.photoResult = res.data;
        res.data.content.forEach(element => {
          if (this.dispalyType.indexOf(element.dispalyType) === -1) {
            this.dispalyType.push(element.dispalyType);
          }
        });
      });
         if (res.code == 200) {
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({
              message: "操作失败, " + res.msg,
              type: "error"
            });
          }
      })
    }
  },
  mounted() {
    this.dictDataFindPage();
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
  margin-left: -95%;
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
</style>
