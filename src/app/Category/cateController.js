const request = require('request');
const {pool} = require("../../../config/database");

const jwtMiddleware = require("../../../config/jwtMiddleware");
const cateProvider = require("../../app/Category/cateProvider");
const secret_config = require("../../../config/secret");
const cateService = require("../../app/Category/cateService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const cateDao = require("./cateDao");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const jwt = require("jsonwebtoken");
const baseResponseStatus = require('../../../config/baseResponseStatus');


/**
 * API No. 17
 * API Name : 메인화면 조회 API
 * [GET] /category
 */

exports.main = async function (req, res) {
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

    const main = await cateProvider.retrieveMain(page, size);
    if(main.length < 1)
        return res.send(baseResponseStatus.SEARCH_RESULT_EMPTY);
    return res.send(response( { "isSuccess": true, "code": 1000, "message":"메인화면 조회 성공" }, main));
};

/**
 * API No. 18
 * API Name : 카테고리 조회 API
 * [GET] /category
 */

exports.category = async function (req, res) {

    const category = await cateProvider.retrieveCategory();
    if(category.length < 1)
        return res.send(baseResponseStatus.CATEGORY_EMPTY);
    return res.send(response( { "isSuccess": true, "code": 1000, "message":"카테고리 조회 성공" }, category));
};

/**
 * API No. 19
 * API Name : 상위 카테고리 메뉴 조회 API
 * [GET] /category/:categoryId/:click
 */
exports.viewCategory = async function (req, res) {

     /**
      * Path Variable: categoryId
      * Query String: click
      */
    const categoryId = req.params.categoryId;
    const click = req.query.click;

    // 빈 값 체크
    if (!categoryId)
        return res.send(response(baseResponse.CATEGORY_ID_EMPTY));
    if (!click) 
        return res.send(response(baseResponse.INPUT_CLICK_BOOLEAN ));


    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(categoryId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 인덱스 0 : X
    if(categoryId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));
    

    // click
    if(click && (click != 0 && click != 1))
        return res.send(response(baseResponse.INPUT_BOOLEAN));
    

    const simpleResult = await cateProvider.retrieveFirstCategory(categoryId, click);
    
    if(click == 0)
        return res.send(response( { "isSuccess": true, "code": 1000, "message": "카테고리 접어보기 성공" }, simpleResult));
    else
        return res.send(response( { "isSuccess": true, "code": 1000, "message": "카테고리 펼쳐보기 성공" }, simpleResult));

}

/**
 * API No. 20
 * API Name : [비회원] 상위 카테고리 상품조회 API
 * [GET] /category/:categoryId/product
 */
 exports.viewProduct = async function (req, res) {
    const userId = req.verifiedToken.userId;
    /**
     * Path Variable: categoryId
     * Query String: type
     */
   const categoryId = req.params.categoryId;
   // 페이징 처리 
   const size = 60;
   let { type, page } = req.query;


   // 빈 값 체크
   if (!categoryId)
       return res.send(response(baseResponse.CATEGORY_ID_EMPTY));


   // 숫자 형식 체크
   var regExp = /^[0-9]+$/;
   if(!regExp.test(categoryId))
       return res.send(response(baseResponse.INPUT_NUMBER));

   // 인덱스 0 : X
   if(categoryId == 0)
       return res.send(response(baseResponse.INPUT_INDEX_RANGE));
   
    // 서브 카테고리가 존재하는지
    // 없으면
    //console.log("1");
    const subCate = await cateProvider.isExistSubCate(categoryId); 
    //console.log(subCate.count);
    if(subCate.count == 0){
   
        //default 설정
        if(!type) type = '최신순';
            
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
        // 필터입력
        let filterArr = ['최신순','인기순','저가순','고가순','거리순'];
        if(filterArr.includes(type) != true)
            return res.send(response(baseResponse.INPUT_FILTER_WRONG));
        // 로그인 페이지 이동
        if(type == '거리순'){
            return res.send(response(baseResponse.DO_LOGIN));
        }

        // 신규 상품 
        const newProductList = await cateProvider.retrieveNewProduct(categoryId);
        if(newProductList.length < 1)
            return res.send(response(baseResponse.SEARCH_NEWRESULT_EMPTY));

        // 필터별 상품 
        const productListByType = await cateProvider.retrieveFilterProduct(type, categoryId, page, size);
        if(productListByType.length < 1)
            return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));

        return res.send(response( { "isSuccess": true, "code": 1000, "message": "상위 카테고리 필터별 상품조회 성공" }, {productListByType, newProductList}));
    
    } else {
        const simpleResult = await cateProvider.retrieveFirstProduct(categoryId);
        if(simpleResult.length < 1)
            return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));
        return res.send(response( { "isSuccess": true, "code": 1000, "message": "상위 카테고리 상품조회 성공" }, simpleResult));
    }
}

