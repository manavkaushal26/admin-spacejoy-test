import cookie from "js-cookie";
import nextCookie from "next-cookies";

export default function getCookie(ctx, name) {
	const cookieValue = ctx && ctx.req ? nextCookie(ctx)[name] : cookie.get(name);
	return cookieValue === "undefined" ? undefined : cookieValue;
}
