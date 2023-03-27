sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/RowAction",
    "sap/ui/table/RowActionItem",
    "sap/ui/table/RowSettings",
    "./BaseController",
    "sap/ui/core/Fragment",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, RowAction, RowActionItem, RowSettings, BaseController, Fragment) {
        "use strict";
        return BaseController.extend("admin.controller.ProductDetail", {
            onInit: function () {
                this.cartId = ""
                this._formFragments = {};

                var route = this.getRouter().getRoute("RouteCartDetail");
                route.attachPatternMatched(this._attachPatternMatched, this);
                this._showFormFragment("CartDetailDisplay")
            },

            _attachPatternMatched: function (oEvent) {
                console.log("oEvent", oEvent);
                this.cartId = oEvent.getParameters().arguments.cartId;
                console.log("cartId", this.cartId);
                this.getView().bindElement(`/Carts(${this.cartId})`);
            },

            _getFormFragment: function (sFragmentName) {
                var pFormFragment = this._formFragments[sFragmentName],
                    oView = this.getView();

                if (!pFormFragment) {
                    pFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "admin.view." + sFragmentName,
                        controller: this
                    });
                    this._formFragments[sFragmentName] = pFormFragment;
                }

                return pFormFragment;
            },

            _showFormFragment: function (sFragmentName) {
                var oPage = this.byId("page");
                oPage.removeAllContent();
                this._getFormFragment(sFragmentName).then(function (oVBox) {
                    oPage.insertContent(oVBox);
                });
            },
            _toggleButtonsAndView: function (bEdit) {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("edit").setVisible(!bEdit);
                oView.byId("save").setVisible(bEdit);
                oView.byId("cancel").setVisible(bEdit);

                // Set the right form type
                this._showFormFragment(bEdit ? "CartDetailChange" : "CartDetailDisplay");
            },

            handleEditPress: function () {
                this._toggleButtonsAndView(true);
            },

            handleCancelPress: function () {
                this._toggleButtonsAndView(false);

            },
            handleSavePress: function() {
                var that = this
                
                var oItems = this.getView().byId("tableedit").getRows();
                var oModel = this.getView().byId("tableedit").getModel();
                console.log('oItem', oItems)
                console.log('oModel', oModel)
                /*
                oItems.forEach(function(oItem) {
                    var oContext = oItem.getBindingContext()
                    console.log("path", oContext.getPath())
                });
                */
            
                
                this.getView().getModel().submitBatch("updateCart").then(function() {
                    that._toggleButtonsAndView(false);
                })
                
            },

            
            
            
        });
    });