/**
 * API No. 21
 * API Name : 서브 카테고리 메뉴 조회 API
 * [GET] /category/:categoryId/:subCategoryId/:click
 */
 exports.viewSubCategory = async function (req, res) {

    /**
     * Path Variable: categoryId, subCategoryId
     * Query String: click
     */
    const categoryId = req.params.categoryId;
    const subCategoryId = req.params.subCategoryId;
    const click = req.query.click;

    console.log(categoryId, subCategoryId, click);
   // 빈 값 체크
    if (!categoryId)
        return res.send(response(baseResponse.CATEGORY_ID_EMPTY));
    if (!subCategoryId)
        return res.send(response(baseResponse.SUBCATEGORY_ID_EMPTY));
    if (!click)
        return res.send(response(baseResponse.INPUT_CLICK_BOOLEAN));


   // 숫자 형식 체크
   var regExp = /^[0-9]+$/;
   if(!regExp.test(categoryId) || !regExp.test(subCategoryId))
       return res.send(response(baseResponse.INPUT_NUMBER));

   // 인덱스 0 : X
   if(categoryId == 0 || subCategoryId == 0)
       return res.send(response(baseResponse.INPUT_INDEX_RANGE));
   

   // click
   if(click && (click != 0 && click != 1))
       return res.send(response(baseResponse.INPUT_BOOLEAN));
   
    const matchResult =  await cateProvider.categoryCheck(categoryId , subCategoryId);
    if(matchResult.exist < 1)
        return res.send(response(baseResponse.SUBCATEGORY_EMPTY));
    
    const simpleResult = await cateProvider.retrieveSecondCategory(subCategoryId, click);
   
   if(click == 0)
       return res.send(response( { "isSuccess": true, "code": 1000, "message": "서브카테고리 접어보기 성공" }, simpleResult));
   else
       return res.send(response( { "isSuccess": true, "code": 1000, "message": "서브카테고리 펼쳐보기 성공" }, simpleResult));

}

/**
 * API No. 22
 * API Name : [비회원] 서브 카테고리 상품조회 API(+필터 | 추천상품 | 신규등록 | 페이징)
 * [GET] /category/:categoryId/:subCategoryId
 */
 exports.viewSubProduct = async function (req, res) {
    const userId = req.verifiedToken.userId;
    /**
     * Path Variable: categoryId , subCategoryId
     * Query String: type, page
     */
   const categoryId = req.params.categoryId;
   const subCategoryId = req.params.subCategoryId;

   // 페이징 처리 
   const size = 120;
   let { type, page } = req.query;

   // 빈 값 체크
    if (!categoryId)
        return res.send(response(baseResponse.CATEGORY_ID_EMPTY));
    if (!subCategoryId)
    return res.send(response(baseResponse.SUBCATEGORY_ID_EMPTY));


    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(categoryId) || !regExp.test(subCategoryId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 인덱스 0 : X
    if(categoryId == 0 || subCategoryId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));
    
    // categoryId & subCategoryId 유효성 검사
    const matchResult = await cateProvider.categoryCheck(categoryId, subCategoryId); 
    if(matchResult.exist < 1)
        return res.send(response(baseResponse.SUBCATEGORY_EMPTY));

    // 하위 카테고리가 존재하는지
    // 없으면
    const thirdCate = await cateProvider.isExistThirdCate(subCategoryId); 
    if(thirdCate.count == 0){
   
        //default 설정
        if(!type) type = '최신순';
            
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
        // 필터입력
        let filterArr = ['최신순','인기순','저가순','고가순','거리순'];
        if(filterArr.includes(type) != true){
            return res.send(response(baseResponse.INPUT_FILTER_WRONG));
        }
        // 로그인 페이지 이동
        if(type == '거리순'){
            return res.send(response(baseResponse.DO_LOGIN));
        }
        
        // 신규 상품 
        const newProductList = await cateProvider.retrieveNewProduct2(subCategoryId);
        if(newProductList.length < 1)
            return res.send(response(baseResponse.SEARCH_NEWRESULT_EMPTY));

        // 필터별 상품
        const productListByType = await cateProvider.retrieveFilterProduct2(type, subCategoryId, page, size);
        if(productListByType.length < 1){
            return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));
        }


        return res.send(response( { "isSuccess": true, "code": 1000, "message": "서브 카테고리 필터별 상품조회 성공" },{productListByType, newProductList}));
    
    } else {
        // 추천 상품 
        const simpleResult = await cateProvider.retrieveSecondProduct(subCategoryId);
        if(simpleResult.length < 1)
            return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));
        return res.send(response( { "isSuccess": true, "code": 1000, "message": "서브 카테고리 상품조회 성공" }, simpleResult));
    }
}

