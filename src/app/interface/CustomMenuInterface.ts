export class CustomMenuInterface {
    ingredients: [{id: string, name: string, type: number, price: number}];
    portions: [{id: string, displayName: string, name: string, price: number, setmenu_type: number}];
    carbs: [{id: string, name: string, price: number}];
    totalPrice: number;
    previousCarbPrice: number;
    previousPortionPrice: number;
}
