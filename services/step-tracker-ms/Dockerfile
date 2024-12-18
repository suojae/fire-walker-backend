# 플랫폼 명시적으로 설정 (x86)
FROM --platform=linux/amd64 node:18

# PM2 설치
RUN npm install -g pm2


# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 실행
RUN npm run build

# .proto 파일을 dist로 복사
COPY src/infrastructure/grpc/*.proto dist/infrastructure/grpc/

# gRPC 서버 실행
CMD ["pm2-runtime", "dist/main.js"]
