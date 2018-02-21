export class SignatureMenuInterface {
    setmenu: {id: string, name: string, description: string, price: number, newPrice: number};
    ingredients: [{id: string, name: string, type: number, price: number}];
    portions: [{id: string, displayName: string, name: string, price: number, setmenu_type: number}];
}
