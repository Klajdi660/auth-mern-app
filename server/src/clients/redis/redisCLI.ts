import { Redis } from "ioredis";
import config from "config";
import { RedisParams } from "../../types";

const redisPath = config.get<RedisParams>("redis_feed");

export const redisCLI = new Redis(redisPath);
