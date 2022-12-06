sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    'sap/ui/core/Fragment',
    "sap/ui/model/json/JSONModel",
], function (Controller, UIComponent, mobileLibrary, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("frontend.controller.BaseController", {
        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

    
        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} [sName] the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {sap.ui.model.Model} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         * @public
         * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        onBaseInit: function() {
            var baseModel = new JSONModel({
                cartInfo: {
                    ID: "",
                    cardNo: "Select cart",
                    total: ""
                }
            });
            this.setModel(baseModel, "baseModel");
            console.log("onInit work");
        },


        onCartClicked: function(oEvent) {
            var oButton = oEvent.getSource(),
				oView = this.getView();
            if (!this._pDialog) {
				this._pDialog = Fragment.load({
					id: "cartSelectionDialog",
                    name: "frontend.view.CartSelectionDialog",
					controller: this
				}).then(function (oDialog){
					oDialog.setModel(oView.getModel());
					return oDialog;
				});
			}

			this._pDialog.then(function(oDialog){
				oDialog.open();
			}.bind(this));
        },

        onEditClicked: function (oEvent) {
            
        },

        onManageClicked: function (oEvent) {
            this.getRouter().navTo("RouteCartView");
        },

        onCartItemClicked: function (oEvent) {

            var item =  oEvent.getSource().getSelectedItem();
            var object = item.getBindingContext().getObject();
            console.log("item", item);
            console.log("object", object);
            // set to base model
            var baseModel = new JSONModel({
                cartInfo: {
                    ID: object.ID,
                    cardNo: object.CardNo,
                    total: object.total
                }
            });
            this.setModel(baseModel, "baseModel");
        },


        onDialogCancelClicked: function(oEvent) {
            this._pDialog.then(function(oDialog) {
                oDialog.close();
            })
        },

        onDialogOkClicked: function(oEvent) {
            this._pDialog.then(function(oDialog) {
                oDialog.close();
            })
        }
    });

});