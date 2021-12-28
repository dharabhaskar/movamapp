sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"infocus/MovamApp/utils/DataManager",
	"sap/ui/core/BusyIndicator"
], function(Controller,DataManager,BusyIndicator) {
	"use strict";

	return Controller.extend("infocus.MovamApp.controller.MainView", {
		onInit: async function(){
			
			BusyIndicator.show();
			var token=await DataManager.getToken();
			BusyIndicator.hide();
			
			
			console.log(token)
		}
	});
});