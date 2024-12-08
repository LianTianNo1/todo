# Todo.llllife - 现代化的待办事项管理应用

## 项目简介

Todo.llllife 是一个简洁优雅的待办事项管理应用，专注于提供流畅的任务管理体验。无论是工作计划、学习目标还是生活安排，都能帮助你井井有条地完成每一项任务。

## 在线体验

立即体验：[todo.llllife.cn](http://todo.llllife.cn)

## 核心特性

- 直观的任务管理界面
- 优雅的拖拽排序功能
- 任务完成度统计和图表展示

## 技术栈

- **框架**: [Next.js 15](https://nextjs.org/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **组件**: 
  - [@radix-ui](https://www.radix-ui.com/) - 无障碍性组件
  - [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) - 拖拽功能
  - [Chart.js](https://www.chartjs.org/) - 数据可视化
- **日期处理**: [date-fns](https://date-fns.org/) & [dayjs](https://day.js.org/)
- **图标**: [Lucide React](https://lucide.dev/)

## 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd mytodo-wrap
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 构建部署

```bash
# 构建项目
npm run build

# 启动生产服务
npm run start
```

## 参与贡献

欢迎提交 Issue 和 Pull Request！让我们一起把这个项目变得更好。

## 开源协议

[MIT License](LICENSE)
