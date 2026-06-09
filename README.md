# 法国家庭旅行资料库

一个手机端友好的家庭法国旅行 POI 共创 Web App，用于浏览、筛选、标注兴趣和生成候选池。

## 功能

- 40 条示例 POI，覆盖巴黎、圣米歇尔山、尼斯、蔚蓝海岸东西线
- 城市/区域、类型、适合人群和关键词筛选
- POI 详情页，含推荐理由、谨慎理由、预约提醒、参考链接和图片
- 固定三位家庭成员：我、爸爸、妈妈
- 每人可标注：很想去、可以去、无感、不想去、已去过但可重游
- 家庭决策页自动汇总共同兴趣、预约项、雨天/晚上/轻松日候选和最终候选池
- 样板 POI 支持家庭适配度、最佳使用方式、交通说明、核实提醒和多图横向滑动
- 家庭访问码，无需复杂登录
- Supabase 持久化投票；未配置 Supabase 时本机 localStorage 暂存

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

默认访问码是 `france2026`。建议在 `.env.local` 设置：

```bash
FAMILY_ACCESS_CODE=your-family-code
ACCESS_COOKIE_SECRET=your-long-random-secret
```

打开 `http://localhost:3000`。

## Supabase 建表

1. 新建 Supabase 项目。
2. 打开 SQL Editor。
3. 执行 `supabase/schema.sql`。
4. 在本地 `.env.local` 添加：

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

本项目通过 Next.js API route 使用 service role 写入投票。前端不会直接拿到 service role key。

## 导入示例数据

```bash
npm run import:seed
```

导入脚本会：

- upsert `family_members`
- upsert `pois`
- 重建每个 POI 的 `poi_images`
- 重建每个 POI 的 `poi_links`

## 数据维护

主数据在 `data/pois.seed.json`。后续可以直接编辑 JSON，再运行导入脚本。

Schema 说明见 `docs/schema.md`。

## 部署到 Vercel

1. 把项目推到 GitHub。
2. 在 Vercel 导入仓库。
3. 配置环境变量：
   - `FAMILY_ACCESS_CODE`
   - `ACCESS_COOKIE_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. 部署。

## 数据准确性说明

示例数据已尽量使用官网、官方旅游局、Michelin Guide 等来源核对入口链接。门票、开放时间、预约策略、演出票务、市场开放日和餐厅价格会变化，相关字段使用 `待核实`、`可能变化` 或 `verify_before`，出行前应再次确认。

用户评价只做简短摘要，不复制长评论原文。

## 待补充字段

- 将样板升级字段扩展到全部 POI
- 为每个 POI 替换成可长期稳定使用的自有图片或 Supabase Storage 图片
- 为餐饮补充菜单价位、预订入口和适合餐段
- 为 quick bite / quick visit 补充“离哪个主景点顺路”

## 后续扩展建议

- 增加 CSV 导入脚本
- 增加“手动锁定候选池”
- 增加每日行程排布页
- 增加地图视图
- 增加成员管理
- 增加字段完整度检查页
