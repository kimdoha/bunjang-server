const request = require('request');
const {pool} = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const talkProvider = require("../../app/Talk/talkProvider");
const secret_config = require("../../../config/secret");
const talkService = require("../../app/Talk/talkService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const talkDao = require("./talkDao");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const jwt = require("jsonwebtoken");

exports.main = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디

    const talkMainResult = await talkProvider.retrieveTalkMain(userId);
    if(talkMainResult.length < 1){
        return res.send(errResponse(baseResponse.BUNGAETALK_SEARCH_NOT));
    }
    return res.send(response( { "isSuccess": true, "code": 1000, "message":" 번개톡 메인화면 조회 성공" }, talkMainResult ));
};
/**
 * API No. 12
 * API Name : 특정 번개톡 세부화면 조회 API
 * [POST] /talk/post/:postId
 */
 exports.detail = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const postId = req.params.postId;

    const result = {};
    //console.log(userId, postId);

    const productInfo = await talkProvider.retrieveTalkProductInfo(postId);
    if(productInfo){
        Object.assign(result , {"ProductInfo" : JSON.parse(JSON.stringify(productInfo))});
    }
    const messageInfo = await talkProvider.retrieveTalkDetail(postId);
    if(messageInfo){
        Object.assign(result, {"MessageList" : JSON.parse(JSON.stringify(messageInfo))});
    }

    return res.send(response( { "isSuccess": true, "code": 1000, "message":" 번개톡 특정 세부화면 조회 성공" }, result ));
};

