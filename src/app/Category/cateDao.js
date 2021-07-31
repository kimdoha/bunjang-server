// 메인 화면 : 오늘의 상품 추천
  async function selectMain(connection, page, size) {
    const selectMainQuery = `
    SELECT p.postId, p.productName, p.price, pi.postImgURL, u.userId, u.userName, u.profileImg,
           (SELECT EXISTS(SELECT * FROM Jjim WHERE postId = p.postId AND status = 1)) AS jjim,
    (CASE
         WHEN TIMESTAMPDIFF(MINUTE, p.createAt, now()) <= 0 THEN '방금 전'
        WHEN TIMESTAMPDIFF(MINUTE, p.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.createAt, NOW()), '분 전')
        WHEN TIMESTAMPDIFF(HOUR, p.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, p.createAt, NOW()), '시간 전')
        WHEN TIMESTAMPDIFF(DAY, p.createAt, NOW()) < 31 THEN CONCAT(TIMESTAMPDIFF(DAY, p.createAt, NOW()), '일 전')
        WHEN TIMESTAMPDIFF(MONTH, p.createAt, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, p.createAt, NOW()), '달 전')
        ELSE CONCAT(TIMESTAMPDIFF(YEAR, p.createAt, NOW()), '년 전')
    END) AS time
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg = 1
    WHERE p.status != 0
    ORDER BY p.createAt DESC
    LIMIT ?, ?;
        `;
    const [productRow] = await connection.query(selectMainQuery,[ page, size ]);
    return productRow;
  }



// 카테고리 목록 조회
async function selectCategory(connection) {
    const categoryQuery = `
            SELECT categoryId AS id, categoryName AS name
            FROM Category;
                  `;
    const [category] = await connection.query(categoryQuery);
    return category;
  }
  
  // 카테고리 (접어 보기)
  async function selectSimpleCategory(connection, categoryId) {
    const selectCategory1Query = `
        SELECT s.subCategoryId AS id,subCategoryName AS name, IFNULL(count, 0) AS count
        FROM SubCategory s
        LEFT JOIN (
        SELECT subCategoryId, count(*) AS count
        FROM Post
        GROUP BY subCategoryId ) sc ON s.subCategoryId = sc.subCategoryId
        WHERE categoryId = ?
        ORDER BY count DESC
        LIMIT 7 OFFSET 0;
                  `;
    const [category1Rows] = await connection.query(selectCategory1Query , categoryId);
    return category1Rows;
  }
  // 카테고리 (펼쳐 보기)
  async function selectDetailCategory(connection, categoryId) {
    const selectCategory11Query = `
        SELECT s.subCategoryId AS id,subCategoryName AS name, IFNULL(count, 0) AS count
        FROM SubCategory s
        LEFT JOIN (
        SELECT subCategoryId, count(*) AS count
        FROM Post
        GROUP BY subCategoryId ) sc ON s.subCategoryId = sc.subCategoryId
        WHERE categoryId = ?
        ORDER BY count DESC;
                  `;
    const [category11Rows] = await connection.query(selectCategory11Query , categoryId);
    return category11Rows;
  }

// 상위 카테고리 상품 조회
  async function selectCate1Product(connection, categoryId) {
    const category1ProductQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
          p.price , pi.postImgURL
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE categoryId = ? AND p.status != 0
    ORDER BY RAND()
    LIMIT 0, 120;
        `;
    const [productRow] = await connection.query(category1ProductQuery, categoryId);
    return productRow;
  }
  
// 서브 카테고리 존재 여부 
async function selectExistSubCategory(connection, categoryId) {
    const existCategoryQuery = `
        SELECT IFNULL(count, 0) AS count
        FROM Category c
        LEFT JOIN (SELECT categoryId, count(*) AS count
        FROM SubCategory
        GROUP BY categoryId) sc ON sc.categoryId = c.categoryId
        WHERE c.categoryId = ?
        `;
    const [existRow] = await connection.query(existCategoryQuery , categoryId);
    return existRow;
  }

// 최신순 정렬
async function productOrderByRecent(connection, categoryId, page, size) {
    const productOrderByRecentQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
          p.price, pi.postImgURL
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE categoryId = ? AND p.status != 0
    ORDER BY p.updateAt DESC
    LIMIT ? , ?;
        `;
    const [productRow] = await connection.query(productOrderByRecentQuery , [ categoryId, page, size ]);
    return productRow;
  }

