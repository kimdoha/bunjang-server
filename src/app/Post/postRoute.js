module.exports = function(app){
    const post = require('./postController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 13. 상품 등록 API
    app.post('/post', jwtMiddleware, post.writePost);

    // 14. 상품 게시글 상세 조회 API
    app.get('/post/:postId', jwtMiddleware , post.viewProductDetail);
    
    // 15. 상품 정보 수정 API
    app.patch('/post/:postId', jwtMiddleware, post.patchProduct);

    // 16. 다른 구매자가 함께 본 상품 조회 API
    app.get('/post/recommend/post/:postId', jwtMiddleware , post.recommendProduct);
    

};