import { doPost, observe } from "./main";

declare const global: {
  [x: string]: unknown;
};

global.doPost = doPost;
global.debug = observe;