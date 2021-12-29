sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function(Controller, Fragment, JSONModel) {
	"use strict";

	return Controller.extend("ProjectSplitApp2.controller.View1", {
		onInit:function(){
		    var oModel = new JSONModel();
			this.getView().setModel(oModel, "vehicles");
			oModel.loadData("data/all_vehicle_data.json");
		},
		onPressGetVehicle: function(){
			var sel=this.byId("getVehicle00").getSelectedKey();
			console.log(sel);
			var model=this.getView().getModel("vehicles");
			var item=model.getProperty("/").find(x=>x.id==sel);
			console.log(item);
			model.setProperty("/item", item);
		},
		getFormFragment: function (sFragmentName) {
			return sap.ui.xmlfragment(this.getView().getId(), "ProjectSplitApp2.fragment.Change");
        },
		onPressMasterBack: function () {
			this.getSplitAppObj().backMaster();
		},
		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			return result;
		},
		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},
		onPressOpenVehiclesMenu:function() {
			this.getSplitAppObj().toMaster(this.createId("master3"));
		},
		onPressOpenDriversMenu: function() {
			this.getSplitAppObj().toMaster(this.createId("master4"));
		},
		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		}
    });
});