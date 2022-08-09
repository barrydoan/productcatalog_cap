sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","frontend/model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/Fragment","sap/ui/Device","sap/ui/model/Sorter"],function(e,t,i,o,n,s,r,a){"use strict";return e.extend("frontend.controller.controller.MainView",{formatter:i,onInit:function(){this._mViewSettingsDialogs={};var e,i,o=this.byId("table");i=o.getBusyIndicatorDelay();this._aTableSearchState=[];e=new t({worklistTableTitle:this.getResourceBundle().getText("worklistTableTitle"),shareOnJamTitle:this.getResourceBundle().getText("worklistTitle"),shareSendEmailSubject:this.getResourceBundle().getText("shareSendEmailWorklistSubject"),shareSendEmailMessage:this.getResourceBundle().getText("shareSendEmailWorklistMessage",[location.href]),tableNoDataText:this.getResourceBundle().getText("tableNoDataText"),tableBusyDelay:0});this.setModel(e,"worklistView");o.attachEventOnce("updateFinished",function(){e.setProperty("/tableBusyDelay",i)})},onUpdateFinished:function(e){var t,i=e.getSource(),o=e.getParameter("total");if(o&&i.getBinding("items").isLengthFinal()){t=this.getResourceBundle().getText("worklistTableTitleCount",[o])}else{t=this.getResourceBundle().getText("worklistTableTitle")}this.getModel("worklistView").setProperty("/worklistTableTitle",t)},onPress:function(e){console.log("Item clicked");this._showObject(e.getSource())},onNavBack:function(){history.go(-1)},onSearch:function(e){if(e.getParameters().refreshButtonPressed){this.onRefresh()}else{var t=[];var i=e.getParameter("query");if(i&&i.length>0){t=[new o("name",n.Contains,i)]}this._applySearch(t)}},onRefresh:function(){var e=this.byId("table");e.getBinding("items").refresh()},_showObject:function(e){this.getRouter().navTo("object",{objectId:e.getBindingContext().getProperty("ProductID")})},_applySearch:function(e){var t=this.byId("table"),i=this.getModel("worklistView");t.getBinding("items").filter(e,"Application");if(e.length!==0){i.setProperty("/tableNoDataText",this.getResourceBundle().getText("worklistNoDataWithSearchText"))}},getViewSettingsDialog:function(e){var t=this._mViewSettingsDialogs[e];if(!t){t=s.load({id:this.getView().getId(),name:e,controller:this}).then(function(e){if(r.system.desktop){e.addStyleClass("sapUiSizeCompact")}return e});this._mViewSettingsDialogs[e]=t}return t},handleSortButtonPressed:function(){this.getViewSettingsDialog("frontend.view.SortDialog").then(function(e){e.open()})},handleSortDialogConfirm:function(e){var t=this.byId("table"),i=e.getParameters(),o=t.getBinding("items"),n,s,r=[];n=i.sortItem.getKey();s=i.sortDescending;r.push(new a(n,s));o.sort(r)},onCategoryChange:function(e){var t=this.byId("oComboBoxCategory").getValue(),i=this.byId("table").getBinding("items"),n;if(t){n=new o("categoryName","EQ",t);i.filter([n])}else if(t===""){i.filter([])}},onSupplierChange:function(e){var t=this.byId("oComboBoxSupplier").getValue(),i=this.byId("table").getBinding("items"),n;if(t){n=new o("supplierName","EQ",t);i.filter([n])}else if(t===""){i.filter([])}}})});