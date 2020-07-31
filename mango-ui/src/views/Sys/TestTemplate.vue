<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.name"  :disabled="true" placeholder="基础模板"></el-input>
			</el-form-item>
			<!-- <el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:menu:view" type="primary" @click="findTreeData(null)"/>
			</el-form-item> -->
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="test:tem:add" type="primary" @click="handleAdd"/>
			</el-form-item>
		</el-form>
	</div>
	<!--表格树内容栏-->
    <el-table :data="tableTreeDdata" stripe size="mini" style="width: 100%;" :border="true"
      v-loading="loading" rowKey="id" element-loading-text="加载中" :lazy="true" :load="load">
        <el-table-column
            prop="id" header-align="center" align="center" width="100" resizable label="ID">
        </el-table-column>
      <el-table-column 
        prop="testName" header-align="center" align="left"  label="名称" width="360">
      </el-table-column>
      <el-table-column header-align="center" align="center" label="测试属性" width="120">
        <template slot-scope="scope">
        <el-tag v-if="scope.row.attribute === 0" size="small">快速模板</el-tag>
        <el-tag v-else-if="scope.row.attribute === 1" size="small">正常模板</el-tag>
        </template>
      </el-table-column>

      <el-table-column 
        prop="parentName" header-align="center" align="left" width="360" label="上级菜单">
      </el-table-column>
       <el-table-column
         align="center" label="排序" width="200">
         <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.$index===0"
              @click="moveUp(scope.$index,scope.row)"><i class="el-icon-arrow-up"></i></el-button>
            <el-button
              size="mini"
              @click="moveDown(scope.$index,scope.row)"><i class="el-icon-arrow-down"></i></el-button>
          </template>
      </el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="270" :label="$t('action.operation')">
        <template slot-scope="scope">
            <kt-button icon="fa fa-edit" label="查看" perms="test:tem:view" @click="handleSee(scope.row)"/>
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" perms="test:tem:edit" @click="handleEdit(scope.row)"/>
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="test:tem:delete" type="danger" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" 
        label-width="100px" :size="size" style="text-align:left;">
        <el-form-item label="模板属性" prop="attribute">
          <el-radio-group v-model="dataForm.attribute">
            <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio v-for="(type, index) in typeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" 模板名称" prop="testName">
          <el-input v-model="dataForm.testName" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
            <popup-tree-input 
              :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName" 
              :nodeKey="''+dataForm.parentId" :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
        </el-form-item>
        <el-form-item label=" 测试目标" prop="testTarget">
          <el-input v-model="dataForm.testTarget" placeholder="测试目标"   type="textarea"></el-input>
        </el-form-item>
        <el-form-item label=" 测试流程" prop="content">
          <el-input v-model="dataForm.content" placeholder="测试流程"   type="textarea"></el-input>
        </el-form-item>
        <el-form-item label=" 备注信息" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注信息"   type="textarea"></el-input>
        </el-form-item>
        <!-- <el-form-item label="排序编号" prop="sort">
          <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog title="查看" width="40%" :visible.sync="dialogVisibleSee"  :close-on-click-modal="false">
      <el-form :model="dataForm"   
        label-width="100px" :size="size" style="text-align:left;">
        <el-form-item label="模板属性" prop="attribute">
          <el-radio-group v-model="dataForm.attribute">
            <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="模板类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio v-for="(type, index) in typeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" 模板名称" prop="testName">
          <el-input v-model="dataForm.testName" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
            <popup-tree-input 
              :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName" 
              :nodeKey="''+dataForm.parentId" :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
        </el-form-item>
        <el-form-item label=" 测试目标" prop="testTarget">
          <el-input v-model="dataForm.testTarget" placeholder="测试目标"   type="textarea"></el-input>
        </el-form-item>
        <el-form-item label=" 测试流程" prop="content">
          <el-input v-model="dataForm.content" placeholder="测试流程"   type="textarea"></el-input>
        </el-form-item>
        <el-form-item label=" 备注信息" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注信息"   type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="排序编号" prop="sort">
          <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      maps: new Map(),
      size: "small",
      loading: false,
      filters: {
        name: ""
      },
      tableTreeDdata: [],
      dialogVisibleSee:false,
      dialogVisible: false,
      menuTypeList: ["快速模板", "正常模板"],
      typeList: ["民用", "工业","通用"],
      dataForm: {
        id: 0,
        parent_id: 0,
        testName:'',
        testTarget:'',
        content:'',
        remarks:'',
        attribute:0,
        type:2,
        parentName: "",
        sort:1
      },
      dataRule: {
        testName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
        attribute:[{ required: true, message: "模板属性不能为空", trigger: "blur" }],
         type:[{ required: true, message: "模板类型不能为空", trigger: "blur" }],
        parent_id:[{ required: true, message: "上级菜单不能为空", trigger: "blur" }],
        testTarget:[{ required: true, message: "测试目标不能为空", trigger: "blur" }],
        content:[{ required: true, message: "测试流程不能为空", trigger: "blur" }],
       
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "testName",
        children: "children"
      }
    };
  },
  methods: {
    // 获取数据
    findTreeData: function() {
      this.loading = true;
      this.$api.testTemplate.findAll({id:0}).then(res => {
        this.tableTreeDdata = res.data;
      });
      this.$api.testTemplate.findAllPop().then(res=>{
         this.popupTreeData = this.getParentMenuTree(res.data);
         this.loading = false;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parentId: 0,
        testName: "顶级菜单",
        children: tableTreeDdata
      };
      return [parent];
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.dataForm = {
        id: 0,
        parent_id: 0,
        testName:'',
        testTarget:'',
        content:'',
        remarks:'',
        attribute:1,
        type:2,
        parentName: "",
        sort:0
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      Object.assign(this.dataForm, row);
    },
     // 显示查看界面
    handleSee: function(row) {
      this.dialogVisibleSee = true;
      Object.assign(this.dataForm, row);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = this.getDeleteIds([], row);
        this.$api.testTemplate.del(params).then(res => {
          const { tree, treeNode, resolve } = this.maps.get(row.parent_id); //根据pid取出对应的节点数据
          this.load(tree, treeNode, resolve);
          this.$message({ message: "删除成功", type: "success" });
        });
      });
    },
    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.id });
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parent_id = data.id;
      this.dataForm.parentName = data.testName;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    //上移
        moveUp(index,row){
        row.remarks='上移';
         this.$api.testTemplate.updateSort(row).then(res => {
              if (res.code == 200) {
                this.$message({ message: res.msg, type: "success" });
                 const { tree, treeNode, resolve } = this.maps.get(row.parent_id); //根据pid取出对应的节点数据
                 this.load(tree, treeNode, resolve);
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              
            });
      },
    
      //下移
      moveDown(index,row){
        console.log('下移',index,row.id);
         row.remarks='下移';
         this.$api.testTemplate.updateSort(row).then(res => {
              if (res.code == 200) {
                this.$message({ message: res.msg, type: "success" });
                const { tree, treeNode, resolve } = this.maps.get(row.parent_id); //根据pid取出对应的节点数据
                 this.load(tree, treeNode, resolve);
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              
            });
      
      },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.testTemplate.save(params).then(res => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
          
                const { tree, treeNode, resolve } = this.maps.get(params.parent_id); //根据pid取出对应的节点数据
                 this.load(tree, treeNode, resolve);
                this.dialogVisible = false;
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    //懒加载
      load(tree, treeNode, resolve) {
        const pid = tree.id;
        this.maps.set(pid, { tree, treeNode, resolve }); //将当前选中节点数据存储到maps中
        this.$api.testTemplate.findAll(tree).then(res => {
          setTimeout(() => {
          resolve(res.data)
        }, 10)
      });
       
      }
  },
  mounted() {
    this.findTreeData();
  }
};
</script>

<style >
.el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>