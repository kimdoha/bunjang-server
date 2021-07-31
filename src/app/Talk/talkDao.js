const { pool } = require("../../../config/database");

// 팔로잉 유저 존재 여부
async function selectCountAddress(connection, userId) {
  const existCountQuery = `
        SELECT count(*) AS count
        FROM MyAddress WHERE userId = ? AND status = 1;
                `;
  const [existRows] = await connection.query(existCountQuery , userId);
  return existRows;
}
// 배송지 등록

  async function insertAddress(connection, insertParams) {
    const addressQuery = `

    INSERT INTO MyAddress(userId, userName, userPhoneNum, address, detailAddress,  asking, isMain)
    VALUES(?,?,?,?,?,?,?);
                  `;
    const insertRows = await connection.query(addressQuery , insertParams);
    return insertRows;
  }

//  userId 관련 배송지 조회 
  async function selectMyAddress(connection, userId) {
    const addressQuery = `
    SELECT addressId, userId, userPhoneNum, address, detailAddress, asking, isMain
    FROM MyAddress WHERE userId = ? AND status = 1
    `;
    const [addressRow] = await connection.query(addressQuery, userId);
    return addressRow;
  }
//  userId -addressId 존재 확인 
async function existAddress(connection, userId, addressId) {
    const addressQuery = `
    SELECT userId, userPhoneNum, address, detailAddress, asking, isMain
FROM MyAddress WHERE userId = ? AND addressId = ? AND status = 1;
    `;
    const [addressRow] = await connection.query(addressQuery,[ userId, addressId]);
    return addressRow;
  }
async function patchAddress(connection, addressId) {
    const patchQuery = `
    UPDATE MyAddress SET status = 0 WHERE addressId = ?;     
    `;
    const [addressRows] = await connection.query(patchQuery, addressId);
    return addressRows;
}

//  userId 관련 배송지 조회 
async function selectByAddressId(connection, addressId) {
    const addressQuery = `
    SELECT addressId, userId, userPhoneNum, address, detailAddress, asking, isMain
    FROM MyAddress WHERE addressId = ? AND status = 0
    `;
    const [addressRow] = await connection.query(addressQuery, addressId);
    return addressRow;
  }

// 게시글 존재 유무 
async function isExistPost(connection, postId) {
    const isExistQuery = `
      SELECT * FROM Post WHERE postId = ? AND status = 1;
      `;
    const [existPostRow] = await connection.query(isExistQuery, postId);
    return existPostRow;
}

// talkRoom 존재 유무
async function isExistRoom(connection, userId, postId) {
    const isExistRoomQuery = `
    SELECT EXISTS(SELECT * FROM TalkRoom
        WHERE status = 1 AND postId = ? AND useId1 = ?) as exist;
      `;
    const [existPostRow ]= await connection.query(isExistRoomQuery, [postId ,userId]);
    return existPostRow;
}


// roomId 얻어오기
async function selectRoomID(connection, sendId, receiveId, postId) {
    const roomIdQuery = `
        SELECT roomId
        FROM TalkRoom
        WHERE status = 1 AND ((useId1 = ? AND useId2 = ? AND postId = ?)
                                OR (useId2 = ? AND useId1 = ? AND postId = ?));
      `;
    const [roomRow]= await connection.query(roomIdQuery , [sendId, receiveId, postId, sendId, receiveId, postId]);
    console.log(roomRow);
    return roomRow;
}

// 일반 메세지 전송
async function sendCommonTalk(connection, infoParams) {
    const addressQuery = `

    INSERT INTO Talk(roomId, receiveId, sendId, content, messageType ) VALUES(?, ?, ?, ?, ?);
                  `;
    const insertRows = await connection.query(addressQuery , infoParams);
    return insertRows;
  }
// 일반 메세지 조회
async function selectTalkMessage(connection, roomId, receiveId, sendId) {
    const talkQuery = `

    SELECT roomId, receiveId, sendId, content 
    FROM Talk
    WHERE (roomId = ? AND receiveId = ? AND sendId = ?)
    ORDER BY createAt DESC 
    LIMIT 1;
                  `;
    const [talkRows] = await connection.query(talkQuery ,[roomId, receiveId, sendId]);
    return talkRows;
  }

  // 판매자 조회
