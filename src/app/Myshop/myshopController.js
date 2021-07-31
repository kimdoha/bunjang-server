const request = require('request');
const {pool} = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const myshopProvider = require("../../app/Myshop/myshopProvider");
const secret_config = require("../../../config/secret");
const myshopService = require("../../app/Myshop/myshopService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const myshopDao = require("./myshopDao");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const jwt = require("jsonwebtoken");
const e = require('express');



/**
 * API No. 7
 * API Name : 나의 찜컬렉션 조회 API
 * [GET] /collection
 */

 exports.viewCollection = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    const collectionResult = await myshopProvider.retrieveCollection(userId);
    if(collectionResult.length < 1){
        const collectionEmptyResult = await myshopProvider.retrieveEmptyCollection(userId);
    }
    return res.send(response( { "isSuccess": true, "code": 1000, "message":"나의 찜 컬렉션 조회 성공" }, collectionResult  ));
};


/**
 * API No. 8
 * API Name : 나의 찜컬렉션 생성 API
 * [POST] /collection
 */

 exports.createCollection = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const {colname} = req.body;
    if(!colname || colname.length < 1)
        return res.send(errResponse(baseResponse.COLLECTION_EMPTY));
    
    if(colname.length > 10)
        return res.send(errResponse(baseResponse.COLLECTION_LENGTH));

   const collectionResult = await myshopService.madeCollection(userId, colname);
   return res.send(collectionResult);
};

/**
 * API No. 9
 * API Name : 나의 찜컬렉션 수정 및 삭제 API
 * [POST] /collection/:collectionId
 */

 exports.patchCollection = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const collectionId = req.params.collectionId;
    const {colname} = req.body;

    if(!collectionId)
        return res.send(errResponse(baseResponse.COLLECTION_ID_EMPTY));

    // 숫자 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(collectionId))
        return res.send(response(baseResponse.INPUT_NUMBER));
    
    if(collectionId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));
    
    // 수정 
    if(colname){
        if(!colname || colname.length < 1)
        return res.send(errResponse(baseResponse.COLLECTION_EMPTY));

        if(colname.length > 10)
        return res.send(errResponse(baseResponse.COLLECTION_LENGTH));

        const collectionResult = await myshopService.editCollection(userId, collectionId, colname);
        return res.send(collectionResult);
    }  // 삭제
    else {
        // 활성된 컬렉션(status == 1) 이 아니면 ,
        const [existCollection] = await myshopProvider.existCollection(collectionId);
        if(existCollection.exist == 0)
            return res.send(errResponse(baseResponse.COLLECTION_REMOVE));
        console.log(existCollection);
        const collectionResult = await myshopService.removeCollection(userId, collectionId);
        return res.send(collectionResult);
    }
};

/**
 * API No. 7
 * API Name : 나의 찜컬렉션 조회 API
 * [GET] /collection/:collectionId/jjim?status
 */

 exports.viewJjimInCollection = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const collectionId = req.params.collectionId;
    const status = req.query.status;

    if(!collectionId)
    return res.send(errResponse(baseResponse.COLLECTION_ID_EMPTY));

    if(!status)
        return res.send(errResponse(baseResponse.INPUT_STATUS_BOOLEAN ));

    // 숫자 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(collectionId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    if(collectionId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));

    if(status != 0 && status != 1)
        return res.send(response(baseResponse.INPUT_STATUS_BOOLEAN));

    if(status == 0){
        const [collectionJjimResult1] = await myshopProvider.retrieveJjimCollection1(collectionId);
        if(collectionJjimResult1.length < 1){
            return res.send(response(baseResponse.JJIM_EMPTY));
        }
        return res.send(response( { "isSuccess": true, "code": 1000, "message":"[판매중] 해당 컬렉션 찜한상품 조회 성공" }, collectionJjimResult1  ));
    } else {
        const [collectionJjimResult2] = await myshopProvider.retrieveJjimCollection2(collectionId);
        console.log(collectionJjimResult2);
        if(collectionJjimResult2.length < 1){
            return res.send(response(baseResponse.JJIM_EMPTY));
        }
        return res.send(response( { "isSuccess": true, "code": 1000, "message":"[판매예약·완료] 해당 컬렉션 찜한상품 조회 성공" }, collectionJjimResult2  ));
    }
        
};


