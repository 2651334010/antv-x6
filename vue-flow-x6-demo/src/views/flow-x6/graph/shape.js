import { Graph, Dom, Node } from '@antv/x6'
import { basicPorts, customPorts } from './ports'

// 基础节点
export const FlowChartRect = Graph.registerNode('flow-chart-rect', {
  inherit: 'rect',
  width: 80,
  height: 42,
  attrs: {
    body: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: '#ffffff',
    },
    fo: {
      refWidth: '100%',
      refHeight: '100%',
    },
    foBody: {
      xmlns: Dom.ns.xhtml,
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    'edit-text': {
      contenteditable: 'true',
      class: 'x6-edit-text',
      style: {
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(0,0,0,0.85)',
      },
    },
    text: {
      fontSize: 12,
      fill: '#080808',
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'text',
    },
    {
      tagName: 'foreignObject',
      selector: 'fo',
      children: [
        {
          ns: Dom.ns.xhtml,
          tagName: 'body',
          selector: 'foBody',
          children: [
            {
              tagName: 'div',
              selector: 'edit-text',
            },
          ],
        },
      ],
    },
  ],
  ports: { ...basicPorts },
})
// 组合节点
export const FlowChartImageRect = Graph.registerNode('flow-chart-image-rect', {
  inherit: 'rect',
  width: 200,
  height: 60,
  attrs: {
    body: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: 'rgba(95,149,255,0.05)',
    },
    image: {
      'xlink:href':
        'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
      width: 16,
      height: 16,
      x: 12,
      y: 12,
    },
    title: {
      text: 'Node',
      refX: 40,
      refY: 14,
      fill: 'rgba(0,0,0,0.85)',
      fontSize: 12,
      'text-anchor': 'start',
    },
    text: {
      text: 'this is content text',
      refX: 40,
      refY: 38,
      fontSize: 12,
      fill: 'rgba(0,0,0,0.6)',
      'text-anchor': 'start',
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'text',
      selector: 'title',
    },
    {
      tagName: 'text',
      selector: 'text',
    },
  ],
  ports: { ...basicPorts },
})

export const FlowChartTitleRect = Graph.registerNode('flow-chart-title-rect', {
  inherit: 'rect',
  width: 200,
  height: 68,
  attrs: {
    body: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: 'rgba(95,149,255,0.05)',
    },
    head: {
      refWidth: '100%',
      stroke: 'transparent',
      height: 28,
      fill: 'rgb(95,149,255)',
    },
    image: {
      'xlink:href':
        'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
      height: 16,
      x: 6,
      y: 6,
    },
    title: {
      text: 'Node',
      refX: 30,
      refY: 9,
      fill: '#ffffff',
      fontSize: 12,
      'text-anchor': 'start',
    },
    text: {
      text: 'this is content text',
      refX: 8,
      refY: 45,
      fontSize: 12,
      fill: 'rgba(0,0,0,0.6)',
      'text-anchor': 'start',
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'rect',
      selector: 'head',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'text',
      selector: 'title',
    },
    {
      tagName: 'text',
      selector: 'text',
    },
  ],
  ports: { ...basicPorts },
})

export const FlowChartAnimateText = Graph.registerNode('flow-chart-animate-text', {
  inherit: 'rect',
  width: 200,
  height: 60,
  attrs: {
    body: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: 'rgba(95,149,255,0.05)',
    },
    text1: {
      class: 'animate-text1',
      text: 'AntV X6',
      fontSize: 32,
    },
    text2: {
      class: 'animate-text2',
      text: 'AntV X6',
      fontSize: 32,
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'text1',
    },
    {
      tagName: 'text',
      selector: 'text2',
    },
  ],
})

// 自定义 系统设计图
export const FlowChartImageRectCustom = Graph.registerNode('flow-chart-image-rect-custom', {
  inherit: 'rect',
  width: 80,
  height: 80,
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
    },
    {
      tagName: 'text',
      selector: 'label',
    }
  ],
  attrs: {
    body: {
      // 节点线的颜色
      stroke: 'transparent',
      // 背景填充色
      fill: 'transparent',
    },
    // 自定义图片
    image: {
      width: 60,
      height: 60,
      refX: 0,
      refY: 0,
    },
    label: {
      refX: 3,
      refY: 2,
      textAnchor: 'left',
      textVerticalAnchor: 'top',
      fontSize: 12,
      fill: 'black',
    },
    'edit-text': {
      contenteditable: 'true',
      class: 'x6-edit-text',
      style: {
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(0,0,0,0.85)'
      },
    },
    text: {
      fontSize: 12,
      fill: '#080808',
    },
  },
  ports: { ...customPorts },
})

