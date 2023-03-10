sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/RowAction",
	"sap/ui/table/RowActionItem",
	"sap/ui/table/RowSettings",
    "sap/m/MessageToast",
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, RowAction, RowActionItem, RowSettings, MessageToast, BaseController) {
        "use strict";

        return BaseController.extend("admin.controller.CartList", {
            onInit: function () {

                var fnPress = this.handleActionPress.bind(this);

                this.modes = [
                    {
                        key: "Navigation",
                        text: "Navigation",
                        handler: function() {
                            var oTemplate = new RowAction({items: [
                                new RowActionItem({
                                    type: "Navigation",
                                    press: fnPress,
                                    visible: "{Available}"
                                })
                            ]});
                            return [1, oTemplate];
                        }
                    }, {
                        key: "NavigationDelete",
                        text: "Navigation & Delete",
                        handler: function() {
                            var oTemplate = new RowAction({items: [
                                new RowActionItem({
                                    type: "Navigation",
                                    press: fnPress,
                                    visible: "{Available}"
                                }),
                                new RowActionItem({type: "Delete", press: fnPress})
                            ]});
                            return [2, oTemplate];
                        }
                    }, {
                        key: "NavigationCustom",
                        text: "Navigation & Custom",
                        handler: function() {
                            var oTemplate = new RowAction({items: [
                                new RowActionItem({
                                    type: "Navigation",
                                    press: fnPress,
                                    visible: "{Available}"
                                }),
                                new RowActionItem({icon: "sap-icon://edit", text: "Edit", press: fnPress})
                            ]});
                            return [2, oTemplate];
                        }
                    }, {
                        key: "Multi",
                        text: "Multiple Actions",
                        handler: function() {
                            var oTemplate = new RowAction({items: [
                                new RowActionItem({icon: "sap-icon://attachment", text: "Attachment", press: fnPress}),
                                new RowActionItem({icon: "sap-icon://search", text: "Search", press: fnPress}),
                                new RowActionItem({icon: "sap-icon://edit", text: "Edit", press: fnPress}),
                                new RowActionItem({icon: "sap-icon://line-chart", text: "Analyze", press: fnPress})
                            ]});
                            return [2, oTemplate];
                        }
                    }, {
                        key: "None",
                        text: "No Actions",
                        handler: function() {
                            return [0, null];
                        }
                    }
                ];

                this.getView().setModel(new JSONModel({items: this.modes}), "modes");
                this.switchState("Navigation");

            },
            onNavIndicatorsToggle: function(oEvent) {
                var oTable = this.byId("table");
                var oToggleButton = oEvent.getSource();
    
                if (oToggleButton.getPressed()) {
                    oTable.setRowSettingsTemplate(new RowSettings({
                        navigated: "{NavigatedState}"
                    }));
                } else {
                    oTable.setRowSettingsTemplate(null);
                }
            },
    
            onBehaviourModeChange: function(oEvent) {
                this.switchState(oEvent.getParameter("selectedItem").getKey());
            },
    
            switchState: function(sKey) {
                var oTable = this.byId("table");
                var iCount = 0;
                var oTemplate = oTable.getRowActionTemplate();
                if (oTemplate) {
                    oTemplate.destroy();
                    oTemplate = null;
                }
    
                for (var i = 0; i < this.modes.length; i++) {
                    if (sKey == this.modes[i].key) {
                        var aRes = this.modes[i].handler();
                        iCount = aRes[0];
                        oTemplate = aRes[1];
                        break;
                    }
                }
    
                oTable.setRowActionTemplate(oTemplate);
                oTable.setRowActionCount(iCount);
            },
    
            handleActionPress: function(oEvent) {
                var oRow = oEvent.getParameter("row");
                var oItem = oEvent.getParameter("item");
                var source = oEvent.getSource();
                var context = source.getBindingContext();
                var productId = context.getProperty("ID");
                console.log("productId", productId)
                console.log("oRow", oRow)
                console.log("oItem", oItem.getType())
                if (oItem.getType() === "Navigation") {
                    this.getRouter().navTo("RouteProductDetail", {
                        productId: productId
                    });
                }

                /*
                MessageToast.show("Item " + (oItem.getText() || oItem.getType()) + " pressed for product with id " +
                    this.getView().getModel().getProperty("ProductId", oRow.getBindingContext()));
                    */
            },
            
        });
    });