/**
 * API No. 10
 * API Name : 상품 찜 + 찜 해제 API
 * [POST] /jjim/collection/:collectionId/:postId
 */

 exports.createjjim= async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const collectionId = req.params.collectionId;
    const postId = req.params.postId;

    if(!collectionId)
        return res.send(errResponse(baseResponse.COLLECTION_ID_EMPTY));

    if(!postId)
        return res.send(errResponse(baseResponse.POST_ID_EMPTY ));

    // 숫자 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(collectionId) || !regExp.test(postId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    if(collectionId == 0 || postId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));

    // collectionId 존재 유무
    const existCollection = await myshopProvider.existCollection(collectionId);
    if(existCollection.exist == 0)
        return res.send(errResponse(baseResponse.COLLECTION_REMOVE));


    const [checkStatus] = await myshopProvider.jjimExist(collectionId, postId);
    const [jjimStatus] = await myshopProvider.jjimStatus(collectionId, postId);

    if (checkStatus.exist == 0) {
        const addJjim = await myshopService.doJjim(collectionId, postId);
        return res.send(addJjim);
    } else {
        if (jjimStatus.status == 1) {
            const updateJjimDelete = await myshopService.deleteJjim(collectionId, postId);
            return res.send(updateJjimDelete);
        } else {
            const updateJjimAdd = await myshopService.updateJjim(collectionId, postId);
            return res.send(updateJjimAdd);
        }
    }
};

/**
 * API No. 33
 * API Name : 마이샵 메인화면 조회 API
 * [GET] /myshop
 */

 exports.viewMyShop = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    const userInfo = await myshopProvider.retrieveUserInfo(userId);

    const reviewInfo = await myshopProvider.retrieveReviewInfo(userId);

    const jjimInfo = await myshopProvider.retrieveJjimInfo(userId);
    const [ followerCountResult ] = await myshopProvider.retrieveFollowerCount(userId);
    const followerNum = followerCountResult.total;

    const [ follwingCountResult ] = await myshopProvider.retrieveFollowingCount(userId);
    const followingNum = follwingCountResult.total;

    const result = { 
        "UserData" : JSON.parse(JSON.stringify(userInfo)), 
        "ReviewData" : JSON.parse(JSON.stringify(reviewInfo)), 
        "JjimData" : JSON.parse(JSON.stringify(jjimInfo)),
        "Follower" : followerNum , 
        "Following": followingNum 
    };

    const [mySellInfo] = await myshopProvider.retrieveMySellnfo(userId);
    if(mySellInfo){
        Object.assign(result , {"MySellInfo" : JSON.parse(JSON.stringify(mySellInfo))});
    }
    const [mySelledInfo] = await myshopProvider.retrieveMySellednfo(userId);
    if(mySelledInfo){
        Object.assign(result, {"MySoldInfo" : JSON.parse(JSON.stringify(mySelledInfo))});
    }

    return res.send(response( { "isSuccess": true, "code": 1000, "message":"마이샵 메인화면 조회 성공" }, result));
};


/**
 * API No. 34.
 * API Name : 마이샵 정보수정 API
 * [PATCH] /myshop
 */

 exports.patchMyShop = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    console.log("userId >>", userId);
    var {
        username, profileImg, storeurl, contactTime1, contactTime2,
        introduction, policy, caution } = req.body;
    // 회원 존재 유무
    const isExistUser = await myshopProvider.isExistUser(userId);
    if(isExistUser.length < 1)
        return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

    if(!username){
        const original = await myshopProvider.retrieveUserInfo(userId);
        username = original.userName;
    } else {
        // 한글 + 영어 + 숫자만 
        var regExp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
        if(!regExp.test(username))
            return res.send(response(baseResponse.USERNAME_INPUT));
        if(username.length > 10)
            return res.send(response(baseResponse.USERNAME_INPUT));
    }

    if(storeurl)
        storeurl = 'http://shop.bunjang.co.kr/' + storeurl;
    else 
        storeurl = 'http://shop.bunjang.co.kr/';

    if(!contactTime1) contactTime1 = '오전 1시부터';
    if(!contactTime2) contactTime2 = '오전 1시까지';

    if(introduction){
        if(introduction.length > 1000)
            return res.send(response(baseResponse.CONTENT_INPUT ));
    } else introduction = '상점 소개가 없습니다';
    
    if(policy){
        if(policy.length > 1000)
            return res.send(response(baseResponse.CONTENT_INPUT ));
    } else{
        policy = '물품의 상태가 기재된 것과 상이할 경우 배송완료일 기준 7일 이내에 환불 및 반품이 가능합니다.';
    }
    if(caution){
        if(caution.length > 1000)
            return res.send(response(baseResponse.CONTENT_INPUT ));
    } else caution = '판매자에게 구매 전 유의사항을 확인 후 거래해주세요.';
    
    
    const updateResult = await myshopService.updateMyInfo(username, profileImg ,contactTime1, contactTime2, policy, storeurl,
        caution, introduction, userId);
    return res.send(updateResult);
};

