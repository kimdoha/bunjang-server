const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const postProvider = require("./postProvider");
const postDao = require("./postDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


exports.createPost = async function (postParams, productImage, tag) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");

        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const postResult = await postDao.writePost(connection, postParams);
        console.log(`추가된 포스트 : ${postResult.insertId}`);
        console.log(postResult);

        const postId = postResult.insertId;
        const total = productImage.length;
        let main = 0, cnt = 0;
        while (cnt < total){
            let url = productImage[cnt];
            if(cnt == 0) main = 1;
            else main = 0;
            const postImageResult = await postDao.insertImage(connection, postId, url, main);
            console.log(`추가된 포스트 이미지 : ${postImageResult.insertId}`);
            cnt += 1;
        }
      
        const tagTotal = tag.length;
        cnt = 0;
        while (cnt < tagTotal){
            let tagInput = tag[cnt];
            const postTagResult = await postDao.insertTag(connection, postId, tagInput );
            console.log(`추가된 태그 이미지 : ${postTagResult.insertId}`);
            cnt += 1;
        }
  
        await connection.commit()           //  트랜잭션 적용 끝 
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"상품 등록 성공" }, { "postId": postId });

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - createPost Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.updatePost = async function (postId, postParams, productImage, tag) {
    try {

        const connection = await pool.getConnection(async (conn) => conn);
        console.log("before");

        await connection.beginTransaction()     // 트랜잭션 적용 시작
        const postResult = await postDao.updatePost(connection, postId, postParams);
        console.log(`수정된 포스트 : ${postResult.insertId}`);
        console.log(postResult);

        const total = productImage.length;
        let main = 0, cnt = 0;
        while (cnt < total){
            let url = productImage[cnt];
            if(cnt == 0) main = 1;
            else main = 0;
            const postImageResult = await postDao.updateImage(connection, postId, url, main);
            console.log(`추가된 포스트 이미지 : ${postImageResult.insertId}`);
            cnt += 1;
        }
      
        const tagTotal = tag.length;
        cnt = 0;
        while (cnt < tagTotal){
            let tagInput = tag[cnt];
            const postTagResult = await postDao.updateTag(connection, postId, tagInput );
            console.log(`추가된 태그 이미지 : ${postTagResult.insertId}`);
            cnt += 1;
        }
  
        await connection.commit()           //  트랜잭션 적용 끝 
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message":"상품 정보 수정 성공" }, { "postId": postId });

    } catch (err) {
        const connection = await pool.getConnection(async (conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - createPost Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
