// var cron = require('node-cron');
import * as cron from "node-cron";
import { follow, getTrendingPost, postLike, visitPost } from "./util.js";

let cronTaskRunning = false

cron.schedule("*/10 * * * * *", async () => {
    if(cronTaskRunning){
        return
    }
    cronTaskRunning = true
  try {
    let count = 1;
    let limit = 10;
    let skip = 0;

    // get trending posts
    do {
      const trendingPosts = await getTrendingPost(skip, limit);

      for (let posts of trendingPosts) {

        //  await visitPost(posts._id);
        //  await postLike(posts._id, posts.ownerData._id);
        // await follow(posts.ownerData._id);

      }

      console.log("skip:",skip,"limit:",limit)
      count =count+ 1;
      skip = limit * count;

    } while (count < 5);

    console.log("Cron done running",cronTaskRunning,new Date().toLocaleString())
    cronTaskRunning = false

  } catch (error) {
    cronTaskRunning = false

    console.log("error in cron restarting the cron", error);
  }

  // for every post do like,watch, follow, get follow back also comment
});
