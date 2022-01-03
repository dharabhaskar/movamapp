sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"infocus/MovamApp/utils/DataManager",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageToast'
], function(Controller, DataManager, BusyIndicator, Fragment, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("infocus.MovamApp.controller.MainView", {
		onInit: async function() {
			var _self = this;

			BusyIndicator.show();
			_self.token = await DataManager.getToken();
			BusyIndicator.hide();
			console.log(_self.token)

			//setting base model with a blank object.
			this.getView().setModel(new JSONModel({}), "dataSet");
			this.obj = {
				integration_id: " ",
				tonnage_id: " ",
				vehicle_make_id: " ",
				registration_number: " ",
				vehicle_type: " ",
				year_of_purchase: " ",
				registration_state: " ",
				front_side_image: " ",
				right_side_image: " ",
				left_side_image: " "

			};
			var oModel = new JSONModel(this.obj);

			this.getView("createVehicle").setModel(oModel, "CVM");

		},

		onPressCreateVehicle: async function() {
			var rbv = this.byId("vehicleType00").getSelectedButton().mProperties.text;
			var dpv = this.byId("yearOfPurchase").getDateValue();
			this.obj.year_of_purchase = dpv.getFullYear();
			this.obj.vehicle_type = rbv;
			this.obj.tonnage_id = parseInt(this.obj.tonnage_id);
			this.obj.vehicle_make_id = parseInt(this.obj.vehicle_make_id);
			console.log(this.getView("createVehicle").getModel("CVM").oData);
			var vehicle = this.getView("createVehicle").getModel("CVM").oData;
			var fU1 = this.getView().byId("fileUploader1");
			var domRef1 = fU1.getFocusDomRef();
			var file1 = domRef1.files[0];
			this.obj.front_side_image = file1;
			var fU2 = this.getView().byId("fileUploader2");
			var domRef2 = fU2.getFocusDomRef();
			var file2 = domRef2.files[0];
			this.obj.right_side_image = file2;
			var fU3 = this.getView().byId("fileUploader3");
			var domRef3 = fU3.getFocusDomRef();
			var file3 = domRef3.files[0];
			this.obj.left_side_image = file3;
			try {
				var response = await DataManager.createVehicles(this.token, vehicle);
			} catch (err) {
				console.log(err);
			}

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
					model.setProperty("/vehicles", response.data)

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