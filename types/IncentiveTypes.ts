interface CartItem {
	_id: string;
	cart: string;
	product: string;
	quantity: number;
}
interface UserCartType {
	_id: string;
	user: string;
	items: CartItem[];
	size: number;
}

interface CartInfoProps {
	result: UserCartType[];
	totalCartSize: number;
}

export type { CartInfoProps };
