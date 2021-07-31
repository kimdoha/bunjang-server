const { pool } = require("../../../config/database");
// 팔로잉 
// 팔로잉 유저 존재 여부
async function followingID(connection, userId) {
  const existFollowQuery = `
        SELECT followId FROM Following
        WHERE userId = ? AND follow = 1;
      `;
  const [ existRows ] = await connection.query(existFollowQuery, userId);
  return existRows;
}
async function followerID(connection, followId) { // 43
  const existFollowerQuery = `
        SELECT userId FROM Following
        WHERE followId = ? AND follow = 1;
      `;
  const [ existRows ] = await connection.query(existFollowerQuery, followId);
  return existRows;
}
async function followerCount(connection, followId) { 
  const existFollowerCountQuery = `
      SELECT COUNT(*) AS total
      FROM Following
      WHERE followId = ? AND follow = 1;
      `;
  const [ existRows ] = await connection.query(existFollowerCountQuery, followId);
  return existRows;
}

async function followingCount(connection, userId) { // 1
  const existFollowCountQuery = `
      SELECT COUNT(*) AS total
      FROM Following
      WHERE userId = ? AND follow = 1;
      `;
  const [ existRows ] = await connection.query(existFollowCountQuery, userId);
  return existRows;
}


async function followingInfo(connection, userId , followId) {
  const followingInfoQuery = `
        SELECT u.userId, u.profileImg, u.userName,
        (SELECT COUNT(*) FROM Post p WHERE p.userId = u.userId) AS totalPost,
        (SELECT COUNT(*) FROM Following f WHERE f.followId = u.userId) AS follower
        FROM User u
        LEFT JOIN Following f ON f.followId = u.userId
        WHERE f.userId = ? AND f.followId = ? AND follow = 1;
      `;
  const [ existRows ] = await connection.query(followingInfoQuery,[ userId, followId ]);
  return existRows;
}

async function followerInfo(connection, userId , followId) {
  const followerInfoQuery = `
      SELECT u.userId, u.profileImg, u.userName,
      (SELECT COUNT(*) FROM Post p WHERE p.userId = u.userId) AS totalPost,
      (SELECT COUNT(*) FROM Following f WHERE f.followId = u.userId) AS follower
      FROM User u
      LEFT JOIN Following f ON f.userId = u.userId
      WHERE f.followId = ? AND f.userId = ? AND follow = 1;
      `;
  const [ existRows ] = await connection.query(followerInfoQuery,[ followId, userId ]);
  return existRows;
}
async function followingProductInfo(connection, userId , followId) {
  const followingProductQuery = `
      SELECT p.userId, p.postId,
      (SELECT pi.postImgUrl FROM postImage pi WHERE pi.mainImg = 1
                                                AND pi.postId = p.postId) AS postImgURL,
      p.price
      FROM Post p
      LEFT JOIN Following f ON f.followId = p.userId
      WHERE f.userId= ? AND f.followId = ? AND follow = 1
      ORDER BY p.createAt DESC LIMIT 3;
      `;
  const [ existRows ] = await connection.query(followingProductQuery,[ userId, followId ]);
  return existRows;
}
async function selectLookedProduct(connection, userId) {
  const lookedProductQuery = `
  SELECT p.postId, productName, price,
  (SELECT pi.postImgUrl
  FROM postImage pi WHERE pi.mainImg = 1
  AND pi.postId = p.postId) AS postImgURL
  FROM Watched w
  LEFT JOIN Post p on w.postId = p.postId
  WHERE w.userId = ? AND w.status = 1
  ORDER BY w.createAt DESC
  LIMIT 30;
      `;
  const [ existRows ] = await connection.query(lookedProductQuery, userId);
  return existRows;
}
async function selectReview(connection, userId) {
  const reviewQuery = `
  SELECT reviewId, reviewerId,
  profileImg, userName, star, r.content, productName,
   (CASE
      WHEN TIMESTAMPDIFF(MINUTE, r.createAt, now()) <= 0 THEN '방금 전'
       WHEN TIMESTAMPDIFF(MINUTE, r.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, r.createAt, NOW()), '분 전')
       WHEN TIMESTAMPDIFF(HOUR, r.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, r.createAt, NOW()), '시간 전')
       WHEN TIMESTAMPDIFF(DAY, r.createAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, r.createAt, NOW()), '일 전')
       WHEN TIMESTAMPDIFF(MONTH, r.createAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, r.createAt, NOW()), '달 전')
       ELSE CONCAT(TIMESTAMPDIFF(YEAR, r.createAt, NOW()), '년 전')
   END) AS createAt
  FROM Review r
  LEFT JOIN User u ON u.userId = r.reviewerId
  LEFT JOIN Post p On p.postId = r.postId
  WHERE r.userId = ? AND r.status = 1;

      `;
  const [ existRows ] = await connection.query(reviewQuery, userId);
  return existRows;
}
async function existUser(connection, userId) {
  const existUserQuery = `
  SELECT * FROM User WHERE userId = ? AND status = 1;
      `;
  const [ existRows ] = await connection.query(existUserQuery, userId);
  return existRows;
}

