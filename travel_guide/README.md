# 旅游指南网站

一个基于 Flask 的旅游指南网站，提供目的地信息、旅游攻略和推荐功能。

## 功能特点

- 🌍 **热门目的地展示** - 精选全球旅游目的地
- 🔍 **智能搜索** - 支持按名称、国家和标签搜索
- 📝 **详细攻略** - 提供实用的旅行建议和经验分享
- 🏷️ **分类筛选** - 按浪漫、文化、自然、海岛、冒险等类别筛选
- ⭐ **评分系统** - 每个目的地都有用户评分
- 💡 **旅行贴士** - 实用的当地建议和注意事项
- 📱 **响应式设计** - 完美适配各种设备

## 技术栈

- **后端**: Python Flask
- **前端**: HTML5, CSS3, JavaScript
- **API**: RESTful API 接口

## 快速开始

### 1. 安装依赖

```bash
pip install flask
```

### 2. 运行应用

```bash
cd travel_guide
python app.py
```

### 3. 访问网站

在浏览器中打开：http://localhost:5000

## 项目结构

```
travel_guide/
├── app.py                 # Flask 主应用
├── templates/             # HTML 模板
│   ├── index.html        # 首页
│   ├── destinations.html # 目的地列表页
│   ├── destination_detail.html # 目的地详情页
│   └── guides.html       # 攻略列表页
└── static/               # 静态资源
    ├── css/
    │   └── style.css     # 样式文件
    └── js/
        └── main.js       # JavaScript 脚本
```

## API 接口

- `GET /api/destinations` - 获取所有目的地
- `GET /api/destination/<id>` - 获取指定目的地详情
- `GET /api/search?q=<query>` - 搜索目的地

## 数据说明

当前使用模拟数据，包含 5 个热门旅游目的地：
- 巴黎（法国）
- 京都（日本）
- 圣托里尼（希腊）
- 冰岛
- 巴厘岛（印度尼西亚）

## 扩展建议

1. **数据库集成** - 使用 SQLite/MySQL 存储数据
2. **用户系统** - 添加用户注册、登录功能
3. **评论系统** - 允许用户发表评论和评分
4. **图片上传** - 支持用户上传旅行照片
5. **地图集成** - 集成 Google Maps 或高德地图
6. **天气信息** - 显示目的地实时天气
7. **预订功能** - 整合酒店和机票预订

## 许可证

MIT License

---

🌍 让每一次旅行都难忘！
