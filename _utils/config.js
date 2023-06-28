const isProduction = process.env.NODE_ENV === "production";

const page = {
	appName: "SpaceJoyWeb",
	apiBaseUrl: isProduction ? "https://api.spacejoy.com/api" : "http://localhost:3000/api",
	localApiBaseUrl: "172.20.10.111:3000",
	placeKey: "AIzaSyDsLNNs6HOOBILlbiMfr9hn9w3_CTxPlRA",
	googleSiteVerification: "AvMwlYBDLdgqosxOUuNf114TxPVJtkY3lm3jxDpqLMY",
	googleAPIKey: "AIzaSyC1Ak54VCskX74P9v0h8Mii5mP3e5hqRo0",
	googleClientId: "628064588100-islor8kv96kol2rjrocarhqs4d604vec.apps.googleusercontent.com",
	tinyMceApiKey: "nodxa0klye29turh3kyb50oizr3vzfpjakvcb1bfwg6heqrq",
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
	whatsAppShareBaseUrl: "https://api.whatsapp.com/send",
	WssUrl: isProduction
		? "wss://api.spacejoy.com/socket.io/?EIO=4&transport=websocket"
		: "wss://api-staging.spacejoy.com/socket.io/?EIO=4&transport=websocket",
};

const pusherConfig = {
	key: isProduction ? "7eb73052d6fa4a2a9b93" : "314266fb5ade06ca76e1",
	cluster: "ap2",
};

const projectConfig = {
	lifetime: 7,
};

const cookieNames = {
	authToken: "token",
	userRole: "role",
};

const company = {
	logo: isProduction ? "v1578101355/shared/spacejoy-logo_ase39m.jpg" : "v1578482972/shared/spacejoy-logo_rdqft7.jpg",
	name: "Neo Design Labs Inc",
	product: "Spacejoy-Dashboard",
	tagLine: "Designing your imagination",
	url: isProduction ? "https://admin.spacejoy.com" : "https://staging-admin.spacejoy.com",
	customerPortalLink: isProduction ? "https://spacejoy.com" : "https://staging.spacejoy.com",
	country: "us",
	subject: "Dashboard to manage customer projects",
	description: "Dashboard for managing customer projects by Spacejoy employees",
	email: {
		support: "hello@spacejoy.com",
		connect: "",
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
			plusCode: "2G73+GH Santa Monica, California, USA",
		},
	],
	social: {
		facebook: "https://www.facebook.com/spacejoyapp/",
		linkedin: "https://www.linkedin.com/company/spacejoy/",
		twitter: "https://twitter.com/spacejoyapp/",
		instagram: "https://www.instagram.com/spacejoyapp/",
		pinterest: "https://in.pinterest.com/spacejoyapp/",
	},
	app: {
		android: "https://play.google.com/store/apps/details?id=com.homefuly.idsuite.retail",
		ios: "https://apps.apple.com/us/app/spacejoy-home-design-makeover/id1484078338",
	},
};

const firebaseConfig = {
	apiKey: "AIzaSyC1Ak54VCskX74P9v0h8Mii5mP3e5hqRo0",
	authDomain: "formal-envelope-244206.firebaseapp.com",
	databaseURL: "https://formal-envelope-244206.firebaseio.com",
	projectId: "formal-envelope-244206",
	storageBucket: "formal-envelope-244206.appspot.com",
	messagingSenderId: "628064588100",
	appId: "1:628064588100:web:2a7a4821cc945c8e238711",
	notificationDatabase: isProduction ? "notification" : "notificationStaging",
	databaseId: isProduction ? "siteConfig" : "siteConfig-devStaging",
	documentId: "main",
};

// ${secureDeliveryURL}/image/upload/v1566896729/web/design-page-banner.jpg
const cloudinary = {
	cloudName: "spacejoy",
	apiKey: "432541925957862",
	apiSecret: "dhn4tENhmmFqoefnjWXtcjlkfUw",
	environmentVariable: "CLOUDINARY_URL=cloudinary://432541925957862:dhn4tENhmmFqoefnjWXtcjlkfUw@spacejoy",
	baseDeliveryURL: "//res.cloudinary.com/spacejoy",
	apiBaseURL: "//api.cloudinary.com/v1_1/spacejoy",
};

module.exports = {
	page,
	firebaseConfig,
	cookieNames,
	company,
	cloudinary,
	projectConfig,
	pusherConfig,
};
