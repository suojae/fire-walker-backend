FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 필수 패키지 설치 (Python3, make, g++, bash 등)
RUN apk add --no-cache python3 make g++

# package.json 복사 및 의존성 설치
COPY package.json .
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 포트 노출
EXPOSE 50051

# 애플리케이션 실행
CMD ["npm", "run", "start"]
