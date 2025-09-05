// type Side = "BUY" | "SELL";
// type OrderStatus = "NEW" | "FILLED" | "CANCELED" | "REJECTED";

// class Order {
//   constructor(
//     private readonly id: string,
//     private readonly symbol: string,
//     private readonly side: Side,
//     private readonly qty: number,
//     private readonly price: number,
//     private status: OrderStatus = "NEW"
//   ) {}
//   getId() { return this.id; }
//   getSymbol() { return this.symbol; }
//   getSide() { return this.side; }
//   getQty() { return this.qty; }
//   getPrice() { return this.price; }
//   getStatus() { return this.status; }
//   protected setStatus(s: OrderStatus) { this.status = s; }
// }

// class Portfolio {
//   constructor(private _balance: number) {}
//   get balance() { return this._balance; }
//   deposit(amount: number): void { /* stub */ }
//   withdraw(amount: number): void { /* stub */ }
// }

// interface IExchange {
//   placeOrder(order: Order): Promise<string>;
//   cancelOrder(orderId: string): Promise<void>;
//   getBalance(): Promise<number>;
// }

// interface IStrategy {
//   onStart(): void;
//   onTick(): void;
//   onStop(): void;
// }

// abstract class BaseBot {
//   start() { this.onStart(); }
//   stop() { this.onStop(); }
//   protected abstract onStart(): void;
//   protected abstract onStop(): void;
// }

// // Polymorphism via strategies
// class MeanReversionStrategy implements IStrategy {
//   onStart() { console.log("MR start"); }
//   onTick()  { console.log("MR tick"); }
//   onStop()  { console.log("MR stop"); }
// }

// // Exchanges (not portfolios)
// class BinanceExchange implements IExchange {
//   constructor(private spotBalance: number) {}
//   async placeOrder(order: Order): Promise<string> { return "order-id"; }
//   async cancelOrder(orderId: string): Promise<void> {}
//   async getBalance(): Promise<number> { return this.spotBalance; }
// }

// class MexcExchange implements IExchange {
//   constructor(private spotBalance: number) {}
//   async placeOrder(order: Order): Promise<string> { return "order-id"; }
//   async cancelOrder(orderId: string): Promise<void> {}
//   async getBalance(): Promise<number> { return this.spotBalance; }
// }
