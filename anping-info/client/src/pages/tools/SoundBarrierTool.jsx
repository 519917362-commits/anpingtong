import {import { useState } from 'react'

const MATERIALimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePriceimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { valueimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc:import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PCimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好'import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice:import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { valueimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280,import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label:import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, descimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

constimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value:import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', costimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'climport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost:import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material,import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material, height, width, thickness, surface, installTypeimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material, height, width, thickness, surface, installType, quantity) {
  if (!material ||import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material, height, width, thickness, surface, installType, quantity) {
  if (!material || !height || !width || !thickness) return null
  const mat = MATERIALSimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material, height, width, thickness, surface, installType, quantity) {
  if (!material || !height || !width || !thickness) return null
  const mat = MATERIALS.find(m => m.value === material)
  const surfaceF = SURFACE_TREATMENTS.findimport { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material, height, width, thickness, surface, installType, quantity) {
  if (!material || !height || !width || !thickness) return null
  const mat = MATERIALS.find(m => m.value === material)
  const surfaceF = SURFACE_TREATMENTS.find(s => s.value === surface)?.factor || 1.0
  const installCost =import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material, height, width, thickness, surface, installType, quantity) {
  if (!material || !height || !width || !thickness) return null
  const mat = MATERIALS.find(m => m.value === material)
  const surfaceF = SURFACE_TREATMENTS.find(s => s.value === surface)?.factor || 1.0
  const installCost = INSTALL_TYPES.find(i => i.value === installType)?.cost || 0
import { useState } from 'react'

const MATERIALS = [
  { value: 'aluminum', label: '铝合金板', basePrice: 180, desc: '轻质、耐腐蚀、美观' },
  { value: 'steel', label: '镀锌钢板', basePrice: 120, desc: '强度高、性价比高' },
  { value: 'pc', label: 'PC耐力板', basePrice: 220, desc: '透明、隔音效果好' },
  { value: 'acrylic', label: '亚克力板', basePrice: 190, desc: '高透明、耐候性好' },
  { value: 'composite', label: '复合吸音板', basePrice: 280, desc: '吸音效果极佳' },
]

const SURFACE_TREATMENTS = [
  { value: 'spray', label: '静电喷涂', factor: 1.05, desc: '常规处理' },
  { value: 'galvanized', label: '热镀锌', factor: 1.1, desc: '防腐性能强' },
  { value: 'powder', label: '粉末喷涂', factor: 1.15, desc: '美观耐用' },
  { value: 'none', label: '不处理', factor: 1.0, desc: '裸材' },
]

const INSTALL_TYPES = [
  { value: 'foundation', label: '混凝土基础安装', cost: 80, desc: '适合永久性安装' },
  { value: 'bolt', label: '螺栓固定', cost: 40, desc: '适合钢结构固定' },
  { value: 'clamp', label: '夹具安装', cost: 30, desc: '快速安装' },
]

function calcPrice(material, height, width, thickness, surface, installType, quantity) {
  if (!material || !height || !width || !thickness) return null
  const mat = MATERIALS.find(m => m.value === material)
  const surfaceF = SURFACE_TREATMENTS.find(s => s.value === surface)?.factor || 1.0
  const installCost = INSTALL_TYPES.find(i => i.value === installType)?.cost || 0
  if (!mat) return null
  
  const area = height * width * quantity
  const material