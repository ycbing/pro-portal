# 使用 Node.js 14 作为基础镜像
FROM node:20.9.0 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml 到工作目录
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm 并安装项目依赖
RUN npm install -g pnpm && pnpm install

# 将应用程序的源代码复制到工作目录
COPY . .

# 构建应用程序
RUN pnpm run build

# 使用 Nginx 作为基础镜像
FROM nginx:latest

# 复制 nginx.conf 到 Nginx 配置目录
COPY nginx.conf /etc/nginx/nginx.conf

# 将构建的应用程序复制到 Nginx 默认的 HTML 目录
COPY --from=builder /app/build /usr/share/nginx/html

# 暴露 Nginx 默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
