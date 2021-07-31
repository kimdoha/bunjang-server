module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    KAKAO_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3999, "message":"카카오 토큰 검증 실패" },
    TOKEN_VERIFICATION_EMPTY : { "isSuccess": false, "code": 3998, "message":"액세스 토큰이 존재하지 않습니다" },

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    //category
    CATEGORY_ID_EMPTY : { "isSuccess": false, "code": 2019, "message": "카테고리ID 값을 입력해주세요" },
    INPUT_NUMBER : { "isSuccess": false, "code": 2021, "message": "숫자로 입력해주세요" },
    INPUT_INDEX_RANGE : { "isSuccess": false, "code": 2022, "message": "인덱스는 1부터 시작합니다" },
    INPUT_BOOLEAN : { "isSuccess": false, "code": 2023, "message": "Boolean 형식으로 입력해주세요" },
    INPUT_CLICK_BOOLEAN : { "isSuccess": false, "code": 2024, "message": "click값 입력해주세요" },
    
    // login redirect
    DO_LOGIN : { "isSuccess": false, "code": 2025, "message": "로그인이 필요합니다" },

    // subcategory
    SUBCATEGORY_ID_EMPTY : { "isSuccess": false, "code": 2027, "message": "서브 카테고리ID 값을 입력해주세요" },

    //  page
    NO_EMPTY_PAGE : { "isSuccess": false, "code": 2020, "message": "페이지를 입력해주세요" },
    INPUT_PAGE_RANGE : { "isSuccess": false, "code": 2028, "message": "페이지는 1부터 시작합니다" },

    // filter
    INPUT_FILTER_WRONG : { "isSuccess": false, "code": 2026, "message": "잘못된 필터입력입니다" },
    INPUT_FILTER_EMPTY : { "isSuccess": false, "code": 2029, "message": "필터를 입력해주세요" },

    // thirdCategory
    THIRDCATEGORY_ID_EMPTY : { "isSuccess": false, "code": 2030, "message": "하위 카테고리ID 값을 입력해주세요" },

    // address
    ADDRESS_INPUT_EMPTY : { "isSuccess": false, "code": 2031, "message": "지역(읍/면/동)을 입력해주세요." },
    ADDRESS_NOT_MATCH : { "isSuccess": false, "code": 2032, "message": "일치하는 지역이 없습니다" },

    // follow
    FOLLOW_ID_EMPTY : { "isSuccess": false, "code": 2033, "message": "팔로우 유저ID를 입력해주세요" },
    

    // post

    POST_IMAGE_EMPTY : { "isSuccess": false, "code": 2034, "message": "상품 사진을 등록해주세요" },
    POST_CATE_EMPTY : { "isSuccess": false, "code": 2035, "message": "카테고리를 선택해주세요" },
    POST_PRICE_EMPTY : { "isSuccess": false, "code": 2036, "message": "100원 이상 입력해주세요" },
    POST_NAME_LENGTH : { "isSuccess": false, "code": 2037, "message": "상품명은 최소 2자 이상 입력해야합니다" },
    POST_IMAGE_LENGTH : { "isSuccess": false, "code": 2038, "message": "사진 첨부는 최대 12장까지 가능합니다" },
    POST_TAG_LENGTH : { "isSuccess": false, "code": 2039, "message": "최대 입력가능한 태그는 5개입니다." },
    POST_CONTENT_LENGTH : { "isSuccess": false, "code": 2040, "message": "2000자 이내로 작성해주세요" },

    // post-detail
    POST_ID_EMPTY : { "isSuccess": false, "code": 2041, "message": "게시글 ID를 입력해주세요" },
  

    // review
    REVIEW_ID_EMPTY : { "isSuccess": false, "code": 2043, "message": "리뷰할 유저ID를 입력해주세요" },

    // jjim
    COLLECTION_EMPTY : { "isSuccess": false, "code": 2044, "message": "컬렉션명을 입력해 주세요" },
    COLLECTION_LENGTH : { "isSuccess": false, "code": 2045, "message": "10자 이하로 입력하세요" },   
    COLLECTION_ID_EMPTY : { "isSuccess": false, "code": 2046, "message": "컬렉션ID를 입력해 주세요" },
    INPUT_STATUS_BOOLEAN : { "isSuccess": false, "code": 2047, "message": "판매 상태를 Boolean 형식으로 입력해주세요" },

    COLLECTION_ID_EMPTY : { "isSuccess": false, "code": 2048, "message": "컬렉션ID를 입력해 주세요" },

    // myshop
    USERNAME_INPUT : { "isSuccess": false, "code": 2049, "message": "상점명은 한글, 영어, 숫자만 입력해주세요(최대 10자)" }, 
    CONTENT_INPUT : { "isSuccess": false, "code": 2050, "message": "천 자 이내로 입력해주세요" }, 
    
    // setAddress


    USERNAME_EMPTY : { "isSuccess": false, "code": 2051, "message": "수령인 이름을 입력해주세요" },
    PHONENUM_EMPTY : { "isSuccess": false, "code": 2052, "message": "-없이 숫자만 입력해주세요" },
    ADDRESS_EMPTY : { "isSuccess": false, "code": 2053, "message": "검색할 도로명 주소를 입력해주세요" },
    ASKING_EMPTY : { "isSuccess": false, "code": 2054, "message": "배송 시 요청사항을 선택해주세요" },
    DETAIL_ADDRESS_EMPTY  : { "isSuccess": false, "code": 2055, "message": "상세 주소를 입력해주세요" },

    ADDRESS_ID_EMPTY  : { "isSuccess": false, "code": 2056, "message": "배송지ID를 입력해주세요" },

    // bungae talk
    BUNGAE_TYPE_EMPTY : { "isSuccess": false, "code": 2057, "message": "메세지 유형을 입력해주세요" },    
    BUNGAE_INPUT_BOOLEAN : { "isSuccess": false, "code": 2058, "message": "메세지 유형을 Boolean 형식으로 입력해주세요" },
    BUNGAE_INDEX_WRONG : { "isSuccess": false, "code": 2059, "message": "받는 사람이 보낸 사람과 동일합니다" }, 
    BUNGAE_INDEX_SERVICE : { "isSuccess": false, "code": 2060, "message": "해당 서비스는 지원되지 않습니다" }, 

    // Response error

    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 후 7일간 재가입이 불가능합니다." },

    // category
    CATEGORY_EMPTY : { "isSuccess": false, "code": 3007, "message": "카테고리 메뉴가 없습니다" },
    SEARCH_RESULT_EMPTY : { "isSuccess": false, "code": 3008, "message": "검색결과가 없습니다" },


    // newProduct
    SEARCH_NEWRESULT_EMPTY : { "isSuccess": false, "code": 3010, "message": "신규등록 상품이 조회되지 않습니다" },
    PROVIDE_NOT_NEWRESULT : { "isSuccess": false, "code": 3011, "message": "신규등록 조회가 제공되지 않습니다" },

    // subcategory
    SUBCATEGORY_EMPTY : { "isSuccess": false, "code": 3009, "message": "해당 카테고리의 서브메뉴가 아닙니다" },
    THIRD_CATEGORY_EMPTY : { "isSuccess": false, "code": 3012, "message": "해당 서브카테고리의 하위메뉴가 아닙니다" },

    // address
    ADDRESS_REGISTER_IMPOSSIBLE : { "isSuccess": false, "code": 3013, "message": "이미 등록된 지역입니다" },

    //follow
    FOLLOW_USER_EMPTY : { "isSuccess": false, "code": 3014, "message": "등록되지 않은 유저입니다" },
    FOLLOWING_STORE_EMPTY : { "isSuccess": false, "code": 3015, "message": "팔로잉한 상점이 없습니다" },


    // product
    SEARCH_PRODUCT_EMPTY : { "isSuccess": false, "code": 3016, "message": "해당 상점의 판매상품이 조회되지 않습니다" },
    SEARCH_REVIEW_EMPTY : { "isSuccess": false, "code": 3017, "message": "등록된 번장인증후기가 없습니다" },


    //follower
    FOLLOWER_STORE_EMPTY : { "isSuccess": false, "code": 3018, "message": "아직 나를 팔로우한 사람이 없습니다" },

    // my-look
    LOOKED_PRODUCT_EMPTY : { "isSuccess": false, "code": 3019, "message": "최근 본 상품이 없습니다" },

    // review
    REVIEW_EMPTY : { "isSuccess": false, "code": 3020, "message": "등록된 일반후기가 없습니다" },

    // jjim
    JJIM_EMPTY : { "isSuccess": false, "code": 3021, "message": "찜한 상품이 없습니다" },
    COLLECTION_REMOVE : { "isSuccess": false, "code": 3022, "message": "이미 삭제된 컬랙션입니다" },

    // myshop
    MYSHOP_USERNAME : { "isSuccess": false, "code": 3023, "message": "싱점명은 변경 후 30일동안 수정이 불가능합니다." }, 
    MYSHOP_STOREURL : { "isSuccess": false, "code": 3024, "message": "주소등록 후 변경은 30일 이후에 가능합니다." }, 

    // address
    ADDRESS_ENOUGH : { "isSuccess": false, "code": 3025, "message": "배송지는 최대 10개까지 추가 가능합니다." },
    ADDRESS_INDEX_ENOUGH : { "isSuccess": false, "code": 3026, "message": "선택할 수 있는 범위의 주소 인덱스가 아닙니다." },

     // view Address
    My_ADDRESS_EMPTY  : { "isSuccess": false, "code": 3027, "message": "배송지를 등록하고, 손쉽게 관리해보세요" },
    My_ADDRESS_PATCH_NOT  : { "isSuccess": false, "code": 3028, "message": "삭제되었거나 조회할 수 없는 배송지입니다" },

    // 번개톡
    My_REGISTER_ADDRESS  : { "isSuccess": false, "code": 3029, "message": "기본 배송지를 등록해주세요" },
    POST_SEARCH_NOT : { "isSuccess": false, "code": 3030, "message": "삭제된 게시글이거나 조회할 수 없습니다" },
    BUNGAETALK_SEARCH_NOT : { "isSuccess": false, "code": 3031, "message": "생성된 대화가 없습니다" },

    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
