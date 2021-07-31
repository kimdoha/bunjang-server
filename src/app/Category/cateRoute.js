module.exports = function(app){
    const cate = require('./cateController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // 17. 메인화면 조회
    app.get('/', cate.main);

    // 18. 카테고리 메뉴 조회 
    app.get('/category', cate.category);

    // 19. 상위 카테고리 메뉴 조회
    app.get('/category/:categoryId',jwtMiddleware ,cate.viewCategory);

    // 20. 상위 카테고리 상품조회 API (+필터)/category/:categoryId
    app.get('/category/:categoryId/product',jwtMiddleware ,cate.viewProduct);

    // 21. 서브 카테고리 메뉴 조회
    app.get('/category/:categoryId/subcategory/:subCategoryId', jwtMiddleware , cate.viewSubCategory);

    // 22. 서브 카테고리 상품조회 API (+필터)
    app.get('/category/:categoryId/subcategory/:subCategoryId/product', jwtMiddleware ,cate.viewSubProduct);

    // 23. 하위 카테고리 상품조회 API (+필터)
    app.get('/category/:categoryId/subcategory/:subCategoryId/thirdcategory/:thirdCategoryId', jwtMiddleware ,cate.viewThirdProduct);
    
    // 24. 상위 카테고리 신규등록 더보기 API
    app.get('/category/:categoryId/product/new',jwtMiddleware ,cate.viewNewProductMore);
    
    // 25. 서브 카테고리 신규등록 더보기 API
    app.get('/category/:categoryId/subcategory/:subCategoryId/product/new',jwtMiddleware, cate.viewSubNewProductMore);

    // 26. 하위 카테고리 신규등록 더보기 API
    app.get('/category/:categoryId/subcategory/:subCategoryId/thirdcategory/:thirdCategoryId/product/new',jwtMiddleware, cate.viewThirdNewProductMore );


};
