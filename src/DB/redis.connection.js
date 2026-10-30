import { createClient } from "redis";
import { REDIS_URI } from "../config/config.js";

export const client = createClient({ url: REDIS_URI });

export async function connectRedis() {
  try {
    await client.connect();
    console.log("Redis Connected");
  } catch (error) {
    console.log("Redis Connection Failed");
    console.log(error);
  }
}
