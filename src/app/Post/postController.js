const request = require('request');
const {pool} = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const postProvider = require("../../app/Post/postProvider");
const cateProvider = require("../../app/Category/cateProvider");
const secret_config = require("../../../config/secret");
const postService = require("../../app/Post/postService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const postDao = require("./postDao");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const jwt = require("jsonwebtoken");

/**
 * API No. 13
 * API Name : 상품 등록 API
 * [POST] /post
 * body : accessToken
 */
	
 exports.writePost = async function (req, res){
    const userId = req.verifiedToken.userId; // 내 아이디
    var { 
        productImage, productName, 
        categoryId, subCategoryId, thirdCategoryId,
        price, changePrice, containDelivery,
        setMyPlace, content, count, productCondition, isExchange, tag } = req.body;

    // 빈 값 체크
    if (!productImage)
        return res.send(response(baseResponse.POST_IMAGE_EMPTY));
    if (productImage.length > 12)
        return res.send(response(baseResponse.POST_IMAGE_LENGTH));
    if(!categoryId || !subCategoryId || !thirdCategoryId)
        return res.send(response(baseResponse.POST_CATE_EMPTY));
    if (!price || price < 100)
        return res.send(response(baseResponse.POST_PRICE_EMPTY));
    if(!productName || productName.length < 2)
        return res.send(response(baseResponse.POST_NAME_LENGTH));
    if(tag){
        if(tag.length > 5)
            return res.send(response(baseResponse.POST_TAG_LENGTH));
    }
    if(content){
        if(content.length > 2000)
        return res.send(response(baseResponse.POST_CONTENT_LENGTH ));
    }
    if(!changePrice) changePrice = 0;
    if(!containDelivery) containDelivery = 0;
    if(!productCondition ) productCondition = 0;
    if(!isExchange) isExchange = 0;
    if(!count) count = 0;

    if((changePrice != 0 && changePrice != 1) || (containDelivery != 0 && containDelivery != 1)|| 
    (productCondition != 0 && productCondition != 1) ||  (isExchange != 0 && isExchange != 1)){
        return res.send(response(baseResponse.INPUT_BOOLEAN));
    }

    // 지역 설정 
    let place;
    if(setMyPlace == 0) place = "지역설정 안함";
    else{
        const [placeResult] = await postProvider.retrieveMyPlace(userId);
        place = placeResult.address;
    }

    // categoryId & subCategoryId 유효성 검사
    const matchResult = await cateProvider.categoryCheck(categoryId, subCategoryId); 
    if(matchResult.exist < 1)
        return res.send(response(baseResponse.SUBCATEGORY_EMPTY));

    // subCategoryId & thirdCateoryId 유효성 검사
    const matchResult2 = await cateProvider.categoryCheck2(subCategoryId, thirdCategoryId); 
        if(matchResult2.exist < 1)
            return res.send(response(baseResponse.THIRD_CATEGORY_EMPTY));

    const postParams = [ userId, productName, 
        categoryId, subCategoryId, thirdCategoryId,
        price, changePrice, setMyPlace, place, 
        containDelivery, content, productCondition, isExchange, count];
    
    // 게시글 등록 
    const writeResponse = await postService.createPost(postParams, productImage, tag);
    return res.send(writeResponse);
};

/**
 * API No. 14
 * API Name : 상품 게시글 상세 조회 API
 * [POST] /post/:postId
 * body : accessToken
 */
exports.viewProductDetail = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const postId = req.params.postId;

    if(!postId)
        return res.send(response(baseResponse.POST_ID_EMPTY));

   // 숫자 형식 체크
   var regExp = /^[0-9]+$/;
   if(!regExp.test(postId))
       return res.send(response(baseResponse.INPUT_NUMBER));

    // 조회 가능한 게시글인지 확인
    const [isExist] = await postProvider.isExistPost(postId);
    if(!isExist)
        return res.send(response(baseResponse.POST_SEARCH_NOT));
    
    const detailInfo = await postProvider.retrievePostView(postId);
    if(detailInfo.length < 1)
        return res.send(baseResponseStatus.SEARCH_RESULT_EMPTY);
    const result = { detailInfo };

    const otherProducts = await postProvider.retrieveOtherProductView(postId);
    if(otherProducts){
        Object.assign(result , {"OtherProducts" : JSON.parse(JSON.stringify(otherProducts))});
    }

    const storeReview = await postProvider.retrieveReview(postId);
    if(storeReview){
        Object.assign(result , {"StoreReview" : JSON.parse(JSON.stringify(storeReview))});
    }
    
    return res.send(response( { "isSuccess": true, "code": 1000, "message":"상품 게시글 상세정보 조회 성공" }, result ));
};

