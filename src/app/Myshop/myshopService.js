const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const myshopProvider = require("./myshopProvider");
const myshopDao = require("./myshopDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");



exports.updateMyInfo = async function (username, profileImg ,contactTime1, contactTime2, policy, storeurl,
    caution, introduction, userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        console.log("userId >> ", userId);
    

        if(!profileImg){
            console.log("222");
            const infoParams = [ username, contactTime1, contactTime2, 
                policy, storeurl, caution, introduction, userId];
         
            const myInfoResult = await myshopDao.editMyInfo(connection, infoParams);
            console.log(myInfoResult);
            console.log(`수정된 내 정보 : ${myInfoResult.insertId}`)
        } else {
            console.log("333");
            const infoProfileParams = [username, profileImg ,contactTime1, contactTime2, policy, storeurl,
                 caution, introduction, userId];
    
            const myInfoProfileResult = await myshopDao.editMyInfoProfile(connection, infoProfileParams);
            console.log(myInfoProfileResult);   
            console.log(`수정된 내 정보 : ${myInfoProfileResult.insertId}`)
            
        }

        connection.release();

        return response({ "isSuccess": true, "code": 1000, "message":"내 상점 수정하기 성공 " }, { "userId": userId  });

    } catch (err) {
        logger.error(`App - Edit Collection Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.madeCollection = async function (userId, colname) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const collectionResult = await myshopDao.createCollection(connection, userId, colname);
        console.log(`추가된 컬렉션 : ${collectionResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"새 컬랙션 추가 성공" }, { "collectionId": collectionResult.insertId, "collectionName": colname });

    } catch (err) {
        logger.error(`App - made Collection Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 컬렉션 정보 수정 
exports.editCollection = async function (userId, collectionId, colname) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const collectionResult = await myshopDao.editCollection(connection, userId, collectionId ,colname);
        console.log(`수정된 컬렉션 : ${collectionResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"해당 찜컬랙션 수정 성공" }, { "collectionId": collectionId, "collectionName": colname });

    } catch (err) {
        logger.error(`App - Edit Collection Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.removeCollection = async function(userId, collectionId){
    try{

        const connection = await pool.getConnection(async (conn) => conn);
        
        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const deleteJjim = await myshopDao.deleteJjim(connection, collectionId);
        const deleteCollection = await myshopDao.deleteCollection(connection, collectionId);
        console.log(`삭제된 컬렉션 : ${deleteCollection.insertId}`)
        await connection.commit()
        connection.release();

        return response({ "isSuccess": true, "code": 1000, "message": "해당 컬랙션 삭제 성공" }, {"Delete": collectionId });
    }
    catch (err){
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - removeCollection Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 찜
exports.doJjim = async function (collectionId, postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const jjimResult = await myshopDao.addJjim(connection, collectionId, postId);
        console.log(`추가된 찜 : ${jjimResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"찜 완료! 원하는 가격을 먼저 제안해보세요 :)" },{ "collectionId": collectionId, "postId": postId });

    } catch (err) {
        logger.error(`App - DoJjim Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 찜 취소
exports.deleteJjim = async function (collectionId, postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const jjimResult = await myshopDao.jjimDelete(connection, collectionId, postId);
        console.log(`추가된 회원 : ${jjimResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"찜 해제가 완료되었습니다." }, { "collectionId": collectionId, "postId": postId });

    } catch (err) {
        logger.error(`App - deleteJjim Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 찜 업데이트
exports.updateJjim = async function (collectionId, postId) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");
        const jjimResult = await myshopDao.updateJjim(connection, collectionId, postId);
        console.log(`추가된 회원 : ${jjimResult.insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"찜 완료! 원하는 가격을 먼저 제안해보세요 :)" }, { "collectionId": collectionId, "postId": postId });

    } catch (err) {
        logger.error(`App - updateJjim Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};