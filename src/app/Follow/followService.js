const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const followProvider = require("./followProvider");
const followDao = require("./followDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


// 팔로잉
exports.doFollow = async function (userId, followId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const followResult = await myshopDao.addFollow(connection, userId, followId);
        console.log(`추가된 회원 : ${followResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"팔로잉이 추가되었습니다." },{ "userId": userId, "followId": followId });

    } catch (err) {
        logger.error(`App - DoFollow Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 팔로잉 취소
exports.deleteFollow = async function (userId, followId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const followResult = await myshopDao.followDelete(connection, userId, followId);
        console.log(`추가된 회원 : ${followResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"팔로잉이 삭제되었습니다." }, {"userId": userId, "followId": followId });

    } catch (err) {
        logger.error(`App - deleteFollow Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 팔로잉 업데이트
exports.updateFollow = async function (userId, followId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const followResult = await myshopDao.updateFollow(connection, userId, followId);
        console.log(`추가된 회원 : ${followResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"팔로잉이 추가되었습니다." }, { "userId": userId, "followId": followId });

    } catch (err) {
        logger.error(`App - UpdateFollow Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

