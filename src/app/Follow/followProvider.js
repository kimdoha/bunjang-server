const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const followDao = require("./followDao");


exports.existFollowID = async function (followId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const followResult = await followDao.existFollowID(connection,followId);
  
    connection.release();
  
    return followResult;
  };

exports.existFollow = async function (userId, followId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followResult = await followDao.existFollow(connection, userId, followId);

  connection.release();

  return followResult;
};

exports.followStatus = async function (userId, followId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followStatusResult = await followDao.followStatus(connection, userId, followId);
  connection.release();

  return followStatusResult;
};

exports.retrieveRecommend = async function (userId, size) {

    const connection = await pool.getConnection(async (conn) => conn);
    const recommendListResult = await followDao.recommendStore(connection, userId, size);
    connection.release();

    return recommendListResult ;
};

exports.retrieveMyFeed = async function (userId, page, size) {
  const connection = await pool.getConnection(async (conn) => conn);
  const feedResult = await followDao.selectMyFeed(connection, userId, page, size);
  connection.release();

  return feedResult;
};
