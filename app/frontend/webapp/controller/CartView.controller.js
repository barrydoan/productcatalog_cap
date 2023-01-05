sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "frontend/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/Fragment',
    'sap/ui/Device',
    'sap/ui/model/Sorter',
    'sap/ui/model/odata/v4/ODataModel'
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Fragment, Device, Sorter, ODataModel) {
    "use strict";

    return BaseController.extend("frontend.controller.controller.CartView", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            var table = this.byId("table");
            console.log("table", table)
        },

        showCartDetail: function(oEvent) {
            var source = oEvent.getSource();
            var context = source.getBindingContext();
            var cartId = context.getProperty("ID");
            console.log("id", cartId);
            // navigate to cart detail page
            this.getRouter().navTo("RouteCartDetailView", {
                cartId: cartId
            });
            
        },
        onCreateClicked: function(oEvent) {
            var view = this.getView();
            var date = new Date();
            var formatedDate = date.getFullYear() + "-" + (date.getMonth() < 8 ? "0" + date.getMonth(): date.getMonth()) + "-" + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
            var newCartModel = new JSONModel({
                cartNo:formatedDate,
                total: 0.00
            })
            if (!this.createCartDialog) {
                this.createCartDialog = Fragment.load({
					id: "createCartDialog",
                    name: "frontend.view.CreateCartDialog",
					controller: this
				})
            }
            this.createCartDialog.then(function(oDialog) {
                console.log("dialog", oDialog);
                oDialog.setModel(newCartModel)
                var model = oDialog.getModel();
                console.log("model", model)
				oDialog.open();
			});

        },
        onDialogCancelClicked: function(oEvent) {
            this.createCartDialog.then(function(oDialog) {
                oDialog.close();
            })
        },
        onRefresh: function () {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },
        onDialogOkClicked: function(oEvent) {
            var that = this;
            this.createCartDialog.then(function(oDialog) {
                console.log("oData", oDialog.getModel().oData);
                var data = {
                    "CardNo": oDialog.getModel().oData.cartNo,
                    "total": oDialog.getModel().oData.total
                }
                // create new cart
                var listBinding = that._oDataModel.bindList('/Carts', undefined, undefined, undefined, { $$updateGroupId: "CreateCart" });
                var context = listBinding.create(data);
                context.created();
                that._oDataModel.submitBatch("CreateCart").then(function () {
                    that.onRefresh();
                    oDialog.close();
                });
            });
        }, 
        onDeleteClicked: function(oEvent) {
            var button = oEvent.getSource();
            console.log(button.oParent)
            var cartId = jQuery.sap.byId(button.oParent.sId).find("[name='cartId']").val();
            console.log("cartId", cartId);
            var that = this;
            // delete cart 
            var listBinding = this._oDataModel.bindList('/Carts');
            listBinding.requestContexts().then(function (aContexts) {
                aContexts.forEach(function (oContext) {
                    if (oContext.getProperty("ID") === cartId) {
                        oContext.delete().then(function () {
                            that.onRefresh();
                        });
                    }
                });
            });
        },
        onAcceptClicked: function(oEvent) {
            var button = oEvent.getSource();
            var cartId = jQuery.sap.byId(button.oParent.oParent.sId).find("[name='cartId']").val();
            console.log("cartId", cartId);
            var cartNo = jQuery.sap.byId(button.oParent.sId).find("[name='cartNo']").val();
            console.log("cartNo", cartNo);
            // update cart
            var data = {
                "ID": cartId,
                "cardNo": cartNo
            }
            var that = this;
            // update cart
            var cart = this._oDataModel.bindContext('/Carts(' + cartId + ')',undefined, undefined, undefined, { $$updateGroupId: "UpdateCart" });
            cart.requestObject().then(function (cartValue) {
                if (cartValue) {
                    cartValue.cardNo = cartNo;
                }
                
            });
            that._oDataModel.submitBatch("UpdateCart").then(function () {
                console.log("refesh")
                that.onRefresh();
            });
        }
    });

});