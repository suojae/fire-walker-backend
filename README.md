
# Firewalker Backend

<img src="https://github.com/user-attachments/assets/c602b69a-2a02-46c7-a5a2-fd59cb6b5dca" width="800">

<br/>
<br/>

## 🔥 Backend Architecture

Firewalker 백엔드는 **사용자 관리, 걸음 데이터 처리, 알림 시스템**을 독립적으로 운영하기 위해 분리된 서비스로 설계 및 구현을 완료했습니다.

<img src="https://github.com/user-attachments/assets/1550b61d-0c8b-491f-a84c-5d7583ecd5ec" width="600">

<br/>

### 주요 설계 

✅ **User-MS / Step-Tracker-MS / Notification-MS** 로 역할을 분리  
✅ **REST + gRPC 혼합 통신**  
✅ **Redis + MySQL 혼합 사용**  

<br/>

**1. Step-Tracker-MS를 따로 둔 이유**
   - 걸음 데이터 API는 **I/O + CPU** 부담이 크다고 판단했습니다. 만약 트래픽이 몰리면 병목현상이 일어날 서비스는 Step-Tracker를 따로 분리하여 EC2에 배포했습니다.

2️⃣ **REST와 gRPC를 병행한 이유?**  
- ㅇㅂㅈㅇ



3️⃣ **Redis와 MySQL을 함께 사용하는 이유?**  
   - **MySQL**: 사용자 정보, 걸음 데이터와 같은 영속성이 필요한 데이터 저장.  
   - **Redis**: 세션 및 랭킹 데이터를 빠르게 조회할 수 있도록 캐싱.  

---

# ☁ AWS Architecture

### 📌 주요 설계 특징  
✅ **AWS ALB + Auto Scaling을 통한 트래픽 처리**  
✅ **RDS Multi-AZ 및 Read Replica 활용**  
✅ **Redis ElastiCache를 통한 세션 관리**  
✅ **S3 + CloudFront로 이미지 파일 저장 최적화**  

<img width="400" alt="image" src="https://github.com/user-attachments/assets/4b22ad00-79d6-4090-b7d0-48beaac1716c" />

### 🔍 면접관이 Hook할 만한 질문  
1️⃣ **Auto Scaling이 적용된 서비스는?**  
   - **User-MS & Step-Tracker-MS**는 트래픽 변동이 크므로 **Auto Scaling** 적용.  
   - **Notification-MS**는 비동기 이벤트 기반이므로 초기에 고정된 리소스로 운영 후 스케일 조정 가능.  

2️⃣ **왜 MySQL을 Multi-AZ + Read Replica로 운영하는가?**  
   - **Multi-AZ**: 장애 시 자동 페일오버.  
   - **Read Replica**: 걸음 데이터 조회 부하를 분산하여 성능 최적화.  

3️⃣ **왜 Redis를 선택했는가?**  
   - 랭킹 시스템은 **높은 읽기 부하**가 발생하므로 Redis를 활용해 캐싱.  

---

# 🗄 Data Model (ERD)

![ERD](./images/erd.png)

**토큰 저장 방식이 Redis인가 MySQL인가?**  
   - **Refresh Token은 Redis**에 저장하여 빠른 만료 처리가 가능하도록 설계.  
   - MySQL을 사용할 수도 있지만, **TTL(Time-To-Live) 관리의 유연성** 때문에 Redis를 선택.  

---

# 🚀 설계 트레이드오프 (Trade-offs)

| 선택지 | 선택 이유 | 트레이드오프 |
|--------|----------|--------------|
| **REST + gRPC** | 클라이언트-서버 REST, MS 간 gRPC | 운영 복잡성이 증가함 |
| **Redis + MySQL** | 빠른 읽기 & 영속성 보장 | Redis TTL 관리 필요 |



**Scaling 전략에서 가장 중요한 요소는?**  
   - **걸음 데이터 API(Write 부하)** 와 **친구 요청 API(읽기 부하)** 최적화가 중요.  
   - Read Replica를 활용한 **읽기 성능 최적화** 적용.  

---

# 🛠 트러블슈팅 경험  

### 1️⃣ **gRPC를 사용하면서 생긴 문제 (Serialization Issue)**
- **문제**: `protobuf` 직렬화 과정에서 일부 필드가 누락되는 현상 발생  
- **해결**: `.proto` 파일을 수정하여 **required 필드 추가 및 명확한 타입 지정**  

### 2️⃣ **Redis TTL 설정 문제**
- **문제**: Refresh Token 만료 시간이 Redis에 정확히 반영되지 않아, 로그아웃 후에도 일부 사용자가 다시 로그인됨  
- **해결**: `EX` 옵션을 사용하여 Redis에 **만료 시간 명시적으로 설정**  
