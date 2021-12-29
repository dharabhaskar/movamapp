sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"infocus/MovamApp/utils/DataManager",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function(Controller, DataManager, BusyIndicator, Fragment, JSONModel) {
	"use strict";

	return Controller.extend("infocus.MovamApp.controller.MainView", {
		onInit: async function() {
			var _self = this;

			BusyIndicator.show();
			_self.token = await DataManager.getToken();
			BusyIndicator.hide();
			console.log(_self.token)

			//setting base model with a blank object.
			this.getView().setModel(new JSONModel({}), "dataSet")
		},
		onPressGetVehicle: function() {
			var sel = this.byId("getVehicle00").getSelectedKey();
			console.log(sel);
			var model = this.getView().getModel("dataSet");
			var item = model.getProperty("/vehicles").find(x => x.id == sel);
			console.log(item);
			model.setProperty("/item", item);
		},
		getFormFragment: function(sFragmentName) {
			return sap.ui.xmlfragment(this.getView().getId(), "ProjectSplitApp2.fragment.Change");
		},
		onPressMasterBack: function() {
			this.getSplitAppObj().backMaster();
		},
		getSplitAppObj: function() {
			var result = this.byId("SplitAppDemo");
			return result;
		},
		onPressGoToMaster: function() {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},
		onPressOpenVehiclesMenu: function() {
			this.getSplitAppObj().toMaster(this.createId("master3"));
		},
		onPressOpenDriversMenu: function() {
			this.getSplitAppObj().toMaster(this.createId("master4"));
		},
		onListItemPress: function(oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitAppObj().toDetail(this.createId(sToPageId));
			this.manageAPICalls(sToPageId);
			console.log(sToPageId);
		},
		manageAPICalls: async function(pageId) {
			var _self = this;
			var model = _self.getBaseModel();
			switch (pageId) {
				//-------------- All Vechicles ----------------
				case "getAllVehicles":
				case "getVehicle":
					BusyIndicator.show();
					var response = await DataManager.getAllVehicles(_self.token);
					model.setProperty("/vehicles",response.data)
					
					console.log(response);
					console.log(model);

					BusyIndicator.hide()
				
					break;
			}
		},
		getBaseModel: function() {
			return this.getView().getModel("dataSet");
		},
	});
});