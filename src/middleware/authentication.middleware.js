import { UnAuthorizeException } from "../common/exceptions/app.exceptions.js";
import { TokenTypeEnum } from "../common/enum/token.enum.js";
import { checkToken } from "../common/security/token.security.js";
import { getUserRevokeTokenKey, isExists } from "../common/cache.service.js";

// all APIs => access
// rotate => refresh

function auth(tokenType = TokenTypeEnum.ACCESS) {
  return async function (req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw UnAuthorizeException("You need to login");
    }

    const [key, credential] = authorization.split(" ");

    switch (key) {
      case "Basic":
        console.log(Buffer.from(credential, "base64").toString().split(":"));
        break;
      case "Bearer":
        const { user, payload } = await checkToken({
          token: credential,
          tokenType,
        });

        if (
          await isExists(
            getUserRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
          )
        ) {
          throw UnAuthorizeException({
            errMsg: "logged-out, Please login again",
          });
        }

        if (payload.iat < user.changeCredentialTime / 1000) {
          throw UnAuthorizeException({
            errMsg: "logged-out, Please login again",
          });
        }

        req.user = user;
        req.payload = payload;
        break;

      default:
        break;
    }

    next();
  };
}
export default auth;
