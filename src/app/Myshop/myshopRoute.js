module.exports = function(app){
    const myshop = require('./myshopController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 7. 나의 찜컬렉션 조회 API
    app.get('/collection', jwtMiddleware , myshop.viewCollection );

    // 8. 나의 찜컬렉션 생성 API
    app.post('/collection', jwtMiddleware , myshop.createCollection );

    // 9. 나의 찜컬렉션 수정 및 삭제 API
    app.patch('/collection/:collectionId', jwtMiddleware , myshop.patchCollection);

    // 10. 컬렉션 찜한상품 조회 API
    app.get('/collection/:collectionId/jjim', jwtMiddleware , myshop.viewJjimInCollection );

    // 11. 상품 찜 + 찜 해제 API
    app.post('/jjim/collection/:collectionId/post/:postId', jwtMiddleware , myshop.createjjim);

    // 33. 마이샵 메인화면 조회 API
    app.get('/myshop', jwtMiddleware , myshop.viewMyShop );

    // 34. 마이샵 정보수정 API
    app.patch('/myshop', jwtMiddleware , myshop.patchMyShop );

    // 35. 마이샵 + 다른 샵 정보조회 API
    app.get('/myshop/:userId', jwtMiddleware , myshop.viewMyShopInfo );


    // 36. 최근 본 상품 조회 API
    app.get('/myshop/mylook', jwtMiddleware , myshop.viewWatched );

    //37. 내 상점 리뷰 조회 API
    app.get('/myshop/review/user/:userId', jwtMiddleware , myshop.viewReview);

    // 38. 내 팔로워 조회 API
    app.get('/myshop/follwer', jwtMiddleware , myshop.viewMyFollower );

    // 39. [팔로잉] 내 팔로잉 조회 API
    app.get('/myshop/following', jwtMiddleware , myshop.viewMyFollowing);



};