sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    'sap/ui/core/Fragment',
    "sap/ui/model/json/JSONModel",
    './webclient',
    './webclientbridge'
], function (Controller, UIComponent, mobileLibrary, Fragment, JSONModel, webclient, webclientbridge) {
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
            this._oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
            var that = this;
            // get the data from the local store
            var cartInfoValue = this._oStorage.get("baseModel");
            console.log("cartInforVlaue", cartInfoValue);
            if (cartInfoValue) {
                var cartInfo = JSON.parse(cartInfoValue);
                jQuery.ajax(
                    "/cart/Carts(" + cartInfo.ID + ")",
                    {
                        contentType : 'application/json',
                        type : 'GET',
                        success: function() {
                            var baseModel = new JSONModel({
                                cartInfo: cartInfo
                            });
                            that.setModel(baseModel, "baseModel");
                        }
                    }
                ); 

                
            }
            else {
                var baseModel = new JSONModel({
                    cartInfo: {
                        ID: "",
                        cardNo: "Select cart",
                        total: ""
                    }
                });
                this.setModel(baseModel, "baseModel");
            }

            console.log("onInit work");
        },

        onAfterRendering: function() {
            console.log("load chat bot");
            var s = document.createElement("script");
            s.setAttribute("src", "https://cdn.cai.tools.sap/webclient/bootstrap.js");
            s.setAttribute("id", "cai-webclient-custom");
            s.setAttribute("data-channel-id",data_channel_id);
            s.setAttribute("data-token",data_token);
            s.setAttribute("data-expander-type","CAI");
            s.setAttribute("data-expander-preferences",data_expander_preferences);
            document.body.appendChild(s);
        },


        onCartClicked: function(oEvent) {
            var oButton = oEvent.getSource(),
				oView = this.getView();
            if (!this._pDialog) {
                var that = this;
				this._pDialog = Fragment.load({
					id: "cartSelectionDialog",
                    name: "frontend.view.CartSelectionDialog",
					controller: this
				}).then(function (oDialog){
                    // open dialog
					oDialog.setModel(oView.getModel());
                    that._table = oDialog.getContent()[0]
					return oDialog;
				});
			}

			this._pDialog.then(function(oDialog){
                var that = this;
                oDialog.attachAfterOpen(function() {
                    var baseModel = that.getModel("baseModel");
                    var cartInfo = baseModel.oData.cartInfo;
                    // set selected item back to table
                    if (cartInfo.ID != "") {
                        var items = that._table.getItems()
                        console.log("items", items);
                        for (var i = 0; i < items.length; i++) {
                            var obj = items[i].getBindingContext().getObject();
                            if (obj.ID == cartInfo.ID) {
                                // set selected row for table
                                console.log("set selected row here");
                                console.log("selectedItem", items[i]);
                                that._table.setSelectedItem(items[i]);
                            }
                        }
                    }
                    
                });
                
				oDialog.open();
                
                console.log("table",this._table)
                
			}.bind(this));
        },

        onEditClicked: function (oEvent) {
            
        },

        onManageClicked: function (oEvent) {
            this.getRouter().navTo("RouteCartView");
        },

        onCartItemClicked: function (oEvent) {

            var source = oEvent.getSource();
            console.log("source",source);
            var item =  oEvent.getSource().getSelectedItem();
            var object = item.getBindingContext().getObject();
            console.log("item", item);
            console.log("object", object);
            var cartInfo = {
                ID: object.ID,
                cardNo: object.CardNo,
                total: object.total
            }
            // set to base model
            var baseModel = new JSONModel({
                cartInfo: cartInfo
            });
            this.setModel(baseModel, "baseModel");
            // save to cookie
            this._oStorage.put("baseModel", JSON.stringify(cartInfo));
            
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
        },

        onPressOpenBot: function (oEvent) {
            console.log("window", window.sap.webchat);
            window.sap.cai.webclient.show();
        },

        onPressCloseBot: function (oEvent) {
            window.sap.cai.webclient.hide();
        },

        onPressToggleBot: function (oEvent) {
            window.sap.cai.webclient.toggle();
        }
    });

});