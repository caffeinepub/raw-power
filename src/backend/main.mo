import Map "mo:core/Map";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";

actor {
  type Category = {
    #mass;
    #cut;
    #focus;
    #recovery;
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    tagline : Text;
  };

  module Product {
    public func compareByPrice(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.price, p2.price);
    };

    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  type ShippingInfo = {
    fullName : Text;
    email : Text;
    address : Text;
    city : Text;
    state : Text;
    zip : Text;
    country : Text;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #shipped;
    #delivered;
  };

  type Order = {
    id : Text;
    items : [CartItem];
    shipping : ShippingInfo;
    status : OrderStatus;
    totalCents : Nat;
    createdAt : Int;
  };

  // Product Catalog

  let productCatalog = Map.empty<Text, Product>();

  let seedProducts : [Product] = [
    {
      id = "mk677-anavar-turkesterone";
      name = "MK-677 + ANAVAR + TURKESTERONE";
      tagline = "20mg | 30 Pills";
      description = "A powerful combination formula: MK-677, Anavar, and Turkesterone. 20mg per pill, 30 pills per bottle.";
      price = 320000;
      category = #mass;
    },
  ];

  for (p in seedProducts.vals()) {
    productCatalog.add(p.id, p);
  };

  public shared func addProduct(product : Product) : async () {
    if (productCatalog.containsKey(product.id)) {
      Runtime.trap("Product already exists");
    };
    productCatalog.add(product.id, product);
  };

  public query func getProduct(productId : Text) : async ?Product {
    productCatalog.get(productId);
  };

  public query func getAllProducts() : async [Product] {
    productCatalog.values().toArray();
  };

  public query func getAllProductsByPrice() : async [Product] {
    productCatalog.values().toArray().sort(Product.compareByPrice);
  };

  public query func getProductsByCategory(category : Category) : async [Product] {
    productCatalog.values().toArray().filter(func(p) { p.category == category });
  };

  // Shopping Cart

  let carts = Map.empty<Principal, [CartItem]>();

  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat) : async () {
    if (quantity == 0) { Runtime.trap("Quantity must be greater than 0") };
    if (not productCatalog.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };

    let currentCart = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    var updated = false;
    let newCartItems = currentCart.map(
      func(item) {
        if (item.productId == productId) {
          updated := true;
          { productId; quantity = item.quantity + quantity };
        } else {
          item;
        };
      }
    );

    if (not updated) {
      carts.add(caller, newCartItems.concat([{ productId; quantity }]));
    } else {
      carts.add(caller, newCartItems);
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    switch (carts.get(caller)) {
      case (null) {
        Runtime.trap("Cart is empty");
      };
      case (?items) {
        let filtered = items.filter(func(item) { item.productId != productId });
        if (filtered.size() == items.size()) {
          Runtime.trap("Product not found in cart");
        };
        carts.add(caller, filtered);
      };
    };
  };

  public shared ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };
  };

  // Orders

  var orderCounter : Nat = 0;
  let orders = Map.empty<Principal, [Order]>();

  public shared ({ caller }) func placeOrder(shipping : ShippingInfo) : async Text {
    let cartItems = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) {
        if (items.size() == 0) { Runtime.trap("Cart is empty") };
        items;
      };
    };

    var total : Nat = 0;
    for (item in cartItems.vals()) {
      switch (productCatalog.get(item.productId)) {
        case (null) {};
        case (?product) {
          total += product.price * item.quantity;
        };
      };
    };

    orderCounter += 1;
    let orderId = "RP-" # orderCounter.toText();

    let newOrder : Order = {
      id = orderId;
      items = cartItems;
      shipping = shipping;
      status = #pending;
      totalCents = total;
      createdAt = Time.now();
    };

    let existingOrders = switch (orders.get(caller)) {
      case (null) { [] };
      case (?o) { o };
    };
    orders.add(caller, existingOrders.concat([newOrder]));

    carts.add(caller, []);

    orderId;
  };

  public shared ({ caller }) func getOrders() : async [Order] {
    switch (orders.get(caller)) {
      case (null) { [] };
      case (?o) { o };
    };
  };

  // Power Club Loyalty Program

  let loyaltyEmails = Set.empty<Text>();

  public shared func signupLoyalty(email : Text) : async () {
    if (loyaltyEmails.contains(email)) {
      Runtime.trap("Email already registered");
    };
    loyaltyEmails.add(email);
  };

  public query func isLoyaltyMember(email : Text) : async Bool {
    loyaltyEmails.contains(email);
  };
};
