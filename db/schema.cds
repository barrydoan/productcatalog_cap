namespace com.sap.productcatalog;

using { Currency, managed, cuid } from '@sap/cds/common';


entity Products : managed {
    key ID : Integer;
    name  : String(111);
    stock  : Integer;
    acqCost: Decimal(9,2);
    retailPrice  : Decimal(9,2);
    awp: Decimal(9,2);
    storeId: String(8);
    NDC: String(20);
    UPC: String(20);
    currency : Currency;
    suplier: Association to Supliers;
    category: Association to Categoris;
    image : LargeBinary @Core.MediaType: 'image/png';
    imageUrl  : String @Core.IsURL @Core.MediaType: 'image/png';
}


entity Supliers : managed {
    key ID : Integer;
    name   : String(111);
    status: String(10);
    products  : Association to many Products on products.suplier = $self;
}

entity Categoris: managed {
    key ID : Integer;
    name   : String(111);
    products : Association to many Products on products.category = $self;
}

entity Orders : cuid, managed {
    OrderNo  : String @title:'Order Number'; //> readable key
    Items    : Composition of many OrderItems on Items.parent = $self;
    total    : Decimal(9,2) @readonly;
    currency : Currency;
}

entity OrderItems : cuid {
    parent    : Association to Orders;
    product      : Association to Products;
    amount    : Integer;
    netAmount : Decimal(9,2);
}


