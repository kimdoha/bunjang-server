module.exports = function(app){
    const talk = require('./talkController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 6. 번개톡 메인화면 조회 API
    app.get('/talk', jwtMiddleware , talk.main);
    
    // 12. 특정 번개톡 세부화면 조회 API
    app.get('/talk/post/:postId', jwtMiddleware , talk.detail);

    // 34. 번개톡 메세지 보내기 API
    app.post('/talk/post/:postId', jwtMiddleware, talk.sendMessage);
    
    // 28. 배송지 설정 API
    app.post('/setting/address', jwtMiddleware, talk.settingAddress);

    // 29. 배송지 정보 확인 API
    app.get('/setting/address', jwtMiddleware, talk.viewAddress);

    // 40. 배송지 삭제 API
    app.patch('/setting/address/:addressId', jwtMiddleware, talk.deleteAddress);

};