// 저가순 정렬
async function productOrderByLow(connection, categoryId, page, size) {
    const productOrderByLowQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
                p.price, pi.postImgURL
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE categoryId = ? AND p.status != 0
    ORDER BY p.price ASC
    LIMIT ?, ?;
        `;
    const [productRow] = await connection.query(productOrderByLowQuery , [ categoryId, page, size ]);
    return productRow;
  }

  // 고가순 정렬
async function productOrderByHigh(connection, categoryId, page, size) {
    const productOrderByHighQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
              p.price , pi.postImgURL
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE categoryId = ? AND p.status != 0
    ORDER BY p.price DESC
    LIMIT ?, ?;
        `;
    const [productRow] = await connection.query(productOrderByHighQuery , [ categoryId, page, size ]);
    return productRow;
  }


  // 인기순 정렬
  async function productOrderByPopular(connection, categoryId, page, size) {
    const productOrderByPopularQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
              p.price , pi.postImgURL
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    LEFT JOIN (SELECT postId ,count(*) AS count FROM Jjim GROUP BY postId) j ON j.postId = p.postId
    WHERE categoryId = ? AND p.status != 0
    ORDER BY j.count DESC
    LIMIT ?, ?;
        `;
    const [productRow] = await connection.query(productOrderByPopularQuery , [ categoryId, page, size ]);
    return productRow;
  }

 // 신규등록 상품
 async function selectNewProduct(connection, categoryId) {
    const newProductQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
              p.price , pi.postImgURL
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE categoryId = ? AND p.status != 0
    ORDER BY p.createAt DESC
    LIMIT 0, 5;
        `;
    const [newProductRow] = await connection.query(newProductQuery, categoryId);
    return newProductRow;
  }

   // 신규등록 (펼쳐 보기)
 async function selectNewProductDetail(connection, categoryId, page, size) {
  const newProductDetailQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
              p.price , pi.postImgURL
    FROM Post p
    LEFT JOIN User u ON p.userId = u.userId
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE categoryId = ? AND p.status != 0
    ORDER BY p.createAt DESC
    LIMIT ?, ?;
      `;
  const [newProductRow] = await connection.query(newProductDetailQuery, [ categoryId, page, size ]);
  return newProductRow;
}
// 서브카테고리 (접어 보기)
async function selectSimple2Category(connection,  subCategoryId) {
    const selectCategory2Query = `
    SELECT t.thirdCategoryId AS id, thirdCategoryName AS name, IFNULL(count, 0) AS count
    FROM ThirdCategory t
    LEFT JOIN (SELECT thirdCategoryId, count(*) AS count FROM Post
    GROUP BY thirdCategoryId) tc ON t.thirdCategoryId = tc.thirdCategoryId
    WHERE subCategoryId = ?
    ORDER BY count DESC
    LIMIT 7 OFFSET 0;
                  `;
    const [category2Rows] = await connection.query(selectCategory2Query , subCategoryId);
    return category2Rows;
  }

  // 서브카테고리 (펼쳐 보기)
  async function selectDetail2Category(connection, subCategoryId) {
    const selectCategory22Query = `
    SELECT t.thirdCategoryId AS id, thirdCategoryName AS name, IFNULL(count, 0) AS count
    FROM ThirdCategory t
    LEFT JOIN (SELECT thirdCategoryId, count(*) AS count FROM Post
    GROUP BY thirdCategoryId) tc ON t.thirdCategoryId = tc.thirdCategoryId
    WHERE subCategoryId = ?
    ORDER BY count DESC;
                  `;
    const [category22Rows] = await connection.query(selectCategory22Query , subCategoryId);
    return category22Rows;
  }

 // 카테고리 - 서브카테고리 유효 검사
 async function subCategoryIdInCategory(connection, categoryId, subCategoryId) {
    const isMatchQuery = `
    SELECT EXISTS( SELECT *
        FROM SubCategory s
        LEFT JOIN Category c on s.categoryId = c.categoryId
        WHERE c.categoryId = ? AND s.subCategoryId = ?) as exist;
    `;
    const [selectMatchRow] = await connection.query( isMatchQuery , [ categoryId, subCategoryId ]);
    return selectMatchRow;
  }
 // 하위 카테고리가 존재하는지
  async function selectExistThirdCategory(connection, subCategoryId) {
    const existCategoryQuery = `
    SELECT IFNULL(count, 0) AS count
    FROM SubCategory sc
    LEFT JOIN (SELECT subCategoryId, count(*) AS count
    FROM ThirdCategory
    GROUP BY subCategoryId) tc ON tc.subCategoryId = sc.subCategoryId
    WHERE sc.subCategoryId = ?;
        `;
    const [existRow] = await connection.query(existCategoryQuery , subCategoryId);
    return existRow;
  }


  // 서브 카테고리 상품 조회
  async function selectCate2Product(connection, subCategoryId) {
    const category2ProductQuery = `
    SELECT p.postId,  IF ((SELECT CHAR_LENGTH(p.productName)) <= 10, p.productName
    ,CONCAT(SUBSTRING(p.productName, 1, 10), '…')) AS productName,
    p.price, pi.postImgURL
    FROM Post p
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE subCategoryId = ? AND p.status != 0
    ORDER BY RAND()
    LIMIT 0, 120;
        `;
    const [productRow] = await connection.query(category2ProductQuery, subCategoryId);
    return productRow;
  }

// 서브카테고리 최신순 정렬
async function productOrderByRecent2(connection, subCategoryId, page, size) {
  const productOrderByRecentQuery2 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price, pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE SubcategoryId = ? AND p.status != 0
  ORDER BY p.updateAt DESC
  LIMIT ? , ?;
      `;
  const [productRow] = await connection.query(productOrderByRecentQuery2 , [ subCategoryId, page, size ]);
  return productRow;
}