/**
 * API No. 15
 * API Name : 상품 정보 수정 API
 * [PATCH] /post/:postId
 * path variable : postId
 * body : nickname
 */
exports.patchProduct = async function (req, res) {

    // jwt - userId, path variable :userId

    const userId = req.verifiedToken.userId; // 내 아이디
    const postId = req.params.postId;
    var { 
        productImage, productName, 
        categoryId, subCategoryId, thirdCategoryId,
        price, changePrice, containDelivery,
        setMyPlace, content, count, productCondition, isExchange, tag } = req.body;

    // 빈 값 체크
    if (!productImage)
        return res.send(response(baseResponse.POST_IMAGE_EMPTY));
    if (productImage.length > 12)
        return res.send(response(baseResponse.POST_IMAGE_LENGTH));
    if(!categoryId || !subCategoryId || !thirdCategoryId)
        return res.send(response(baseResponse.POST_CATE_EMPTY));
    if (!price || price < 100)
        return res.send(response(baseResponse.POST_PRICE_EMPTY));
    if(!productName || productName.length < 2)
        return res.send(response(baseResponse.POST_NAME_LENGTH));
    if(tag.length > 5)
        return res.send(response(baseResponse.POST_TAG_LENGTH));
    if(content.length > 2000)
        return res.send(response(baseResponse.POST_CONTENT_LENGTH ));

    if(!changePrice) changePrice = 0;
    if(!containDelivery) containDelivery = 0;
    if(!productCondition ) productCondition = 0;
    if(!isExchange) isExchange = 0;
    if(!count) count = 0;

    if((changePrice != 0 && changePrice != 1) || (containDelivery != 0 && containDelivery != 1)|| 
    (productCondition != 0 && productCondition != 1) ||  (isExchange != 0 && isExchange != 1)){
        return res.send(response(baseResponse.INPUT_BOOLEAN));
    }

    // 지역 설정 
    let place;
    if(setMyPlace == 0) place = "지역설정 안함";
    else{
        const [placeResult] = await postProvider.retrieveMyPlace(userId);
        place = placeResult.address;
    }

    // categoryId & subCategoryId 유효성 검사
    const matchResult = await cateProvider.categoryCheck(categoryId, subCategoryId); 
    if(matchResult.exist < 1)
        return res.send(response(baseResponse.SUBCATEGORY_EMPTY));

    // subCategoryId & thirdCateoryId 유효성 검사
    const matchResult2 = await cateProvider.categoryCheck2(subCategoryId, thirdCategoryId); 
        if(matchResult2.exist < 1)
            return res.send(response(baseResponse.THIRD_CATEGORY_EMPTY));
   
    // 게시글 등록 
   const updatePostResult = await postService.updatePost(postId, postParams, productImage, tag);
   return res.send(updatePostResult);
};



/**
 * API No. 16
 * API Name : 다른 구매자가 함께 본 상품 조회 API
 * [GET] /post/recommend/:postId
 * Header : accessToken
 */
 exports.recommendProduct = async function (req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const postId = req.params.postId;

    if(!postId)
        return res.send(response(baseResponse.POST_ID_EMPTY));

   // 숫자 형식 체크
   var regExp = /^[0-9]+$/;
   if(!regExp.test(postId))
       return res.send(response(baseResponse.INPUT_NUMBER));

    // 조회 가능한 게시글인지 확인
    const [isExist] = await postProvider.isExistPost(postId);
    if(isExist.length < 1)
        return res.send(response(baseResponse.POST_SEARCH_NOT));
    
    const recommendResult = await postProvider.recommendProduct(postId);
    if(recommendResult.length < 1)
        return res.send(baseResponseStatus.SEARCH_RESULT_EMPTY);


    return res.send(response( { "isSuccess": true, "code": 1000, "message":"다른 구매자가 함께 본 상품 조회 성공" }, recommendResult ));
};