async function selectCollection(connection, userId) {
  const collectionQuery = `
  SELECT jj.collectionId, jj.collectionName, jj.userId, postImgUrl,
  (SELECT count(*) AS count FROM Jjim WHERE collectionId = jj.collectionId) AS count
FROM JjimCollection jj
INNER JOIN (SELECT jj.collectionId, postImgUrl
FROM JjimCollection jj
INNER JOIN
(SELECT collectionId,
  GROUP_CONCAT((SELECT postImgUrl FROM postImage pi WHERE postId = j.postId AND status = 1 AND mainImg = 1)) AS postImgUrl
FROM Jjim j WHERE j.collectionId IN (SELECT collectionId FROM JjimCollection WHERE userId = ? AND status = 1)
GROUP BY collectionId) cp
ON jj.collectionId = cp.collectionId
ORDER BY jj.createAt DESC) jp ON jp.collectionId = jj.collectionId
ORDER BY createAt DESC;

      `;
  const [ existRows ] = await connection.query(collectionQuery, [ userId, userId ]);
  return existRows;
}

async function selectEmptyCollection(connection, userId) {
  const existUserQuery = `
        SELECT jj.collectionId, collectionName,
        (SELECT count(*) AS count FROM Jjim WHERE collectionId = jj.collectionId) AS count
      FROM JjimCollection jj
      WHERE userId = ?;
      `;
  const [ existRows ] = await connection.query(existUserQuery, userId);
  return existRows;
}

async function createCollection(connection, userId, colname) {
  const collectionQuery = `
  INSERT INTO JjimCollection( userId, collectionName ) VALUES (?, ?);
      `;
  const [ existRows ] = await connection.query(collectionQuery, [ userId, colname]);
  return existRows;
}