// 서브카테고리 저가순 정렬
async function productOrderByLow2(connection, subCategoryId, page, size) {
  const productOrderByLowQuery2 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price, pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE SubcategoryId = ? AND p.status != 0
  ORDER BY p.price ASC
  LIMIT ?, ?;
      `;
  const [productRow] = await connection.query(productOrderByLowQuery2 , [ subCategoryId, page, size ]);
  return productRow;
}

// 서브카테고리 고가순 정렬
async function productOrderByHigh2(connection, subCategoryId, page, size) {
  const productOrderByHighQuery2 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price, pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE SubcategoryId = ? AND p.status != 0
  ORDER BY p.price DESC
  LIMIT ?, ?;
      `;
  const [productRow] = await connection.query(productOrderByHighQuery2 , [ subCategoryId, page, size ]);
  return productRow;
}


// 서브카테고리 인기순 정렬
async function productOrderByPopular2(connection, subCategoryId, page, size) {
  const productOrderByPopularQuery2 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price , pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  LEFT JOIN (SELECT postId ,count(*) AS count FROM Jjim GROUP BY postId) j ON j.postId = p.postId
  WHERE SubcategoryId = ? AND p.status != 0
  ORDER BY j.count DESC
  LIMIT ?, ?;
      `;
  const [productRow] = await connection.query(productOrderByPopularQuery2 , [ subCategoryId, page, size ]);
  return productRow;
}

 // [서브] 신규등록 상품 접어보기 
 async function selectNewProduct2(connection, subCategoryId) {
  const newProductQuery = `
    SELECT p.postId,
    IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
              ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
              p.price , pi.postImgURL
    FROM Post p
    LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
    WHERE subCategoryId = ? AND p.status != 0
    ORDER BY p.createAt DESC
    LIMIT 0, 5;
      `;
  const [newProductRow] = await connection.query(newProductQuery, subCategoryId);
  return newProductRow;
}

// [서브] 신규등록 상품 (펼쳐 보기)
async function selectNewProductDetail2(connection, subCategoryId, page, size) {
  const newProductDetailQuery = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price , pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE subCategoryId = ? AND p.status != 0
  ORDER BY p.createAt DESC
  LIMIT ?, ?;
      `;
  const [newProductRow] = await connection.query(newProductDetailQuery, [ subCategoryId, page, size ]);
  return newProductRow;
}

 // 카테고리 - 하위카테고리 유효 검사
 async function thirdCategoryIdInSubCategory(connection, subCategoryId, thirdCategoryId ) {
  const isMatchQuery = `
  SELECT EXISTS( SELECT *
    FROM ThirdCategory tc
    LEFT JOIN SubCategory sc on tc.subCategoryId = sc.subCategoryId
    WHERE tc.subCategoryId = ? AND tc.thirdCategoryId = ?) as exist;
  `;
  const [selectMatchRow] = await connection.query( isMatchQuery , [ subCategoryId, thirdCategoryId ]);
  return selectMatchRow;
}

 // [하위] 신규등록 상품 접어보기 
 async function selectNewProduct3(connection, thirdCategoryId) {
  const newProductQuery = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price , pi.postImgURL
  FROM Post p
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE thirdCategoryId = ? AND p.status != 0
  ORDER BY p.createAt DESC
  LIMIT 0, 5;
      `;
  const [newProductRow] = await connection.query(newProductQuery, thirdCategoryId);
  return newProductRow;
}
// 하위카테고리 최신순 정렬
async function productOrderByRecent3(connection, thirdCategoryId, page, size) {
  const productOrderByRecentQuery3 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price , pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE thirdcategoryId = ? AND p.status != 0
  ORDER BY p.updateAt DESC
  LIMIT ? , ?;
      `;
  const [productRow] = await connection.query(productOrderByRecentQuery3 , [ thirdCategoryId, page, size ]);
  return productRow;
}

