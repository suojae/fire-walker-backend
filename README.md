
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

**사용자 관리, 걸음 데이터 처리, 알림 시스템** 독립적 운영 위해 분리된 서비스로 설계 및 구현

<img src="https://github.com/user-attachments/assets/1550b61d-0c8b-491f-a84c-5d7583ecd5ec" width="600">

<br/>

### 주요 설계 

- **User-MS / Step-Tracker-MS / Notification-MS** 역할 분리  
- **네트워크: REST + gRPC**  
- **데이터베이스: Redis + MySQL**  

<br/>

**1. Step-Tracker-MS를 따로 둔 이유**
- 걸음 데이터 각 사용자로부터 실시간으로 데이터가 들어오게됩니다.이러한 걸음데이터 교환은 **I/O + CPU** 부담이 크다고 판단했습니다
- 만약 트래픽이 몰리면 유저 로그인과 알람을 책임지는 서비스보다는 병목현상이 일어날 서비스는 Step-Tracker라 판단, 따로 분리하여 EC2에 배포했습니다.

<br/>

**2. gRPC vs WebSocket (실시간 걸음 데이터 처리 방식 비교)**  

| 기준 | **gRPC** | **WebSocket** |
|------|---------|-------------|
| **프로토콜** | HTTP/2 기반 | TCP 기반 |
| **데이터 포맷** | **Protobuf (바이너리)** | JSON / 바이너리 |
| **메시지 크기** | **작음 (최적화된 직렬화)** | 크거나 불필요한 헤더 포함 가능 |
| **성능 최적화** | **멀티플렉싱 및 압축 지원** | 단일 연결 유지 (Idle Connection 부담) |
| **실시간성** | **빠름 (RTT 낮음)** | 연결 유지 필요 |

- 걸음 수 데이터는 **작은 크기의 패킷을 초당 여러 번 주고받아야 하므로** 경량화된 직렬화(ProtoBuf) + HTTP/2 멀티플렉싱 지원이 있는 gRPC가 더 적합하다고 판단했습니다.
- (WebSocket은 **대규모 연결을 유지해야 하므로 부담이 크고**, **데이터 크기에 대한 최적화도 부족**.)

<br/>

**3. Redis와 MySQL을 함께 사용하는 이유?**  

| 목적 | **MySQL** | **Redis** |
|------|---------|---------|
| **사용자 정보** | 영속적 저장 (User Table) | ❌ |
| **토큰 관리** | ❌ | 인증 처리 |
| **로그인 보안 (블랙리스트 관리)** | ❌ | **만료된 토큰 저장 (로그아웃 상태 유지)** |

- MySQL은 **영구 저장이 필요한 사용자 및 걸음 데이터 관리** 하는데 사용했습니다.
- Redis는 **유저 정보 관리를 위해 활용** 했습니다.
- 특히, Redis에는 **로그아웃된 JWT를 블랙리스트에 저장**하여 불법 액세스를 차단 및 보안을 강화했습니다.

<br/>
<br/>


## AWS Architecture

### 주요 설계 
- **AWS ALB + Auto Scaling을 통한 트래픽 처리**  
- **RDS Multi-AZ 및 Read Replica 활용**  
- **Redis ElastiCache를 통한 세션 관리**  
- **S3 + CloudFront로 이미지 파일 저장 최적화**  

<img width="400" alt="image" src="https://github.com/user-attachments/assets/4b22ad00-79d6-4090-b7d0-48beaac1716c" />

<br/>

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

**1. 걸음 데이터(steps) 저장 방식**
- 개별 기록을 저장하는 대신, 날짜별 누적 데이터로 저장하여 Write 부하를 줄임  
- **트레이드오프**: 개별 걸음 데이터를 분석하려면 추가적인 집계 로직이 필요  

**2. 친구 관계 모델링**
- `Friendship` 테이블을 별도로 두고, 친구 요청 및 수락 상태를 관리  
- **트레이드오프**: 조회 시 `JOIN`이 필요하여 쿼리 성능에 영향 가능  

  
