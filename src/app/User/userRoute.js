module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // access-Token 가져오기 
    // const rp= require("request-promise");

    // 1. 소셜 로그인 (카카오) API
    app.post('/login', user.login);

    // 2. 카카오 로그 아웃 API
    app.post('/logout', jwtMiddleware , user.logout);

    // 3. 자동 로그인 하기 API (JWT 검증 및 Payload 내뱉기)
    app.post('/autologin',jwtMiddleware, user.autologin);

    // 회원 정보 수정 API 
    //app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)
    
    // 5. 배송지 등록 추가 API      
    app.get("/user/address", jwtMiddleware , user.registerAddress);


};
