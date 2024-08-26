<template>
  <div class="bar">
    <el-tooltip class="item" effect="dark" content="清除 (Cmd + D)" placement="bottom">
      <el-button name="delete" @click="handleClick" class="item-space" size="small" >
        删除
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="撤销 (Cmd + Z)" placement="bottom">
      <el-button :disabled="!canUndo" name="undo" @click="handleClick" class="item-space" size="small" >
        撤销
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="Redo (Cmd + Shift + Z)" placement="bottom">
      <el-button :disabled="!canRedo" name="redo" @click="handleClick" class="item-space" size="small" >
        redo
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="复制 (Cmd + Shift + Z)" placement="bottom">
      <el-button name="copy" @click="handleClick" class="item-space" size="small" >
        复制
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="剪切 (Cmd + X)" placement="bottom">
      <el-button name="cut" @click="handleClick" class="item-space" size="small" >
        剪切
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="粘贴 (Cmd + V)" placement="bottom">
      <el-button name="paste" @click="handleClick" class="item-space" size="small" >
        粘贴
      </el-button>
    </el-tooltip>
	

    <el-tooltip class="item" effect="dark" content="保存PNG (Cmd + S)" placement="bottom">
      <el-button name="savePNG" @click="handleClick" class="item-space" size="small">
        savePNG
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="保存SVG (Cmd + S)" placement="bottom">
      <el-button name="saveSVG" @click="handleClick" class="item-space" size="small">
        saveSVG
      </el-button>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="打印 (Cmd + P)" placement="bottom">
      <el-button name="print" @click="handleClick" class="item-space" size="small">
        打印
      </el-button>
    </el-tooltip>

   <!-- Button for exporting JSON with dialog -->
    <el-tooltip class="item" effect="dark" content="导出 (Cmd + P)" placement="bottom">
      <el-button name="toJSON" @click="exportJSONDialog" class="item-space" size="small">
        保存
      </el-button>
    </el-tooltip>
	<!-- Dialog for exporting JSON -->
  <el-dialog title="保存" :visible.sync="jsonDialogVisible">
    <el-form ref="jsonForm" :model="jsonForm" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="jsonForm.name"></el-input>
      </el-form-item>
		<el-form-item label="项目编码">
          <el-input v-model="jsonForm.projectCode"></el-input>
        </el-form-item>
        <el-form-item label="图对象编码">
          <el-input v-model="jsonForm.objectCode"></el-input>
        </el-form-item>
		<el-form-item label="父节点编码">
          <el-input v-model="jsonForm.parentCode"></el-input>
        </el-form-item>
		<el-form-item label="数据空间编码">
          <el-input v-model="jsonForm.dataspaceCode"></el-input>
        </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="jsonDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="exportJSON">保存 </el-button>
    </span>
  </el-dialog>
  </div>
  
</template>
<script>
import FlowGraph from '../../graph'
import { DataUri } from '@antv/x6'
import axios from 'axios'
import qs from 'qs';
export default {
  data() {
    return {
      canUndo: null,
      canRedo: null,
	  jsonDialogVisible: false,
      jsonForm: {
        name: '', // To store the user-provided name
        projectCode: '', // Added project code
        objectCode: '',   // Added object code
        parentCode: '',       // Added version
		dataspaceCode:''
      }
    }
  },
  created() {
    this.myInit();
  },
  methods: {
    myInit() {
      const { graph } = FlowGraph
      const { history } = graph
      this.canUndo = history.canUndo()
      this.canRedo = history.canRedo()
      history.on('change', () => {
      this.canUndo = history.canUndo()
      this.canRedo = history.canRedo()
    })
    graph.bindKey('ctrl+z', () => {
      if (history.canUndo()) {
        history.undo()
      }
      return false
    })
    graph.bindKey('ctrl+shift+z', () => {
      if (history.canRedo()) {
        history.redo()
      }
      return false
    })
    graph.bindKey('ctrl+d', () => {
      graph.clearCells()
      return false
    })
    graph.bindKey('ctrl+s', () => {
      graph.toPNG((datauri) => {
        DataUri.downloadDataUri(datauri, 'chart.png')
      })
      return false
    })
    graph.bindKey('ctrl+p', () => {
      graph.printPreview()
      return false
    })
    graph.bindKey('ctrl+c', this.copy)
    graph.bindKey('ctrl+v', this.paste)
    graph.bindKey('ctrl+x', this.cut)
    },
    copy() {
      const { graph } = FlowGraph
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    },

    cut () {
      const { graph } = FlowGraph
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.cut(cells)
      }
      return false
    },

    paste () {
      const { graph } = FlowGraph
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 })
        graph.cleanSelection()
        graph.select(cells)
      }
      return false
    },

	// Method to show export JSON dialog
    exportJSONDialog() {
      this.jsonForm.name = '' // Clear previous input
      this.jsonDialogVisible = true
    },
	// Method to export JSON with user-provided name
    exportJSON() {
      const { graph } = FlowGraph
      const name = this.jsonForm.name.trim()
      if (name) {
	  console.log(this.jsonForm);
	  console.log(JSON.stringify(this.$store.state.flow));
        const jsonData = graph.toJSON()
        //window.localStorage.setItem(name, JSON.stringify(jsonData))
		const cur=window.document.location.href;
	  const pathname=window.document.location.pathname;
	  const pos=cur.indexOf(pathname);
	  const localhostpath=cur.substring(0,pos);
	  
	  $.ajax({
		type:"get",
		data:{
		name: name,
		  projectCode: this.jsonForm.projectCode,
		  objectCode: this.jsonForm.objectCode,
		  parentCode: this.jsonForm.parentCode,
		  json: JSON.stringify(jsonData),
		  background: JSON.stringify(this.$store.state.flow),
		  dataspaceCode:this.jsonForm.dataspaceCode
		  },
		  url:localhostpath+'/vue/saveJson',
		  success:(res) => {
			if(res.code==500){
				Utils.error(res.message)
			}else{
				this.jsonDialogVisible = false
				Utils.success('保存成功！')
			}
		  }
	  })
		
      } else {
        this.$message.error('请输入有效的名称')
      }
    },
    handleClick(event) {
      const { graph } = FlowGraph
      const name = (event.currentTarget).name
      switch (name) {
        case 'undo':
          graph.history.undo()
          break
        case 'redo':
          graph.history.redo()
          break
        case 'delete':
          graph.clearCells()
          break
		case 'swit':
          FlowGraph.switchEdgeOrDouble()
          break
        case 'savePNG':
          graph.toPNG((dataUri) => {
            // 下载
            DataUri.downloadDataUri(dataUri, 'chartx.png')
          }, {
            backgroundColor:'white',
            padding: {
              top: 20,
              right: 30,
              bottom: 40,
              left: 50,
            },
            quality:1
          })
          break
        case 'saveSVG':
          graph.toSVG((dataUri) => {
            // 下载
            DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
          })
          break
        case 'print':
          graph.printPreview()
          break
        case 'copy':
          this.copy()
          break
        case 'cut':
          this.cut()
          break
        case 'paste':
          this.paste()
          break
        case 'toJSON':
          console.log(graph.toJSON())
          window.localStorage.setItem('graphJson', JSON.stringify(graph.toJSON()))
          // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
          break
        default:
          break
      }
    }
  }
}
</script>
<style scoped>
.bar{
  width: 100%;
  z-index: 99999;
  margin-right:16px;
}
.item-space{
  margin-left:16px;
}

</style>
