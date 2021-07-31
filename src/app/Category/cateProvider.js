const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const cateDao = require("./cateDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveMain = async function (page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mainResult = await cateDao.selectMain(connection, page, size);

  connection.release();

  return mainResult;
};

exports.retrieveFirstCategory = async function (categoryId, click) {
  if (click == 0) {
      // 접어 보기
    const connection = await pool.getConnection(async (conn) => conn);
    const cate1ListResult = await cateDao.selectSimpleCategory(connection, categoryId);
    connection.release();

    return cate1ListResult;

  } else {
      // 펼쳐 보기
    const connection = await pool.getConnection(async (conn) => conn);
    const cate11ListResult = await cateDao.selectDetailCategory(connection, categoryId);
    connection.release();

    return cate11ListResult;
  }
};

exports.retrieveCategory = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const categoryResult = await cateDao.selectCategory(connection);

  connection.release();

  return categoryResult;
};

exports.retrieveFirstProduct = async function (categoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await cateDao.selectCate1Product(connection, categoryId);
  connection.release();

  return productResult;
};


exports.isExistSubCate = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [isExistResult] = await cateDao.selectExistSubCategory(connection, categoryId);
    connection.release();
    return isExistResult;
  };

// 비회원 상품 조회
  exports.retrieveFilterProduct = async function (type, categoryId, page, size) {
    const connection = await pool.getConnection(async (conn) => conn);

    if(type == '최신순'){
        const isExistResult = await cateDao.productOrderByRecent(connection, categoryId, page, size);
        connection.release();
        return isExistResult;

    } else if(type == '인기순'){
        const isExistResult = await cateDao.productOrderByPopular(connection, categoryId, page, size);
        connection.release();
        return isExistResult;

    } else if(type == '저가순'){
        const isExistResult = await cateDao.productOrderByLow(connection, categoryId, page, size);
        connection.release();
        return isExistResult;

    } else if(type == '고가순'){
        const isExistResult = await cateDao.productOrderByHigh(connection, categoryId, page, size);
        connection.release();
        return isExistResult;

    }
  };

// 상위 - 신규 상품 (접어 보기)
exports.retrieveNewProduct = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productResult = await cateDao.selectNewProduct(connection, categoryId);
    connection.release();
  
    return productResult;
};

// 상위 - 신규 상품 (펼쳐 보기)
exports.retrieveNewProductDetail = async function (categoryId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await cateDao.selectNewProductDetail(connection, categoryId, page, size);
  connection.release();

  return productResult;
};

// 서브 카테고리 메뉴 
exports.retrieveSecondCategory = async function (subCategoryId, click) {
    if (click == 0) {
        // 접어 보기
      const connection = await pool.getConnection(async (conn) => conn);
      const cate2ListResult = await cateDao.selectSimple2Category(connection, subCategoryId);
      connection.release();
  
      return cate2ListResult;
  
    } else {
        // 펼쳐 보기
        const connection = await pool.getConnection(async (conn) => conn);
        const cate22ListResult = await cateDao.selectDetail2Category(connection, subCategoryId);
        connection.release();
        
      return cate22ListResult;
    }
  };

// categoryId & subCategoryId 유효성 검사
exports.categoryCheck = async function (categoryId, subCategoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const [matchResult] = await cateDao.subCategoryIdInCategory( connection, categoryId, subCategoryId );
  connection.release();
  return matchResult;
};

// 하위 카테고리가 존재하는지
exports.isExistThirdCate = async function (subCategoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const [isExistResult] = await cateDao.selectExistThirdCategory(connection, subCategoryId);
  connection.release();
  return isExistResult;
};

// 서브 카테고리 추천상품
exports.retrieveSecondProduct = async function (subCategoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await cateDao.selectCate2Product(connection, subCategoryId);
  connection.release();

  return productResult;
};


// [비회원] 서브 카테고리 상품 조회
exports.retrieveFilterProduct2 = async function (type, subCategoryId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);

  if(type == '최신순'){
      const isExistResult = await cateDao.productOrderByRecent2(connection, subCategoryId, page, size);
      connection.release();
      return isExistResult;

  } else if(type == '인기순'){
      const isExistResult = await cateDao.productOrderByPopular2(connection, subCategoryId, page, size);
      connection.release();
      return isExistResult;

  } else if(type == '저가순'){
      const isExistResult = await cateDao.productOrderByLow2(connection, subCategoryId, page, size);
      connection.release();
      return isExistResult;

  } else if(type == '고가순'){
      const isExistResult = await cateDao.productOrderByHigh2(connection, subCategoryId, page, size);
      connection.release();
      return isExistResult;

  }
};




// 서브 - 신규 상품 (접어 보기)
exports.retrieveNewProduct2 = async function (subCategoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await cateDao.selectNewProduct2(connection, subCategoryId);
  connection.release();

  return productResult;
};

// 서브 - 신규 상품 (펼쳐 보기)
exports.retrieveNewProductDetail2 = async function (subCategoryId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await cateDao.selectNewProductDetail2(connection, subCategoryId, page, size);
  connection.release();

  return productResult;
};

// subCategoryId & thirdCategoryId 유효성 검사
exports.categoryCheck2 = async function (subCategoryId, thirdCategoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const [matchResult] = await cateDao.thirdCategoryIdInSubCategory( connection, subCategoryId, thirdCategoryId );
  connection.release();
  return matchResult;
};

// 하위 - 신규 상품 (접어 보기)
exports.retrieveNewProduct3 = async function (thirdCategoryId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await cateDao.selectNewProduct3(connection, thirdCategoryId);
  connection.release();

  return productResult;
};

// [비회원] 하위 카테고리 상품 조회
exports.retrieveFilterProduct3 = async function (type, thirdCategoryId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);

  if(type == '최신순'){
      const isExistResult = await cateDao.productOrderByRecent3(connection, thirdCategoryId, page, size);
      connection.release();
      return isExistResult;

  } else if(type == '인기순'){
      const isExistResult = await cateDao.productOrderByPopular3(connection, thirdCategoryId, page, size);
      connection.release();
      return isExistResult;

  } else if(type == '저가순'){
      const isExistResult = await cateDao.productOrderByLow3(connection, thirdCategoryId, page, size);
      connection.release();
      return isExistResult;

  } else if(type == '고가순'){
      const isExistResult = await cateDao.productOrderByHigh3(connection, thirdCategoryId, page, size);
      connection.release();
      return isExistResult;

  }
};


// 서브 - 신규 상품 (펼쳐 보기)
exports.retrieveNewProductDetail3 = async function (thirdCategoryId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const productResult = await cateDao.selectNewProductDetail3(connection, thirdCategoryId, page, size);
  connection.release();

  return productResult;
};
