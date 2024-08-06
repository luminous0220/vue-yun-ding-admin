

<h1 align="center">Vue3-Yun-Ding-Admin（云顶后台管理系统）</h1>

<br/>

## 🚀简介
`Vue3-Yun-Ding-Admin`（云顶后台管理系统）是一个全栈项目,使用同一种语言 `JavaScript` 进行的前后端开发。前端基于 `Vue3、TypeScript`，后端基于 `Nest.Js、Mysql、Redis` 等。由于使用了同一种语言，大大简化了开发人员的学习成本和代码维护成本

## 🌟技术栈

前端技术栈：🌟 `vue3` 🌟、🌸 `typescript` 🌸、🎈 `element-plus` 🎈、🍕 `unocss` 🍕、👌 `pinia` 👌、🚑 `JSX` 等等。

后端技术栈：🎆 `Nest.Js` 🎆、🎉 `MySQL` 🎉、🎨 `TypeORM` 🎨、🪭 `PM2` 🪭、🏀 `Redis` 🏀等


## 🎉特点
二次封装了 `BasicTable、BasicForm、BasicDialog、BasicDrawer` 等与表格相关的组件，开发者引入这些组件后只需传入简单的对象数据便可轻松地渲染表格，而表格在后台系统中的占比非常之大，使用这种方式渲染能够节省非常多的时间成本

## 🎈预览

`yun-ding-server`

账号：`admin`，密码：`123456`


## 🎨使用

支持现代浏览器, 不支持 `IE`，使用 `pnpm` 进行依赖安装

| Node 版本 | PNPM 版本 | Vue 版本 |
| ------- | ------- | ------ |
| 20.10.0 | latest  | latest |

使用步骤：

```shell
# 获取项目代码
git clone https://github.com/luminous0220/vue3-yun-ding-admin.git

# 使用控制台打开项目根目录

# 进入前端项目目录
cd ./client

# 安装前端依赖
pnpm install 或 npm install 或 yarn install

# 运行前端项目
pnpm dev 或 npm run dev 或 yarn dev

# 进入后端项目目录
cd ../server

# 安装后端服务依赖
pnpm install 或 npm install 或 yarn install

# 运行后端项目
pnpm start:dev 或 npm run start:dev 或 pnpm run start:dev
```

> 注意在运行后端项目时需确保本地已安装了 `MySQL、Redis`，否则运行会失败


```shell
# 前端项目打包
pnpm build-only 或 npm run build-only 或 yarn build-only

# 后端项目打包
pnpm build 或 npm run build 或 yarn build
```


## 🌸表格组件的使用

比如开发一个用户管理页面：

引入 `basic-table` 组件：

```html

<basic-table
  ref="BasicTableRef"
  :columns="columns"
  showOverflowTooltip
  :req-api="reqApi">
  <template #leftHeaderButton="scope">
	<el-button type="primary" @click="handleOpen('新增')">
	  新增用户
	  <template #icon>
		<i-carbon-add-alt />
	  </template>
	</el-button>

	<el-button type="danger" @click="batchRemove(scope.selectedList)">
	  批量删除
	  <template #icon>
		<i-ep-delete />
	  </template>
	</el-button>

	<!-- 导出按钮 -->
	<el-button v-debounce type="warning" @click="exportFile">
	  导出上传模版
	  <template #icon>
		<i-carbon-document-export />
	  </template>
	</el-button>

	<!-- 批量上传 -->
	<Upload
	  text="批量新增"
	  url="http://localhost:8182/api/upload/users"
	  :fileExt="['xlsx']"
	  @success="BasicTableRef?.loadData" />
  </template>
  <template #operation="scope">
	<div>
	  <el-button
		class="mr-10px"
		type="primary"
		plain
		size="small"
		@click="handleOpen('授权', scope.row)">授权</el-button>
	</div>
  </template>
</basic-table>
```

表格列的相关配置：

```js
const colums = reactive([
  {
    el: 'input',
    prop: 'username',
    label: '用户名',
    attrs: {
      placeholder: '请填写用户名'
    },
    rule: [{ required: true, message: '该项必填', trigger: 'change' }]
  },
  {
    el: 'input',
    prop: 'email',
    label: '邮箱',
    attrs: {
      placeholder: '请填写邮箱'
    },
    rule: [{ required: true, message: '该项必填', trigger: 'change' }]
  },
  {
    el: 'input',
    prop: 'nickname',
    label: '昵称',
    attrs: {
      placeholder: '请填写昵称'
    }
  },
  {
    el: 'radio',
    prop: 'sex',
    label: '性别',
    options: GENDER_OPIONS,
    rule: [{ required: true, message: '该项必填', trigger: 'change' }]
  },
  {
    el: 'date',
    prop: 'birthday',
    label: '生日'
  },
  {
    el: 'input',
    prop: 'avatar',
    label: '上传头像'
  },
  {
    el: 'input',
    label: '签名',
    attrs: {
      type: 'textarea'
    },
    prop: 'sign'
  }
])
```

渲染的页面如下：

![image](https://github.com/user-attachments/assets/1bf3a0cb-1932-4380-9761-4e3a16f6a461)
