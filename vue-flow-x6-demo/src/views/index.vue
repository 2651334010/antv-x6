<doc>
  通过Json数据回显页面
</doc>
<template>
  <div class="">
	<div ref="graphContainer" id="flow-container" style="height: 1000px; border: 1px solid #ccc;"></div>
  </div>
</template>
<script>
import FlowGraph from './flow-x6/graph'
import getContainerSize from '../utils'
import GridOption from './flow-x6/components/ConfigPanel/ConfigGrid/method'
export default {
 data() {
    return {
      graph: null // Graph instance
    }
  },
  created() {
    this.fetchSavedItems()
  },
 
  destroyed() {
    const { graph } = FlowGraph
    // 销毁画布，资源回收
    if(graph) graph.dispose()
    // 移除监听
    window.removeEventListener('resize', this.resizeFn)
  },
  methods:{
	fetchSavedItems() {
		const versionId=Utils.getUrlParam("versionId");
		if(versionId!=null&&versionId!=""){
			$.ajax({
			type:"get",
			data:{
			  versionId: versionId
			  },
			  url:'/vue/getJsonByVersionId',
			  success:function(res){
				if(res.code==200){
					// 初始化画板
					  const graph = FlowGraph.init(document.querySelector('#flow-container'), document.querySelector('#flow-container').getBoundingClientRect().width, document.querySelector('#flow-container').getBoundingClientRect().height, false)
					  // 渲染操作
					  graph.fromJSON(JSON.parse(res.data.content))
					  const options = {
						color: "#e5e5e5",
						image: require('../assets/logo.png'),
						repeat: "no-repeat",
						angle: "30",
						size: "cover",
						position: "center",
						opacity: 0.9,
					}
					const background=res.data.background;
					if(background!=null&&background!=""){
					const globalGridAttr=JSON.parse(background);
					const option = {
						color: globalGridAttr.bgColor,
						image: globalGridAttr.showImage ? globalGridAttr.bgImage: require('../assets/logo.png'),
						repeat: globalGridAttr.repeat,
						angle: globalGridAttr.angle,
						size: globalGridAttr.bgSize,
						position: globalGridAttr.position,
						opacity: globalGridAttr.opacity,
					}
						graph.drawBackground(option)
					}else{
						graph.drawBackground(options)
					}
					
					//刷新属性
					const nodess = graph.getNodes();
					// 遍历所有节点
					nodess.forEach(node => {
					  // 检查节点的 shape 属性
					  if (node.shape === 'flow-chart-text-block') {
						const nodeData=node.store.data;
						if(nodeData!=null&&nodeData.data!=null){
							const projectCode=nodeData.data.projectCode;
							const objectCode=nodeData.data.objectCode;
							if(projectCode!=null&&projectCode!=""&&objectCode!=null&&objectCode!=""){
								$.ajax({
									type:"get",
									data:{
									  projectCode:projectCode,
										objectCode:objectCode
									  },
									  url:'/vue/getAttr',
									  success:function(res){
										if(res.data!=null&&res.data!=""){
											const tooltipData = res.data;
											  console.log(tooltipData);
											  var tooltipContent='';
											  tooltipData.forEach(item => {
												tooltipContent +=item.name+':'+item.value+'\n';
											  });
												node.attr('text/text', tooltipContent);
										}
									}})
							
							}
						}
					  }
					});
					
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
						  
						  $.ajax({
							type:"get",
							data:{
							  projectCode:projectCode,
								objectCode:objectCode
							  },
							  url:'/vue/getObjectIdByCode',
							  success:function(res){
								if(res.data!=null&&res.data!=""){
									window.parent.clickEvent(res.data);
								}
							}})
						}
					  })
					  
					  // 鼠标移入
					  graph.on('node:mouseenter', ({ e, node, view }) => { 
						const cellData=node.store.data;
						  if(cellData==null) return;
						  if(cellData.data==null) return;
						  const projectCode=cellData.data.projectCode;
						  const objectCode=cellData.data.objectCode;
						  if(projectCode==null || objectCode==null) return;
						  $.ajax({
							type:"get",
							data:{
							  projectCode:projectCode,
								objectCode:objectCode
							  },
							  url:'/vue/getAttr',
							  success:function(res){
								if(res.data!=null&&res.data!=""){
									const tooltipData=res.data;
									console.log(tooltipData);
									const tooltipElement1 = document.querySelector('.custom-tooltip');
									  if (tooltipElement1) {
										tooltipElement1.remove();
									  }
									// Create a tooltip element
									  const tooltipElement = document.createElement('div');
									  
									  // Add class for styling
									  tooltipElement.classList.add('custom-tooltip');
									  
									  // Construct HTML content for tooltip
									  var tooltipContent = '';
									  tooltipData.forEach(item => {
										tooltipContent += `<p><strong>${item.name}:</strong> ${item.value}</p>`;
									  });
									  // Set tooltip content
									  tooltipElement.innerHTML = tooltipContent;
									  
									  // Set position of tooltip
									  tooltipElement.style.position = 'absolute';
									  tooltipElement.style.left = `${e.pageX}px`;
									  tooltipElement.style.top = `${e.pageY}px`;
									  
									  // Append tooltip to the body
									  document.body.appendChild(tooltipElement);
								}
							}})
					  })

					  
						// 鼠标移出 隐藏
						graph.on('node:mouseleave', () => {
						  const tooltipElement = document.querySelector('.custom-tooltip');
						  if (tooltipElement) {
							tooltipElement.remove();
						  }
						})
						
						  // 绑定节点点击事件
						  var currNode=null;
						  //start animal
							function addAnimal(x,y,width,height,from,to,dur){
								const rect = graph.addNode({
								  shape: 'wavy',
								  x: x,
								  y: y,
								  width: width,
								  height: height,
								  attrs:{
									  image: {
									  'xlink:href':require('../assets/波浪.png'),
										  width: width,
										  height:height ,
										  refX: 5,
										  refY: 5
									},
								  }
								})

								const view = graph.findView(rect)
								if (view) {
								 view.animate('image', {
									attributeType: 'XML',
									attributeName: 'x',
									from: from,
									to: to,
									dur: dur+'s',
									repeatCount: 'indefinite',
								  })
								}
							}
							function addAnimal2(x,y,width,height,from,to,dur){
								const rect = graph.addNode({
								  shape: 'wavy',
								  x: x,
								  y: y,
								  width: width,
								  height: height,
								  attrs:{
									  image: {
									  'xlink:href':require('../assets/波浪竖.png'),
										  width: width,
										  height:height ,
										  refX: 5,
										  refY: 5
									},
								  }
								})

								const view = graph.findView(rect)
								if (view) {
								 view.animate('image', {
									attributeType: 'XML',
									attributeName: 'y',
									from: from,
									to: to,
									dur: dur+'s',
									repeatCount: 'indefinite',
								  })
								}
							}
						  
						  graph.on('node:click', ({ e, x, y, node, view }) => {
						console.log(node)
						const butShape=node.store.data.shape;
						if(butShape=="button"){
							console.log(currNode);
							if(node.getData()!=null){
								console.log(node.getData().event);
								const btnEvent=node.getData().event;
								if(btnEvent=="打开图纸"){
									if(currNode!=null){
										const cellData=currNode.store.data;
									  if(cellData==null) return;
									  if(cellData.data==null) return;
									  const projectCode=cellData.data.projectCode;
									  const objectCode=cellData.data.drawCode;
									  if(projectCode==null || objectCode==null) return;
									  $.ajax({
										type:"get",
										data:{
										  projectCode:projectCode,
											objectCode:objectCode
										  },
										  url:'/vue/getObjectIdByCode',
										  success:function(res){
											if(res.data!=null&&res.data!=""){
												window.parent.clickEvent(res.data);
											}
										}})
									}
								}else if(btnEvent=="开始动画"){
										// 获取所有节点
										const nodes = graph.getNodes();
										// 遍历所有节点
										nodes.forEach(node => {
										  // 检查节点的 shape 属性
										  if (node.shape === 'wavy') {
											// 删除符合条件的节点
											graph.removeNode(node);
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
													addAnimal(x,y,width,height,x,Number(x) + Number(distance),duration);
												  }, timeOuts);
											  }else{
												  setTimeout(() => {
													addAnimal2(x,y,width,height,y,Number(y) + Number(distance),duration);
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
										graph.removeNode(node);
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
												$.ajax({
													type:"get",
													data:{
													  projectCode:projectCode,
														objectCode:objectCode
													  },
													  url:'/vue/getAttr',
													  success:function(res){
														if(res.data!=null&&res.data!=""){
															const tooltipData = res.data;
															  console.log(tooltipData);
															  var tooltipContent='';
															  tooltipData.forEach(item => {
																tooltipContent +=item.name+':'+item.value+'\n';
															  });
																node.attr('text/text', tooltipContent);
														}
													}})
											
											}
										}
									  }
									});
								}
							}
							
						}else{
							currNode=node;
						}
					  })
				}
			  }
			})
		}
    },
    // 去后台拿json
    getFlowJson() {
      setTimeout(() => {
        const graphJson = JSON.parse(window.localStorage.getItem('graphJson'))
        if(graphJson) {
          this.initFlowImage(graphJson)
        } else {
          this.$router.push('/flow-x6')
        }
      }, 300)
    },
	 // Method to load selected graph JSON
    loadGraph() {
      const selectedName = this.selectedItem
      if (selectedName && localStorage.getItem(selectedName)) {
        const jsonData = JSON.parse(localStorage.getItem(selectedName))
		console.log(jsonData)
		this.graph = FlowGraph.init($('#flow-container'), $('#flow-container').getBoundingClientRect().width, $('#flow-container').getBoundingClientRect().height, false)
        this.graph.fromJSON(jsonData)
		const options = {
            color: "#e5e5e5",
            image: require('../assets/logo.png'),
            repeat: "no-repeat",
            angle: "30",
            size: "cover",
            position: "center",
            opacity: 0.9,
        }
		this.graph.drawBackground(options)
      }
    },
    // 根据json渲染
    initFlowImage(graphJson) {
      // 初始化画板
      const graph = FlowGraph.init($('#flow-container'), $('#flow-container').getBoundingClientRect().width, $('#flow-container').getBoundingClientRect().height, false)
      // 渲染操作
      graph.fromJSON(graphJson)

      // 监听数据改变事件
      //graph.getNodes().forEach(node => {
       // if(node.getData()) {
        //  node.on("change:data", ({ cell, current }) => {
            // current 就是我们绑定的 业务属性data
        //    if(current.status == 0) {
        //      cell.attr('body/fill', 'red')
        //      cell.attr('text/fill', '#fff')
        //      cell.attr('text/text', '100℃')
        //    } else {
        //      cell.attr('body/fill', 'green')
        //      cell.attr('text/fill', '#080808')
        //      cell.attr('text/text', '150℃')
         //   }
        //  })
       // }
      //})
      //window.addEventListener('resize', this.resizeFn)
    },
    // 改变状态
    editFlowData() {
      const { graph } = FlowGraph
      graph.getNodes().forEach(node => {
        if(node.getData()) {
          let curStatus = node.getData().status
          node.setData({
            status: curStatus == 0 ? 1 : 0
          })
        }
      })
    },
    resizeFn() {
      setTimeout(() => {
        const { width, height } = getContainerSize($('#flow-image'))
        this.graph.resize(width, height)
      }, 100)
    },
	//start animal
	startAnimal(){
		FlowGraph.startAnimation();
	},
	stopAnimal(){
		FlowGraph.startAnimation();
	}
  }
}
</script>
<style scoped>

</style>
