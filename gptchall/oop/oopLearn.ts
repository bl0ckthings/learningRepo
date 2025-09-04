
class Order {
    constructor(
        private readonly id: string,
        private status: 'NEW'| 'FILLED'| 'CANCELED' = "NEW"
    ) {}

    getId() { return this.id}
    getStatus() {return this.status}
    protected setStatus(s:'NEW'| 'FILLED'| 'CANCELED' ) {
        this.status = s
    }

}

class Portfolio  {
    constructor(
        private  _balance:number,
    ) {}
    get balance() {
         return this._balance
    }
    deposit(amount:number) :void{}
    withdraw(amount: number): void{} 

}


class BinancePortfolio extends Portfolio {

    constructor(
        public binanceSpotBalance:number
    ) {
        super(binanceSpotBalance)
    } 

    getBinanceBalance(amount: number) {
        return this.binanceSpotBalance
    }

    deposit(amount: number): void {
    
    }
    withdraw(amount: number): void {
        
    }
    
}

class MEXC extends Portfolio {

    constructor(
        public mexcSpotBalance:number
    ) {
        super(mexcSpotBalance)
    } 

    getMEXCBalance(amount: number) {
        return this.mexcSpotBalance
    }

    deposit(amount: number): void {
    
    }
    withdraw(amount: number): void {
        
    }
    
}



interface IExchange {
    placeStart()
    cancelorder()
    getBalance() 
}
interface IStrategy {
    onStart()
    onTick()
    onStop()
}
const runtime: boolean= false


abstract class BaseBot  {
    start() {
        this.onStart()

    }
    stop() {
        this.onStop();
    }

    protected abstract onStart(): void
    protected abstract onStop(): void

}


class MeanReversionStrategy implements IStrategy {
    onStart ()  {
        if (!runtime) {
            return;
        }
        console.log(Date.now())
    }
    onTick() {
        if (!runtime) {
            return;
        }
        console.log("FETCHING NEW MEV MOVE...")
    }
    onStop() {
        if (!runtime) {
            return;
        }
        console.log('Shuting down the bot...')
    }
}  

