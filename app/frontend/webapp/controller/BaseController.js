sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    'sap/ui/core/Fragment',
    "sap/ui/model/json/JSONModel",
], function (Controller, UIComponent, mobileLibrary, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("frontend.controller.controller.BaseController", {
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
					id: "CartDialog",
                    name: "frontend.view.CartDialog",
					controller: this
				}).then(function (oDialog){
					oDialog.setModel(oView.getModel());
					return oDialog;
				});
			}

			this._pDialog.then(function(oDialog){
                this._configDialog(oDialog)
				oDialog.open();
			}.bind(this));
        },

        _configDialog: function (oDialog) {
            oDialog.setRememberSelections(true);
        },

        onDialogClose: function (oEvent) {
			
			var source = oEvent.getSource();
            var mProperties = source._oSelectedItem.mProperties;
            console.log("source", mProperties);
            var baseModel = new JSONModel({
                cartInfo: {
                    ID: mProperties.description,
                    cardNo: mProperties.title,
                    total: mProperties.info
                }
            });
            this.setModel(baseModel, "baseModel");
            
		},

        

    });

});