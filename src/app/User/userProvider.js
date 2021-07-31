const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (kakaoId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectKakaoId(connection, kakaoId);

  connection.release();

  return userResult[0];
};

exports.nextUserId = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const nextIdResult = await userDao.selectNextUserId(connection);
  connection.release();

  return nextIdResult;
};

// exports.passwordCheck = async function (selectUserPasswordParams) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const passwordCheckResult = await userDao.selectUserPassword(
//       connection,
//       selectUserPasswordParams
//   );
//   connection.release();
//   return passwordCheckResult[0];
// };

exports.statusCheck = async function (kakaoId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userStatusResult = await userDao.selectUserStatus(connection, kakaoId);
  connection.release();

  return userStatusResult;
};


exports.addressIsFirst = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const addressInfo = await userDao.addressInfoExist(connection, userId);
  connection.release();

  return addressInfo;
};


exports.sameAddress = async function (userId, split) {
  const connection = await pool.getConnection(async (conn) => conn);
  const addressInfo = await userDao.selectSameAddress(connection, userId, split);
  connection.release();

  return addressInfo;
};