export class OrderInterface {
    order: {
        customerId: string,
        grossTotal: number,
        id: string,
        nettTotal: number,
        notes: string,
        orderDate: any,
        status: number,
        tax: number
    };
    orderDetailDTO: any[];
};
