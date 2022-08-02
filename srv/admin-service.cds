using { com.sap.productcatalog as my } from '../db/schema';

service AdminService  {
  entity Products as projection on my.Products;
  entity Supliers as projection on my.Supliers;
  entity Categoris as select from my.Categoris;
  entity Orders as select from my.Orders;
}