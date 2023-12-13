import config from "config";
import dayjs from "dayjs";

const { accessTokenExpiresIn, refreshTokenExpiresIn } = config.get<any>("token");

export const accessTokenCookieOptions = {
  expires: dayjs().add(accessTokenExpiresIn, 'minutes').toDate(),
  maxAge: accessTokenExpiresIn * 60 * 1000,
  httpOnly: true,
  // sameSite: 'lax',
};

export const refreshTokenCookieOptions = {
    expires: dayjs().add(refreshTokenExpiresIn, 'minutes').toDate(),
    maxAge: refreshTokenExpiresIn * 60 * 1000,
    httpOnly: true,
    // sameSite: "lax",
};

export const loginTokenCookieOptions = {
    ...accessTokenCookieOptions,
    httpOnly: true
};