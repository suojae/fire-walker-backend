
# Firewalker Backend

<img src="https://github.com/user-attachments/assets/c602b69a-2a02-46c7-a5a2-fd59cb6b5dca" width="800">

<br/>

### 서비스 소개 

Firewalker는 친구와 실시간으로 걸음 수를 비교하며 건강한 라이프스타일을 유지할 수 있도록 도와주는 애플리케이션입니다.

<br/>

| 기능 | 설명 |
|------|------|
| **실시간 걸음 수 랭킹** | 친구들과 하루 동안 걸은 걸음 수를 비교하고 순위를 확인 |
| **소셜 피트니스** | 친구 요청을 보내고 걸음 목표를 공유하여 동기부여 강화 |
| **푸시 알림 시스템** | 친구 요청 수락 및 랭킹 변화 시 실시간 알림 제공 |
| **데이터 시각화** | 개인 및 그룹별 걸음 통계를 시각적으로 분석 및 제공 |

<br/>
<br/>

## Backend Architecture

Firewalker 백엔드는 **사용자 관리, 걸음 데이터 처리, 알림 시스템**을 독립적으로 운영하기 위해 분리된 서비스로 설계 및 구현을 완료했습니다.

<img src="https://github.com/user-attachments/assets/1550b61d-0c8b-491f-a84c-5d7583ecd5ec" width="600">

<br/>

### 주요 설계 

✅ **User-MS / Step-Tracker-MS / Notification-MS** 로 역할을 분리  
✅ **네트워크: REST + gRPC**  
✅ **데이터베이스: Redis + MySQL**  

<br/>

**1. Step-Tracker-MS를 따로 둔 이유**
- 걸음 데이터 API는 **I/O + CPU** 부담이 크다고 판단했습니다. 만약 트래픽이 몰리면 병목현상이 일어날 서비스는 Step-Tracker를 따로 분리하여 EC2에 배포했습니다.

**2. gRPC vs Socket
- 


**3. Redis와 MySQL을 함께 사용하는 이유?**  
   - **MySQL**: 사용자 정보, 걸음 데이터와 같은 영속성이 필요한 데이터 저장.  
   - **Redis**: 세션 및 랭킹 데이터를 빠르게 조회할 수 있도록 캐싱.  

<br/>
<br/>


## AWS Architecture

### 주요 설계 
✅ **AWS ALB + Auto Scaling을 통한 트래픽 처리**  
✅ **RDS Multi-AZ 및 Read Replica 활용**  
✅ **Redis ElastiCache를 통한 세션 관리**  
✅ **S3 + CloudFront로 이미지 파일 저장 최적화**  

<img width="400" alt="image" src="https://github.com/user-attachments/assets/4b22ad00-79d6-4090-b7d0-48beaac1716c" />

**1. Auto Scaling이 적용된 서비스는?**  
   - **User-MS & Step-Tracker-MS**는 트래픽 변동이 크므로 **Auto Scaling** 적용.  
   - **Notification-MS**는 비동기 이벤트 기반이므로 초기에 고정된 리소스로 운영 후 스케일 조정 가능.  

**2. 왜 MySQL을 Multi-AZ + Read Replica로 운영하는가?**  
   - **Multi-AZ**: 장애 시 자동 페일오버.  
   - **Read Replica**: 걸음 데이터 조회 부하를 분산하여 성능 최적화.  

**3. 왜 Redis를 선택했는가?**  
   - 랭킹 시스템은 **높은 읽기 부하**가 발생하므로 Redis를 활용해 캐싱.  


<br/>
<br/>

## Data Model (ERD)

<img src="https://github.com/user-attachments/assets/668c9c8a-1575-4f7c-902b-7b572ec49732" width="400">

**토큰 저장 방식이 Redis인가 MySQL인가?**  
   - **Refresh Token은 Redis**에 저장하여 빠른 만료 처리가 가능하도록 설계.  
   - MySQL을 사용할 수도 있지만, **TTL(Time-To-Live) 관리의 유연성** 때문에 Redis를 선택.  
  
