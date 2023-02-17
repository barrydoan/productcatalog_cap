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
            this.productId = "";

        
            var route = this.getRouter().getRoute("RouteProductDetailView");
            console.log("route", route);
            route.attachPatternMatched(this._attachPatternMatched, this);
            
        },

        _attachPatternMatched: function(oEvent) {
            console.log("oEvent", oEvent);
            this.productId = oEvent.getParameters().arguments.productId;
            console.log("productId", this.productId);
            this.getProductDetail(this.productId);
        },

        getProductDetail: function(productId) {
            var that = this;
            jQuery.ajax(
                that.getBaseUrl() + "/cart/Products(" + productId + ")",
                {
                    contentType : 'application/json',
                    type : 'GET',
                    success: function (data) {
                        console.log("data", data)
                        var productModel = new JSONModel(data);
                        that.setModel(productModel, "productDetailModel");
                        console.log("productDetailModel", that.getModel("productDetailModel"));
                    }
                },
                
            ); 
        }
        
    });

});