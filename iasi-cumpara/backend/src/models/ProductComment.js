class ProductComment{
    constructor(id, productId, userId, comment, date) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.comment = comment;
        this.date = date;
    }
}

module.exports = ProductComment