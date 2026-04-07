---
name: antd-pro-react
description: >-
  Applies React functional components, Ant Design Pro (PageContainer, ProTable,
  ModalForm, ProDescriptions), TypeScript, preferring ahooks where it fits, styled-components
  for component-level layout and custom UI, and mandatory getProTableConfig on query list
  pages. Use when building or refactoring admin list pages, CRUD modals, ProTable columns,
  styled layouts, or when the user mentions Ant Design Pro, ProTable, ModalForm, styled-components,
  or this fitment-pc stack.
---

# Ant Design Pro + React 前端规范

## 技术栈

- React（函数组件 + Hooks）
- Ant Design Pro：`PageContainer`、`ProTable`、`ModalForm`、`ProDescriptions`
- TypeScript
- **ahooks**：凡有对应能力（如 `useBoolean`、`useRequest`、`useMount` 等），**优先用 ahooks**，避免为同类需求手写 `useState` / `useEffect`。列表页的表格数据请求仍必须通过 **`getProTableConfig` 的 `request`**；其他非表格请求可用 `useRequest` 等。
- **styled-components**：页面、弹窗、局部布局等需要 **自定义布局、间距、背景、响应式片段** 时，**优先用 styled-components** 写成具名样式组件（如 `StyledModalBody`、`PageWrap`），与 Ant Design / ProComponents 组合使用；不要为用 styled 而用，简单一层 `div` 且仅需 AntD `style` / `className` 时可保持简洁。

## 1. 查询页面（列表页）

- 页面最外层必须使用 `PageContainer`。
- 数据表格必须使用 `ProTable`。
- **查询类列表页的数据请求：必须使用 `getProTableConfig` 展开到 `ProTable`**（禁止绕开 `getProTableConfig` 自行拼一套与项目不一致的 pagination / params 处理，除非该页根本不是标准查询表）。

**ProTable 固定配置：**

- 必须定义 `actionRef` 和 `formRef`。
- `rowKey="id"`（或等价唯一键；若与 `getProTableConfig` 泛型冲突，可用 `ProTable<any, any>` 与项目现有写法对齐）。
- `scroll={{ x: 900 }}`，避免表格过宽撑破布局。
- `request` 必须放在 `getProTableConfig` 里，例如：

```tsx
{...getProTableConfig({
  request: async (params) => {
    return await API.someQueryFunction(params);
  },
})}
```

- `columns` 在组件内定义，或通过同目录/模块文件引入；不要挂在全局。

## 2. 表格操作列

- 操作列：`fixed: 'right'`、`align: 'center'`。
- 操作区用 `<Space>` 包裹多个按钮。
- **删除**：必须用 `<Popconfirm>`，**标题/确认文案**为「确定删除该数据吗？」（与产品文案不一致时在规则中单独说明）。

## 3. 新增 / 编辑弹窗（ModalForm）

- 使用 `@ant-design/pro-components` 的 `ModalForm`。
- 显隐用 ahooks **`useBoolean`**；表格刷新沿用页面的 `formRef.submit()` 或 `actionRef`（与项目现有写法一致）。
- 提供 **`handleOpenModal`**（或等价命名）打开弹窗。
- `ModalForm` 的 `open`（或版本对应的 `visible`）与 `onOpenChange` / `modalProps.onCancel` 绑定到 `useBoolean` 的状态与关闭逻辑。

## 4. 表单布局（Form Layout）

- 表单内部必须使用 Ant Design 的栅格：`Row gutter={16}`。
- 每个表单项用 **`Col span={8}`** 包裹（每行 3 个字段）；字段过少时可按设计调整，但保持 `gutter={16}`。

## 5. 详情展示（Details）

- 必须使用 **`ProDescriptions`** 展示详情数据。
- 列定义与对应 `ProTable` 展示字段保持语义一致。

## 6. styled-components 编写样式

- **命名**：导出或文件内样式组件使用 **PascalCase**，前缀可用 `Styled`（如 `StyledToolbar`、`ModalSection`），含义一目了然。
- **位置**：与页面/组件同目录，写在 **`xxx.tsx` 文件底部**或同级 **`styles.ts`**；避免在全局散落无归属的 styled 块。
- **用法**：
  - 布局容器用 `styled.div`；需要包一层 Pro/Ant 组件时用 **`styled(ProTable)` / `styled(Modal)`** 等，只覆盖本项目需要的 `padding`、`min-height`、`gap` 等。
  - **优先通过包裹容器** 控制子元素间距（flex / gap），少用 `!important` 穿透修改 Ant Design 内部 class；确需覆盖时限制在局部 styled Wrapper 内。
- **主题**：若上层已有 `ThemeProvider` 或 Ant Design `theme` token，**颜色、圆角、字号优先与现有 token 一致**；硬编码色值仅用于无设计 token 的过渡实现，并集中在一处便于替换。
- **与 Ant Design**：页面级仍优先 **`PageContainer` + ProTable 默认能力**；styled-components 用于 **补强布局与品牌区**，而不是整页复制一份 UI。

## 输出约定

- 生成代码时优先使用 **TypeScript**。
- 代码风格简洁、模块化。
- 用户要求「生成列表页」时，默认套用本节中与列表相关的全部规范；涉及自定义区域布局时，**搭配 styled-components 输出具名样式组件**。