export const FlowImageRectCustom = Graph.registerNode(
        'image',
        {
          inherit: 'rect',
          width: 52,
          height: 52,
          markup: [
            {
              tagName: 'rect',
              selector: 'body'
            },
            {
              tagName: 'image'
            },
            {
              tagName: 'text',
              selector: 'label'
            }
          ],
          attrs: {
            body: {
              strokeWidth: 1,
              stroke: 'transparent',
              fill: 'transparent'
            },
            image: {
              width: 52,
              height:52 ,
              refX: 5,
              refY: 5
            },
            label: {
              refX: 0,
              refY: 0,
              textAnchor: 'left',
              textVerticalAnchor: 'top',
              fontSize: 0,
              fill: '#fff'
            }
          },
          ports: { ...customPorts }
        },
        true
      )

// 注册文本框节点
export const FlowChartTextBlock = Graph.registerNode('flow-chart-text-block', {
  inherit: 'rect',
  width: 100,
  height: 50,
  attrs: {
    body: {
      stroke: 'transparent', // 边框透明
      fill: 'transparent',   // 背景透明
    },
    fo: {
      refWidth: '100%',
      refHeight: '100%',
    },
    foBody: {
      xmlns: Dom.ns.xhtml,
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent', // 背景透明
      },
    },
    'edit-text': {
      contenteditable: 'true',
      class: 'x6-edit-text',
      style: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: 14,
        color: '#333',
        background: 'transparent', // 背景透明
        border: 'none',            // 无边框
        outline: 'none',           // 无轮廓
      },
    },
    text: {
      text: '双击编辑文本',
      fontSize: 14,
      fill: '#333',
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'foreignObject',
      selector: 'fo',
      children: [
        {
          ns: Dom.ns.xhtml,
          tagName: 'body',
          selector: 'foBody',
          children: [
            {
              tagName: 'div',
              selector: 'edit-text',
            },
          ],
        },
      ],
    },
    {
      tagName: 'text',
      selector: 'text',
    },
  ],
  ports: { ...basicPorts },
})

// 定义按钮节点
export const FlowChartButtonNode = Graph.registerNode('button', {
  inherit: 'rect',
  width: 100,
  height: 50,
  attrs: {
    body: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: '#ffffff',
      rx: 10,  // 设置圆角半径
      ry: 10,  // 设置圆角半径
    },
    text: {
		text: '按钮',
      fontSize: 12,
      fill: '#080808',
      refX: 10,
      refY: 25,
      textAnchor: 'start',
    }
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'rect',
      selector: 'button',
    },
    {
      tagName: 'text',
      selector: 'buttonText',
    },
    {
      tagName: 'text',
      selector: 'text',
    },
  ]
});

// 定义具有三条小波浪线的节点
export const FlowChartWavyNode = Graph.registerNode('wavy', {
  inherit: 'rect',
  width: 30,
  height: 30,
  attrs: {
    body: {
      stroke: 'transparent',
      strokeWidth: 1,
      fill: 'transparent',
    },
    image: {
      'xlink:href':require('../../../assets/波浪.png'),
		  width: 30,
		  height:30 ,
		  refX: 5,
		  refY: 5
    },
    text: {
      text: '',
      refX: 10,
      refY: 90,
      fontSize: 12,
      fill: '#080808',
      textAnchor: 'start',
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
      selector: 'image',
    }
  ]
});

// 节点组
export class NodeGroup extends Node {
  collapsed = true

  postprocess() {
    this.toggleCollapse(true)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleCollapse(collapsed) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.resize(200, 40)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      this.resize(240, 240)
    }
    this.collapsed = target
  }
}

NodeGroup.config({
  shape: 'rect',
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'text',
      selector: 'text',
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: 'rgba(95,149,255,0.05)',
      stroke: '#5F95FF',
    },
    image: {
      'xlink:href':
        'https://gw.alipayobjects.com/mdn/rms_0b51a4/afts/img/A*X4e0TrDsEiIAAAAAAAAAAAAAARQnAQ',
      width: 16,
      height: 16,
      x: 8,
      y: 12,
    },
    text: {
      fontSize: 12,
      fill: 'rgba(0,0,0,0.85)',
      refX: 30,
      refY: 15,
    },
    buttonGroup: {
      refX: '100%',
      refX2: -25,
      refY: 13,
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: '#f5f5f5',
      stroke: '#ccc',
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: '#808080',
    },
  },
})

Graph.registerNode('groupNode', NodeGroup)
