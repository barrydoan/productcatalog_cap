sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "frontend/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/Device',
    "sap/ui/table/RowAction",
	"sap/ui/table/RowActionItem",
    'sap/ui/model/Sorter',
    'sap/ui/model/odata/v4/ODataModel'
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Fragment, Device, Sorter, ODataModel, RowAction, RowActionItem) {
    "use strict";

    return BaseController.extend("frontend.controller.CartDetailView", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {

            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.setModel(oViewModel, "objectView");
            var view = this.getView();
            console.log("View", view);

            var table = this.byId("table");

            this.cartId = '';


            
            
            var route = this.getRouter().getRoute("RouteCartDetailView");
            console.log("route", route);
            route.attachPatternMatched(this._attachPatternMatched, this);
            
            
        },

        _attachPatternMatched: function(oEvent) {
            console.log("oEvent", oEvent);
            this.cartId = oEvent.getParameters().arguments.cartId;
            console.log("cartId", this.cartId);
            var a = this.getView();
            console.log("view", a);
            var that = this;
            // get cart detail
            this.getCartDetail(this.cartId);
            // get cart item
            this.getCartItem(this.cartId);
        },

        onDeleteClicked: function(oEvent) {
            var button = oEvent.getSource();
            console.log(button.oParent)
            var cartItemId = jQuery.sap.byId(button.oParent.sId).find("[name='cartItemId']").val();
            console.log("cartItemId", cartItemId);
            var that = this;
            jQuery.ajax(
                origin + "/cart/CartItems(" + cartItemId + ")",
                {
                    contentType : 'application/json',
                    type : 'DELETE',
                    success: function () {
                        // update cart items
                        that.getCartItem(that.cartId);
                        // update cart detail
                        that.getCartDetail(that.cartId);
                    }
                },
                
            ); 
        },

        onEditClicked: function(oEvent) {
            var button = oEvent.getSource();
            console.log(button.oParent)
            var cartItemId = jQuery.sap.byId(button.oParent.oParent.sId).find("[name='cartItemId']").val();
            console.log("cartItemId", cartItemId);
            var parentId = jQuery.sap.byId(button.oParent.sId).find("[name='parentId']").val();
            console.log("parentId", parentId);
            var productId = jQuery.sap.byId(button.oParent.sId).find("[name='productId']").val();
            console.log("productId", productId);
            var quantity = jQuery.sap.byId(button.oParent.oParent.sId).find("[name='quantity']").val();
            console.log("quantity", quantity);
            var that = this;
            if (quantity > 0) {
                var data = 
                {
                    "parent_ID": parentId,
                    "product_ID":  parseInt(productId),
                    "amount": parseInt(quantity)
                }
                // update quantity
                jQuery.ajax(
                    origin + "/cart/CartItems/" + cartItemId,
                    {
                        data:  JSON.stringify(data),
                        contentType : 'application/json',
                        type : 'PUT',
                        success: function () {
                            // update cart items
                            that.getCartItem(that.cartId);
                            // update cart detail
                            that.getCartDetail(that.cartId);
                        }
                    }
                ); 
            }
        },

        onEditCartNoClicked: function(oEvent) {
            var button = oEvent.getSource();
            var cartNo = jQuery.sap.byId(button.oParent.sId).find("[name='cartNo']").val();
            var that = this;
            var data = {
                "ID": this.cartId,
                "CardNo": cartNo
            }
            jQuery.ajax(
                origin + "/cart/Carts/" + this.cartId,
                {
                    contentType : 'application/json',
                    type : 'PUT',
                    data: JSON.stringify(data),
                    success: function(data) {
                        that.getCartDetail(that.cartId)
                    }
                },
            ); 
        },

        getCartItem: function(cartId) {
            var that = this;
            // get cart item 
            var listBinding = this._oDataModel.bindList("/CartItems", null, [], [new Filter("parent_ID", "EQ", cartId)], { $$updateGroupId: "CreateCart", $$operationMode: "Server", $expand: "product" });
            listBinding.requestContexts().then(function (aContexts) {
                var data = {
                    "value": [{
                        product: {
                            "createdAt": null,
                            "modifiedAt": null,
                            "ID": 16,
                            "shortId": "10146796",
                            "NDC": "00536-1006-01",
                            "UPC": "3-05361-00601-3",
                            "name": "ALLER CHLOR/CPM 4MG",
                            "stock": 12,
                            "acqCost": 1.45,
                            "retailPrice": 7.3,
                            "awp": 5.7,
                            "rebate": 0,
                            "perDose": 0.01,
                            "unitSize": 100,
                            "form": "TABLET",
                            "caseQuantity": null,
                            "imageUrl": "10146796-264410-Abc700Wx700H.jpg",
                            "data@odata.mediaContentType": "application/binary",
                            "currency_code": "USD",
                            "supplier_ID": 29,
                            "category_ID": 2,
                            "categoryName": "OT Over the Counter",
                            "supplierName": "RUGBY"
                        }
                    }]
                };
                aContexts.forEach(function (oContext) {
                    oContext.requestObject().then(function(object) {
                        data.value.push(object)
                    });
                    
                });
                var cartItemsModel = new JSONModel(data);
                that.setModel(cartItemsModel, "cartItemsModel2");
                console.log("cartItemsModel2", that.getModel("cartItemsModel2"));
                

            });

            
            jQuery.ajax(
                "/cart/CartItems?$filter=parent_ID eq " + cartId + "&$expand=product",
                {
                    contentType : 'application/json',
                    type : 'GET',
                    success: function (data) {
                        console.log("data", data)
                        var cartItemsModel = new JSONModel(data);
                        that.setModel(cartItemsModel, "cartItemsModel");
                        console.log("cartItemsModel", cartItemsModel);
                    }
                },
                
            ); 
        
            
            
        },

        getCartDetail: function(cartId) {
            var that = this;
            jQuery.ajax(
                origin + "/cart/Carts(" + this.cartId + ")?&$expand=Items",
                {
                    contentType : 'application/json',
                    type : 'GET',
                    success: function (data) {
                        var cartDetailModel = new JSONModel(data);
                        console.log("cartDetaiModel", cartDetailModel);
                        that.setModel(cartDetailModel, "cartDetailModel");
                        // get detail of product
                        var items = data.Items;
                        console.log("items", items);
                    }
                },
                
            ); 
        }
        
    });

});