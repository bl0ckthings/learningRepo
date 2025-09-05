// solid-anti-pattern.ts
// Intentionally BAD code that violates multiple SOLID principles.
// Your challenge: refactor this into SOLID-compliant design.

/*********************************
 * 1) Massive God Class (SRP/OCP/DIP)
 *********************************/

type PaymentType = "card" | "paypal" | "crypto";

type OrderItem = { sku: string; qty: number; price: number };

type Order = {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  paymentType: PaymentType;
  total?: number; // calculated on the fly
};

class OrderProcessor {
  // LOW-LEVEL details stuffed in HIGH-LEVEL class (DIP violation)
  private connectionString = "mysql://user:pass@localhost:3306/shop";

  // Multiple responsibilities (SRP violation): pricing, payments, persistence, logging, emailing
  process(order: Order): boolean {
    console.log("Processing order:", order.id);

    // Calculate total (business rule + tax baked in)
    const subtotal = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const tax = subtotal * 0.23; // Magic number tax rate
    const shipping = subtotal > 100 ? 0 : 9.99; // hard-coded shipping logic
    const total = subtotal + tax + shipping;
    (order as any).total = total; // mutating input (yikes)

    // Save order directly to a specific DB (DIP + SRP violation)
    this.saveToMySQL(order);

    // Choose payment flow via switch (OCP violation)
    switch (order.paymentType) {
      case "card":
        this.chargeCard(total);
        break;
      case "paypal":
        this.payWithPaypal(total);
        break;
      case "crypto":
        this.payWithCrypto(total);
        break;
      default:
        throw new Error("Unsupported payment type");
    }

    // Send confirmation email (SRP violation)
    this.sendEmail(order.customerEmail, `Thanks for your order ${order.id}! Total: ${total}`);

    // Log everything (SRP again)
    console.log("Order processed successfully:", order);
    return true;
  }

  private saveToMySQL(order: Order) {
    // Direct DB logic in high-level class
    console.log("[MySQL] Saving order to:", this.connectionString);
    // imagine a bunch of SQL here
  }

  private chargeCard(amount: number) {
    // Hard-coded gateway
    console.log("[Stripe] Charging card $" + amount.toFixed(2));
  }

  private payWithPaypal(amount: number) {
    console.log("[PayPal] Paying $" + amount.toFixed(2));
  }

  private payWithCrypto(amount: number) {
    // Fake confirmation delay
    console.log("[Crypto] Transferring $" + amount.toFixed(2));
  }

  private sendEmail(to: string, body: string) {
    // Pretend SMTP here
    console.log(`[Email] To: ${to} Body: ${body}`);
  }
}

/*********************************
 * 2) LSP Violation via Inheritance
 *********************************/

class Rectangle {
  constructor(public width: number, public height: number) {}
  setWidth(w: number) { this.width = w; }
  setHeight(h: number) { this.height = h; }
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  // Inherits width/height but changes invariants (LSP violation)
  setWidth(w: number) { this.width = w; this.height = w; }
  setHeight(h: number) { this.height = h; this.width = h; }
}

function printArea(rect: Rectangle) {
  rect.setWidth(5); // expects area = 5 * originalHeight
  rect.setHeight(4); // expects area = 5 * 4
  console.log("Area is:", rect.area()); // With Square, behavior surprises callers
}

/*********************************
 * 3) Interface Segregation Violation (ISP)
 *********************************/

interface Machine {
  print(doc: string): void;
  scan(): string;
  fax(number: string, content: string): void;
}

class SimplePrinter implements Machine {
  // Forced to implement unused methods (ISP violation)
  print(doc: string): void { console.log("Printing:", doc); }
  scan(): string { throw new Error("scan not supported"); }
  fax(number: string, content: string): void { throw new Error("fax not supported"); }
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

/*********************************
 * USAGE (don’t change for your refactor tests)
 *********************************/

const order: Order = {
  id: "ORD-123",
  customerEmail: "alice@example.com",
  items: [
    { sku: "AAA", qty: 2, price: 25 },
    { sku: "BBB", qty: 1, price: 60 },
  ],
  paymentType: "card",
};

const processor = new OrderProcessor();
processor.process(order);

printArea(new Rectangle(2, 3)); // expected 20 after setters
printArea(new Square(2, 3));     // surprising result due to LSP violation

const printer = new SimplePrinter();
try { printer.scan(); } catch (e) { console.log("Scan failed as expected"); }

const checkout = new CheckoutService();
checkout.checkout(99.99);

const notifier = new Notifier();
notifier.notify("email", "bob@example.com", "Hi Bob!");
