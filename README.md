# 번개장터 - server
<br/>
<p align="center">
  <img width="500" alt="15" src="https://api.seumlaw.com/images/seum_2b0c6bd440ca4a23a5ce5830026d67b0.jpg">
</p>

## Description

취향 기반 중고거래 플랫폼인 번개장터 클론 프로젝트입니다. MySQL, Express.js, Node.js 스택을 활용해 번개장터의 기능 구현을 목표로 했습니다.


## Demo_video

https://www.youtube.com/watch?v=DB-V6g2f0EU

[![Video Label](https://img.youtube.com/vi/DB-V6g2f0EU/0.jpg)](https://www.youtube.com/watch?v=DB-V6g2f0EU)


## Open API

- 유저의 배송지를 등록하는 기능에  **네이버 지역검색 API** 를 활용하여 개발하였습니다.
  

- 유저의 배송지를 도로명 주소로 등록하는 기능에 **행정안전부 도로명 주소 API** 를 활용하여 개발하였습니다.




## ERD
설계한 데이테이스 Diagram 입니다

<img src="https://postfiles.pstatic.net/MjAyMTA4MDFfMjE5/MDAxNjI3NzQ0NDAwMjA1.3XEGD_ssaCtC5NRf_Mp2E6Dy9K5BepBWt6wVVB9TioEg.v4RQYTOlHFyEZZKcp2eZIzpTBx0HWFbEVAJ3WILkxDgg.PNG.kkhhjj888/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2021-08-01_%EC%98%A4%EC%A0%84_12.12.30.png?type=w966" width="400">






## Features

#### 로그인 및 회원가입
   - [X] 카카오 로그인 및 로그아웃
   - [X] 자동 로그인

 
#### 찜 
   - [X] 나의 찜 컬렉션 조회
   - [X] 나의 찜 컬렉션 생성
   - [X] 찜 컬렉션 수정 및 삭제
   - [X] 찜한 상품 조회
   - [X] 상품 찜과 해제

#### 상품 🛍
   - [X] 상품 등록
   - [X] 상품 게시글 상세 조회
   - [X] 다른 구매자가 함께 본 상품 조회

#### 홈 화면 🏠
   - [X] 홈 화면 조회
   - [X] 카테고리 메뉴 조회
   - [X] 상위 카테고리 조회
   - [X] 상위 카테고리 상품 조회 (+필터 | 추천 상품 | 신규 등록 | 페이징 )
   - [X] 서브 카테고리 조회
   - [X] 서브 카테고리 상품 조회 (+필터 | 추천 상품 | 신규 등록 | 페이징 )
   - [X] 하위 카테고리 상품 조회 (+필터 | 추천 상품 | 신규 등록 | 페이징 )
   - [X] 상위 카테고리 신규등록 더보기
   - [X] 서브 카테고리 신규등록 더보기
   - [X] 하위 카테고리 신규등록 더보기
   
#### 팔로잉 💛
   - [X] 팔로잉 설정 및 해제
   - [X] 추천 상점 조회
   - [X] 팔로잉 상점 소식 조회
    
#### 마이샵
   - [X] 마이샵 메인화면 조회
   - [X] 마이샵 정보수정
   - [X] 마이샵 + 다른 샵 정보조회
   - [X] 최근 본 상품 조회
   - [X] 내 상점 + 다른 상점 리뷰 조회
   - [X] 내 팔로워 조회
   - [X] 내 팔로잉 조회

#### 번개톡 ⚡️
   - [X] 번개톡 메인화면 조회
   - [X] 특정 번개톡 세부화면 조회
   - [X] 번개톡 메세지 보내기 ( 거래메세지 : 입금했어요/ 배송지 보내기 / 직거래 약속)
   - [X] 배송지 설정
   - [X] 배송지 정보 확인
   - [X] 배송지 삭제


## Requirements

### Language
 - Backend
  - Node.js
  
### Framework
- Backend
  - Express.js
  
### Database
- Backend
  - MySQL
  
### Library
- Backend
  - MySQL
  - Bcrypt
  - JWT


### Usage
`Database.js` 파일을 `config` 내부에 생성하여 본인의 Database 정보를 입력해주신 후 사용하시면 됩니다.