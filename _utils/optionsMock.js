const RoomType = [
	{
		name: "LivingRoom",
		displayName: "Living Room"
	},
	{
		name: "Bedroom",
		displayName: "Bedroom"
	},
	{
		name: "Entryway",
		displayName: "Entryway"
	},
	{
		name: "KidBedroom",
		displayName: "Kid's Bedroom"
	},
	{
		name: "Studio",
		displayName: "Studio"
	},
	{
		name: "Nursery",
		displayName: "Nursery"
	}
];

const Budget = [
	{
		name: "2000",
		displayName: "$2000 or less"
	},
	{
		name: "2000-5000",
		displayName: "$2000 - $5000"
	},
	{
		name: "5000-7000",
		displayName: "$5000 - 7000"
	},

	{
		name: "10000",
		displayName: "$10,000 or More"
	}
];

const CurrentRoomStatus = [
	{
		name: "scratch",
		displayName: "Looking to design from scratch"
	},
	{
		name: "keyItems",
		displayName: "I am looking for key items only"
	},
	{
		name: "furnished",
		displayName: "Its almost furnished but need help finishing it"
	},
	{
		name: "new",
		displayName: "Need help with a new layout"
	}
];

module.exports = { RoomType, Budget, CurrentRoomStatus };