/**
 * API No. 34
 * API Name : 마이샵 + 다른 샵 정보조회 API
 * [GET] /myshop/:userId
 */

 exports.viewMyShopInfo = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const otherId = req.params.userId;

    const result = {};
    const userInfo = await myshopProvider.retrieveUserDetailInfo(otherId);
    if(userInfo){
        Object.assign(result , {"UserData" : JSON.parse(JSON.stringify(userInfo))});
    }
    const userProductInfo = await myshopProvider.retrieveUserProductInfo(otherId);
    if(userProductInfo){
        Object.assign(result , {"ProductData" : JSON.parse(JSON.stringify(userProductInfo))});
    }
    const userReviewInfo = await myshopProvider.retrieveReview(otherId);
    if(userReviewInfo){
        Object.assign(result , {"ReviewData" : JSON.parse(JSON.stringify(userReviewInfo))});
    }

    console.log(result);
    return res.send(response( { "isSuccess": true, "code": 1000, "message":"상점 조회 성공" }, result));
};

/**
 * API No. 36
 * API Name : 최근 본 상품 조회 API
 * [GET] /myshop/mylook
 */

 exports.viewWatched = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    const lookedResult = await myshopProvider.retrieveLookedProduct(userId);
    if(lookedResult.length < 1)
        return res.send(errResponse(baseResponse.LOOKED_PRODUCT_EMPTY));

    return res.send(response( { "isSuccess": true, "code": 1000, "message":"최근 본 상품 조회 성공" }, lookedResult  ));
};


/**
 * API No. 36
 * API Name : 내 상점 리뷰 조회 API
 * [GET] /myshop/review/user/:userId
 */

 exports.viewReview = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const searchId = req.params.userId;   // 찾고자 하는 아이디
    if(!searchId)
        return res.send(errResponse(baseResponse.REVIEW_ID_EMPTY));

    if(userId == searchId){
        const reviewResult = await myshopProvider.retrieveReview(userId);
        if(reviewResult.length < 1)
            return res.send(errResponse(baseResponse.SEARCH_REVIEW_EMPTY));
        
        return res.send(response( { "isSuccess": true, "code": 1000, "message":"내 리뷰 조회 성공" }, reviewResult ));

    } else {
        const isExistUser = await myshopProvider.isExistUser(searchId);
        if(isExistUser.length < 1)
            return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
        
        // 해당 유저의 리뷰가 존재 하는지
        const reviewResult = await myshopProvider.retrieveReview(searchId);
        if(reviewResult.length < 1)
            return res.send(errResponse(baseResponse.SEARCH_REVIEW_EMPTY));
        
        return res.send(response( { "isSuccess": true, "code": 1000, "message":"다른 상점 리뷰 조회 성공" }, reviewResult ));
    }
};

/**
 * API No. 38
 * API Name : [팔로잉] 내 팔로워 조회 API
 * [GET] /myshop/follower
 */

 exports.viewMyFollower = async function (req, res) {
    const followId = req.verifiedToken.userId; // 내 아이디

    const followerResult = await myshopProvider.retrieveFollower(followId);
    if(followerResult.length < 1)
        return res.send(errResponse(baseResponse.SEARCH_RESULT_EMPTY ));

    const [ followerCountResult ] = await myshopProvider.retrieveFollowerCount(followId);
    const num = followerCountResult.total;
    if(num < 1)
        return res.send(errResponse(baseResponse.FOLLOWER_STORE_EMPTY));
    
    let count = 0;
    let totalData = [];

  while (count < num) {
        let userId = JSON.parse(JSON.stringify(followerResult))[count].userId;
        console.log(userId, followId);
        const [ infoRows ] = await myshopProvider.getFollowerInfo(userId, followId);         
        console.log(infoRows);

        totalData[count] = infoRows;
        count += 1;
  }

    return res.send(response( { "isSuccess": true, "code": 1000, "message":"내 팔로워 조회 성공" }, totalData ));
};


/**
 * API No. 39
 * API Name : [팔로잉] 내 팔로잉 조회 API
 * [GET] /myshop/following
 */

 exports.viewMyFollowing = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    const follwingResult = await myshopProvider.retrieveFollowing(userId);
    if(followingResult.length < 1)
        return res.send(errResponse(baseResponse.SEARCH_RESULT_EMPTY));

    const [ follwingCountResult ] = await myshopProvider.retrieveFollowingCount(userId);
    const num = follwingCountResult.total;
    if(num < 1)
        return res.send(errResponse(baseResponse.FOLLOWING_STORE_EMPTY));

    let count = 0;
    let totalData = [];

  while (count < num) {
        let followId = JSON.parse(JSON.stringify(follwingResult))[count].followId;
        var getFollowingParams = [ userId, followId ];

        const [ infoRows ] = await myshopProvider.getFollowInfo(userId, followId);         
        const [ productRows ] = await myshopProvider.followProductInfo (userId, followId); 
        

        const result = { userData: infoRows, postData: productRows };

        totalData[count] = result;
        count += 1;
  }

    return res.send(response( { "isSuccess": true, "code": 1000, "message":"내 팔로잉 조회 성공" }, totalData ));
};