async function selectSeller(connection, postId) {
    const selectSellerQuery = `
            SELECT userId FROM Post
            WHERE status = 1 AND postId = ?;
    `;
      const [sellerRows] = await connection.query(selectSellerQuery, postId );
      return sellerRows;
}
// payId 생성
async function insertPayId(connection, postId, userId, sellerId) {
    const addressQuery = `
    INSERT INTO Payment(postId, userId, sellerId )
    VALUES(?, ?, ?);
                  `;
    const insertRows = await connection.query(addressQuery , [ postId, userId, sellerId ]);
    return insertRows;
  }

  // payId 조회
async function selectPayId(connection, postId, userId, sellerId) {
    const selectPayIdQuery = `
    SELECT payId FROM Payment
    WHERE postId = ? AND userId = ? AND sellerId = ? AND accept = 0;   
    `;
      const [payIdRows] = await connection.query(selectPayIdQuery,[ postId, userId, sellerId ]);
      return payIdRows;
}

// payId 조회
  async function existPayId(connection, postId, userId, sellerId) {
    const existPayIdQuery = `
    SELECT EXISTS(SELECT * FROM Payment
        WHERE postId = ? AND userId = ? AND sellerId = ? AND accept = 0) AS exist;
    `;
      const [existRows] = await connection.query(existPayIdQuery,[ postId, userId, sellerId ]);
      return existRows;
}
//  userId 관련 배송지 조회 
async function retrieveMyFirstAddr(connection, userId) {
    const addressQuery = `
    SELECT addressId, userId, userPhoneNum, address, detailAddress, asking, isMain
    FROM MyAddress
    WHERE userId = ? AND status = 1
    ORDER BY createAt
    LIMIT 1;
    `;
    const [addressRow] = await connection.query(addressQuery, userId);
    return addressRow;
  }


  //  userId 관련 배송지 조회 
async function selectProductInfo(connection, postId) {
    const productQuery = `
    SELECT productName, price FROM Post
    WHERE postId = ? AND status = 1;
    `;
    const [productRow] = await connection.query(productQuery , postId);
    return productRow;
  }

 // 특별 메세지 전송
async function sendSpecialTalk(connection, infoParams) {
    const addressQuery = `
    INSERT INTO Talk(roomId, receiveId, sendId, content, messageType, paystep) VALUES(?, ?, ?, ?, ?, ?);
    `;
    const insertRows = await connection.query(addressQuery , infoParams);
    return insertRows;
  }



 // 계좌 정보 전송 => 나중에 조회 
async function createAccount(connection, accountParams) {
    const accountQuery = `
    INSERT INTO AccountTransaction(payId, bankName, sendName, comment)
    VALUES(?, ?, ?, ?);
    `;
    const insertRows = await connection.query(accountQuery , accountParams);
    return insertRows;
  }
// 주소 정보 전송 => 나중에 조회
async function createAddress(connection, addressParams) {
    const addressQuery = `
    INSERT INTO ShippingDestination(userName, phoneNumber, zipCode, address, detailAddress, asking, main)
    VALUES(?, ?, ?, ?, ? ,? ,?);
    `;
    const insertRows = await connection.query(addressQuery , addressParams);
    return insertRows;
  }

  // 주소 정보 전송 => 나중에 조회
async function createMeet(connection, meetParams) {
    const meetQuery = `
    INSERT INTO DirectTransaction(payId, directDate, directPlace, type)
    VALUES(?, ?, ?, ?);
    `;
    const insertRows = await connection.query(meetQuery  , meetParams);
    return insertRows;
  }
