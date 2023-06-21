import { Config } from "./config";
import { initConfig } from "./sheets";

function sendTypetalkMessage(text: string, config: Config) {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      "X-TYPETALK-TOKEN": config.typetalkToken,
    },
    payload: {
      message: text,
    },
  };
  UrlFetchApp.fetch(config.typetalkUrl, options);
}

type Post = {
  id: number;
  topicId: number;
  message: string;
};

export function observe(post: Post) {
  const config = initConfig();
  if (config === null) {
    console.error("It works! but no config.");
    return;
  }
  const zoomRegex = /https:\/\/.*zoom\.us\/j\/\d+/;
  if(post.message?.match(zoomRegex) !== null) {
    const postUrl = `https://typetalk.com/topics/${post.topicId}/posts/${post.id}`;
    sendTypetalkMessage(postUrl, config);
  }
}

export const doPost = (event: GoogleAppsScript.Events.DoPost) => {
  let contents
  try {
    contents = JSON.parse(event.postData.contents);
  } catch (e) {
    console.error("cannot parse event.postData.contents");
    return;
  }
  const post: Partial<Post> = {
    id: contents?.post?.id as undefined,
    topicId: contents?.post?.topicId as undefined,
    message: contents?.post?.message as undefined,
  };
  if (Object.keys(post).some((key) => post[key as keyof Post] === null)) {
    console.error("no post body.");
    return;
  }

  // Is there a better code ......
  observe(post as Post);
};
