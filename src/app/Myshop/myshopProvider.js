const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const myshopDao = require("./myshopDao");



exports.retrieveFollower = async function (followId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const followerResult = await myshopDao.followerID(connection, followId);
  console.log(followerResult);
  connection.release();

  return followerResult ;
};


exports.retrieveFollowerCount = async function (followId) {
  const connection = await pool.getConnection(async (conn) => conn);

  const followerCountResult = await myshopDao.followerCount(connection, followId);

  connection.release();

return followerCountResult;
};

exports.retrieveFollowing = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const followResult = await myshopDao.followingID(connection, userId);
    console.log(followResult);
    connection.release();
  
    return followResult;
  };
  

exports.retrieveFollowingCount = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const followCountResult = await myshopDao.followingCount(connection, userId);

    connection.release();

return followCountResult;
};

exports.getFollowInfo= async function (userId, followId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followResult = await myshopDao.followingInfo(connection, userId, followId);

  connection.release();

  return followResult;
};

exports.getFollowerInfo = async function (userId, followId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followResult = await myshopDao.followerInfo(connection, userId, followId);

  connection.release();

  return followResult;
};
exports.followProductInfo = async function (userId, followId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followProductResult = await myshopDao.followingProductInfo(connection, userId, followId);
  connection.release();

  return followProductResult;
};

exports.retrieveLookedProduct = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const lookedProduct = await myshopDao.selectLookedProduct (connection, userId);
  connection.release();

  return lookedProduct;
};


exports.retrieveReview = async function (userId){
  const connection = await pool.getConnection(async (conn) => conn);
  const reviewResult = await myshopDao.selectReview(connection, userId);
  connection.release();

  return reviewResult;
}

exports.isExistUser = async function (userId){
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await myshopDao.existUser(connection, userId);
  connection.release();

  return userResult;
}

exports.retrieveCollection= async function (userId){
  const connection = await pool.getConnection(async (conn) => conn);
  const collectionResult = await myshopDao.selectCollection(connection, userId);
  connection.release();

  return collectionResult;
}

exports.retrieveEmptyCollection = async function (userId){
  const connection = await pool.getConnection(async (conn) => conn);
  const collectionResult = await myshopDao.selectEmptyCollection(connection, userId);
  connection.release();

  return collectionResult;
}

exports.existCollection = async function (collectionId){
  const connection = await pool.getConnection(async (conn) => conn);
  const collectionResult = await myshopDao.existCollection(connection, collectionId);
  connection.release();

  return collectionResult;
}

exports.retrieveJjimCollection1 = async function (collectionId){
  const connection = await pool.getConnection(async (conn) => conn);
  const collectionResult = await myshopDao.selectJjimCollection1(connection ,collectionId);
  connection.release();

  return collectionResult;
}

exports.retrieveJjimCollection2 = async function (collectionId){
  const connection = await pool.getConnection(async (conn) => conn);
  const collectionResult = await myshopDao.selectJjimCollection2(connection,collectionId);
  connection.release();

  return collectionResult;
}

exports.jjimExist = async function (collectionId, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const jjimResult = await myshopDao.existJjim(connection, collectionId, postId);

  connection.release();

  return jjimResult;
};

exports.jjimStatus = async function (collectionId, postId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const jjimStatusResult = await myshopDao.jjimStatus(connection, collectionId, postId);
  connection.release();

  return jjimStatusResult;
};

exports.retrieveUserInfo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const [userInfoResult] = await myshopDao.selectMyInfo(connection, userId);
  connection.release();

  return userInfoResult;
};

exports.retrieveReviewInfo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const [reviewInfoResult] = await myshopDao.selectMyReview(connection, userId);
  
  connection.release();

  return reviewInfoResult;
};

exports.retrieveJjimInfo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const [jjimInfoResult] = await myshopDao.selectMyJjim(connection, userId);
  connection.release();

  return jjimInfoResult;
};


exports.retrieveMySellnfo= async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const sellInfoResult = await myshopDao.selectMySell(connection, userId);
  connection.release();

  return sellInfoResult;
};

exports.retrieveMySellednfo= async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const sellInfoResult = await myshopDao.selectMySelled(connection, userId);
  connection.release();

  return sellInfoResult;
};



exports.retrieveUserDetailInfo= async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const sellInfoResult = await myshopDao.selectMyDetailInfo(connection, userId);
  connection.release();

  return sellInfoResult;
};


exports.retrieveUserProductInfo= async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const sellInfoResult = await myshopDao.userProductList(connection, userId);
  connection.release();

  return sellInfoResult;
};