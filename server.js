async checkout() {
  try {
    const res = await fetch("https://school-dkny.onrender.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.customerName,
        phone: this.customerPhone,
        cart: this.cart
      })
    });

    const data = await res.json();
    console.log("ORDER RESPONSE:", data);

    if (!data.success) {
      throw new Error("Order failed");
    }

    alert("✅ Order saved successfully!");

    this.cart = [];
    this.customerName = "";
    this.customerPhone = "";
    this.fetchLessons();
    this.showCart = false;

  } catch (err) {
    console.error(err);
    alert("❌ Order failed - check console");
  }
}