/**
 * API No. 27
 * API Name : 번개톡 메세지 보내기 API
 * [POST] /talk/post/:postId
 */

 exports.sendMessage = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const postId = req.params.postId;

    if(!postId)
        return res.send(response(baseResponse.POST_ID_EMPTY));

   // 숫자 형식 체크
   var regExp = /^[0-9]+$/;
   if(!regExp.test(postId))
       return res.send(response(baseResponse.INPUT_NUMBER));

    // 조회 가능한 게시글인지 확인
    const [isExist] = await talkProvider.isExistPost(postId);
    if(!isExist)
        return res.send(response(baseResponse.POST_SEARCH_NOT));
    console.log(isExist);
    
    let { messageType } = req.query;
    if(!messageType)
        return res.send(response(baseResponse.BUNGAE_TYPE_EMPTY));

    if(messageType != 0 && messageType != 1)
        return res.send(response(baseResponse.BUNGAE_INPUT_BOOLEAN));

    let roomId;

    // 까먹으면 안댐 receiveId- sendId 는 계속 바껴
    if(messageType == 0){
        const talkStatus = await talkProvider.existRoom(userId, postId);
        const { receiveId, sendId, content } = req.body;

        if(talkStatus.exist == 0){
            const startTalk = await talkService.startTalk(receiveId, sendId, postId);
        } 

        if(sendId == receiveId) // 메세지를 보낼 수 없습니다.
            return res.send(response(baseResponse.BUNGAE_INDEX_WRONG));

        const roomIdResult = await talkProvider.retrieveRoomID(sendId, receiveId, postId);
        console.log(roomIdResult);
        roomId = roomIdResult.roomId;
        console.log(roomId);

        // 룸아이디를 얻어서 밑에다가 적용
        const createMessage = await talkService.sendTalk( roomId, receiveId, sendId, content, messageType );
        return res.send(createMessage);

    } else if (messageType == 1){
        // 상품에 대한 정보 저장
        const productInfo = await talkProvider.retrieveProductInfo(postId);
        console.log("productInfo >> ", productInfo);

        const sellerIdResult = await talkProvider.retrieveSeller(postId);
        const sellerId = sellerIdResult.userId;
        const existPayId = await talkProvider.isExistPayId(postId, userId, sellerId);
        if(existPayId.exist == 0 ){ // payId를 생성한다.
            const createPay = await talkService.createPayId( postId, userId, sellerId);
        } 
        const payIdResult = await talkProvider.retrievePayId(postId, userId, sellerId);
        const payId = payIdResult.payId;



        const { paystep } = req.query;
        if(paystep == 1){ // 계좌 전송
            const { receiveId, sendId, bankName, sendName, comment } = req.body;

            // 메세지를 보낼 수 없습니다.
            if(sendId == receiveId)
                return res.send(response(baseResponse.BUNGAE_INDEX_WRONG));
  

            const talkStatus = await talkProvider.existRoom(userId, postId);
            // 처음 대화를 주고 받는다
            if (talkStatus.exist == 0){
                const startTalk = await talkService.startTalk(receiveId, sendId, postId);
            }
            const roomIdResult = await talkProvider.retrieveRoomID(sendId, receiveId, postId);
            roomId = roomIdResult.roomId;
            //=> productname, productprice  상품명 불러오기

            // MyAddress 에서 배송지 있는지 
            const addressInfo = await talkProvider.retrieveMyFirstAddress(userId);
            console.log("address Info>> ",addressInfo);
            if(addressInfo){
                // 계좌 전송 메세지 생성
                let content = "거래가 합의되었습니다.\n판매자에게 입금확인을 요청합니다.\n거래완료 후 인증후기를 남길 수 있습니다.\n\n상품명 :"+productInfo.productName+"\n거래방식: 계좌거래\n총 거래액:"+productInfo.price;
                const createAccountMessage = await talkService.sendAccountTalk( roomId, receiveId, sendId, content, payId, messageType, paystep, bankName, sendName, comment);
                return res.send(createAccountMessage);
            } else { //없으면 기본 배송 주소지 등록해주세요
                return res.send(response(baseResponse.My_REGISTER_ADDRESS));
            }
        } 
        else if(paystep == 2){ // 배송지 전송
            const { receiveId, sendId, userName} = req.body;
            // 메세지를 보낼 수 없습니다.
            if(sendId == receiveId)
                return res.send(response(baseResponse.BUNGAE_INDEX_WRONG));

            const talkStatus = await talkProvider.existRoom(userId, postId);
            // 처음 대화를 주고 받는다
            if (talkStatus.exist == 0) {
                const startTalk = await talkService.startTalk(receiveId, sendId, postId);
            }
            const roomIdResult = await talkProvider.retrieveRoomID(sendId, receiveId, postId);
            roomId = roomIdResult.roomId;
            // MyAddress 에서 배송지 있는지 
            const addressInfo = await talkProvider.retrieveMyFirstAddress(userId);
            if(addressInfo){
                let content = "거래를 승인해 주세요.\n계좌번호/배송지를 확인하고 거래승인버튼을 눌러주세요.\n\n상품명 :"+productInfo.productName+"\n거래방식: 계좌거래\n총 거래액:"+productInfo.price;
                const createAddressMessage = await talkService.sendAddressTalk( roomId, receiveId, sendId, content, payId, messageType, paystep , userName, addressInfo );
                return res.send(createAddressMessage);
            } else return res.send(response(baseResponse.My_REGISTER_ADDRESS));
        } 
       else if(paystep == 3){ // 직거래 약속
            // directDate를 따로 입력하지 않으면 현재 날짜로 !
            const { receiveId, sendId, directDate, directPlace, type } = req.body;
            // 메세지를 보낼 수 없습니다.
            if(sendId == receiveId)
                return res.send(response(baseResponse.BUNGAE_INDEX_WRONG));

            const talkStatus = await talkProvider.existRoom(userId, postId);
            // 처음 대화를 주고 받는다
            if (talkStatus.exist == 0) {
                const startTalk = await talkService.startTalk(receiveId, sendId, postId);
            }
            const roomIdResult = await talkProvider.retrieveRoomID(sendId, receiveId, postId);
            roomId = roomIdResult.roomId;

            let content = "거래를 승인해 주세요.\n계좌번호/배송지를 확인하고 거래승인버튼을 눌러주세요.\n\n상품명 :"+productInfo.productName+"\n거래방식: 계좌거래\n총 거래액:"+productInfo.price;
            const createMeetMessage = await talkService.sendMeetTalk( roomId, receiveId, sendId, content, payId, messageType, paystep, directDate, directPlace, type   );
            return res.send(createMeetMessage);

        } else {    // 잘못된 paystep 입력입니다.
            return res.send(response(baseResponse.BUNGAE_INDEX_SERVICE));
        }
    } else { // 잘못된 메세지 타입 입력입니다.
        return res.send(response(baseResponse.BUNGAE_INDEX_SERVICE));
    }
};

