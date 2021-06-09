class Product{
    constructor(id,name,price,description,category,images) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category= category;
        this.description = description;
        this.images = images;
    }
}

module.exports = Product