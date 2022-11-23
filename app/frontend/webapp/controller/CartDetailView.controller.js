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
            
            
            var route = this.getRouter().getRoute("RouteCartDetailView");
            console.log("route", route);
            route.attachPatternMatched(this._attachPatternMatched, this);
            
            
        },

        _attachPatternMatched: function(oEvent) {
            console.log("oEvent", oEvent);
            var cartId = oEvent.getParameters().arguments.cartId;
            console.log("cartId", cartId);
            var a = this.getView();
            console.log("view", a);
            var that = this;
            jQuery.ajax(
                origin + "/cart/Carts(" + cartId + ")?&$expand=Items",
                {
                    contentType : 'application/json',
                    type : 'GET',
                    success: function (data) {
                        var cartDetailModel = new JSONModel(data);
                        console.log("cartDetaiModel", cartDetailModel);
                        that.setModel(cartDetailModel, "cartDetailModel");
                    }
                },
                
            ); 
        },

        
    });

});