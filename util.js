import axios from "axios";

const selfUserId = "62c1bde9515b1f04e0471b85";
const authToken =
  "eyJhbGciOiJIUzI1NiJ9.ZjJkNmEyMDI2Nzg5N2YxZWQ1MDExZWI4YzdkYzk5Yzg6Zjk0NzkxMDQzZGZiNDEwNGU2MjgyZmM4NmQ3NTI3MGZiYzQyZTIxNmQzOTU3OTdiZmNiYzI1NjcwOWQ2YjkyOTk0YjBlNmMzMjAwMjRhNWNkMDg2YTE2OTYwYzg1OTkzMGZmOWIzMTNhYTI2MjVlYTk2ZGRhODk4ZTJmMTRmNGNkZTY2MmYxMGU5NDg5ZTdhNTRhNTI2ODcxMzljNWVjOWRhYjI0MDI3Yzg1MDQwMjMwODVmZTFjN2E2OWM0ZGEwYzkyNjM0MTA3NjUwOTAxMDdlMDA4OTNjYmZlZGU2M2Y0ZDIzYWQ1OGUwNmFlODBiNTdkMWZlMDBkZjI1ZDg4MWEyYmE1YTBhYWI0Y2QxMzhkZGQ2MDc1YzM5MTM0MTRjZWM4MTk3ZWFhM2NkNmFhYjJhNjNhZDkxNzJhNzNkOGZkOTA2ZjliZWFmOGQzOGQ5MGMwOWQwNmQ2N2U3YmIxYWIwMmZhMjY5YzRmNTQ4YjhlOTZmM2NmZGRjNjNlMDRiM2E2MjhmYWQ0NmU2OTVkZTUzNzhmZWRjYWQwY2JlNDlkNGYyM2UxMWQzYTQxMDA5MDE2MzczNDg5ODUwNmQ4NTY3YjY0MzBmMWYyYzQxNzJjZmY3OGNiZDA2YzU1OGFlYWE3ZjE1MmRkMGZmNmZkZTkzMzMwMGNkNTQ2NmViNDNiNWQ3YTI3OGRjN2E1NDA4Yjc2MWFiZTBiMDNkNjdhMjUxNDMxYzE4MjA3MjhjMDgwY2VkMzU2MzM4MDg4NjFmYWY3ZjIyMzc5MTg0ZTZhY2NmNjhkZDk3NWIwN2ZhOGUwMmI2YzMxY2E5NTM3MjMxMTU0M2U5ZTBhMzI5NTA4NDBkMjQ0ZmVlNDg1ODI2NzUwYjA4Y2QzZDMyZjI1ZTk1OWY1ZTlmZDRhMmZiODJkMGIzNmE4YWE3YWI5YWRhNTVjNGRkMTAwOGUzYWE2YTVjMDE2OWFkZDk5ZTI4MGQ3MTkyMzY3OTg3YzU0ODRhNjY0N2EwODAwOWI3ZTQ2YTY2ZDdjNmYyZWEwZjUxNjNjYjVkMDcwMmU0MDQ2ZGFlNWFhZmMxN2E3ZDkyMDI4M2U0MTk3Mjc5YjJjYjEyMDQwNDU2NDdhZmE2NGRkODVkNTI2ZDRhZDhmNmE0ODYyZDIx.zR3ND0FjDNHi89TF7qL2PHbgdvkIJDxXs4FYtOHot0Y";
const CHINGARI_URL = "https://api.chingari.io";

function checkCode(response) {
  console.log(response);
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

export const visitPost = async (postId, duration) => {
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
      { timestamp: next ? next : "2022-06-22T18:28:34.653Z" },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`error while comment ${error}`);
  }
};

export const getPostByUserId = async (userId, userPostLimit, userPostSkip) => {
  try {
    const response = await axios.post(
      CHINGARI_URL + "/users/getPosts",
      {
        limit: userPostLimit,
        skip: userPostSkip,
        language: "english",
        ownerId: selfUserId,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "User-Agent": "b3ca0e3ea01debb4",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`error while comment ${error}`);
  }
};

export const sharePost = async (postId, ownerId) => {
  try {
    const response = await axios.post(
      CHINGARI_URL + "/post/sharePost",
      { postId: postId, ownerId: ownerId, userId: selfUserId, shareType: "0" },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`error while comment ${error}`);
  }
};

export const addComment = async (postId, ownerId) => {
  try {
    const response = await axios.post(
      CHINGARI_URL + "/post/v2/add_comment",
      { comment: "👍", postId: postId, ownerId: ownerId, userId: selfUserId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`error while comment ${error}`);
  }
};
