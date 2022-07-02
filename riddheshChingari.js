// var cron = require('node-cron');
import * as cron from "node-cron";
import { follow, getTrendingPost, postLike, visitPost, followingPosts,getPostByUserId } from "./riddhestchingari.util.js";

let cronTaskRunning = false

cron.schedule("*/90 * * * * *", async () => {
  if(cronTaskRunning){
      return
  }
  console.log("RIddhesh cron started")
  cronTaskRunning = true
try {
  let count = 1;
  let limit = 10;
  let skip = 0;
  const waittime=5000
  let next 
  // get trending posts
  do {
  const trendingPosts = await getTrendingPost(skip, limit);
    //  const trendingPosts = await followingPosts(next);
    //  next= trendingPosts.next
    for (let posts of trendingPosts) {
      console.log(posts.userId)
      let userPostLimit = 50;
      let userPostSkip = 0;
      let userCount = 0;
      let  userPosts
      await follow(posts.ownerData._id);

      // do {
        
        userPosts = await getPostByUserId(posts.userId,userPostLimit,userPostSkip)
        for(let [i,userPost] of userPosts.data.entries()){
          console.log(userPosts.hasMoreData,userPosts.data.length,i,userPost.post.mediaLocation.duration)

           await visitPost(userPost.post._id,userPost.post.mediaLocation.duration?userPost.post.mediaLocation.duration:47);
          await postLike(userPost.post._id, userPost.post.ownerData._id);
          await delay(2000)
  
        }
      // } while (i<userPosts.data.length);

      userCount = userCount+ 1;
      userPostSkip = userPostLimit * userCount;
      await delay(4000)
    }
  console.log("RIddhesh cron one post completed")
    
    console.log("skip:",skip,"limit:",limit)
    count =count+ 1;
    skip = limit * count;

  } while (count < 10);

  console.log("Cron done running",cronTaskRunning,new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'}) )
  cronTaskRunning = false

} catch (error) {
  cronTaskRunning = false
  delay(60000)
  console.log("error in cron restarting the cron", error);
}

// for every post do like,watch, follow, get follow back also comment
});

const delay = ms => new Promise(res => setTimeout(res, ms));

