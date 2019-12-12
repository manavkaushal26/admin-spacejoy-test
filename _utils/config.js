const page = {
	appName: "SpaceJoyWeb",
	apiBaseUrl: "https://api.spacejoy.com/api",
	stageApiBaseUrl: "https://server.staging.spacejoy.com/api",
	placeKey: "AIzaSyDsLNNs6HOOBILlbiMfr9hn9w3_CTxPlRA",
	googleSiteVerification: "AvMwlYBDLdgqosxOUuNf114TxPVJtkY3lm3jxDpqLMY",
	googleAPIKey: "AIzaSyC1Ak54VCskX74P9v0h8Mii5mP3e5hqRo0",
	googleClientId: "628064588100-islor8kv96kol2rjrocarhqs4d604vec.apps.googleusercontent.com",
	ga: "UA-145327802-1",
	gtm: "GTM-WC4HSB6",
	optimize: "GTM-KKZ3VGJ",
	stripe: "pk_live_74NmugK4189bLTq0H74tvVz300grMkWE5n",
	CLEVERTAP_ACCOUNT_ID: "69R-KW5-465Z",
	playStoreUrl: "https://play.google.com/store/apps/details?id=com.homefuly.idsuite.retail",
	playStoreId: "com.homefuly.idsuite.retail",
	appStoreUrl: "https://apps.apple.com/us/app/homefuly/id1448690338",
	appStoreId: "1448690338",
	facebookPageId: "652491341906462",
	facebookAppId: "652491341906462",
	pinterestAppId: "78963155e9328e543f3c8741e7afb48c",
	whatsAppShareBaseUrl: "https://api.whatsapp.com/send"
};

const projectConfig = {
	lifetime: 7
};

const cookieNames = {
	authToken: "token",
	userRole: "role"
};

const company = {
	logo: "v1573706986/shared/logo_h2nngf.svg",
	name: "Neo Design Labs Inc",
	product: "Spacejoy",
	tagLine: "Designing your imagination",
	url: "//spacejoy.com",
	country: "us",
	subject: "Smart Online Interior Design & Decorating in 3D",
	description: "Experience the joy of designing your home in 3D using products from brands you can buy immediately",
	email: {
		support: "hello@spacejoy.com",
		connect: ""
	},
	address: [
		{
			location1: "1450 2nd Street",
			location2: "155 Santa Monica",
			city: "LA",
			state: "California",
			country: "USA",
			pin: "90401",
			latitude: "",
			longitude: "",
			plusCode: "2G73+GH Santa Monica, California, USA"
		}
	],
	social: {
		facebook: "https://www.facebook.com/spacejoyapp/",
		linkedin: "https://www.linkedin.com/company/spacejoy/",
		twitter: "https://twitter.com/spacejoyapp/",
		instagram: "https://www.instagram.com/spacejoyapp/",
		pinterest: "https://in.pinterest.com/spacejoyapp/"
	},
	app: {
		android: "https://play.google.com/store/apps/details?id=com.homefuly.idsuite.retail",
		ios: "https://apps.apple.com/us/app/spacejoy-home-design-makeover/id1484078338"
	}
};

// ${secureDeliveryURL}/image/upload/v1566896729/web/design-page-banner.jpg
const cloudinary = {
	cloudName: "spacejoy",
	apiKey: "432541925957862",
	apiSecret: "dhn4tENhmmFqoefnjWXtcjlkfUw",
	environmentVariable: "CLOUDINARY_URL=cloudinary://432541925957862:dhn4tENhmmFqoefnjWXtcjlkfUw@spacejoy",
	baseDeliveryURL: "//res.cloudinary.com/spacejoy",
	apiBaseURL: "//api.cloudinary.com/v1_1/spacejoy"
};

const stagingCloudinary = {
	cloudName: "spacejoy-staging",
	apiKey: "549421365942597",
	apiSecret: "wzZmzPhV05-eCkbTC0xI2HNKg9Q",
	environmentVariable: "CLOUDINARY_URL=cloudinary://549421365942597:wzZmzPhV05-eCkbTC0xI2HNKg9Q@spacejoy-staging",
	baseDeliveryURL: "//res.cloudinary.com/spacejoy-staging",
	apiBaseURL: "//api.cloudinary.com/v1_1/spacejoy-staging"
};

module.exports = {
	page,
	cookieNames,
	company,
	cloudinary: process.env.NODE_ENV !== "production" ? cloudinary : stagingCloudinary,
	projectConfig
};