async function editCollection(connection, userId, collectionId ,colname) {
  const collectionQuery = `
      UPDATE JjimCollection SET collectionName = ?
      WHERE userId = ? AND collectionId = ?;
      `;
  const [ existRows ] = await connection.query(collectionQuery, [ colname, userId, collectionId]);
  return existRows;
}
async function existCollection(connection, collectionId) {
  const collectionQuery = `
    SELECT EXISTS (SELECT * FROM JjimCollection WHERE collectionId = ? AND status = 1) as exist;
      `;
  const [ existRows ] = await connection.query(collectionQuery, collectionId);
  console.log(existRows);
  return existRows;
}
async function deleteCollection(connection, collectionId){
  const deleteCollectionQuery = `
    UPDATE JjimCollection SET status = 0 WHERE collectionId = ?;
  `;
  const [deleteCollectionRow] = await connection.query(deleteCollectionQuery, collectionId);
  return deleteCollectionRow;
}
async function deleteJjim(connection, collectionId){
  const deleteJjimQuery = `
    UPDATE Jjim SET status = 0 WHERE collectionId = ?;
  `;
  const deleteJjimRow = await connection.query(deleteJjimQuery, collectionId);
  return deleteJjimRow;
}
// 판매 중
async function selectJjimCollection1(connection, collectionId){
  const jjimQuery = `
        SELECT j.jjimId, collectionId, j.postId,
        (SELECT pi.postImgURL FROM postImage pi WHERE pi.postId = j.postId AND pi.mainImg = 1) AS postImgURL,
        productName, price, userName, profileImg, uploadDate, sellStatus
      FROM Jjim j
      INNER JOIN
      (SELECT jjimId,j.postId ,productName, price, userName, profileImg, pp.createAt,
      (CASE
        WHEN TIMESTAMPDIFF(MINUTE, pp.createAt, now()) <= 0 THEN '방금 전'
        WHEN TIMESTAMPDIFF(MINUTE, pp.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, pp.createAt, NOW()), '분 전')
        WHEN TIMESTAMPDIFF(HOUR, pp.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, pp.createAt, NOW()), '시간 전')
        WHEN TIMESTAMPDIFF(DAY, pp.createAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, pp.createAt, NOW()), '일 전')
        WHEN TIMESTAMPDIFF(MONTH, pp.createAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, pp.createAt, NOW()), '달 전')
        ELSE CONCAT(TIMESTAMPDIFF(YEAR, pp.createAt, NOW()), '년 전')
      END) AS uploadDate,
        IFNULL(( CASE rf.status
            WHEN 1 THEN rf.status
            WHEN 2 THEN rf.status
            END ), 0) AS sellStatus
      FROM Jjim j
      INNER JOIN (SELECT * FROM Post p WHERE p.status = 1) pp on pp.postId = j.postId
      INNER JOIN (SELECT * FROM User u WHERE u.status = 1) uu on uu.userId = pp.userId
      LEFT JOIN (SELECT * FROM Payment p ) rf on rf.postId = j.postId
      WHERE j.collectionId = ? AND j.status = 1 ) fj ON j.jjimId = fj.jjimId
      WHERE sellStatus = 0
      ORDER BY fj.createAt ASC;
  `;
  const jjimRow = await connection.query(jjimQuery, collectionId);
  return jjimRow;
}
// 판매예약 및 완료 
async function selectJjimCollection2(connection, collectionId){
  const jjimQuery = `
    SELECT j.jjimId, collectionId, j.postId,
    (SELECT pi.postImgURL FROM postImage pi WHERE pi.postId = j.postId AND pi.mainImg = 1) AS postImgURL,
    productName, price, userName, profileImg, uploadDate, sellStatus
  FROM Jjim j
  INNER JOIN
  (SELECT jjimId,j.postId ,productName, price, userName, profileImg, pp.createAt,
  (CASE
    WHEN TIMESTAMPDIFF(MINUTE, pp.createAt, now()) <= 0 THEN '방금 전'
    WHEN TIMESTAMPDIFF(MINUTE, pp.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, pp.createAt, NOW()), '분 전')
    WHEN TIMESTAMPDIFF(HOUR, pp.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, pp.createAt, NOW()), '시간 전')
    WHEN TIMESTAMPDIFF(DAY, pp.createAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, pp.createAt, NOW()), '일 전')
    WHEN TIMESTAMPDIFF(MONTH, pp.createAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, pp.createAt, NOW()), '달 전')
    ELSE CONCAT(TIMESTAMPDIFF(YEAR, pp.createAt, NOW()), '년 전')
  END) AS uploadDate,
    IFNULL(( CASE rf.status
        WHEN 1 THEN rf.status
        WHEN 2 THEN rf.status
        END ), 0) AS sellStatus
  FROM Jjim j
  INNER JOIN (SELECT * FROM Post p WHERE p.status = 1) pp on pp.postId = j.postId
  INNER JOIN (SELECT * FROM User u WHERE u.status = 1) uu on uu.userId = pp.userId
  LEFT JOIN (SELECT * FROM Payment p ) rf on rf.postId = j.postId
  WHERE j.collectionId = ? AND j.status = 1 ) fj ON j.jjimId = fj.jjimId
  WHERE sellStatus != 0
  ORDER BY fj.createAt ASC;
  `;
  const jjimRow = await connection.query(jjimQuery, collectionId);
  return jjimRow;
}
// (collectionId - postId) 
async function existJjim(connection, collectionId, postId) {
  const existJjimQuery = `
  SELECT exists(
    select collectionId, postId
    FROM Jjim
    WHERE collectionId = ? AND postId = ?)
    AS exist;
  `;
  const [jjimRows] = await connection.query(existJjimQuery, [collectionId, postId]);
  return jjimRows;
}

async function jjimStatus(connection, collectionId, postId) {
  const statusQuery = `
    SELECT status
    FROM Jjim
    WHERE collectionId = ? AND postId = ?;
  `;
  const [jjimRows] = await connection.query(statusQuery, [collectionId, postId]);
  return jjimRows;
}

async function addJjim(connection, collectionId, postId) {
  const addJjimQuery = `
    insert into Jjim(collectionId, postId)
    values (?, ?);
  `;
  const [jjimRows] = await connection.query(addJjimQuery, [collectionId, postId]);
  return jjimRows;
}

