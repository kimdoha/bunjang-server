module.exports = function(app){
    const follow = require('./followController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 34. 팔로잉 설정 및 해제 API
    app.post('/following/:userId', jwtMiddleware, follow.startOrEnd);

    // 35. 추천 상점 조회 API
    app.get('/following/recommend', jwtMiddleware , follow.viewRecommend);

    // 36. 팔로잉 상점 소식 조회 API
    app.get('/following/feed', jwtMiddleware , follow.viewFeed);


};