// 하위카테고리 저가순 정렬
async function productOrderByLow3(connection, thirdCategoryId, page, size) {
  const productOrderByLowQuery3 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price , pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE thirdcategoryId = ? AND p.status != 0
  ORDER BY p.price ASC
  LIMIT ?, ?;
      `;
  const [productRow] = await connection.query(productOrderByLowQuery3 , [ thirdCategoryId, page, size ]);
  return productRow;
}

// 하위카테고리 고가순 정렬
async function productOrderByHigh3(connection, thirdCategoryId, page, size) {
  const productOrderByHighQuery3 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price , pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE thirdcategoryId = ? AND p.status != 0
  ORDER BY p.price DESC
  LIMIT ?, ?;
      `;
  const [productRow] = await connection.query(productOrderByHighQuery3 , [ thirdCategoryId, page, size ]);
  return productRow;
}


// 하위 카테고리 인기순 정렬
async function productOrderByPopular3(connection, thirdCategoryId, page, size) {
  const productOrderByPopularQuery3 = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price, pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  LEFT JOIN (SELECT postId ,count(*) AS count FROM Jjim GROUP BY postId) j ON j.postId = p.postId
  WHERE thirdcategoryId = ? AND p.status != 0
  ORDER BY j.count DESC
  LIMIT ?, ?;
      `;
  const [productRow] = await connection.query(productOrderByPopularQuery3 , [ thirdCategoryId, page, size ]);
  return productRow;
}
// [하위] 신규등록 상품 (펼쳐 보기)
async function selectNewProductDetail3(connection, thirdCategoryId, page, size) {
  const newProductDetailQuery = `
  SELECT p.postId,
  IF ((SELECT CHAR_LENGTH(p.productName)) <= 9, p.productName
            ,CONCAT(SUBSTRING(p.productName, 1, 9), '…')) AS productName,
            p.price , pi.postImgURL
  FROM Post p
  LEFT JOIN User u ON p.userId = u.userId
  LEFT JOIN postImage pi ON pi.postId = p.postId AND pi.mainImg= 1
  WHERE thirdCategoryId = ? AND p.status != 0
  ORDER BY p.createAt DESC
  LIMIT ?, ?;
      `;
  const [newProductRow] = await connection.query(newProductDetailQuery, [ thirdCategoryId, page, size ]);
  return newProductRow;
}

  
  
  module.exports = {
    selectMain,
    selectCategory,
    selectSimpleCategory,
    selectDetailCategory,
    selectCate1Product,
    selectExistSubCategory,
    productOrderByRecent,
    productOrderByLow,
    productOrderByHigh,
    productOrderByPopular,
    selectSimple2Category,
    selectDetail2Category,
    subCategoryIdInCategory,
    selectNewProduct,
    selectNewProductDetail,
    selectExistThirdCategory,
    selectCate2Product,
    productOrderByRecent2,
    productOrderByLow2,
    productOrderByHigh2,
    productOrderByPopular2,
    selectNewProduct2,
    selectNewProductDetail2,
    thirdCategoryIdInSubCategory,
    selectNewProduct3,
    productOrderByRecent3,
    productOrderByLow3,
    productOrderByHigh3,
    productOrderByPopular3,
    selectNewProductDetail3
  };
  