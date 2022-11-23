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
            
        }
    });

});