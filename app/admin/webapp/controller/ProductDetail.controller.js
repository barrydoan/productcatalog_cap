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
                this.productId = ""
                this._formFragments = {};
               
                var route = this.getRouter().getRoute("RouteProductDetail");
                route.attachPatternMatched(this._attachPatternMatched, this);
                this._showFormFragment("ProductDetailDisplay")

                
            },

            _attachPatternMatched: function(oEvent) {
                console.log("oEvent", oEvent);
                this.productId = oEvent.getParameters().arguments.productId;
                console.log("productId", this.productId);
                this.getView().bindElement(`/Products/${this.productId}`);
                
               
            },

            _getFormFragment: function (sFragmentName) {
                var pFormFragment = this._formFragments[sFragmentName],
                    oView = this.getView();
    
                if (!pFormFragment) {
                    pFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "admin.view." + sFragmentName
                    });
                    this._formFragments[sFragmentName] = pFormFragment;
                }
    
                return pFormFragment;
            },

            _showFormFragment : function (sFragmentName) {
                var oPage = this.byId("page");
                var that = this
                oPage.removeAllContent();
                this._getFormFragment(sFragmentName).then(function(oVBox){
                    oPage.insertContent(oVBox);
                });
            },
            _toggleButtonsAndView : function (bEdit) {
                var oView = this.getView();
    
                // Show the appropriate action buttons
                oView.byId("edit").setVisible(!bEdit);
                oView.byId("save").setVisible(bEdit);
                oView.byId("cancel").setVisible(bEdit);
    
                // Set the right form type
                this._showFormFragment(bEdit ? "ProductDetailChange" : "ProductDetailDisplay");
            },

            handleEditPress : function () {
                this._toggleButtonsAndView(true);
            },

            handleCancelPress : function () {
                this._toggleButtonsAndView(false);
    
            },
    
           
        });
    });
