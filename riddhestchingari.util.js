import axios from "axios";

const selfUserId = "60681a5ec4f7f60907a9eedf";
const authToken =
  "eyJhbGciOiJIUzI1NiJ9.YzlhYzM2Y2RlNjIwOTE1ZjhhMGUwNjkxMTExMWU5MTI6YmNlOTU5NzE2MWY3ZWI5ODRmN2MzMDZjOGNmNjM3MDAzMjQ2OTQ4ODA3N2ZlZjkzZmUyMWYxNzFmYjIxNDk3ZTlkNmM2N2JkMmQ3NTY0NTZhMjM4NWZlMGI1MGE2ZTg0ZjAwYzZmY2Y4MDRlZDc0NDQ3NDk5YzY4NGUwMjM5YjQ4M2M2YzY4OGU3OGU2MjI2Mzg5NTAzY2E3OTI0NDVlYmNhZjkxNGQ1ZTlmNzFjNTFmZDkwZWRlNTVhZjcyZGJmZGZlYmMzNTE5NjM0ZjA5ZDdmZWRmM2RiNzQwYjQ4NDY3MTk0MzRlYmFlMzU2OWZlODUzY2NkYTU1MGVkOTE0OGMzMGE0OTE5ZmIxNzdmZDliMTM2OWMzMTNkMjEwZWFiYzUzNDlkYzE5ZmZlODhmYTRlOGMyMzZmZGIwZGNmZDhiYjNmMDc2YWIzMmExNzY2ZDJjMzkwOTA2NTc1NjIyNjg2MWRmNDMwOTIzYTAwNDc0ZDcyNmZjMjQ5Mjg3YmEzYWIyMzZmNTViZDBiY2QyYTc5OGQ0MmQ0NjkxZWUzOGI3N2U1NzliMzA5NTFhYmQxNzE0MTQzNTdkZDNkZjlkMzlmNWM4NWIyMmY1YjM3MjNmODhjNzViM2Y5NGExMDk1Y2RkYzQ0NjgxMTMzN2QwNGVmYTU0YWYxYjhhMGZmMWUwM2UzZTA2MjNmMTBkNDY1NjIxZjE4NzczYmZjNzVhMzVmNDgwZWYzYWEyODBjYTE3MjIzMTE3Mjk1NTM0MzliNjZkMTc5MmE4MDY5YWIwYjcwNzIxNjRkN2I5NDllODY4ZjdhNGZkNWNlZTUxYmFjZjhiODg1NGNmN2Q5ZTQ2NWJlZTE1ZWNjNTI4NDFkMTk5MjdmMGNiZTBhNWRmYWFlNjcwYzM2MTgzNjdiOGNhZGU2NzU2MjdmMDk2OGVlNjQ.QQ68M_ycf1DnxHmbymlNH0OwIKKgEqayiX4P-KaD0xY";
const CHINGARI_URL = "https://api.chingari.io";
function checkCode(response) {
  if (response.code == 200 || response.code == 201) {
    return response.code;
  }
}

export const getTrendingPost = async (skip, limit) => {
  try {
    const response = await axios.post(
      CHINGARI_URL + "/post/v2/trending-videos",
      {
        type: "text",
        key: {
          countryCode: "IN",
          limit: limit,
          contentLanguages: ["english"],
          skip: skip,
          language: "english",
          deviceId: "b3ca0e3ea01debb4",
        },
        value: "",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );

    return response.data.data.TrendingFeedData;
  } catch (error) {
    console.log(`error while getTrendingPost` + error);
    throw error;
  }
};

export const visitPost = async (postId,duration) => {
  try {
    const response = await axios.post(
      CHINGARI_URL + "/post/v2/visitPost",
      {
        duration: duration,
        feedType: 0,
        isDeeplink: "0",
        language: "english",
        postId: postId,
        userId: selfUserId,
        deviceId: "b3ca0e3ea01debb4",
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );
console.log(response.data)
    return checkCode(response.data);
  } catch (error) {
    console.log(`error while post like ${error}`);
    throw error;
  }
};

export const postLike = async (postId, ownerId) => {
  try {
    const response = await axios.post(
      CHINGARI_URL + "/post/v2/likeUnlikePost",
      { postId: postId, ownerId: ownerId, userId: selfUserId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );
    return checkCode(response.data);
  } catch (error) {
    console.log(`error while post like ${error}`);
    throw error;
  }
};

export const follow = async (followUserId) => {
  try {
    const response = await axios.post(
      CHINGARI_URL + "/users/v2/followUsers",
      {
        userId: selfUserId,
        followUserId: followUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );
console.log(response.data)
    return checkCode(response.data);
  } catch (error) {
    console.log(`error while post like ${error}`);
    throw error;
  }
};
export const followingPosts = async (next) => {
  try {

   
    const response = await axios.post(
      CHINGARI_URL + "/feeds/following",
      {"timestamp":next?next:"2022-06-22T18:28:34.653Z"},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );
    return (response.data);
  } catch (error) {
    console.log(`error while comment ${error}`);
  }
};

export const getPostByUserId = async (userId,userPostLimit,userPostSkip) => {
  try {

   
    const response = await axios.post(
      CHINGARI_URL + "/users/getPosts",
      {"limit":userPostLimit,"skip":userPostSkip,"language":"english","ownerId":selfUserId,"userId":userId},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );
    return (response.data);
  } catch (error) {
    console.log(`error while comment ${error}`);
  }
};

