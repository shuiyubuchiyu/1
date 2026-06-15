"""
旅游指南网站 - Flask 应用
提供旅游目的地信息、攻略和推荐功能
"""

from flask import Flask, render_template, jsonify, request
from datetime import datetime
import json

app = Flask(__name__)

# 模拟数据库数据
destinations = [
    {
        "id": 1,
        "name": "巴黎",
        "country": "法国",
        "description": "浪漫之都，拥有埃菲尔铁塔、卢浮宫等世界著名景点",
        "best_time": "4-6月，9-10月",
        "rating": 4.8,
        "image": "/static/images/paris.jpg",
        "tags": ["浪漫", "文化", "美食"],
        "tips": ["提前预订博物馆门票", "学习基本法语问候语", "注意保管贵重物品"]
    },
    {
        "id": 2,
        "name": "京都",
        "country": "日本",
        "description": "古都风韵，千年寺庙与传统日式庭院的完美结合",
        "best_time": "3-4月（樱花），11月（红叶）",
        "rating": 4.9,
        "image": "/static/images/kyoto.jpg",
        "tags": ["历史", "文化", "自然"],
        "tips": ["穿着舒适的鞋子", "尊重寺庙礼仪", "尝试传统怀石料理"]
    },
    {
        "id": 3,
        "name": "圣托里尼",
        "country": "希腊",
        "description": "爱琴海明珠，蓝白建筑与绝美日落的代名词",
        "best_time": "5-9月",
        "rating": 4.7,
        "image": "/static/images/santorini.jpg",
        "tags": ["海岛", "浪漫", "摄影"],
        "tips": ["预订悬崖酒店", "观看Oia日落", "品尝当地葡萄酒"]
    },
    {
        "id": 4,
        "name": "冰岛",
        "country": "冰岛",
        "description": "冰与火之国，极光、冰川、火山和温泉的奇幻世界",
        "best_time": "6-8月（午夜阳光），9-3月（极光）",
        "rating": 4.9,
        "image": "/static/images/iceland.jpg",
        "tags": ["自然", "冒险", "极光"],
        "tips": ["租车自驾需购买全险", "携带防水保暖衣物", "提前预订蓝湖温泉"]
    },
    {
        "id": 5,
        "name": "巴厘岛",
        "country": "印度尼西亚",
        "description": "热带天堂，海滩、寺庙和瑜伽文化的完美融合",
        "best_time": "4-10月",
        "rating": 4.6,
        "image": "/static/images/bali.jpg",
        "tags": ["海岛", "度假", "文化"],
        "tips": ["尊重宗教习俗", "尝试传统按摩", "探索乌布艺术村"]
    }
]

travel_guides = [
    {
        "id": 1,
        "destination_id": 1,
        "title": "巴黎三日游完美攻略",
        "author": "旅行达人小李",
        "date": "2024-01-15",
        "content": "第一天：埃菲尔铁塔 - 香榭丽舍大街 - 凯旋门\n第二天：卢浮宫 - 塞纳河游船 - 蒙马特高地\n第三天：凡尔赛宫 - 老佛爷百货购物",
        "likes": 1250
    },
    {
        "id": 2,
        "destination_id": 2,
        "title": "京都樱花季深度游",
        "author": "樱花爱好者",
        "date": "2024-03-20",
        "content": "清水寺 - 伏见稻荷大社 - 岚山竹林 - 金阁寺\n推荐体验：茶道表演、和服租赁、怀石料理",
        "likes": 980
    },
    {
        "id": 3,
        "destination_id": 4,
        "title": "冰岛环岛自驾指南",
        "author": "冒险家老王",
        "date": "2024-02-10",
        "content": "雷克雅未克 - 黄金圈 - 南岸冰川 - 杰古沙龙冰河湖 - 米湖 - 斯奈山半岛\n注意事项：路况复杂，建议7天以上行程",
        "likes": 1560
    }
]


@app.route('/')
def index():
    """首页 - 展示热门目的地"""
    return render_template('index.html', destinations=destinations[:4])


@app.route('/destinations')
def destinations_list():
    """目的地列表页"""
    category = request.args.get('category', '')
    filtered_destinations = destinations
    
    if category:
        filtered_destinations = [d for d in destinations if category in d['tags']]
    
    return render_template('destinations.html', 
                         destinations=filtered_destinations,
                         categories=['浪漫', '文化', '自然', '海岛', '冒险'])


@app.route('/destination/<int:dest_id>')
def destination_detail(dest_id):
    """目的地详情页"""
    destination = next((d for d in destinations if d['id'] == dest_id), None)
    if not destination:
        return "目的地不存在", 404
    
    guides = [g for g in travel_guides if g['destination_id'] == dest_id]
    return render_template('destination_detail.html', 
                         destination=destination,
                         guides=guides)


@app.route('/guides')
def guides_list():
    """旅游攻略列表页"""
    return render_template('guides.html', guides=travel_guides)


@app.route('/api/destinations')
def api_destinations():
    """API - 获取所有目的地"""
    return jsonify(destinations)


@app.route('/api/destination/<int:dest_id>')
def api_destination_detail(dest_id):
    """API - 获取目的地详情"""
    destination = next((d for d in destinations if d['id'] == dest_id), None)
    if not destination:
        return jsonify({"error": "Not found"}), 404
    return jsonify(destination)


@app.route('/api/search')
def api_search():
    """API - 搜索目的地"""
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    
    results = [d for d in destinations 
              if query in d['name'].lower() or 
                 query in d['country'].lower() or
                 any(query in tag.lower() for tag in d['tags'])]
    
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
