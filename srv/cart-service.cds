using { com.sap.productcatalog as my } from '../db/schema';

@path:'/cart'
service CartService {
    entity Carts as projection on my.Carts;
    entity CartItems as SELECT from my.CartItems
}