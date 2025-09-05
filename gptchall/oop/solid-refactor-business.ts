// Make this file a module to avoid global scope conflicts
export {};

type PaymentType = "card" | "paypal" | "crypto" | "applepay";

type OrderItem = { sku: string; qty: number; price: number };



type Order = {
  id: string;
  customerEmail: string;
  items: OrderItem[];
  paymentType: PaymentType;
  total?: number; 
};


// PRICING 

interface PricingService {
  calculate(order:Order): number;
}


class Pricing implements PricingService {
    calculate(order:Order) {
    const subtotal = order.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const tax = subtotal * 0.23; // Magic number tax rate
    const shipping = subtotal > 100 ? 0 : 9.99; // hard-coded shipping logic
    const total = subtotal + tax + shipping;
    return total
    }

    
}
// SQL MANAGER
interface OrderRepository {
  save(order: Order): void;
  findbyId(id: string): Order | undefined;
  findAll(): Order[];
}
class MySQLOrderRepository implements OrderRepository {

  save(order: Order): void {
    console.log("[MySQL] Saving order to:", order);
  }
  findbyId(id: string): Order | undefined {
    console.log("[MySQL] Finding order by id:", id);
    return undefined;
  }
  findAll(): Order[] {
    console.log("[MySQL] Finding all orders");
    return [];
  }
}
// NOTIFIER
type NotificationType = "email" | "sms";

interface INotifier {
  notify(recipient: string, message: string): void;
}

interface INotificationService {
  sendNotification(type: NotificationType, recipient: string, message: string): void;
}

// Factory for notification methods
class NotificationFactory {
  private static notificationMethods: Partial<Record<NotificationType, () => INotifier>> = {};

  static register(type: NotificationType, factory: () => INotifier) {
    this.notificationMethods[type] = factory;
  }

  static create(type: NotificationType): INotifier {
    const factory = this.notificationMethods[type];
    if (!factory) {
      throw new Error(`No notification method registered for type: ${type}`);
    }
    return factory();
  }
}

class EmailNotifier implements INotifier {
  notify(recipient: string, message: string) {
    console.log(`[Email] To: ${recipient} - ${message}`);
  }
}

// Auto-register email notifier
NotificationFactory.register("email", () => new EmailNotifier());

class SmsNotifier implements INotifier {
  notify(recipient: string, message: string) {
    console.log(`[SMS] To: ${recipient} - ${message}`);
  }
}

// Auto-register SMS notifier  
NotificationFactory.register("sms", () => new SmsNotifier());

class NotificationService implements INotificationService {
  sendNotification(type: NotificationType, recipient: string, message: string) {
    const notifier = NotificationFactory.create(type);
    notifier.notify(recipient, message);
  }
}



// PAYMENT PROCESSOR

interface IPayment {
  pay(amount:number): Promise<void>
}

interface IPaymentProcessor {
  processPayment(type: PaymentType, amount: number): Promise<void>;
}

// Factory for automatic payment method registration
class PaymentFactory {
  private static paymentMethods: Partial<Record<PaymentType, () => IPayment>> = {};

  static register(type: PaymentType, factory: () => IPayment) {
    this.paymentMethods[type] = factory;
  }

  static create(type: PaymentType): IPayment {
    const factory = this.paymentMethods[type];
    if (!factory) {
      throw new Error(`No payment method registered for type: ${type}`);
    }
    return factory();
  }

  static getAllRegisteredMethods(): Record<PaymentType, IPayment> {
    const methods: Record<PaymentType, IPayment> = {} as any;
    for (const [type, factory] of Object.entries(this.paymentMethods)) {
      methods[type as PaymentType] = factory();
    }
    return methods;
  }
}


class PayWithCard implements IPayment{
  async pay(amount: number) {
    console.log("[Stripe] Charging card $" + amount.toFixed(2));
  }
}

// Auto-register this payment method
PaymentFactory.register("card", () => new PayWithCard());

class PayWithPaypal implements IPayment  {
    async pay(amount: number) {
          console.log("[PayPal] Paying $" + amount.toFixed(2));
    }
}

// Auto-register this payment method
PaymentFactory.register("paypal", () => new PayWithPaypal());

class PayWithCrypto implements IPayment {
    async pay(amount: number) {
         console.log("[Crypto] Transferring $" + amount.toFixed(2));
    }
}

// Auto-register this payment method
PaymentFactory.register("crypto", () => new PayWithCrypto());

// Example: Adding a new payment method is now super easy!
// Just create the class and it auto-registers itself
class PayWithApplePay implements IPayment {
  async pay(amount: number) {
    console.log("[Apple Pay] Touch ID payment $" + amount.toFixed(2));
  }
}

// Auto-register this new payment method - that's it!
PaymentFactory.register("applepay", () => new PayWithApplePay());

class PaymentProcessor implements IPaymentProcessor {
  async processPayment(type: PaymentType, amount: number) {
    const paymentMethod = PaymentFactory.create(type);
    await paymentMethod.pay(amount);
  }
}


class OrderProcessor  {

  constructor(
    private notificationService: INotificationService,
    private pricing: PricingService,
    private orderRepository: OrderRepository,
    private paymentProcessor: IPaymentProcessor
  ) {}

  // Multiple responsibilities (SRP violation): pricing, payments, persistence, logging, emailing

  
  process(order: Order): boolean {
    console.log("Processing order:", order.id);

    // Calculate total (business rule + tax baked in)
    const total = this.pricing.calculate(order)

    // Process payment based on order's payment type
    this.paymentProcessor.processPayment(order.paymentType, total);
        
    // Save order
    this.orderRepository.save(order);

   
    // Send confirmation notification - determine type based on recipient
    const notificationType: NotificationType = order.customerEmail.includes("@") ? "email" : "sms";
    this.notificationService.sendNotification(
      notificationType, 
      order.customerEmail, 
      `Thanks for your order ${order.id}! Total: ${total}`
    );

    // Log everything (SRP again)
    console.log("Order processed successfully:", order);
    return true;
  }

 
}


const order: Order = {
    id: "ORD-123",
    customerEmail: "alice@example.com",
    items: [
      { sku: "AAA", qty: 2, price: 25 },
      { sku: "BBB", qty: 1, price: 60 },
    ],
    paymentType: "card",
  };
  
  // Create all dependencies
  const notificationService = new NotificationService();
  const pricingService = new Pricing();
  const orderRepository = new MySQLOrderRepository();
  const paymentProcessor = new PaymentProcessor();
  
  const processNewOrder = new OrderProcessor(
    notificationService, 
    pricingService, 
    orderRepository, 
    paymentProcessor
  );
  processNewOrder.process(order);

  // Example usage with explicit notification types
  notificationService.sendNotification("email", "bob@example.com", "Hi Bob!");
  notificationService.sendNotification("sms", "+1234567890", "Hi Bob!");
  notificationService.sendNotification("email", "alice@example.com", "Hi Alice!");
  notificationService.sendNotification("sms", "+9876543210", "Hi Alice!");
  notificationService.sendNotification("email", "charlie@example.com", "Hi Charlie!");
  notificationService.sendNotification("sms", "+5555555555", "Hi Charlie!");
  notificationService.sendNotification("email", "dave@example.com", "Hi Dave!");
  notificationService.sendNotification("sms", "+1111111111", "Hi Dave!");
  notificationService.sendNotification("email", "eve@example.com", "Hi Eve!");
  