async function jjimDelete(connection, collectionId, postId) {
  const updateDeleteQuery = `
      UPDATE Jjim SET status = 0
      WHERE collectionId = ? AND postId = ?;
  `;
  const [jjimRows] = await connection.query(updateDeleteQuery, [collectionId, postId]);
  return jjimRows;
}
async function updateJjim(connection, collectionId, postId) {
  const updateJjimQuery = `
      UPDATE Jjim SET status = 1
    WHERE collectionId = ? AND postId = ?;
  `;
  const [jjimRows] = await connection.query(updateJjimQuery,[ collectionId, postId ]);
  return jjimRows;
}

async function selectMyInfo(connection, userId) {
  const userInfoQuery = `
        SELECT userId, userName, profileImg
        FROM User
        WHERE userId = ?;
      `;
  const [ existRows ] = await connection.query(userInfoQuery, userId);
  return existRows;
}

async function selectMyReview(connection, userId) {
  const reviewInfoQuery = `
        SELECT IFNULL(count(*), 0) AS reviewCount,
        IFNULL((SUM(star)/count(*)), 0) AS starPoint
      FROM Review
      WHERE userId = ?;
      `;
  const [ existRows ] = await connection.query(reviewInfoQuery, userId);
  return existRows;
}

async function selectMyJjim(connection, userId) {
  const jjimInfoQuery = `
      SELECT count(*) AS count FROM Jjim
      WHERE collectionId IN (SELECT collectionId FROM JjimCollection
      WHERE userId = ? AND status = 1);
      `;
  const [ existRows ] = await connection.query(jjimInfoQuery , userId);
  return existRows;
}


async function selectMySell(connection, userId) {
  const sellInfoQuery = `
  SELECT P.postId, userId, P.productName, P.price, postImgURL, uploadDate, sellStatus
  FROM Post P
  INNER JOIN(
  SELECT p.postId ,productName, price, userName, profileImg, p.createAt,
         (SELECT pi.postImgURL FROM postImage pi WHERE pi.postId = p.postId AND pi.mainImg = 1) AS postImgURL,
      (CASE
          WHEN TIMESTAMPDIFF(MINUTE, p.createAt, now()) <= 0 THEN '방금 전'
          WHEN TIMESTAMPDIFF(MINUTE, p.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.createAt, NOW()), '분 전')
          WHEN TIMESTAMPDIFF(HOUR, p.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.createAt, NOW()), '시간 전')
          WHEN TIMESTAMPDIFF(DAY, p.createAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, p.createAt, NOW()), '일 전')
          WHEN TIMESTAMPDIFF(MONTH, p.createAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, p.createAt, NOW()), '달 전')
          ELSE CONCAT(TIMESTAMPDIFF(YEAR, p.createAt, NOW()), '년 전')
      END) AS uploadDate,
         IFNULL(
             ( CASE rf.status
             WHEN 1 THEN rf.status
             WHEN 2 THEN rf.status
             END ), 0) AS sellStatus
      FROM Post p
      INNER JOIN (SELECT * FROM User u WHERE u.status = 1) u on u.userId = p.userId
      LEFT JOIN (SELECT * FROM Payment p ) rf on rf.postId = p.postId
      WHERE p.userId = ? AND p.status = 1 ) tp ON tp.postId = P.postId
  WHERE sellStatus = 0
  ORDER BY tp.createAt ASC;
      `;
  const [ existRows ] = await connection.query(sellInfoQuery , userId);
  return existRows;
}

async function selectMySelled(connection, userId) {
  const sellInfoQuery = `
  SELECT P.postId, userId, P.productName, P.price, postImgURL, uploadDate, sellStatus
  FROM Post P
  INNER JOIN(
  SELECT p.postId ,productName, price, userName, profileImg, p.createAt,
         (SELECT pi.postImgURL FROM postImage pi WHERE pi.postId = p.postId AND pi.mainImg = 1) AS postImgURL,
      (CASE
          WHEN TIMESTAMPDIFF(MINUTE, p.createAt, now()) <= 0 THEN '방금 전'
          WHEN TIMESTAMPDIFF(MINUTE, p.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.createAt, NOW()), '분 전')
          WHEN TIMESTAMPDIFF(HOUR, p.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.createAt, NOW()), '시간 전')
          WHEN TIMESTAMPDIFF(DAY, p.createAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, p.createAt, NOW()), '일 전')
          WHEN TIMESTAMPDIFF(MONTH, p.createAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, p.createAt, NOW()), '달 전')
          ELSE CONCAT(TIMESTAMPDIFF(YEAR, p.createAt, NOW()), '년 전')
      END) AS uploadDate,
         IFNULL(
             ( CASE rf.status
             WHEN 1 THEN rf.status
             WHEN 2 THEN rf.status
             END ), 0) AS sellStatus
      FROM Post p
      INNER JOIN (SELECT * FROM User u WHERE u.status = 1) u on u.userId = p.userId
      LEFT JOIN (SELECT * FROM Payment p ) rf on rf.postId = p.postId
      WHERE p.userId = ? AND p.status = 1 ) tp ON tp.postId = P.postId
  WHERE sellStatus != 0
  ORDER BY tp.createAt ASC;
      `;
  const [ existRows ] = await connection.query(sellInfoQuery , userId);
  return existRows;
}

