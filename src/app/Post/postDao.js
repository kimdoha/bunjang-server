// 게시글 작성 
async function writePost(connection, postParams) {
    const writePostQuery = `
    INSERT INTO Post (userId, productName, categoryId, subCategoryId, thirdCategoryId,
      price, changePrice, setMyPlace, place,
      containDelivery, content, productCondition, isExchange, count)
      VALUES (?, ?, ?, ?, ?, 
              ?, ?, ?, ?,
              ?, ?, ?, ?, ?);
      `;
    const [insertPostRow] = await connection.query(writePostQuery , postParams);

    return insertPostRow;
}
  
// 상품 이미지 추가
  async function insertImage(connection, postId, url, main) {
    const addProductImageQuery = `
      INSERT INTO postImage(postId, postImgUrl, mainImg) VALUES (?, ?, ?);
    `;
    const [imageRows] = await connection.query( addProductImageQuery , [ postId, url, main ] );
    return imageRows;
  }


// 상품 태그 추가
async function insertTag(connection, postId, tag) {
  const addProductTagQuery = `
      INSERT INTO postTag(postId, tag) VALUES (?, ?);
                `;
  const [tagRows] = await connection.query(addProductTagQuery, [ postId, tag ] );
  return tagRows;
}
  
  // 내 주소 가져오기
  async function selectMyAddress(connection, userId) {
    const myAddressQuery = `
    SELECT a.areaName
    FROM Area a
    INNER JOIN (SELECT *
    FROM Area
    WHERE userId = ? AND status = 1) ad ON a.userId = ad.userId
    ORDER BY a.createAt DESC
    LIMIT 1;
      `;
    const [myAddressRow] = await connection.query(myAddressQuery, userId);
    return myAddressRow;
  }
  
  // 상품 상세정보 화면 조회 
  async function postView(connection, postId) {
    const viewQuery = `
    SELECT p.postId, GROUP_CONCAT(pi.postImgUrl) AS postImages, p.productName, p.price,
    (CASE
         WHEN TIMESTAMPDIFF(MINUTE, p.updateAt, now()) <= 0 THEN '방금 전'
         WHEN TIMESTAMPDIFF(MINUTE, p.updateAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.updateAt, NOW()), '분 전')
         WHEN TIMESTAMPDIFF(HOUR, p.updateAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.updateAt, NOW()), '시간 전')
         WHEN TIMESTAMPDIFF(DAY, p.updateAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, p.updateAt, NOW()), '일 전')
         WHEN TIMESTAMPDIFF(MONTH, p.updateAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, p.updateAt, NOW()), '달 전')
         ELSE CONCAT(TIMESTAMPDIFF(YEAR, p.updateAt, NOW()), '년 전')
      END) AS time,
    (SELECT count(*) AS count FROM Watched GROUP BY postId Having postId = ?) AS watched,
    (SELECT COUNT(*) FROM Jjim j WHERE j.postId = p.postId AND j.status = 1) AS jjim,
    p.productCondition, p.containDelivery, p.isExchange, p.count, p.content, p.place,
    (SELECT t.thirdCategoryName FROM ThirdCategory t WHERE t.thirdCategoryId = p.thirdCategoryId) AS category,
    (SELECT COUNT(*) FROM postQuestion pq WHERE pq.postId = p.postId) AS postQuestion,
    (SELECT GROUP_CONCAT(tag SEPARATOR ', ') AS Tags FROM postTag WHERE postId = ? AND status = 1) AS tags,
    u.userId, u.userName, u.profileImg,
    (CONCAT('+', TIMESTAMPDIFF(DAY, u.createAt, NOW()))) AS userOpenDate,
    (SELECT COUNT(*) FROM Following f WHERE f.followId = u.userId) AS follower,
    (SELECT COUNT(*) FROM Post p1 WHERE p1.userId = (SELECT p.userId FROM Post p WHERE p.postId = ?)) AS totalPost,
    (SELECT COUNT(*) FROM Review r WHERE r.userId = p.userId) AS totalReview,
    (SELECT SUM(r.star)/COUNT(*) FROM Review r WHERE r.userId= p.userId) AS averageStar
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId
    WHERE p.postId = ? AND p.status = 1;
      `;
    const [viewDetailRow] = await connection.query(viewQuery, [ postId, postId, postId, postId ]);
    return viewDetailRow;
  }

  // 상품 상세정보 화면 조회 
  async function postProduct(connection, postId) {
    const viewQuery = `
    SELECT p.postId,
    (SELECT pi.postImgUrl FROM postImage pi
    WHERE pi.mainImg = 1 AND p.postId = pi.postId AND p.status = 1) AS postImg,
    p.price
    FROM Post p
    WHERE p.userId = (SELECT p.userId FROM Post p WHERE p.postId = ?) AND p.postId!= ?
    ORDER BY p.createAt DESC 
    LIMIT 3;     
      `;
    const [viewDetailRow] = await connection.query(viewQuery, [ postId, postId ]);
    return viewDetailRow;
  }

  // 상품 상세정보 화면 조회 
  async function postReview(connection, postId) {
    const viewQuery = `
    SELECT r.reviewId,
    (SELECT u.userName FROM User u WHERE u.userId = r.reviewId) AS reviewer,
    (SELECT u.profileImg FROM User u WHERE u.userId = r.reviewId) AS reviewerProfile,
    r.content, r.star,
    (CASE
        WHEN TIMESTAMPDIFF(MINUTE, p.updateAt, now()) <= 0 THEN '방금 전'
         WHEN TIMESTAMPDIFF(MINUTE, r.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, r.createAt, NOW()), '분 전')
         WHEN TIMESTAMPDIFF(HOUR, r.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, r.createAt, NOW()), '시간 전')
         WHEN TIMESTAMPDIFF(DAY, r.createAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, r.createAt, NOW()), '일 전')
         WHEN TIMESTAMPDIFF(MONTH, r.createAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, r.createAt, NOW()), '달 전')
         ELSE CONCAT(TIMESTAMPDIFF(YEAR, r.createAt, NOW()), '년 전')
     END) AS createAt
    FROM Review r
    INNER JOIN Post p ON r.userId = p.userId WHERE p.postId = ?
    ORDER BY r.createAt DESC 
    LIMIT 2;
      `;
    const [viewDetailRow] = await connection.query(viewQuery, postId);
    return viewDetailRow;
  }
 

  // 게시글 존재 유무 
  async function isExistPost(connection, postId) {
    const isExistQuery = `
      SELECT * FROM Post WHERE postId = ? AND status = 1;
      `;
    const [existPostRow] = await connection.query(isExistQuery, postId);
    return existPostRow;
  }

  // 다른 구매자가 함께 본 상품

  async function selectRecommendProduct(connection, postId) {
    const recommendQuery = `
    SELECT p.postId, productName, price,
    (SELECT pi.postImgUrl FROM postImage pi WHERE pi.mainImg = 1
          AND pi.postId = p.postId) AS postImgURL

    FROM Post p
    INNER JOIN (
    SELECT w.postId, w.userId
    FROM Watched w
    INNER JOIN Post p ON p.postId = w.postId
    WHERE w.userId IN (SELECT userId FROM Watched WHERE postId = ?) AND w.postId != ? AND p.status = 1
    GROUP BY postId
    ) w ON w.postId = p.postId
    GROUP BY p.postId
    ORDER BY RAND()
    LIMIT 18;
      `;
    const [recommendRow] = await connection.query(recommendQuery , [ postId, postId ]);
    return recommendRow;
  }

  async function updatePost(){
  //   const updateUserQuery = `
  // `;
  //   const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  //   return updateUserRow[0];
  }
  async function updateImage(){
      //   const updateUserQuery = `
  // `;
  //   const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  //   return updateUserRow[0];
  }
  async function updateTag(){
      //   const updateUserQuery = `
  // `;
  //   const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  //   return updateUserRow[0];
  }


  module.exports = {
    writePost,
    selectMyAddress,
    insertTag,
    insertImage,
    postView,
    postReview,
    postProduct,
    isExistPost,
    selectRecommendProduct
  }
  