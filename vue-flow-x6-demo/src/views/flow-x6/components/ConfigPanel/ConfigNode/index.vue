<template>
  <div style="width: 100%;height: 100%;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="节点" name="1">
	

        <!-- 调节边框的颜色  对无边框的不起作用 -->
        <el-row v-show="nodeType == 'text' || nodeType == 'image'">
          <el-col :span='10'>Border Color</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="color" v-model="nodeStroke" style="width: 100%" @change="onStrokeChange"/>
          </el-col>
        </el-row>
        <!-- 调节边框的宽度  对无边框的不起作用 -->
        <el-row v-show="nodeType == 'text' || nodeType == 'image'">
          <el-col :span='8'>Border Width</el-col>
          <el-col :span='12'>
            <el-slider size="mini" :min='1' :max='5' :step='1' v-model="nodeStrokeWidth" @change="onStrokeWidthChange"/>
          </el-col>
          <el-col :span='2'>
            <div class="result">{{nodeStrokeWidth}}</div>
          </el-col>
        </el-row>
        <!-- 填充颜色  对image不起作用 -->
        <el-row v-show="nodeType == 'text'">
          <el-col :span='8'>Fill isTransparent</el-col>
          <el-col :span='14'>
            <el-switch v-model="isNodeFill" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-row>
        <el-row v-show="nodeType == 'text' && !isNodeFill">
          <el-input size="mini" type="color" v-model="nodeFill" style="width: 100%" @change="onFillChange"/>
        </el-row>
        <!-- <el-row>
          <el-col :span='8'>Image Width</el-col>
          <el-col :span='14'>
            <el-slider :min='20' :max='300' :step='20' v-model="nodeImageWidth" style="width: 100%" @change="onImageWidth"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='8'>Image Height</el-col>
          <el-col :span='14'>
            <el-slider :min='20' :max='300' :step='20' v-model="nodeImageHeight" style="width: 100%" @change="onImageHeight"/>
          </el-col>
        </el-row> -->
        <el-row v-show="nodeType == 'image'">
          <el-col :span='8'>Port ID</el-col>
          <el-col :span='14'>
            <el-select size="mini" v-model="portId" placeholder="请选择">
              <el-option label="top" value="port1" />
              <el-option label="right" value="port2" />
              <el-option label="bottom" value="port3" />
              <el-option label="left" value="port4" />
            </el-select>
          </el-col>
        </el-row>
        <el-row v-show="portId">
          <el-col :span='8'>Port Left</el-col>
          <el-col :span='12'>
            <el-slider size="mini" :min='-5' :max='100' :step='1' v-model="portX" style="width: 100%"/>
          </el-col>
          <el-col :span='2'>
            <div class="result">{{ portX }}</div>
          </el-col>
        </el-row>
        <el-row v-show="portId">
          <el-col :span='8'>Port Top</el-col>
          <el-col :span='12'>
            <el-slider size="mini" :min='-5' :max='100' :step='1' v-model="portY" style="width: 100%"/>
          </el-col>
          <el-col :span='2'>
            <div class="result">{{ portY }}</div>
          </el-col>
        </el-row>
        <el-row v-show="portId">
          <el-col :span='10'>Port Color</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="color" v-model="portColor" style="width: 100%" @change="onPortColorChange"/>
          </el-col>
        </el-row>
        <el-row v-show="portId">
          <el-col :span='10'>Port Fill</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="color" v-model="portFill" style="width: 100%" @change="onPortFillChange"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='8'>Node ZIndex</el-col>
          <el-col :span='12'>
            <el-slider size="mini" :min='0' :max='100' :step='1' v-model="ZIndex" style="width: 100%"/>
          </el-col>
          <el-col :span='2'>
            <div class="result">{{ ZIndex }}</div>
          </el-col>
        </el-row>
		 <!-- 新增动画设置 -->
        <el-row>
          <el-col :span='8'>开启动画</el-col>
          <el-col :span='14'>
            <el-switch v-model="enableAnimation" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-col>
        </el-row>
		       <el-row v-show="enableAnimation">
          <el-col :span='8'>起始坐标X(px)</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="number" v-model="animationStartX" style="width: 100%" @change="onAnimationStartXChange"/>
          </el-col>
        </el-row>

        <el-row v-show="enableAnimation">
          <el-col :span='8'>起始坐标Y(px)</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="number" v-model="animationStartY" style="width: 100%" @change="onAnimationStartYChange"/>
          </el-col>
        </el-row>

        <el-row v-show="enableAnimation">
          <el-col :span='8'>宽度(px)</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="number" v-model="animationWidth" style="width: 100%" @change="onAnimationWidthChange"/>
          </el-col>
        </el-row>
		<el-row v-show="enableAnimation">
          <el-col :span='8'>高度(px)</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="number" v-model="animationHeight" style="width: 100%" @change="onAnimationHeightChange"/>
          </el-col>
        </el-row>

        <el-row v-show="enableAnimation">
          <el-col :span='8'>距离(px)</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="number" v-model="animationDistance" style="width: 100%" @change="onAnimationDistanceChange"/>
          </el-col>
        </el-row>

        <el-row v-show="enableAnimation">
          <el-col :span='8'>方向</el-col>
          <el-col :span='14'>
            <el-select size="mini" v-model="animationDirection" placeholder="请选择方向" @change="onAnimationDirectionChange">
              <el-option label="从左到右" value="1" />
              <el-option label="从上到下" value="2" />
            </el-select>
          </el-col>
        </el-row>
        
        <el-row v-show="enableAnimation">
          <el-col :span='8'>时间(s)</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="number" v-model="animationDuration" style="width: 100%" @change="onAnimationDurationChange"/>
          </el-col>
        </el-row>
      </el-tab-pane>
	  
	   <!-- 事件标签页 -->
      <el-tab-pane v-if="nodeType == 'text'" label="事件" name="5">
        <el-row>
          <el-col :span='8'>事件类型</el-col>
          <el-col :span='14'>
            <el-select size="mini" v-model="selectedEvent" placeholder="请选择事件" @change="onEventChange">
              <el-option v-for="event in eventOptions" :key="event.value" :label="event.label" :value="event.value" />
            </el-select>
          </el-col>
        </el-row>
      </el-tab-pane>
	  
      <el-tab-pane label="文本" name="2">
        <el-row>
          <el-col :span='8'>Font Size</el-col>
          <el-col :span='12'>
            <el-slider size="mini" :min='8' :max='160' :step='1' v-model="nodeFontSize" @change="onFontSizeChange"/>
          </el-col>
          <el-col :span='2'>
            <div class="result">{{ nodeFontSize }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='8'>Font Color</el-col>
          <el-col :span='14'>
            <el-input size="mini" type="color" v-model="nodeColor" style="width: 100%" @change="onColorChange"/>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="nodeType == 'text'" label="属性" name="3">
        <el-row>
          <el-col :span='8'>Status</el-col>
          <el-col :span='14'>
            <el-select size="mini" @change="onNodeStatusChange" v-model="nodeStatus" placeholder="请选择">
              <el-option label="停止" :value="0" />
              <el-option label="运行" :value="1" />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='8'>PointCode</el-col>
          <el-col :span='14'>
            <el-select size="mini" @change="onNodePointCode" v-model="nodePointCode" placeholder="请选择">
              <el-option label="52" value="52" />
              <el-option label="51" value="51" />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='8'>FieldName</el-col>
          <el-col :span='14'>
            <el-select size="mini" @change="onNodeFieldName" v-model="nodeFieldName" placeholder="请选择">
              <el-option label="fieldName1" value="fieldName1" />
              <el-option label="fieldName2" value="fieldName2" />
            </el-select>
          </el-col>
        </el-row>
      </el-tab-pane>
	  
	  <!-- New tab pane for Interface Parameters -->
      <el-tab-pane label="接口参数" name="4">
        <el-row>
          <el-col :span="8">项目编码</el-col>
          <el-col :span="14">
            <el-input size="mini" v-model="projectCode" @change="onNodeProjectCode"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">对象编码</el-col>
          <el-col :span="14">
            <el-input size="mini" v-model="objectCode" @change="onNodeObjectCode"></el-input>
          </el-col>
        </el-row>
		<el-row>
          <el-col :span="8">连接图纸编码</el-col>
          <el-col :span="14">
            <el-input size="mini" v-model="drawCode" @change="onNodeDrawCode"></el-input>
          </el-col>
        </el-row>
        <!-- Add more rows for additional parameters as needed -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { nodeOpt } from "./method";
export default {
  data() {
    return {
      curCel: null,
      activeName: '1',
      isNodeFill: false,
	  projectCode: '', //项目编码
      objectCode: '',//对象编码
	  drawCode:'',
	  animationStartX: 100,
      animationStartY: 100,
      animationWidth: 30,
      animationDistance: 200,
      animationDirection: '1',
	  enableAnimation: false, // 新增
      animationHeight: 30, // 新增，默认值
      animationDuration: 1, // 新增，默认值
	  selectedEvent: '', // 当前选中的事件
      eventOptions: [   // 事件选项列表
        { label: '开始动画', value: '开始动画' },
        { label: '停止动画', value: '停止动画' },
        { label: '打开图纸', value: '打开图纸' },
        { label: '刷新属性', value: '刷新属性' }
      ],
    }
  },
  props: { id: String },
  watch: {
    id: {
      handler() {
        this.curCel = nodeOpt(this.id, this.$store.state.flow);
        if(this.curCel) {
		console.log(this.curCel);
          this.ZIndex = this.curCel.getZIndex()
          this.isNodeFill = false
		  this.projectCode = this.curCel?.getData()?.projectCode ?? '';
          this.objectCode = this.curCel?.getData()?.objectCode ?? '';
		  this.drawCode = this.curCel?.getData()?.drawCode ?? '';
		  this.selectedEvent = this.curCel?.getData()?.event ?? ''; // 读取当前节点的事件
		     // 读取动画属性
			this.enableAnimation = this.curCel.attr('animation/height')==null?false:true;
			if(this.enableAnimation){
				this.animationHeight = this.curCel.attr('animation/height') ? this.curCel.attr('animation/height') : 100;
				this.animationDuration = this.curCel.attr('animation/duration') ? this.curCel.attr('animation/duration') : 1;
			}

        }
      },
      immediate: false,
      deep: true
    },
	 projectCode(newValue, oldValue) {
      this.onNodeProjectCode()
    },
    objectCode(newValue, oldValue) {
      this.onNodeObjectCode()
    },
	drawCode(newValue, oldValue) {
      this.onNodeDrawCode()
    },
    portId: {
      handler() {
        if(this.portId) {
          const { x, y } = this.curCel?.getPortProp(this.portId)?.args
          if(x && y) {
            this.portX = parseInt(x.slice(0, -1))
            this.portY = parseInt(y.slice(0, -1))
          }
        }
      },
      immediate: false
    },
    portX: {
      handler() {
        this.curCel?.setPortProp(this.portId, 'args', { x: this.portX + '%', y: this.portY + '%' })
      },
      immediate: false
    },
    portY: {
      handler() {
        this.curCel?.setPortProp(this.portId, 'args', { x: this.portX + '%', y: this.portY + '%' })
      },
      immediate: false
    },
    ZIndex: {
      handler() {
        if(this.curCel) {
          this.curCel?.setZIndex(this.ZIndex)
        }
      },
      immediate: false
    },
    isNodeFill: {
      handler() {
        if(this.isNodeFill) {
          this.curCel?.attr('body/fill', 'transparent')
        } else {
          this.curCel?.attr('body/fill', '#fff')
        }
      },
      immediate: true
    },
	enableAnimation: {
      handler(newValue) {
        this.applyAnimationSettings(); // 应用动画设置
      },
      immediate: false,
    },
    animationHeight: {
      handler() {
        this.applyAnimationSettings(); // 应用动画设置
      },
      immediate: false,
    },
     animationStartX(newValue) {
      this.applyAnimationSettings();
    },
    animationStartY(newValue) {
      this.applyAnimationSettings();
    },
    animationWidth(newValue) {
      this.applyAnimationSettings();
    },
    animationDistance(newValue) {
      this.applyAnimationSettings();
    },
    animationDirection(newValue) {
      this.applyAnimationSettings();
    },
    animationDuration(newValue) {
      this.applyAnimationSettings();
    },
	selectedEvent(newEvent) {
      if (this.curCel) {
        this.curCel.setData({ event: newEvent });
      }
    },
  },
  computed: {
    
	nodeStroke: {
      get() {
        return this.$store.state.flow.nodeStroke
      },
      set(val) {
        this.$store.commit('flow/updatenodeStroke', val)
      }
    },
    nodeStrokeWidth: {
      get() {
        return this.$store.state.flow.nodeStrokeWidth
      },
      set(val) {
        this.$store.commit('flow/updatenodeStrokeWidth', val)
      }
    },
    nodeFill: {
      get() {
        return this.$store.state.flow.nodeFill
      },
      set(val) {
        this.$store.commit('flow/updatenodeFill', val)
      }
    },
    // nodeImageWidth: {
    //   get() {
    //     return this.$store.state.flow.nodeImageWidth
    //   },
    //   set(val) {
    //     this.$store.commit('flow/updatenodeImageWidth', val)
    //   }
    // },
    // nodeImageHeight: {
    //   get() {
    //     return this.$store.state.flow.nodeImageHeight
    //   },
    //   set(val) {
    //     this.$store.commit('flow/updatenodeImageHeight', val)
    //   }
    // },
    portId: {
      get() {
        return this.$store.state.flow.portId
      },
      set(val) {
        this.$store.commit('flow/updateportId', val)
      }
    },
    portX: {
      get() {
        return this.$store.state.flow.portX
      },
      set(val) {
        this.$store.commit('flow/updateportX', val)
      }
    },
    portY: {
      get() {
        return this.$store.state.flow.portY
      },
      set(val) {
        this.$store.commit('flow/updateportY', val)
      }
    },
    portColor: {
      get() {
        return this.$store.state.flow.portColor
      },
      set(val) {
        this.$store.commit('flow/updateportColor', val)
      }
    },
    portFill: {
      get() {
        return this.$store.state.flow.portFill
      },
      set(val) {
        this.$store.commit('flow/updateportFill', val)
      }
    },
    ZIndex: {
      get() {
        return this.$store.state.flow.ZIndex
      },
      set(val) {
        this.$store.commit('flow/updateZIndex', val)
      }
    },
    nodeFontSize: {
      get() {
        return this.$store.state.flow.nodeFontSize
      },
      set(val) {
        this.$store.commit('flow/updatenodeFontSize', val)
      }
    },
    nodeColor: {
      get() {
        return this.$store.state.flow.nodeColor
      },
      set(val) {
        this.$store.commit('flow/updatenodeColor', val)
      }
    },
    nodeStatus: {
      get() {
        return this.$store.state.flow.nodeStatus
      },
      set(val) {
        this.$store.commit('flow/updatenodeStatus', val)
      }
    },
    nodePointCode: {
      get() {
        return this.$store.state.flow.nodePointCode
      },
      set(val) {
        this.$store.commit('flow/updatenodePointCode', val)
      }
    },
    nodeFieldName: {
      get() {
        return this.$store.state.flow.nodeFieldName
      },
      set(val) {
        this.$store.commit('flow/updatenodeFieldName', val)
      }
    },
    nodeType: {
      get() {console.log(this.$store.state.flow.nodeType);
        return this.$store.state.flow.nodeType
      },
      set(val) {
        this.$store.commit('flow/updatenodeType', val)
      }
    },
  },
  methods: {
    onStrokeChange () {console.log(this.curCel);
      if (this.nodeType === 'text') {
		this.curCel?.attr('body/stroke', this.nodeStroke);
	  } else if (this.nodeType === 'image') {
		this.curCel?.attr('body/stroke', this.nodeStroke);
	  }
    },

    onStrokeWidthChange () {
      this.curCel?.attr('body/strokeWidth', this.nodeStrokeWidth)
    },

    onFillChange () {
      this.curCel?.attr('body/fill', this.nodeFill)
    },

    // onImageWidth (e) {
    //   this.curCel?.attr('image/width', this.nodeImageWidth)
    // },

    // onImageHeight (e) {
    //   this.curCel?.attr('image/height', this.nodeImageHeight)
    // },

    onPortColorChange() {
      this.curCel?.setPortProp(this.portId, ['attrs', 'circle', 'stroke'], this.portColor)
    },

    onPortFillChange() {
      this.curCel?.setPortProp(this.portId, ['attrs', 'circle', 'fill'], this.portFill)
    },

    onFontSizeChange () {
      this.curCel?.attr('text/fontSize', this.nodeFontSize)
    },

    onColorChange () {
      this.curCel?.attr('text/fill', this.nodeColor)
    },

    onNodeStatusChange () {
      // this.curCel?.attr('data/status', this.nodeStatus)
      this.curCel?.setData({ status: this.nodeStatus })
    },
    onNodePointCode () {
      // this.curCel?.attr('data/pointCode', this.nodePointCode)
      this.curCel?.setData({ pointCode: this.nodePointCode })
    },
    onNodeFieldName () {
      // this.curCel?.attr('data/fieldName', this.nodeFieldName)
      this.curCel?.setData({ fieldName: this.nodeFieldName })
    },
	onNodeProjectCode() {
    if (this.curCel) {
      this.curCel.setData({ projectCode: this.projectCode,objectCode: this.objectCode,drawCode:this.drawCode  });
    }
	  },
	  onNodeObjectCode() {
		if (this.curCel) {
		  this.curCel.setData({ projectCode: this.projectCode,objectCode: this.objectCode,drawCode:this.drawCode  });
		}
	  },
	  onNodeDrawCode() {
		if (this.curCel) {
		  this.curCel.setData({ projectCode: this.projectCode,objectCode: this.objectCode,drawCode:this.drawCode  });
		}
	  },
	  // 新增方法处理动画设置
    applyAnimationSettings() {
      if (this.curCel && this.enableAnimation) {
        this.curCel.attr('animation/height', this.animationHeight);
        this.curCel.attr('animation/duration', this.animationDuration);
		this.curCel.attr('animation/x', this.animationStartX);
        this.curCel.attr('animation/y', this.animationStartY);
        this.curCel.attr('animation/width', this.animationWidth);
        this.curCel.attr('animation/distance', this.animationDistance);
        this.curCel.attr('animation/direction', this.animationDirection);
      } else if (this.curCel) {
        // 如果禁用了动画，可以移除动画设置
        this.curCel.attr('animation/height', null);
		this.curCel.attr('animation/x', null);
        this.curCel.attr('animation/y', null);
        this.curCel.attr('animation/width', null);
        this.curCel.attr('animation/distance', null);
        this.curCel.attr('animation/direction', null);
        this.curCel.attr('animation/duration', null);
      }
    },

    onAnimationHeightChange() {
      this.applyAnimationSettings();
    },

    onAnimationStartXChange() {
      this.applyAnimationSettings();
    },

    onAnimationStartYChange() {
      this.applyAnimationSettings();
    },

    onAnimationWidthChange() {
      this.applyAnimationSettings();
    },

    onAnimationDistanceChange() {
      this.applyAnimationSettings();
    },

    onAnimationDirectionChange() {
      this.applyAnimationSettings();
    },

    onAnimationDurationChange() {
      this.applyAnimationSettings();
    },
	
	onEventChange(value) {
      if (this.curCel) {
        this.curCel.setData({ event: value });
      }
    },
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 5px;
}
</style>
