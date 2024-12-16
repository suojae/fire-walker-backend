FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 확인: dist 디렉토리 생성
RUN npm run build && ls dist

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "run", "start"]