async function editMyInfo(connection, infoParams) {
  const updateInfoQuery = `
      UPDATE User SET userName = ?, contactTime1 = ?, contactTime2 = ? ,
      policy = ?,storeUrl = ?, caution = ?, introduction = ?
      WHERE userId = ?;
  `;
  const [infoRows] = await connection.query(updateInfoQuery, infoParams);
  return infoRows;
}
async function editMyInfoProfile(connection, infoProfileParams) {
  const updateInfoQuery = `
  UPDATE User SET userName = ?, profileImg = ?, contactTime1 = ?, contactTime2 = ? ,
      policy = ?,storeUrl = ?, caution = ?, introduction = ?
  WHERE userId = ?;

  `;
  const [infoRows] = await connection.query(updateInfoQuery, infoProfileParams);
  return infoRows;
}
async function selectMyDetailInfo(connection, userId) {
  const selectInfoQuery = `
  SELECT
  u.userId, u.userName, u.profileImg,
  (CONCAT('+', TIMESTAMPDIFF(DAY, createAt, NOW()))) AS userOpenDate,
  (SELECT count(*) FROM Watched WHERE postId IN (SELECT postId FROM Post WHERE userId = u.userId)) AS visitors,
  (SELECT COUNT(*) FROM Following f WHERE f.followId = u.userId) AS follower,
  (SELECT COUNT(*) FROM Following f WHERE f.userId = u.userId) AS following,
  (SELECT COUNT(*) FROM Post p1 WHERE p1.userId = u.userId) AS totalPost,
  (SELECT COUNT(*) FROM Review r WHERE r.userId = userId) AS totalReview,
  (SELECT SUM(r.star)/COUNT(*) FROM Review r WHERE r.userId= userId) AS averageStar,
  (SELECT count(*) FROM Payment WHERE postId IN (SELECT postId FROM Post WHERE userId = u.userId)) AS sell,
  (SELECT count(*) FROM Payment WHERE postId IN (SELECT postId FROM Post WHERE userId = u.userId) AND type = 1) AS deliveryCount

  FROM User u
  WHERE u.userId = ? AND u.status = 1;

  `;
  const [infoRows] = await connection.query(selectInfoQuery, userId);
  return infoRows;
}

async function userProductList(connection, userId) {
  const selectInfoQuery = `
  SELECT p.postId,
       (SELECT pi.postImgUrl FROM postImage pi
       WHERE pi.mainImg = 1 AND p.postId = pi.postId AND p.status = 1) AS postImg,
       p.price, p.productName, (SELECT EXISTS(SELECT * FROM Jjim WHERE postId = p.postId AND status = 1)) AS jjim
  FROM Post p
  WHERE p.userId = ?
  ORDER BY p.createAt DESC LIMIT 10;

  `;
  const [infoRows] = await connection.query(selectInfoQuery, userId);
  return infoRows;
}


module.exports = {
    followerID,
    followingID,
    followerCount,
    followerInfo,
    followingCount,
    followingInfo,
    followingProductInfo,
    selectLookedProduct,
    selectReview,
    existUser,
    selectCollection,
    selectEmptyCollection,
    createCollection,
    editCollection,
    existCollection,
    deleteCollection,
    deleteJjim,
    selectJjimCollection1,
    selectJjimCollection2,
    addJjim,
    jjimDelete,
    updateJjim,
    existJjim,
    jjimStatus,
    selectMyInfo,
    selectMyReview,
    selectMyJjim,
    selectMySell,
    selectMySelled,
    editMyInfo,
    selectMyDetailInfo,
    editMyInfoProfile,
    userProductList
  };
  