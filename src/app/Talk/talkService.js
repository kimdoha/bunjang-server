const request = require('request');
const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const talkProvider = require("./talkProvider");
const talkDao = require("./talkDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


// 번개톡
exports.sendTalk = async function (roomId, receiveId, sendId, content, messageType ) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const infoParams = [roomId, receiveId, sendId, content, messageType ];
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const talkResult = await talkDao.sendCommonTalk(connection, infoParams);
        console.log(`추가된 회원 : ${talkResult.insertId}`)

        const talkListResult = await talkDao.selectTalkMessage(connection, roomId, receiveId, sendId);

        await connection.commit()
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"일반 번개톡 메세지 전송 성공" }, {"result": talkListResult});

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback();
        connection.release();

        logger.error(`App - Send Talk Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createPayId = async function (postId, userId, sellerId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const payIdResult = await talkDao.insertPayId(connection, postId, userId, sellerId);
        console.log(`추가된 회원 : ${payIdResult.insertId}`)
        connection.release();
        return;

    } catch (err) {
        logger.error(`App - Create PayId Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 계좌 톡
exports.sendAccountTalk = async function (roomId, receiveId, sendId, content, payId, messageType, paystep, bankName, sendName, comment) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before"); 
        const infoParams = [roomId, receiveId, sendId, content,  payId, messageType, paystep ];
        const accountParams = [payId, bankName, sendName, comment ];

        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const talkResult = await talkDao.sendSpecialTalk(connection, infoParams);
        console.log(`추가된 회원 : ${talkResult.insertId}`)
        const talkListResult = await talkDao.selectTalkMessage(connection, roomId, receiveId, sendId);
        const accountListResult = await talkDao.createAccount(connection, accountParams);
        console.log(`추가된 회원 : ${accountListResult.insertId}`)
        await connection.commit()
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"번개톡 입금했어요 전송 성공" }, {"result": talkListResult});

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback();
        connection.release();

        logger.error(`App - Send Talk Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 계좌 톡
exports.sendAddressTalk = async function (roomId, receiveId, sendId, content, payId, messageType, paystep , userName, addressInfo ) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before"); 
        const infoParams = [roomId, receiveId, sendId, content, payId, messageType, paystep ];
        const phoneNumber = addressInfo.userPhoneNum;
        let address = addressInfo.address;
        let zipCode = address.slice(address.length - 6, address.length - 1 );
        address = address.slice(0, address.length - 6);
        const detailAddress = addressInfo.detailAddress;
        const asking = addressInfo.asking;
        const main = addressInfo.isMain;

        const addressParams = [ userName, phoneNumber, zipCode, address, detailAddress, asking, main ];

        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const talkResult = await talkDao.sendSpecialTalk(connection, infoParams);
        console.log(`추가된 회원 : ${talkResult.insertId}`)
        const talkListResult = await talkDao.selectTalkMessage(connection, roomId, receiveId, sendId);
        const addressListResult = await talkDao.createAddress(connection, addressParams);
        console.log(`추가된 회원 : ${addressListResult.insertId}`)
        await connection.commit()
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"번개톡 배송지 보내기 전송 성공" }, {"result": talkListResult});

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback();
        connection.release();

        logger.error(`App - Send Talk Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
// 직거래 톡
exports.sendMeetTalk = async function (roomId, receiveId, sendId, content, payId, messageType, paystep, directDate, directPlace, type) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before"); 
        const infoParams = [roomId, receiveId, sendId, content,  payId, messageType, paystep ];
        const meetParams = [ payId, directDate, directPlace, type];

        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const talkResult = await talkDao.sendSpecialTalk(connection, infoParams);
        console.log(`추가된 회원 : ${talkResult.insertId}`)
        const talkListResult = await talkDao.selectTalkMessage(connection, roomId, receiveId, sendId);
        const meetListResult = await talkDao.createMeet(connection, meetParams);
        console.log(`추가된 회원 : ${meetListResult.insertId}`)
        await connection.commit()
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"번개톡 직거래 약속 전송 성공" }, {"result": talkListResult});

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback();
        connection.release();

        logger.error(`App - Send Talk Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 톡을 처음 하는 경우 
exports.startTalk = async function (receiveId, sendId, postId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before"); 
        const createRoomResult = await talkDao.createRoom(connection, receiveId, sendId, postId);
        console.log(`추가된 회원 : ${createRoomResult.insertId}`);
        connection.release();
        return;

    } catch (err) {
        logger.error(`App - Create Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 톡을 처음 하는 경우 
exports.patchMyAddress = async function (addressId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before"); 
        const deleteResult = await talkDao.patchAddress(connection, addressId);
        console.log(`추가된 회원 : ${deleteResult.insertId}`);
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"배송지 삭제 성공" }, {"addressId": addressId });
        return;

    } catch (err) {
        logger.error(`App - Create Room Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.registerMyAddress = async function (userId, userName, userPhoneNum, roadstr, detailAddress, asking, isMain) {
    try {
        const infoParams = [userId, userName, userPhoneNum, roadstr, detailAddress, asking, isMain];
        const connection = await pool.getConnection(async (conn) => conn);
        
        console.log("before"); 
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const registerResult = await talkDao.insertAddress(connection, infoParams);
        const myAddress = await talkDao.selectMyAddress(connection, userId);

        console.log(`추가된 회원 : ${registerResult.insertId}`);
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"배송지 설정 성공" }, myAddress);

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback();
        logger.error(`App - Create Room Service error\n: ${err.message}`);

        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.patchMyAddress = async function (addressId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const addressResult = await talkDao.patchAddress(connection, addressId);
        console.log(`추가된 회원 : ${addressResult.insertId}`)

        const addressListResult = await talkDao.selectByAddressId(connection, addressId);

        await connection.commit()
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"배송지 삭제하기 성공" }, {"result": addressListResult});

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback();
        connection.release();

        logger.error(`App - Address Patch Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};