/**
 * API No. 23
 * API Name : [비회원] 하위 카테고리 상품조회 API (+필터 | 신규등록 | 페이징)
 * [GET] /category/:categoryId/subcategory/:subCategoryId/thirdcategory/:thirdCategoryId
 */
 exports.viewThirdProduct = async function (req, res) {
    const userId = req.verifiedToken.userId;
    /**
     * Path Variable: categoryId , subCategoryId, thirdCategoryId
     * Query String: type, page
     */
   const categoryId = req.params.categoryId;
   const subCategoryId = req.params.subCategoryId;
   const thirdCategoryId = req.params.thirdCategoryId;

   // 페이징 처리 
   const size = 60;
   let { type, page } = req.query;

   // 빈 값 체크
    if (!categoryId)
        return res.send(response(baseResponse.CATEGORY_ID_EMPTY));
    if (!subCategoryId)
        return res.send(response(baseResponse.SUBCATEGORY_ID_EMPTY));
    if (!thirdCategoryId)
        return res.send(response(baseResponse.THIRDCATEGORY_ID_EMPTY));

    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(categoryId) || !regExp.test(subCategoryId) || !regExp.test(thirdCategoryId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 인덱스 0 : X
    if(categoryId == 0 || subCategoryId == 0 || thirdCategoryId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));
    
    // categoryId & subCategoryId 유효성 검사
    const matchResult = await cateProvider.categoryCheck(categoryId, subCategoryId); 
    if(matchResult.exist < 1)
        return res.send(response(baseResponse.SUBCATEGORY_EMPTY));
        
    // subCategoryId & thirdCateoryId 유효성 검사
    const matchResult2 = await cateProvider.categoryCheck2(subCategoryId, thirdCategoryId); 
        if(matchResult2.exist < 1)
            return res.send(response(baseResponse.THIRD_CATEGORY_EMPTY));
    
    //default 설정
    if(!type) type = '최신순';
        
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
    // 필터입력
    let filterArr = ['최신순','인기순','저가순','고가순','거리순'];
    if(filterArr.includes(type) != true){
        return res.send(response(baseResponse.INPUT_FILTER_WRONG));
    }
    // 로그인 페이지 이동
    if(type == '거리순'){
        return res.send(response(baseResponse.DO_LOGIN));
    }
    
    // 신규 상품 
    const newProductList = await cateProvider.retrieveNewProduct3(thirdCategoryId);
    if(newProductList.length < 1)
        return res.send(response(baseResponse.SEARCH_NEWRESULT_EMPTY));

    // 필터별 상품
    const productListByType = await cateProvider.retrieveFilterProduct3(type, thirdCategoryId, page, size);
    if(productListByType.length < 1){
        return res.send(response(baseResponse.SEARCH_RESULT_EMPTY));
    }

    return res.send(response( { "isSuccess": true, "code": 1000, "message": "하위 카테고리 필터별 상품조회 성공" },{productListByType, newProductList}));
    
}


/**
 * API No. 24
 * API Name : [비회원] 상위 카테고리 신규등록 조회 더보기 API
 * [GET] /new/category/:categoryId
 */
 exports.viewNewProductMore = async function (req, res) {

    /**
     * Path Variable: categoryId
     * Query String: page
     */
   const categoryId = req.params.categoryId;
   // 페이징 처리 
   const size = 60;
   let { page }= req.query;

    // 빈 값 체크
    if (!categoryId)
        return res.send(response(baseResponse.CATEGORY_ID_EMPTY));

   if (!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));

    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(categoryId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 인덱스 0 : X
    if(categoryId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));

    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);
 

    // 서브 카테고리가 존재하는지
    // 없으면
    const subCate = await cateProvider.isExistSubCate(categoryId); 
    if(subCate.count == 0){

        const newProductList = await cateProvider.retrieveNewProductDetail(categoryId, page, size);
        if(newProductList.length < 1)
            return res.send(response(baseResponse.SEARCH_NEWRESULT_EMPTY));

        return res.send(response( { "isSuccess": true, "code": 1000, "message": "신규등록 조회 성공" }, newProductList));
    
    } else {
        return res.send(response(baseResponse.PROVIDE_NOT_NEWRESULT));
    }
}

