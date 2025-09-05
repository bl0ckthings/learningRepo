export {};

/*********************************
 * 2) LSP Violation via Inheritance
 *********************************/

interface Shape {
  
  area(): number;
  
}


class Rectangle implements Shape {
    constructor(
      public width: number, 
      public height: number,
    ) {}
    setWidth(w: number) { this.width = w; }
    setHeight(h: number) { this.height = h; }
    area() { return this.width * this.height; }
  }
  
  class Square implements Shape {
    constructor(
      public length: number,
    ) {}
    
    setLength(l: number) { 
        this.length = l;  
    }
    
    area() { 
        return this.length * this.length;  
    }
}
  
  function printArea(shape: Shape) {
    
 
  }
  
  /*********************************
   * 3) Interface Segregation Violation (ISP)
   *********************************/
  
  interface IPrinter {
    print(doc: string): void;
  
  }
  interface IScanner {
    scan(): string;
  }

  interface IFaxer{
    fax(number: string, content: string): void;
  }
  class Printer implements Printer {
    // Forced to implement unused methods (ISP violation)
    print(doc: string): void { console.log("Printing:", doc); }
   
  }
  class Scanner implements Scanner {
    scan(): string { throw new Error("scan not supported"); }
  }

  class Faxer implements Faxer {
    fax(number: string, content: string): void { throw new Error("fax not supported"); }
  }
  
class SimplePrinter implements IPrinter,IScanner,IFaxer {
    constructor(
      private printer: IPrinter,
      private scanner: IScanner,
      private faxer: IFaxer,
     ) {}

     print(doc: string):void {
      this.printer.print(doc)
     }

     scan():string {
      return this.scanner.scan()
     }

     fax(number: string, content:string): void {
      this.faxer.fax(number,content)
     }
}

  

  /*********************************
   * 4) Dependency Inversion Violation (DIP)
   *********************************/
  
  class StripePaymentGateway { // concrete detail
    pay(amount: number) { console.log("Stripe paid:", amount); }
  }
  
  class CheckoutService { // high-level policy depending on concrete class
    private gateway = new StripePaymentGateway();
    checkout(amount: number) { this.gateway.pay(amount); }
  }
  
  /*********************************
   * 5) Open/Closed Violation via Giant If/Else
   *********************************/
  
  type NotificationType = "email" | "sms" | "push";
  
  class Notifier {
    notify(type: NotificationType, recipient: string, message: string) {
      if (type === "email") {
        console.log(`Email to ${recipient}: ${message}`);
      } else if (type === "sms") {
        console.log(`SMS to ${recipient}: ${message}`);
      } else if (type === "push") {
        console.log(`Push to ${recipient}: ${message}`);
      } else {
        throw new Error("Unknown notification type");
      }
    }
  }



// TESTING

  printArea(new Rectangle(2, 3)); // expected 20 after setters
printArea(new Square(2));     // surprising result due to LSP violation

const printer = new SimplePrinter();
try { printer.scan(); } catch (e) { console.log("Scan failed as expected"); }

const checkout = new CheckoutService();
checkout.checkout(99.99);

const notifier = new Notifier();
notifier.notify("email", "bob@example.com", "Hi Bob!");
