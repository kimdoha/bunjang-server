const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (userName, kakaoId) {
    try {

        selectUserParams = [userName, kakaoId];
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const userIdResult = await userDao.insertUserInfo(connection, selectUserParams);
        console.log(`추가된 회원 : ${userIdResult.insertId}`)
        connection.release();
        return;

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 지역 설정하기 
exports.registerAddress = async function (userId, split, main) {
    try {

        userParams = [userId, split, main];
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");


        const userIdResult = await userDao.insertUserAddress(connection, userParams);

        console.log(`추가된 회원 : ${userIdResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message": "지역 설정 성공" }, {"userId": userId, "address": split });

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