/**
 * API No. 25
 * API Name : [비회원] 서브 카테고리 신규등록 더보기 API
 * [GET] /category/:categoryId/subcategory/:subCategoryId/product/new
 */
 exports.viewSubNewProductMore = async function (req, res) {

    /**
     * Path Variable: categoryId, subCategoryId
     * Query String: page
     */
   const categoryId = req.params.categoryId;
   const subCategoryId = req.params.subCategoryId;

   // 페이징 처리 
   const size = 60;
   let { page }= req.query;

    // 빈 값 체크
    if (!categoryId)
        return res.send(response(baseResponse.CATEGORY_ID_EMPTY));

    if (!subCategoryId)
        return res.send(response(baseResponse.SUBCATEGORY_ID_EMPTY));

    if (!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));



    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(categoryId) || !regExp.test(subCategoryId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 인덱스 0 : X
    if(categoryId == 0 || subCategoryId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));

    
    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);

    // categoryId & subCategoryId 유효성 검사
    const matchResult = await cateProvider.categoryCheck(categoryId, subCategoryId); 
    if(matchResult.exist < 1)
        return res.send(response(baseResponse.SUBCATEGORY_EMPTY));

    // 하위 카테고리가 존재하는지
    // 없으면
    const thirdCate = await cateProvider.isExistThirdCate(subCategoryId); 
    console.log(thirdCate.count);
    if(thirdCate.count == 0){

        const newProductList = await cateProvider.retrieveNewProductDetail2(subCategoryId, page, size);
        if(newProductList.length < 1)
            return res.send(response(baseResponse.SEARCH_NEWRESULT_EMPTY));

        return res.send(response( { "isSuccess": true, "code": 1000, "message": "서브 카테고리 신규등록 조회 성공" }, newProductList));
    
    } else {
        return res.send(response(baseResponse.PROVIDE_NOT_NEWRESULT));
    }
}

/**
 * API No. 26
 * API Name : [비회원] 서브 카테고리 신규등록 더보기 API
 * [GET] /category/:categoryId/subcategory/:subCategoryId/thirdcategory/:thirdCategoryId/product/new
 */
 exports.viewThirdNewProductMore = async function (req, res) {

    /**
     * Path Variable: categoryId, subCategoryId, thirdCategoryId
     * Query String: page
     */
   const categoryId = req.params.categoryId;
   const subCategoryId = req.params.subCategoryId;
   const thirdCategoryId = req.params.thirdCategoryId;

   // 페이징 처리 
   const size = 60;
   let { page }= req.query;

    // 빈 값 체크
    if (!categoryId)
        return res.send(response(baseResponse.CATEGORY_ID_EMPTY));

    if (!subCategoryId)
        return res.send(response(baseResponse.SUBCATEGORY_ID_EMPTY));

    if (!thirdCategoryId)
        return res.send(response(baseResponse.THIRDCATEGORY_ID_EMPTY));

    if (!page)
        return res.send(response(baseResponse.NO_EMPTY_PAGE));



    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(categoryId) || !regExp.test(subCategoryId) || !regExp.test(thirdCategoryId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 인덱스 0 : X
    if(categoryId == 0 || subCategoryId == 0 || thirdCategoryId == 0)
        return res.send(response(baseResponse.INPUT_INDEX_RANGE));

    
    if(page == 0)
        return res.send(response(baseResponse.INPUT_PAGE_RANGE));

    page = size * (page-1);

    // categoryId & subCategoryId 유효성 검사
    const matchResult = await cateProvider.categoryCheck(categoryId, subCategoryId); 
    if(matchResult.exist < 1)
        return res.send(response(baseResponse.SUBCATEGORY_EMPTY));

    // subCategoryId & thirdCateoryId 유효성 검사
    const matchResult2 = await cateProvider.categoryCheck2(subCategoryId, thirdCategoryId); 
        if(matchResult2.exist < 1)
            return res.send(response(baseResponse.THIRD_CATEGORY_EMPTY));

    const newProductList = await cateProvider.retrieveNewProductDetail3(thirdCategoryId, page, size);
    if(newProductList.length < 1)
        return res.send(response(baseResponse.SEARCH_NEWRESULT_EMPTY));

    return res.send(response( { "isSuccess": true, "code": 1000, "message": "하위 카테고리 신규등록 조회 성공" }, newProductList));
    
}