// 신규 - 번개톡방 만들기 
  async function createRoom(connection, receiveId, sendId, postId) {
    const roomQuery = `
    INSERT INTO TalkRoom(postId, useId1, useId2)
    VALUES(?, ?, ?);
    `;
    const insertRows = await connection.query(roomQuery , [ postId, sendId, receiveId ] );
    return insertRows;
  }
  // 
  async function selectMainInfo(connection, userId) {
    const mainQuery = `
    SELECT roomId, notice, userName, profileImg, useId1 AS sendId,
    useId2 AS receiveId,
        (CASE
      WHEN TIMESTAMPDIFF(MINUTE, (SELECT tt.createAt FROM Talk tt WHERE tt.roomId = t.roomId
    ORDER BY tt.createAt DESC LIMIT 1), now()) <= 0 THEN '방금 전'
     WHEN TIMESTAMPDIFF(HOUR, (SELECT tt.createAt FROM Talk tt WHERE tt.roomId = t.roomId
    ORDER BY tt.createAt DESC LIMIT 1), NOW()) < 24
         THEN IF(
             HOUR((SELECT tt.createAt FROM Talk tt WHERE tt.roomId = t.roomId ORDER BY tt.createAt DESC LIMIT 1)) >= 12,
             DATE_FORMAT((SELECT tt.createAt FROM Talk tt WHERE tt.roomId = t.roomId ORDER BY tt.createAt DESC LIMIT 1),'오후 %l:%i'),
             DATE_FORMAT((SELECT tt.createAt FROM Talk tt WHERE tt.roomId = t.roomId ORDER BY tt.createAt DESC LIMIT 1),'오전 %l:%i' ))
     ELSE DATE_FORMAT((SELECT tt.createAt FROM Talk tt WHERE tt.roomId = t.roomId
    ORDER BY tt.createAt DESC LIMIT 1), '%c 월 %e 일')
  END) AS time,
      (SELECT content FROM Talk tt WHERE tt.roomId = t.roomId
      ORDER BY tt.createAt DESC LIMIT 1) AS lastMessage,
      (SELECT sendId FROM Talk tt WHERE tt.roomId = t.roomId
      ORDER BY tt.createAt DESC LIMIT 1) AS lastSendId

  FROM TalkRoom t
  INNER JOIN Post p ON t.postId = p.postId
  INNER JOIN User u ON u.userId = t.useId2
  WHERE useId1 = ? OR useId2 = ?
  ORDER BY t.createAt DESC;
    `;
    const insertRows = await connection.query(mainQuery , [ userId, userId ] );
    return insertRows;
  }

  // 상품에 대한 정보
  async function selectTalkProductInfo(connection, postId) {
    const productQuery = `
    SELECT roomId, p.postId, productName, price,
    (SELECT pi.postImgUrl FROM postImage pi
    WHERE pi.mainImg = 1 AND p.postId = pi.postId AND p.status = 1) AS postImg
FROM TalkRoom tr
INNER JOIN Post p ON p.postId = tr.postId
WHERE tr.postId = ? AND tr.status = 1 AND p.status = 1;
    `;
    const [productRow] = await connection.query(productQuery , postId);
    return productRow;
  }

// 상품에 대한 정보
async function selectDetailTalk(connection, postId) {
      const detailQuery = `
      SELECT sendId, receiveId, content, messageType, paystep,
      CASE (SELECT EXISTS(SELECT * FROM TalkWatched tw WHERE tw.talkId = t.talkId))
            WHEN 0 THEN '안읽음'
           WHEN 1 THEN '읽음'
       END AS readOrNot,
      CASE DATE_FORMAT(t.createAt, '%w')
           WHEN 0 THEN DATE_FORMAT(t.createAt, '%Y.%c.%e 일요일')
           WHEN 1 THEN DATE_FORMAT(t.createAt, '%Y.%c.%e 월요일')
           WHEN 2 THEN DATE_FORMAT(t.createAt, '%Y.%c.%e 화요일')
           WHEN 3 THEN DATE_FORMAT(t.createAt, '%Y.%c.%e 수요일')
           WHEN 4 THEN DATE_FORMAT(t.createAt, '%Y.%c.%e 목요일')
           WHEN 5 THEN DATE_FORMAT(t.createAt, '%Y.%c.%e 금요일')
           WHEN 6 THEN DATE_FORMAT(t.createAt, '%Y.%c.%e 토요일')
       END AS sendDate,
 IF(HOUR(t.createAt) >= 12,
DATE_FORMAT(t.createAt,'오후 %l:%i'),
DATE_FORMAT(t.createAt,'오전 %l:%i')) AS sendTime,
     (SELECT profileImg FROM User WHERE userId = sendId) AS sendProfileImg

FROM Talk t
LEFT JOIN TalkRoom tr ON tr.roomId = t.roomId
WHERE postId = ?
ORDER BY t.createAt;
      `;
      const [detailRow] = await connection.query(detailQuery , postId);
      return detailRow;
    }
  module.exports = {
    selectCountAddress,
    insertAddress,
    selectMyAddress,
    existAddress,
    patchAddress,
    selectByAddressId,
    isExistPost,
    isExistRoom,
    selectRoomID,
    sendCommonTalk,
    selectTalkMessage,
    selectSeller,
    insertPayId,
    selectPayId,
    existPayId,
    retrieveMyFirstAddr,
    selectProductInfo,
    sendSpecialTalk,
    createAccount,
    createAddress,
    createMeet,
    createRoom,
    selectMainInfo,
    selectTalkProductInfo,
    selectDetailTalk
  };
  