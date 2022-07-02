import axios from "axios";

const selfUserId = "61993b9ee0fdb20939eabc58";
const authToken =
  "eyJhbGciOiJIUzI1NiJ9.ODIwNDdmYWVlNmRiNTAwZmM1YmVjNDVlNTJhZjI4YTM6NTlhNWI1ZmE2MTM3MzBmN2IyMGYyMTg3MmNhZWU2MzU5MDhiOTk1MjhiZTY5MTdkNGZlNWI0ZmViZjM3NjQ3NTBhMTE2Njg0ODcwYTlhNWMxNWI1MDRhNTdjYWQ5ZTUwYzY4ZjFmYmMyNWIxOGIwN2QzOTI0MDUyZjIwMTYyODIxMmM4MWNmYTQ2MzYzN2JhMjUxMjVhZTk0MGM2YmU1ZGViZjJiYzIxZGE3MjJkZGYwMWI2MWY1MDU5NWRlMjRlOGNjOGRlZTJiMDAwYTM1MDAyN2M1NGQ3NDBlNTY5ZmU5ZTE3NjBlZGE2YmNhYmViMzdkNGJhNjE3NjhhYzk5NzdhMWFlYTRkYmQ4NzY1ZGIxOGY0MmFkNDA4Y2JkZDZjMjA2ZjQ1NGFlY2ViNDk1MTE1NjVmMTZjZWRkNzA4MTZkNTZjYTc4ZGY0YjE5ZTM1OGY3NjViMjFjMmI4NWQ4NWMzMDQ1NGQxYmY2N2I5NzgxZWIzOWJiNTU0MWE2OTQ0YTYyNTRmZTkzMGE0ZGZmNWEyMjVlYzI4YmM5NmIzZWNiZDEyNDc4ZjA4NGU4NmY4NTNhYjg5MjhhNDY1YzlkM2VjOTA3M2RiODE4Nzc1ODhmMzJiMGQwYzg4MTE2OWMwNjM0MWY3MDRkMGFlMjFjYzg1NzA0NmJhZjhjMjU3ODFmZDBiZDhkNWY4ZjU2MGQ5ZWNhYmU1MDlkNzJlMTJlYw.uUeLAxx733z8AigR9K0B9KpT9kV1b96kz27_sizoqyQ";
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
