const { pool } = require("../../../config/database");

// 팔로잉 유저 존재 여부
async function existFollowID(connection, followId) {
  const existFollowQuery = `
    SELECT * FROM User WHERE userId = ?;
                `;
  const [existRows] = await connection.query(existFollowQuery, followId);
  return existRows;
}
// (userId-followId) 팔로우 여부 
  async function existFollow(connection, userId, followId) {
    const existFollowQuery = `
    SELECT exists(select userId, followId
      FROM Following
      WHERE userId = ? AND followId= ?)
      AS exist;
                  `;
    const [existRows] = await connection.query(existFollowQuery, [ userId, followId ]);
    return existRows;
  }

//  팔로우 상태 조회 
  async function followStatus(connection, userId, followId) {
    const followStatusQuery = `
    SELECT follow
    FROM Following
    WHERE userId = ? AND followId = ?;
                   `;
    const [followRow] = await connection.query(followStatusQuery, [ userId, followId ]);
    return followRow;
  }
  

async function addFollow(connection, userId, followId) {
    const addFollowQuery = `
    insert into Following(userId, followId)
    values (?, ?);
    `;
    const [followRows] = await connection.query(addFollowQuery, [userId, followId]);
    return followRows;
}

async function followDelete(connection, userId, followId) {
    const updateDeleteQuery = `
    UPDATE Following SET follow = 0
    WHERE userId = ? AND followId = ?;
    `;
    const [followRows] = await connection.query(updateDeleteQuery, [userId, followId]);
    return followRows;
}

async function updateFollow(connection, userId, followId) {
    const updateFollowQuery = `
      UPDATE Following SET follow = 1
      WHERE userId = ? AND followId = ?;
    `;
    const [followRows] = await connection.query(updateFollowQuery,[ userId, followId ]);
    return followRows;
}


// 내 피드 조회 
async function selectMyFeed(connection, userId, page, size) {
  const selectMyFeedQuery = `
          SELECT p.postId,
          (SELECT postImgUrl
          FROM postImage pi
          WHERE pi.postId = p.postId AND pi.mainImg = 1) AS postImage,
          p.price, p.productName, u.userId, u.profileImg, u.userName
        FROM Post p
        LEFT JOIN User u ON p.userId = u.userId
        LEFT JOIN Following f ON f.followId = p.userId
        WHERE f.userId = ? AND f.follow = 1
        ORDER BY p.createAt DESC
        LIMIT ?, ?;
        `;
    const [ feedRow ] = await connection.query(selectMyFeedQuery, [userId, page, size] );
    return feedRow;
}



// 추천 상점 조회
async function recommendStore(userId, size) {

  const connection = await pool.getConnection(async (conn) => conn);
  
  const getUserDataQuery = `
      SELECT u.userId, u.profileImg, u.userName,
      (SELECT COUNT(*) FROM Post p WHERE p.userId = u.userId) AS product,
      (SELECT COUNT(*) FROM Following f WHERE f.followId = u.userId) AS follower
      FROM User u
      WHERE u.userId = ? AND status = 1;
  `
  const getPostDataQuery = `
      SELECT p.userId, p.postId,
      (SELECT pi.postImgUrl FROM postImage pi WHERE pi.mainImg = 1 AND pi.postId = p.postId) AS postImgURL,
      p.price
      FROM Post p
      WHERE p.userId = ? AND p.status = 1
      ORDER BY p.createAt DESC LIMIT 3;
  `
  const getUserIdQuery = `
      SELECT u.userId FROM User u
      INNER JOIN (SELECT count(*) AS pcount, userId
      FROM Post
      WHERE status = 1
      GROUP BY userId
      HAVING pcount >= 3) us
      ON us.userId = u.userId
      ORDER BY RAND()
      LIMIT 8;
  `
  
  const [randomUserIdList] = await connection.query(getUserIdQuery);

  let count = 0
  let totalData = [];

  while (count < 8) {
    let userId = JSON.parse(JSON.stringify(randomUserIdList))[count].userId;

    var randomParams = [userId];

    const [userRows] = await connection.query(getUserDataQuery,randomParams);

    const [postRows] = await connection.query(getPostDataQuery, randomParams)

    const result = { userData: userRows, postData: postRows };

    totalData[count] = result;

    count += 1;
  }

  connection.release();
  return totalData;
}

  module.exports = {
    existFollow,
    followStatus,
    existFollowID,
    addFollow,
    followDelete,
    updateFollow,
    selectMyFeed,
    recommendStore
  };
  