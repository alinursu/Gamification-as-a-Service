class Order {
    constructor(id, userId, productId, quantity, dateAcquired) {
        this.id = id
        this.userId = userId
        this.productId = productId
        this.quantity = quantity
        this.dateAcquired = dateAcquired
    }
}

module.exports = Order