<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-select v-model="filters.use" clearable placeholder="请选择用途">
                <el-option v-for="item in dictData" :key="item.id" :label="item.label" :value="item.id" v-if="item.type=='use'"></el-option>
                </el-select>
			</el-form-item>
            <el-form-item>
				<el-select v-model="filters.protocol" clearable placeholder="请选择匹配协议">
                <el-option v-for="item in dictData" :key="item.id" :label="item.label" :value="item.id" v-if="item.type=='protocol'"></el-option>
                </el-select>
			</el-form-item>
            <el-form-item>
				<el-select v-model="filters.name" clearable placeholder="请选择名称">
                <el-option v-for="item in dictData" :key="item.id" :label="item.label" :value="item.id" v-if="item.type=='name'"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="up:record:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="up:record:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>
	<!--表格内容栏-->
	<Mr-table permsEdit="up:record:edit" permsDelete="up:record:delete" permsLook="up:recordInfo:view" permsAdd="up:recordInfo:add"
		:data="pageResult" :columns="columns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleSee="handleSee" @handleaddInfo="handleaddInfo" @handleDelete="handleDelete">
	</Mr-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用途" prop="label">
                <el-select v-model="dataForm.use" clearable placeholder="请选择用途" :style="{width:'100%'}">
                <el-option v-for="item in dictData" :key="item.id" :label="item.label" :value="item.id" v-if="item.type=='use'"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="匹配协议" prop="value">
                <el-select v-model="dataForm.matching_protocol" clearable placeholder="请选择匹配协议" :style="{width:'100%'}">
                <el-option v-for="item in dictData" :key="item.id" :label="item.label" :value="item.id" v-if="item.type=='protocol'"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="名称" prop="type">
                <el-select v-model="dataForm.name" clearable placeholder="请选择名称" :style="{width:'100%'}">
                <el-option v-for="item in dictData" :key="item.id" :label="item.label" :value="item.id" v-if="item.type=='name'"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input v-model="dataForm.sort" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
    	<!--编辑界面-->
	<el-dialog title="编辑" width="40%" :visible.sync="editInfo" :close-on-click-modal="false">
		<el-form :model="infoDataFrom" label-width="80px"  ref="infoDataFrom" :size="size" :rules="infoDataFromRules">
            <el-form-item label="版本号" prop="version">
				<el-input :required="true" v-model="infoDataFrom.version" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="升级时间" prop="upTime">
				<!-- <el-input v-model="infoDataFrom.upTime" auto-complete="off"></el-input> -->
                  <el-date-picker :style="{width:'100%'}" value-format="yyyy-MM-dd HH:mm" size="small" v-model="infoDataFrom.upTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
			</el-form-item>
            <el-form-item label="升级内容">
				<el-input type="textarea" v-for="(item, index) in infoDataFrom.contents" :key="item.id" v-model="infoDataFrom.contents[index].content" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="editInfo = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitInfoDataFrom" :loading="editInfoLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
     	<!--info新增界面-->
	<el-dialog title="新增" width="40%" :visible.sync="handleaddInfoV" :close-on-click-modal="false">
		<el-form :model="addInfoDataFrom" label-width="80px"  ref="addInfoDataFrom" :size="size" :rules="infoDataFromRules">
            <el-form-item label="版本号" prop="version">
				<el-input :required="true" v-model="addInfoDataFrom.version" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="升级时间" prop="upTime">
				<!-- <el-input v-model="infoDataFrom.upTime" auto-complete="off"></el-input> -->
                  <el-date-picker :style="{width:'100%'}" value-format="yyyy-MM-dd HH:mm" size="small" v-model="addInfoDataFrom.upTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
			</el-form-item>
            <el-form-item label="升级内容">
				<el-input type="textarea"  v-model="addInfoDataFrom.contents" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="handleaddInfoV = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitAddInfoDataFrom">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
    <!-- 查看界面 -->
        <el-dialog :title="rowName" :visible.sync="seeDialogVisible" :close-on-click-modal="false" > 
          <div v-for="update in updateInfo.content" :key="update.id">
              <p :style="{ textAlign:'left'}"><span :style="{margin:'20px',color:'red',fontSize:'17px'}">{{update.version}}</span><span :style="{color:'blue'}">{{update.upTime}}</span></p>
             <el-card shadow="never" class="elCard">
            <p class='ptitle' v-for="tent in update.contents" :key="tent.id"><!-- {{tent.id}}： -->*{{tent.content}}</p>
            <!-- <el-button size="mini" type="primary" @click="modifyInfo(update.id)">编辑</el-button> <el-button size="mini" type="danger" @click="deleteInfo(update.id,update.parentId)">删除</el-button> -->
			<my-button icon="fa fa-edit" label="编辑" perms="up:recordInfo:edit" type="primary" @click="modifyInfo(update.id)"/>
			<my-button icon="fa fa-trash-o" label="删除" perms="up:recordInfo:delete" type="danger" @click="deleteInfo(update.id,update.parentId)"/>
             </el-card>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import MrTable from "@/views/Core/MrTable"
