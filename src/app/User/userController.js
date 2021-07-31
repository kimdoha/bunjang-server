const request = require('request');
const {pool} = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const secret_config = require("../../../config/secret");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const userDao = require("./userDao");

const regexEmail = require("regex-email");
const {emit, addListener} = require("nodemon");

const jwt = require("jsonwebtoken");


/**
 * API No. 1
 * API Name : 카카오 로그인 API
 * [POST] /login
 * body : accessToken
 */
exports.login = async function (req, res) {

    const accessToken = req.body.accessToken;
    // console.log(accessToken);
  
    let userName, token;

    const promise = new Promise((resolve, reject) => {

        const kakao = request.get({
            url: "https://kapi.kakao.com/v1/user/access_token_info",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }, async (res, body) => {
            try {
                console.log('유효:', JSON.parse(body.body));
    
                //사용자 정보 조회
                request.get({
                    url: "https://kapi.kakao.com/v2/user/me",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }, async (res, body) => {
                    try {
                        const kakaoId = JSON.parse(body.body).id;
    
                        console.log('카카오 Id :', kakaoId);
                        console.log('사용자 정보 결과 :', JSON.parse(body.body));
                        
                        // kakao Id 존재 여부
                        const isExist = await userProvider.retrieveUser(kakaoId);
                        // 신규 회원 
                        console.log(isExist);
                        if(isExist.exist === 0)
                        {
                            const id = await userProvider.nextUserId();
                        
                            // 상점 이름 생성 
                            userName = String(id);
                            userName = userName.length >= 8 ? userName:new Array(8-userName.padEnd.length+1).join('0')+userName;
                            userName = '상점' + userName + '호';

                            const newUser = await userService.createUser(userName, kakaoId);
                        }
                  
                    // 계정 상태 확인
                    const userInfoRows = await userProvider.statusCheck(kakaoId);
                    console.log("??",userInfoRows[0].status);

                    if (userInfoRows[0].status != 0) {

                        console.log("id",userInfoRows[0].userId) // DB의 userId
                        console.log(userInfoRows[0]);
                        
                        //토큰 생성 Service
                        token = await jwt.sign(
                            {
                                userId: userInfoRows[0].userId,
                            }, // 토큰의 내용(payload)
                            secret_config.jwtsecret, // 비밀키
                            {
                                expiresIn: "365d",
                                subject: "userId",
                            } // 유효 기간 365일
                        );
                    }

                    const info = {
                        status : userInfoRows[0].status,
                        userId: userInfoRows[0].userId,
                        tokenId: token
                    };
            
                    resolve(info); 
               
    
                    } catch (err) {
                        console.log('사용자:', err);
                        return false;
                    }
                });
            } catch (err) {
                console.log('유효:', err);
                return false;
            }
        });
    });
    
    promise.then((info) => {
        userId = info.userId;
        token = info.tokenId
        status = info.status;

        if(status === 0){
            return res.json(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));
            
        }
        if(!token){
            return res.json(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE ));
        }
        
        return  res.send({ isSuccess:true, code:1000, message:"로그인 되었습니다!", "result": { id: userId, jwt: token }});
    });
    
};


/**
 * API No. 2
 * API Name : 카카오 로그아웃 API
 * [POST] /logout
 */

 exports.logout = async function (req, res) {

    const accessToken = req.body.accessToken;
    console.log(accessToken);
  
    const promise = new Promise((resolve, reject) => {

        const kakao = request.post({
            url: "https://kapi.kakao.com/v1/user/logout",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }, async (res, body) => {
            try {
                console.log('유효:', JSON.parse(body.body));
    
                //사용자 정보 조회
                request.get({
                    url: "https://kapi.kakao.com/v2/user/me",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }, async (res, body) => {
                    try {
                        const kakaoId = JSON.parse(body.body).id;
                        console.log(kakaoId);
                        resolve(kakaoId);
    
                    } catch (err) {
                        // 사용자가 조회되지 않습니다.
                        console.log('사용자:', err);
                        //res.json(baseResponse.);
                        return false;
                    }
                });
            } catch (err) {
                console.log('유효:', err);
                // 이미 로그 아웃 된 사용자 입니다.
                //res.json(baseResponse.);
                return false;
            }
        });
    });
    promise.then((kakaoId) => {
        return res.json({ isSuccess:true, code:1000, message:"로그아웃 되었습니다!", id: kakaoId });
    });
};


/** JWT 토큰 검증 API
 * [POST] /autologin
 */
exports.autologin = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response({ "isSuccess": true, "code": 1000, "message":"자동로그인 성공" }));
};



/**
 * API No. 5
 * API Name : 배송지 등록 추가 API (+ 네이버 지역검색 API 연동)
 * [GET] /user/address
 * 
 */
 const NAVER_CLIENT_ID     = ''
 const NAVER_CLIENT_SECRET = ''
 const rp= require("request-promise");


exports.registerAddress = async function (req, res) {

    /**
     * Path Variable: userId
     * Query String: search
     */

    const userId = req.verifiedToken.userId
    let { search, main } = req.query;
    

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    if (!search){   
        const sameAddressResult = await userProvider.sameAddress(userId, split);
        if(sameAddressResult.length > 0)
            return res.send(errResponse(baseResponse.ADDRESS_REGISTER_IMPOSSIBLE));

    } else {
        var regExp = /읍|면|동/g;

        if(!regExp.test(search))
            return res.send(response(baseResponse.ADDRESS_INPUT_EMPTY ));
        
        const option = {
            query  :search,
            display:1, //검색 결과 출력 
            start  :1, //검색 시작 위치
            sort   :'random' //정렬 유형 (sim:유사도)
        }
        const options = {
            uri: "https://openapi.naver.com/v1/search/local.json",
            method: "GET",
            qs : option,
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
            }
        }

        const cb = await rp(options);
        var accountObj = JSON.parse(cb);
        console.log(accountObj);

        if(accountObj.total < 1)
            return res.send(errResponse(baseResponse.ADDRESS_NOT_MATCH));

        var sub1 = "읍", sub2 = "면" , sub3 = "동";
        var address = accountObj.items[0].address;

        console.log(address);
        var end, split = "";

        if(address.includes(sub1)){
            end = address.indexOf(sub1);
            split = address.substring(0 , end+1);
        } else if(address.includes(sub2)){
            end = address.indexOf(sub2);
            split = address.substring(0 , end+1);
        } else if(address.includes(sub3)){
            end = address.indexOf(sub3);
            split = address.substring(0 , end+1);
        } 
        console.log(split);

            
        const sameAddressResult = await userProvider.sameAddress(userId, split);
        if(sameAddressResult.length > 0)
            return res.send(errResponse(baseResponse.ADDRESS_REGISTER_IMPOSSIBLE));

        const addressResult = await userService.registerAddress(userId, split, main);
        return res.send(addressResult);
    }
};





