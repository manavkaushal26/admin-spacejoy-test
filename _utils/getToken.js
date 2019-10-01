import cookie from "js-cookie";
import nextCookie from "next-cookies";

export default function(ctx) {
	const token = ctx && ctx.req ? nextCookie(ctx).token : cookie.get("token");
	return token;
}
