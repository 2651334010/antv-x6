import {Graph, Addon, FunctionExt, Shape, Dom,Vector} from '@antv/x6'
import './shape'
import { customPorts } from './ports'
import { getImg } from '../../../utils'
import graphData from './data/data'
import axios from 'axios'
const insertCss = require('insert-css')

insertCss(`
  @keyframes ant-line {
    to {
        stroke-dashoffset: -1000
    }
  }
  .custom-tooltip {
  position: absolute;
  background-color: #3498db; /* 蓝色背景色 */
  color: #fff; /* 文字颜色 */
  padding: 10px; /* 内边距 */
  border: 2px solid #000; /* 黑色边框 */
  border-radius: 5px; /* 边框圆角 */
}

`)

export default class FlowGraph {
  static graph = null
  static stencil = null
  static animations = []; // 用于存储动画实例
  static jsontemp = null; // 用于存储动画实例
  /**
   * 初始化方法
   * @param {*} dom 画板容器
   * @param {*} width 容器宽度
   * @param {*} height 容器高度
   * @param {*} flag 默认为true，传入false只实例化画板
   * @returns 
   */
  static init(dom, width = 1200, height = 900, flag = true) {
	  console.log(dom);
    // 初始化 流程图画板
    this.graph = new Graph({
      background: {
        color: '#e5e5e5' // 设置画布背景颜色
      },
      container: dom,
      width: width,
      height: height,
      autoResize: true,
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#cccccc',
            thickness: 1,
          },
          {
            color: '#5F95FF',
            thickness: 1,
            factor: 4,
          },
        ],
      },
      scroller: {
        enabled: false,
        pageVisible: false,
        pageBreak: false,
        pannable: false,
      },
      // 开启画布缩放
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2,
      },
      interacting: {
        nodeMovable: true, //节点是否可以被移动。
        edgeMovable: false, //边是否可以被移动。
        edgeLabelMovable: false, //边的标签是否可以被移动。
        arrowheadMovable: false, //边的起始/终止箭头是否可以被移动
        vertexMovable: true, //边的路径点是否可以被移动。
        vertexAddable: true, //是否可以添加边的路径点。
        vertexDeletable: true, //边的路径点是否可以被删除。
      },
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: true,
        highlight: true,
        snap: true, // 是否自动吸附
        allowMulti: true, // 是否允许在相同的起始节点和终止之间创建多条边
        allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
        allowBlank: false, // 是否允许连接到空白点
        allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点，
        allowEdge: false, // 是否允许边链接到另一个边
        highlight: true, // 拖动边时，是否高亮显示所有可用的连接桩或节点
        connectionPoint: "anchor", // 指定连接点
        anchor: "center", // 指定被连接的节点的锚点
        createEdge() {
          // X6 的 Shape 命名空间中内置 Edge、DoubleEdge、ShadowEdge 三种边
          return new Shape.DoubleEdge({
            attrs: {
              // line: {
              //   // stroke: '#5F95FF',
              //   // strokeWidth: 4,
              //   // targetMarker: {
              //   //   name: 'classic',
              //   //   size: 8,
              //   // },
              //   stroke: '#1890ff',
              //   strokeDasharray: 5,
              //   targetMarker: null,//block classic diamond cross async path circle circlePlus ellipse
              //   style: {
              //     animation: 'ant-line 30s infinite linear',
              //   },
              // },
              line: {
                strokeWidth: 4,
                stroke: '#cfe7f2',
                strokeDasharray: 0,
                style: {
                  animation: 'ant-line 0s infinite linear',
                },
                targetMarker: null, // 去掉箭头
              },
              outline: {
                stroke: '#456d89',
                strokeWidth: 7,
              }
            },
            router: {
              name: 'metro',
              args: {
                offset: 32,
                direction: 'H'
              }
            }
          })
        },
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          if (sourceView === targetView) {
            return false
          }
          if (!sourceMagnet) {
            return false
          }
          if (!targetMagnet) {
            return false
          }
          return true
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: 'rgba(223,234,255)',
            },
          },
        },
      },
      // 开启拖拽平移（防止冲突，按下修饰键并点击鼠标才能触发画布拖拽）
      panning: {
        enabled: true,
        modifiers: 'shift',
      },
      resizing: true,
      rotating: true,
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
      snapline: true,
      history: true,
      clipboard: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            // 只有 data.parent 为 true 的节点才是父节点
            const data = node.getData()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        },
      },
    })
  
   if(!flag) {
      // this.graph.centerContent()
      this.graph.hideGrid() // 返显渲染的时候 隐藏网格
      return this.graph
    }
    this.initStencil()
    this.initShape()
    this.initGraphShape()
    this.initEvent()
    return this.graph
  }
  // 初始化根节点
  static initStencil() {
    this.stencil = new Addon.Stencil({
      target: this.graph,
      stencilGraphWidth: 280,
      search: { rect: true },
      collapsable: true,
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          graphHeight: 260,
        },
        {
          name: 'custom-image',
          title: '系统设计图',
          graphHeight: 1500
        },
        // {
        //   name: 'combination',
        //   title: '组合节点',
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        //   graphHeight: 260,
        // },
        // {
        //   name: 'group',
        //   title: '节点组',
        //   graphHeight: 100,
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        // },
      ],
    })
    const stencilContainer = document.querySelector('#stencil')
    stencilContainer?.appendChild(this.stencil.container)
  }
  // 初始化具体每个根节点下不同类型节点
  static initShape() {
    const { graph } = this
    // 基础节点
    const r1 = graph.createNode({
      shape: 'flow-chart-rect',
      attrs: {
        body: {
          rx: 24,
          ry: 24,
        },
        text: {
          text: '起始节点',
        },
      },
    })
	
// 新的文本框节点
  const textBlock = graph.createNode({
    shape: 'flow-chart-text-block',
    attrs: {
      text: {
        text: '双击编辑文本',
      },
    },
  })
  //按钮
  const buttonNode = graph.createNode({
	  shape: 'button',
	  x: 40,
	  y: 40,
	});
  
    const r2 = graph.createNode({
      shape: 'flow-chart-rect',
      attrs: {
        text: {
          text: '流程节点',
        },
      },
    })
    const r3 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 52,
      height: 52,
      angle: 45,
      attrs: {
        'edit-text': {
          style: {
            transform: 'rotate(-45deg)',
          },
        },
        text: {
          text: '判断节点',
          transform: 'rotate(-45deg)',
        },
      },
      ports: {
        groups: {
          top: {
            position: {
              name: 'top',
              args: {
                dx: -26,
              },
            },
          },
          right: {
            position: {
              name: 'right',
              args: {
                dy: -26,
              },
            },
          },
          bottom: {
            position: {
              name: 'bottom',
              args: {
                dx: 26,
              },
            },
          },
          left: {
            position: {
              name: 'left',
              args: {
                dy: 26,
              },
            },
          },
        },
      },
    })
    const r4 = graph.createNode({
      shape: 'flow-chart-rect',
      width: 70,
      height: 70,
      attrs: {
        body: {
          rx: 35,
          ry: 35,
        },
        text: {
          text: '链接节点',
        },
      },
    })
    // 组合节点
    const c1 = graph.createNode({
      shape: 'flow-chart-image-rect',
    })
    const c2 = graph.createNode({
      shape: 'flow-chart-title-rect',
    })
    const c3 = graph.createNode({
      shape: 'flow-chart-animate-text',
    })
    // 节点组
    const g1 = graph.createNode({
      shape: 'groupNode',
      attrs: {
        text: {
          text: 'Group Name',
        },
      },
      data: {
        parent: true,
      },
    })
    // 系统设计图
    const imgs = [
      {
        image: getImg('ldb.png')
      },
      {
        image: getImg('wft1.png')
      },
      {
        image: getImg('wft2.png')
      },
      {
        image: getImg('wft3.png')
      },
      {
        image: getImg('wft4.png')
      },
      {
        image: getImg('wft5.png')
      },
      {
        image: getImg('lqt.png')
      },
      {
        image: getImg('lqb-o.png')
      },
      {
        image: getImg('ldb-o.png')
      },
      {
        image: getImg('bh.png')
      },
      {
        image: getImg('f1.png')
      },
      {
        image: getImg('f2.png')
      },
      {
        image: getImg('f3.png')
      },
{
        image: getImg('铣.png')
      },
{
        image: getImg('发酵.png')
      },
{
        image: getImg('废液.png')
      },
{
        image: getImg('干燥.png')
      },
{
        image: getImg('混合.png')
      },
{
        image: getImg('蒸发.png')
      },
{
        image: getImg('蒸馏.png')
      },
{
        image: getImg('整流.png')
      },
{
        image: getImg('制浆.png')
      },
	  {
        image: getImg('风管.png')
      },
	  {
        image: getImg('风机.png')
      },
	  {
        image: getImg('风板.png')
      },
	  {
        image: getImg('阀门.png')
      },
	  {
        image: getImg('排风扇.png')
      },
	  {
        image: getImg('网.png')
      },
	  {
        image: getImg('智能1.png')
      },
	  {
        image: getImg('智能2.png')
      },
	  {
        image: getImg('直管.png')
      },
	  {
        image: getImg('三通.png')
      }
	  
    ]
    const imgNodes = imgs.map(item => {
      return graph.createNode({
        // shape: 'flow-chart-image-rect-custom',
        // attrs: {
        //   image: {
        //     'xlink:href': item.image,
        //   }
        // }
        shape: 'image', //可选值：Rect Circle Ellipse Polygon Polyline Path Image HTML TextBlock BorderedImage EmbeddedImage InscribedImage Cylinder
        
		 body: {
		  // 节点线的颜色
		  stroke: 'transparent',
		  // 背景填充色
		  fill: 'transparent',
		},
        attrs: {
          image: {
			  'xlink:href':item.image,
            // fill: 'yellow',
			width: 52,
              height:52 ,
              refX: 5,
              refY: 5
          },
        },
        width: 52,
        height: 52,
        ports: { ...customPorts }
      })
    })
    this.stencil.load([r1, r2, r3, r4,textBlock,buttonNode], 'basic')
    this.stencil.load(imgNodes, 'custom-image')
    // this.stencil.load([c1, c2, c3], 'combination')
    // this.stencil.load([g1], 'group')
  }
  
  // 根据json渲染节点和边
  static initGraphShape() {
	  const cur=window.document.location.href;
	  const pathname=window.document.location.pathname;
	  const pos=cur.indexOf(pathname);
	  const localhostpath=cur.substring(0,pos);
	  console.log(localhostpath);
		axios.get(localhostpath+'/vue/getJson')
		.then(response => {
		  const gd = response.data;
		  this.graph.fromJSON(gd)
		})
		.catch(error => {
		  console.error('Error fetching data:', error);
		});
		const options = {
            color: "#e5e5e5",
            image: require('../../../assets/logo.png'),
            repeat: "no-repeat",
            angle: "30",
            size: "cover",
            position: "center",
            opacity: 0.9,
        }
		this.graph.drawBackground(options)
  }

  // 连接桩显示时机
  static showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  
  
  // 事件相关
  static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')
    // 右键编辑文本
    graph.on('node:contextmenu', ({ cell, view }) => {
      console.log(view.container)
      const oldText = cell.attr('text/text')
      cell.attr('text/style/display', 'none')
      const elem = view.container.querySelector('.x6-edit-text')
      if (elem) {
        elem.innerText = oldText
        elem.focus()
      }
      const onBlur = () => {
        cell.attr('text/text', elem.innerText)
        cell.attr('text/style/display', 'inline-block')
      }
      if(elem){
        elem.addEventListener('blur', () => {
          onBlur()
          elem.removeEventListener('blur', onBlur)
        })
      }
    })
	
	 // 双击编辑文本
  graph.on('node:dblclick', ({ node, e }) => {
   const shape = node.shape;
	if (shape === 'image') {   console.log(node);
		// 如果是图片节点，则执行跳转到导航树
		const cellData=node.store.data;
		
	  if(cellData==null) return;
	  if(cellData.data==null) return;
	  const projectCode=cellData.data.projectCode;
	  const objectCode=cellData.data.objectCode;
	  if(projectCode==null || objectCode==null) return;
	  const cur=window.document.location.href;
	  const pathname=window.document.location.pathname;
	  const pos=cur.indexOf(pathname);
	  const localhostpath=cur.substring(0,pos);
	  console.log(localhostpath);
		axios.get(localhostpath+'/vue/getObjectIdByCode', {
		  params: 
		  {projectCode:projectCode,
			objectCode:objectCode
		  }
		})
		.then(response => {
		  const tooltipData = response.data.data; // Assuming backend returns JSON data
		  console.log(tooltipData);
			if(tooltipData!=null&&tooltipData!=""){
				window.parent.clickEvent(tooltipData);
			}
		})
		.catch(error => {
		  console.error('Error fetching data:', error);
		});
		return;
	}
    const text = node.attr('text/text')
    const elem = document.createElement('textarea')
    elem.value = text
    elem.style.position = 'absolute'
    elem.style.left = `${e.clientX}px`
    elem.style.top = `${e.clientY}px`
    document.body.appendChild(elem)
    elem.focus()
    
    elem.addEventListener('blur', () => {
      node.attr('text/text', elem.value)
      document.body.removeChild(elem)
    })
  })
  
   graph.on('node:click', ({ e, x, y, node, view }) => {
						console.log(node)
						const butShape=node.store.data.shape;
						if(butShape=="button"){
							if(node.getData()!=null){
								console.log(node.getData().event);
								const btnEvent=node.getData().event;
								if(btnEvent=="打开图纸"){
									
								}else if(btnEvent=="开始动画"){
									const nodes = graph.getNodes();
										// 遍历所有节点
										nodes.forEach(node => {
										  // 检查节点的 shape 属性
										  if (node.shape === 'wavy') {
											// 删除符合条件的节点
											this.graph.removeNode(node);
										  }
										});
										
										var timeOuts=0;
										// 遍历所有节点，判断是否开启动画
										nodes.forEach(node => {
										  console.log(node.getAttrs());
										  const animation=node.getAttrs().animation;
										  if(animation!=null){
											  const x=animation.x;
											  const y=animation.y;
											  const width=animation.width;
											  const height=animation.height;
											  const duration=animation.duration;
											  const distance=animation.distance;
											  const direction=animation.direction;
											  if(direction=="1"){
												  setTimeout(() => {
													this.addAnimal(x,y,width,height,x,Number(x) + Number(distance),duration);
												  }, timeOuts);
											  }else{
												  setTimeout(() => {
													this.addAnimal2(x,y,width,height,y,Number(y) + Number(distance),duration);
												  }, timeOuts);
											  }
											timeOuts+=100;  
										  }
									
										});	
								
								}else if(btnEvent=="停止动画"){
									// 获取所有节点
										const nodes = graph.getNodes();
										// 遍历所有节点
										nodes.forEach(node => {
										  // 检查节点的 shape 属性
										  if (node.shape === 'wavy') {
											// 删除符合条件的节点
											this.graph.removeNode(node);
										  }
										});
								}else if(btnEvent=="刷新属性"){
									const nodes = graph.getNodes();
									// 遍历所有节点
									nodes.forEach(node => {
									  // 检查节点的 shape 属性
									  if (node.shape === 'flow-chart-text-block') {
										const nodeData=node.store.data;
										if(nodeData!=null&&nodeData.data!=null){
											const projectCode=nodeData.data.projectCode;
											const objectCode=nodeData.data.objectCode;
											if(projectCode!=null&&projectCode!=""&&objectCode!=null&&objectCode!=""){
												const cur=window.document.location.href;
											  const pathname=window.document.location.pathname;
											  const pos=cur.indexOf(pathname);
											  const localhostpath=cur.substring(0,pos);
												axios.get(localhostpath+'/vue/getAttr', {
												  params: 
												  {projectCode:projectCode,
													objectCode:objectCode
												  }
												})
												.then(response => {
												  const tooltipData = response.data.data;
												  console.log(tooltipData);
												  var tooltipContent='';
												  tooltipData.forEach(item => {
													tooltipContent += `${item.name}:${item.value}`+'\n';
												  });
													node.attr('text/text', tooltipContent);
												})
												.catch(error => {
												  console.error('Error fetching data:', error);
												});
											}
										}
									  }
									});
								}
								
							}
						}
					  })
	
    // 鼠标移入 显示连接桩
    graph.on('node:mouseenter', FunctionExt.debounce((e) => {
      const ports = container.querySelectorAll('.x6-port-body')
      this.showPorts(ports, true)
	  console.log(e)
	  const cellData=e.cell.store.data;
	  if(cellData==null) return;
	  if(cellData.data==null) return;
	  const projectCode=cellData.data.projectCode;
	  const objectCode=cellData.data.objectCode;
	  if(projectCode==null || objectCode==null) return;
	  const cur=window.document.location.href;
	  const pathname=window.document.location.pathname;
	  const pos=cur.indexOf(pathname);
	  const localhostpath=cur.substring(0,pos);
	  console.log(localhostpath);
		axios.get(localhostpath+'/vue/getAttr', {
		  params: 
		  {projectCode:projectCode,
			objectCode:objectCode
		  }
		})
		.then(response => {
		  const tooltipData = response.data.data; // Assuming backend returns JSON data
		  console.log(tooltipData);
			// Render tooltip or use any other logic based on tooltipData
			this.hideTooltip();
			this.showTooltip(e.e, tooltipData);
		})
		.catch(error => {
		  console.error('Error fetching data:', error);
		});
      
      
    }), 500,)
    // 鼠标移出 隐藏连接桩
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll('.x6-port-body')
      this.showPorts(ports, false)
	  this.hideTooltip();
    })

    graph.on('node:collapse', ({ node, e }) => {
      e.stopPropagation()
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const cells = node.getDescendants()
      cells.forEach(n => {
        if (collapsed) {
          n.hide()
        } else {
          n.show()
        }
      })
    })
    // backspace
    graph.bindKey('delete', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })
    // 鼠标动态添加/删除小工具。
    graph.on('edge:mouseenter', ({ cell }) => {
      /**
       * EdgeTool
       * vertices 路径点工具，在路径点位置渲染一个小圆点，拖动小圆点修改路径点位置，双击小圆点删除路径点，在边上单击添加路径点。
       * segments 线段工具。在边的每条线段的中心渲染一个工具条，可以拖动工具条调整线段两端的路径点的位置。
       * boundary 根据边的包围盒渲染一个包围边的矩形。注意，该工具仅仅渲染一个矩形，不带任何交互。
       * button 在指定位置处渲染一个按钮，支持自定义按钮的点击交互。
       * button-remove 在指定的位置处，渲染一个删除按钮，点击时删除对应的边。
       * source-arrowhead-和-target-arrowhead 在边的起点或终点渲染一个图形(默认是箭头)，拖动该图形来修改边的起点或终点。
       * edge-editor 提供边上文本编辑功能。
       */
      cell.addTools([
        {
          name: 'vertices',
          args: {
            attrs: { fill: '#007acc' },
            // 移动路径点过程中的吸附半径。当路径点与邻近的路径点的某个坐标 (x, y) 距离在半径范围内时，将当前路径点的对应坐标 (x, y) 吸附到邻居路径的路径点。
            snapRadius: 20,
            // 在边上按下鼠标时，是否可以添加新的路径点。
            addable: true,
            // 是否可以通过双击移除路径点。
            removable: true,
            // 是否自动移除冗余的路径点。
            removeRedundancies: true,
            // 是否阻止工具上的鼠标事件冒泡到边视图上。阻止后鼠标与工具交互时将不会触发边的 mousedown、mousemove 和 mouseup 事件。
            stopPropagation: false
          }
        }
      ])
    })
    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools()
    })

	// 监听节点尺寸变化事件
    graph.on('node:change:position', ({ node }) => {
      const image = node.store.data.shape;
      if (image=="image") {
        
		
		const size = node.getSize(); // Get the new size of the node
      const image = node.attr('image'); // Get the image attribute

      // Calculate the position for the image to be centered within the node
      const imageWidth = size.width; // Example: 80% of node width
      const imageHeight = size.height; // Example: 80% of node height
      const imageX = (size.width - imageWidth) / 2; // Center horizontally
      const imageY = (size.height - imageHeight) / 2; // Center vertically

      // Update the image attributes
      node.attr({
        image: {
          ...image,
          'xlink:href': image['xlink:href'], // Ensure image URL is retained
          width: imageWidth,
          height: imageHeight,
		  preserveAspectRatio:'none',
          x: imageX,
          y: imageY,
        },
      });
      }
    });
  }
  
	static showTooltip(event, data) {
	  // Create a tooltip element
	  const tooltipElement = document.createElement('div');
	  
	  // Add class for styling
	  tooltipElement.classList.add('custom-tooltip');
	  
	  // Construct HTML content for tooltip
	  var tooltipContent = '';
	  console.log(data);
	  data.forEach(item => {
		tooltipContent += `<p><strong>${item.name}:</strong> ${item.value}</p>`;
	  });
	  // Set tooltip content
	  tooltipElement.innerHTML = tooltipContent;
	  
	  // Set position of tooltip
	  tooltipElement.style.position = 'absolute';
	  tooltipElement.style.left = `${event.pageX}px`;
	  tooltipElement.style.top = `${event.pageY}px`;
	  
	  // Append tooltip to the body
	  document.body.appendChild(tooltipElement);
	}

	// Helper method to hide tooltip
	static hideTooltip() {
	  const tooltipElement = document.querySelector('.custom-tooltip');
	  if (tooltipElement) {
		tooltipElement.remove();
	  }
	}
	
	//start animal
	static addAnimal(x,y,width,height,from,to,dur){
		const rect = this.graph.addNode({
		  shape: 'wavy',
		  x: x,
		  y: y,
		  width: width,
		  height: height,
		  attrs:{
			  image: {
			  'xlink:href':require('../../../assets/波浪.png'),
				  width: width,
				  height:height ,
				  refX: 5,
				  refY: 5
			},
		  }
		})

		const view = this.graph.findView(rect)
		if (view) {
		 const animalInstance =view.animate('image', {
			attributeType: 'XML',
			attributeName: 'x',
			from: from,
			to: to,
			dur: dur+'s',
			repeatCount: 'indefinite',
		  })
		  
		}
	}
	static addAnimal2(x,y,width,height,from,to,dur){
		const rect = this.graph.addNode({
		  shape: 'wavy',
		  x: x,
		  y: y,
		  width: width,
		  height: height,
		  attrs:{
			  image: {
			  'xlink:href':require('../../../assets/波浪竖.png'),
				  width: width,
				  height:height ,
				  refX: 5,
				  refY: 5
			},
		  }
		})

		const view = this.graph.findView(rect)
		if (view) {
		 const animalInstance =view.animate('image', {
			attributeType: 'XML',
			attributeName: 'y',
			from: from,
			to: to,
			dur: dur+'s',
			repeatCount: 'indefinite',
		  })
		  
		}
	}
}
