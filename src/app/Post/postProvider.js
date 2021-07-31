const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const postDao = require("./postDao");


exports.retrieveMyPlace = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const postListResult = await postDao.selectMyAddress(connection, userId);
    connection.release();

    return postListResult;

};

exports.retrieveViewDetail = async function (postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postResult = await postDao.selectViewDetail(connection, postId);

  connection.release();

  return postResult;
};

exports.retrievePostView = async function (postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const postViewResult = await postDao.postView(connection, postId);
  connection.release();

  return postViewResult;
};

exports.retrieveOtherProductView = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const postProductResult = await postDao.postProduct(connection, postId);
    connection.release();
  
    return postProductResult;
  };

  exports.retrieveReview = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const postReviewResult = await postDao.postReview(connection, postId);
    connection.release();
  
    return postReviewResult;
  };

  exports.isExistPost = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const existPostResult = await postDao.isExistPost(connection, postId);
    connection.release();
  
    return existPostResult;
  };

  exports.recommendProduct = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const productResult = await postDao.selectRecommendProduct(connection, postId);
    connection.release();
  
    return productResult ;
  };
