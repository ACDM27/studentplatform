# 使用官方 Node.js 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制其余文件
COPY . .

# 构建 Vue 项目
RUN pnpm run build

# 启动前端服务
CMD ["npm", "run", "serve"]

# 暴露服务端口
EXPOSE 8080
