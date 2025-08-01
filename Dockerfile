# 使用官方 Node.js 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制其余文件
COPY . .

# 构建 Vue 项目
RUN npm run build

# 启动前端服务
CMD ["npm", "run", "serve"]

# 暴露服务端口
EXPOSE 8080