/**
 * API No. 27
 * API Name : 배송지 설정 API
 * [POST] /setting/address
 */

 exports.settingAddress = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    let { index } = req.query; // 주소 선택 인덱스
    const {userName, userPhoneNum, address, detailAddress, asking} = req.body;
    let isMain = req.body.isMain;

    if(!userName)
        return res.send(response(baseResponse.USERNAME_EMPTY));
    if(!userPhoneNum)
        return res.send(response(baseResponse.PHONENUM_EMPTY));
    if(!address)
        return res.send(response(baseResponse.ADDRESS_EMPTY));
    if(!detailAddress)
        return res.send(response(baseResponse.DETAIL_ADDRESS_EMPTY));
    if(!asking)
        return res.send(response(baseResponse.ASKING_EMPTY));
    if(!isMain) isMain = 0;

    // 배송지는 10개까지 추가 가능
    const [countResult] = await talkProvider.countAddress(userId);
    if(countResult > 10)
        return res.send(response(baseResponse.ADDRESS_ENOUGH));

    console.log(countResult);

    // address 로 도로명 검색
    const rp= require("request-promise");
    const currentPage = 1;      // 현재 페이지
    const countPerPage = 50;    // 페이지당 출력 개수
    const resultType = "json";
    const confmKey = "";
    const keyword = address;

    const options = {
        uri:  "https://www.juso.go.kr/addrlink/addrLinkApi.do?currentPage="+currentPage+"&countPerPage="+countPerPage+"&keyword="+encodeURI(keyword,"UTF-8")+"&confmKey="+confmKey+"&resultType="+resultType,
        method: "GET"
    }

    const cb = await rp(options);

    var addressObj = JSON.parse(cb);
    console.log(addressObj.results.juso.length);
    let total = addressObj.results.juso.length;

    const splitAddressResult = await talkProvider.splitAddress(addressObj, total);
    if(splitAddressResult.length < 1)
        return res.send(errResponse(baseResponse. SEARCH_RESULT_EMPTY));

    if(!index) return res.send({ "isSuccess": true, "code": 1000, "message":"도로명 주소 검색 성공", "result": splitAddressResult });
    if(index){
        if(index < total){
           console.log("주소 선택 인덱스 >>",splitAddressResult[index]);
           let roadstr = splitAddressResult[index].roadAddr + '('+splitAddressResult[index].zipNo +')';
           console.log(roadstr);

           const addressResult = await talkService.registerMyAddress(userId, userName, userPhoneNum, roadstr, detailAddress, asking, isMain);
           return res.send(addressResult);
        } else {
            return res.send(response(baseResponse.ADDRESS_INDEX_ENOUGH));
        }
    }
};

/**
 * API No. 28
 * API Name : 배송지 조회 API
 * [POST] /setting/address
 */


 exports.viewAddress= async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    
    const addressResult = await talkProvider.retrieveMyAddress(userId);
    if(addressResult.length < 1)
        return res.send(baseResponseStatus.My_ADDRESS_EMPTY);


    return res.send(response( { "isSuccess": true, "code": 1000, "message":"나의 배송지 조회 성공" }, addressResult));
};



/**
 * API No. 40
 * API Name : 배송지 삭제 API
 * [PATCH] /setting/address/:addressId
 */

 exports.deleteAddress= async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const addressId = req.params.addressId;

    if(!addressId)
        return res.send(errResponse(baseResponse.ADDRESS_ID_EMPTY ));
    const addressExistResult = await talkProvider.isExistAddress(userId, addressId);
    if(addressExistResult.length < 1)
        return res.send(baseResponseStatus.My_ADDRESS_PATCH_NOT );

    const addressResult = await talkService.patchMyAddress(addressId);
    return res.send(addressResult);
};
