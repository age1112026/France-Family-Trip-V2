# 数据 Schema

这个项目把数据分成 POI 主资料、图片、参考链接、家庭成员、兴趣标注五类。

## pois

POI 主表，适合从 `data/pois.seed.json` 批量导入。

关键字段：

- `id`: 稳定主键，例如 `poi_louvre`
- `slug`: 用于详情页 URL
- `city_region`: `Paris`、`Mont-Saint-Michel`、`Nice`、`French Riviera East`、`French Riviera West`
- `categories`: 类型标签数组
- `audience_tags`: 适合人群标签数组
- `classic_level`: `大众经典`、`高价值经典`、`小众宝藏`、`可选补充`
- `reservation_required`: 是否需要提前预约
- `verification_status`: `已核实`、`待核实`、`可能变化`
- `source_urls`: 核实来源数组
- `rainy_day_suitable` / `night_suitable` / `easy_day_suitable`: 决策视图使用
- `family_fit_score`: 针对本家庭的适配度，1-5 分
- `fit_reason`: 为什么适合本家庭
- `possible_mismatch`: 可能踩雷或无感的原因
- `best_use`: 最适合放进行程的方式
- `use_cases`: 例如 `经典但值得`、`海景记忆点`、`quick bite`、`文化+夜晚`
- `transport_note`: 交通难度的白话解释
- `verify_before`: 什么时候再核实票务、营业、天气或预约
- `content_status`: `base` 或 `upgraded`

价格、开放时间、预约入口容易变化。第一版只写摘要和来源，不把不确定信息写成确定事实。

## poi_images

一条 POI 可以有多张图：

- `image_url`
- `alt`
- `caption`
- `source_url`
- `sort_order`

建议优先使用官方旅游局、机构官网、Wikimedia Commons 或可公开引用图片。无法确认来源时，保留 `TODO`，不要随意抓取评论平台图片。

## poi_links

用于官网、地图、评论、Michelin、旅游局等链接：

- `label`
- `url`
- `link_type`: `official`、`map`、`reviews`、`tourism`、`michelin`、`reference`

## family_members

第一版固定三人：

- `me`: 我
- `dad`: 爸爸
- `mom`: 妈妈

## poi_interest_votes

每个人对每个 POI 一条标注：

- `poi_id`
- `member_id`
- `interest_level`
- `note`
- `updated_at`

`interest_level` 可选：

- `must_go`: 很想去
- `okay`: 可以去
- `neutral`: 无感
- `not_interested`: 不想去
- `revisit`: 已去过但可重游

## 自动候选规则

当前 MVP 的“最终入选候选池”规则：

- 至少两个人为正向标注：`很想去`、`可以去`、`已去过但可重游`
- 且没有人标注 `不想去`

后续可以改成更细的打分制或手动锁定。

## 样板升级字段

新增字段是为了把 POI 从“资料条目”升级成“家庭决策条目”。判断重点不只是地点本身是否有名，而是：

- 是否符合本家庭偏好
- 是否能形成记忆点
- 是否适合作为专门前往、顺路看看、quick bite 或雨天备用
- 交通和核实成本是否清楚

当前已优先升级 10 个样板方向：卢浮宫、奥赛、橘园、巴黎圣母院、先贤祠、玛黑区、创作者/跳蚤市场、巴黎歌剧院芭蕾夜、埃兹、尼斯日落海景餐厅。
