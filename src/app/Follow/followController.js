const request = require('request');
const {pool} = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const followProvider = require("../../app/Follow/followProvider");
const secret_config = require("../../../config/secret");
const followService = require("../../app/Follow/followService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const followDao = require("./followDao");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const jwt = require("jsonwebtoken");

/**
 * API No. 34
 * API Name : 팔로잉 설정 및 해제 API
 * [POST] /following/:userId
 */

 exports.startOrEnd= async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const followId = req.params.userId;      // 팔로잉 할 유저

    if(!followId)
        return res.send(errResponse(baseResponse.FOLLOW_ID_EMPTY));
    
    const existFollowID = await followProvider.existFollowID(followId);
    if(existFollowID.length < 1)
        return res.send(errResponse(baseResponse.FOLLOW_USER_EMPTY));


    const [checkStatus] = await followProvider.existFollow(userId, followId);
    const [followStatus] = await followProvider.followStatus(userId, followId);

    if (checkStatus.exist == 0) {
        const addFollow = await followService.doFollow(userId, followId);
        return res.send(addFollow);
    } else {
        if (followStatus.follow == 1) {
            const updateFollowDelete = await followService.deleteFollow(userId, followId);
            return res.send(updateFollowDelete);
        } else {
            const updateFollowAdd = await followService.updateFollow(userId, followId);
            return res.send(updateFollowAdd);
        }
    }
};


/**
 * API No. 35
 * API Name : 추천 상점 조회 API
 * [GET] /following/recommend
 */

 exports.viewRecommend = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    const recommendResult = await followProvider.retrieveRecommend(userId);
    if(recommendResult.length < 1)
        return res.send(baseResponseStatus.SEARCH_RESULT_EMPTY);

    return res.send(response( { "isSuccess": true, "code": 1000, "message":"추천 상점 조회 성공" }, recommendResult));
};



/**
 * API No. 36
 * API Name : 팔로잉 상점 소식 조회 API
 * [GET] /following/feed
 */

 exports.viewFeed = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    const size = 50;
    let { page } = req.query;
    if(!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));

    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(page))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 인덱스 0 : X
    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);

    const feedResult = await followProvider.retrieveMyFeed(userId, page, size);

    console.log(feedResult);

    if(feedResult.length < 1)
        return res.send(baseResponseStatus.SEARCH_RESULT_EMPTY);
    return res.send(response( { "isSuccess": true, "code": 1000, "message":"팔로잉상점 소식 조회 성공" }, feedResult));
};