import KtButton from "@/views/Core/KtButton"
import MyButton from "@/views/Core/MyButton"
import { format } from "@/utils/datetime"
export default {
	components:{
			MrTable,
			KtButton,
			MyButton
	},
	data() {
		return {
			size: 'small',
			filters: {
                use:'' ,
                protocol:'',
                name:''
			},
			columns: [
				 {prop:"id", label:"ID", minWidth:50},
                {prop:"use", label:"用途", minWidth:120},
                {prop:"matching_protocol", label:"匹配协议", minWidth:120},
                {prop:"name", label:"名称", minWidth:120},
				{prop:"sort", label:"排序", minWidth:80},
				{prop:"createBy", label:"创建人", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
            editDialogVisible: false, // 新增编辑界面是否显示
            seeDialogVisible:false,//查看界面是否显示
            editInfo:false,//查看编辑界面是否显示
            handleaddInfoV:false,//新增详情界面是否显示
            editLoading: false,
            editInfoLoading:false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
                ],
                use: [
					{ required: true, message: '请输入用途', trigger: 'blur' }
                ],
                matching_protocol: [
					{ required: true, message: '请输入匹配协议', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				name: '',
				use:'',
				matching_protocol:'',
				sort: 0,
            },
            infoDataFromRules: {
				version: [
					{ required: true, message: '请输入版本号', trigger: 'blur' }
                ],
                upTime:[
                    {required: true, message: '请输入升级时间', trigger: 'blur'}
                ]
            },
            //详情信息
            infoDataFrom: {
                
            },
            //添加记录详情
            addInfoDataFrom:{
                version:'',
                upTime:'',
                contents:'',
                parentId:0
            },
            //编辑详情信息
            updateInfo:{
           
            },
            //数据字典信息
            dictData:{
                
            },
            rowName:'',
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			 this.pageRequest.pageSize=10;
			this.pageRequest.params = {use:this.filters.use==''?'0':this.filters.use, protocol:this.filters.protocol==''?'0':this.filters.protocol,name:this.filters.name==''?'0':this.filters.name,falg:'软件'}
			this.$api.updateRecord.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
           this.$api.updateRecord.batchDelete(data.params).then(data!=null?data.callback:'')
        },
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				name: '',
				use:'',
        matching_protocol:'',
        falg:0,
				sort: 0,
			}
        },
        //显示记录界面
        handleSee:function(params){
            this.seeDialogVisible=true
            this.rowName=params.row.name+"升级记录"
           console.log(params.row.id)
           let id=params.row.id;
           let pageRequest = { pageNum: 1, pageSize: 10000000 ,params:{"id":id}}
           this.$api.updateRecord.findInfoView(pageRequest).then((res)=>{
               this.updateInfo=res.data 
               console.log(res.data)})
               
        },
        //显示新增详情界面
        handleaddInfo:function(params){
            this.handleaddInfoV=true
            this.addInfoDataFrom.parentId=params.row.id;     
        },
        //新增详情界面
        submitAddInfoDataFrom:function(){
              this.$refs.addInfoDataFrom.validate((valid)=>{
               if(valid){
                   this.$confirm('确认提交吗？','提示',{}).then(()=>{
                   
                    let params=Object.assign({},this.addInfoDataFrom)
                    this.$api.updateRecord.addInfo(params).then((res)=>{
                        if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                            }
                            this.handleaddInfoV=false
                    })
                   })
               }
           })
        },
        deleteInfo:function(id,parentId){
            console.log(id,parentId)
             let params={"id":id}
             this.$api.updateRecord.deleteInfo(params).then((res)=>{
                  if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                            }
                             let pageRequest = { pageNum: 1, pageSize: 10000000 ,params:{"id":parentId}}
                             this.$api.updateRecord.findInfoView(pageRequest).then((res)=>{
                              this.updateInfo=res.data 
                            })
             })
        },
        //根据id显示info编辑界面
        modifyInfo:function(id){
            this.editInfo=true
            let params={"id":id}
            this.$api.updateRecord.modifyInfo(params).then((res)=>{
                this.infoDataFrom=res.data
            })
        },
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
        },
       //info编辑
       submitInfoDataFrom: function(){
           this.$refs.infoDataFrom.validate((valid)=>{
               if(valid){
                   this.$confirm('确认提交吗？','提示',{}).then(()=>{
                    this.editInfoLoading=true
                    let params=Object.assign({},this.infoDataFrom)
                    this.$api.updateRecord.modifyInfoOver(params).then((res)=>{
                        if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                            }
                            this.editInfoLoading=false
                            console.log(params.parentId)
                            let pageRequest = { pageNum: 1, pageSize: 10000000 ,params:{"id":params.parentId}}
                             this.$api.updateRecord.findInfoView(pageRequest).then((res)=>{
                              this.updateInfo=res.data 
                            })
                            this.editInfo=false

                    })
                   })
               }
           })
          
       },
        
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.updateRecord.save(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.editLoading = false
							this.$refs['dataForm'].resetFields()
							this.editDialogVisible = false
							this.findPage(null)
						})
					})
				}
			})
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
        //数据字典信息获取
        dictDataFindPage: function(){
            let	pageRequest= { pageNum: 1, pageSize: 100000 };
            
            this.$api.dict.findPage(pageRequest).then((res) => {
				this.dictData = res.data.content
			})
        }
	},
	mounted() {
        this.dictDataFindPage();
	}
}
</script>

<style>
.ptitle {
	 text-align: left;
	
 }
</style>