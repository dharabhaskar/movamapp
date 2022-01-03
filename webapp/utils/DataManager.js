jQuery.sap.declare("infocus.MovamApp.utils.DataManager");
infocus.MovamApp.utils.DataManager = (function() {
	var base = "https://test-serv.movam.ng/api/v1";
	var trackingBase = "https://trackapidev.movam.ng/api/devices";
	return {
		getToken: function() {
			var tokenUrl = base + "/get-token";
			var data = {
				"email": "sumit@infocus-in.com",
				"password": "12345678",
				"role": "transporter"
			};
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: tokenUrl,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json"
					},
					data: JSON.stringify(data),
					success: function(response) {
						if (response.statusCode !== 200) {
							reject(response.message);
							return
						}
						var token = response.data.token;
						//console.log(token);
						resolve(token);
					},
					error: function(err) {
						reject(err);
					}
				});
			});
		},
		getBacktraking: function(token, formData) {
			var _self = this;
			var url = trackingBase + "/backtracking";
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: url,
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Authorization": "Bearer " + token
					},
					data: JSON.stringify(formData),
					success: function(response) {
						console.log(response);
						if (response.status == 200) {
							console.log(response);
							var i = 0;
							var data = response.result.map(item => item.data).map(result => {
								//console.log(item);
								var locations = result.filter(function(item, pos) {
									return result.map(l => l.latitude).indexOf(item.latitude) == pos
								}).map(l => {
									return {
										location: {
											lat: l.latitude,
											lng: l.longitude
										},
										info: {
											name: formData.vehicleNo[i],
											time: _self.formatDate(new Date(l.deviceTime)),
											address: l.address,
											speed: l.speed,
											ignition: l.attributes.ignition ? "Yes" : "No"
										}
									}
								});
								i += 1;
								return locations;
								//return item;
							});
							resolve(data);
						} else {
							reject(response.message);
							return
						}
					},
					error: function(jqXHR, exception) {
						if (jqXHR.status === 0) {
							reject("Not connected veryfy network.")
						} else if (jqXHR.status >= 500 && jqXHR.status <= 599) {
							reject(`Internal server error [${jqXHR.status}].`)
						}
					}
				});
			});
		},
		getAllVehicles: function(token) {
			var _self = this;
			var vehiclesApiUrl = base + "/vehicles";
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: vehiclesApiUrl,
					method: "GET",
					headers: _self.getHeaderJson(token),
					success: function(response) {
						if (response.statusCode !== 200) {
							reject(response.message);
							return
						}
						resolve(response);
					},
					error: function(err) {
						reject(err);
					}
				});
			});
		},
		// create vehicle
		createVehicles: function(token, vehicle) {
			var _self = this;
			var vehiclesApiUrl = base + "/vehicles";

			var formdata = new FormData();
			formdata.append("integration_id", vehicle.integration_id);
			formdata.append("tonnage_id", vehicle.tonnage_id);
			formdata.append("vehicle_make_id", vehicle.vehicle_make_id);
			formdata.append("registration_number", vehicle.registration_number);
			formdata.append("vehicle_type", vehicle.vehicle_type);
			formdata.append("year_of_purchase", vehicle.year_of_purchase);
			formdata.append("registration_state", vehicle.registration_state);
			formdata.append("front_side_image", vehicle.front_side_image);
			formdata.append("right_side_image", vehicle.right_side_image);
			formdata.append("left_side_image", vehicle.left_side_image);
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: vehiclesApiUrl,
					method: "POST",
					//headers: _self.getHeaderJson(token),
					enctype: "multipart/form-data",
					data: formdata,
					processData: false,
					contentType: false,
					cache: false,
					success: function(response) {
						if (response.statusCode !== 200) {
							reject(response.message);
							return
						}
						console.log(response);
						resolve(response);
					},
					error: function(err) {
						console.log(err);
						reject(err);
					}
				});
			});
		},
		// Update vehicle
		updateVehicles: function(token, vehicleNo, vehicle) {
			var _self = this;
			var vehiclesApiUrl = base + "/vehicles/" + vehicleNo;
			return new Promise(function(resolve, reject) {
				$.ajax({
					url: vehiclesApiUrl,
					method: "PUT",
					headers: _self.getHeaderJson(token),
					success: function(response) {
						if (response.statusCode !== 200) {
							reject(response.message);
							return
						}
						resolve(response);
					},
					error: function(err) {
						reject(err);
					}
				});
			});
		},
		formatDate: function(d) {
			return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
		},
		getHeaderJson: function(token) {
			var header = {
				"Content-Type": "application/json",
				"Accept": "application/json",
			}
			if (token) {
				header.Authorization = `Bearer ${token}`;
			}
			return header;
		}
	};
}());