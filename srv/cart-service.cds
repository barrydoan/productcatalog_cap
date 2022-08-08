using { com.sap.productcatalog as my } from '../db/schema';

@path:'/cart'
service CartService {
    entity Carts as projection on my.Carts;
    @readonly entity Products as SELECT from my.Products {
        *,
        category.name as category,
        supplier.name as supplier
    } excluding { createdBy, modifiedBy };
    entity CartItems as SELECT from my.CartItems {
        *,
        product.shortId,
        product.NDC,
        product.name,
        product.imageUrl,
        product.retailPrice,
        product.acqCost
    };
}