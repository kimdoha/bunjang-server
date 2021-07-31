const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const talkDao = require("./talkDao");


// Provider: Read 비즈니스 로직 처리
exports.splitAddress = async function (addressObj, total) {
    let count = 0;
    let totalData = [];
    while (count < total) {
        let idx = count;
        let roadAddr = addressObj.results.juso[count].roadAddr;
        let zipNo = addressObj.results.juso[count].zipNo;
        const result = { "index" : idx, "roadAddr": roadAddr , "zipNo": zipNo};
        totalData[count] = result;
        count += 1;
    }
    return totalData;
};

exports.countAddress = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const talkResult = await talkDao.selectCountAddress(connection, userId);

  connection.release();

  return talkResult;
};

exports.retrieveMyAddress = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myAddressResult = await talkDao.selectMyAddress(connection, userId);
  connection.release();
  return myAddressResult;
};

exports.isExistAddress = async function (userId, addressId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const existAddressResult = await talkDao.existAddress(connection, userId, addressId);
    connection.release();

    return existAddressResult;
};

exports.isExistPost = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const existPostResult = await talkDao.isExistPost(connection, postId);
    connection.release();
    return existPostResult;
  };

  exports.existRoom = async function (userId, postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [existRoomResult] = await talkDao.isExistRoom(connection, userId, postId);
    connection.release();
  
    return existRoomResult;
  };

  exports.retrieveRoomID = async function (sendId, receiveId, postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [roomIDResult] = await talkDao.selectRoomID(connection, sendId, receiveId, postId);
    console.log("RoomIdResult>>", roomIDResult);
    connection.release();
  
    return roomIDResult;
  };
  exports.retrieveSeller = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [sellerResult] = await talkDao.selectSeller(connection, postId);
    connection.release();
  
    return sellerResult;
  };
 
exports.retrievePayId = async function (postId, userId, sellerId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [payIdResult] = await talkDao.selectPayId(connection, postId, userId, sellerId);
    connection.release();
    console.log(payIdResult);
    return payIdResult;
  };

  exports.isExistPayId = async function (postId, userId, sellerId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [payIdResult] = await talkDao.existPayId(connection, postId, userId, sellerId);
    connection.release();
  
    return payIdResult;
  };

  exports.retrieveMyFirstAddress = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [addressResult] = await talkDao.retrieveMyFirstAddr(connection, userId);
    connection.release();
  
    return addressResult;
  };

  exports.retrieveProductInfo = async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [productResult] = await talkDao.selectProductInfo(connection, postId);
    connection.release();
  
    return productResult;
  };

  exports.retrieveTalkMain = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [mainResult] = await talkDao.selectMainInfo(connection, userId, userId);
    connection.release();
  
    return mainResult;
  };

  exports.retrieveTalkProductInfo= async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [productResult] = await talkDao.selectTalkProductInfo(connection, postId);
    connection.release();
    console.log(productResult);
    return productResult;
  };

  exports.retrieveTalkDetail= async function (postId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const detailResult = await talkDao.selectDetailTalk(connection, postId);
    connection.release();
    console.log(detailResult);
    return detailResult;
  };
