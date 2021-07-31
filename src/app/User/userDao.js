// 다음 유저 아이디 조회
async function selectNextUserId(connection) {
  const nextUserIdQuery = `
        SELECT IFNULL(max(userId)+1, 1) AS id
        FROM User;
                `;
  const [nextId] = await connection.query(nextUserIdQuery);
  return nextId[0].id;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
      SELECT email, nickname
      FROM UserInfo
      WHERE email = ?;
      `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}
//
// kakaoId 회원 조회
async function selectKakaoId(connection, kakaoId) {
  const selectKakaoIdQuery = `
      SELECT EXISTS (SELECT * FROM User WHERE kakaoId = ?) as exist;
                 `;
  const [userRow] = await connection.query(selectKakaoIdQuery, kakaoId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, selectUserParams) {
  const insertUserInfoQuery = `
      INSERT INTO User(userName, kakaoId) VALUES (?, ?);
    `;
  const [insertUserInfoRow] = await connection.query( insertUserInfoQuery, selectUserParams);
  return insertUserInfoRow;
}

// // 패스워드 체크
// async function selectUserPassword(connection, selectUserPasswordParams) {
//   const selectUserPasswordQuery = `
//         SELECT email, nickname, password
//         FROM UserInfo
//         WHERE email = ? AND password = ?;`;
//   const selectUserPasswordRow = await connection.query(
//       selectUserPasswordQuery,
//       selectUserPasswordParams
//   );
//
//   return selectUserPasswordRow;
// }
//

// 유저 계정 상태 체크 
async function selectUserStatus(connection, kakaoId) {
  const selectStatusQuery = `
            SELECT userId, status
            FROM User
            WHERE kakaoId = ?;
        `;
    const statusRow = await connection.query(selectStatusQuery, kakaoId);
    return statusRow[0];
}

// async function updateUserInfo(connection, id, nickname) {
//   const updateUserQuery = `
// `;
//   const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
//   return updateUserRow[0];
// }

// main 주소인지 여부  
async function addressInfoExist(connection, userId) {
  const selectAddressQuery = `
  SELECT EXISTS (SELECT * FROM MyAddress WHERE userId = ? AND status != 0) as exist;
        `;
  const [addressRow] = await connection.query(selectAddressQuery, userId);
  return addressRow;
}


// 주소 등록 
async function insertUserAddress(connection, userParams) {
  const insertUserInfoQuery = `
    INSERT INTO MyAddress (userId, address, isMain) VALUES (?, ?, ?);

    `;
  const [insertAddressInfoRow] = await connection.query( insertUserInfoQuery, userParams);
  return insertAddressInfoRow;
}
// 이미 등록된 주소 확인 selectSameAddress(connection, userId, split);
async function selectSameAddress(connection, userId, split){
  const sameAddressQuery = `
    SELECT *
    FROM MyAddress
    WHERE userId = ? AND status != 0
    AND address LIKE concat ('%', ?, '%');
    `;
  const [sameAddressInfoRow] = await connection.query( sameAddressQuery , [userId, split]);
  return sameAddressInfoRow;
}

module.exports = {
    selectKakaoId,
    selectNextUserId,
    insertUserInfo,
    selectUserStatus,
    addressInfoExist,
    insertUserAddress,
    selectSameAddress
};
