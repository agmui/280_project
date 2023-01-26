
var rhit = rhit || {};

// Collections
rhit.FB_INVENTORY = "Inventory"
rhit.FB_USERS = "Users"

// Inventory Fields
rhit.FB_CHECKOUT_DATE = "checkoutDate"
rhit.FB_ITEM_NAME = "name"
rhit.FB_USER_CHECKED_OUT_TO = "userCheckedoutTo"

// User Fields
rhit.FB_ABOUT_US_BOOL = "aboutUs"
rhit.FB_USERNAME = "username"


rhit.InventoryController = class {
	constructor() {
		this._ref = firebase.firestore().collection(rhit.FB_INVENTORY)
	}
	addItem(itemName) {
		this._ref.add({
			[rhit.FB_ITEM_NAME]: itemName,
			[rhit.FB_USER_CHECKED_OUT_TO]: "",
			[rhit.FB_CHECKOUT_DATE]: firebase.firestore.Timestamp.now(),
		})
		.then(function(docRef) {
			console.log("Document written with ID: ", docRef.id)
		})
		.catch(function(error) {
			console.error("Error adding document: ", error)
		})
	}
	deleteItem(itemId) {
		// TODO: add firebaase
	}
	queryItem(itemSubString) {

		// TODO: function on firebase to help with this
	}
	checkoutItem(itemName, userName) {
		// TODO: add firebaase

	}
	returnItem(itemName) {
		// TODO: add firebase that sets checkedOutTo to empty string	
	}
	getItem(itemName) {

		// TODO: add firebase to return item	
	}
	getUser(userName) {

		// TODO: add firebase to return user
	}
}

rhit.Item = class {
	constructor(itemName) {
		this.itemName = itemName
		this.date = "01/01/2023"
		this.checkedOutTo = ""
	}

	setName(newName) {
		this.itemName = newName
	}

	setDate(newDate) {
		this.date = newDate
	}

	setChecked(newCheckedOut) {
		this.checkedOutTo = newCheckedOut
	}

	getName() {
		return this.itemName
	}

	getDate() {
		return this.date
	}

	getCheckedOutTo() {
		return this.checkedOutTo
	}
}
rhit.User = class {
	constructor(username) {
		this.userName = username
	}

	editUser() {

	}
}

rhit.main = function () {
	console.log("Ready");
	rhit.Controller = new rhit.Controller();

	const inputEmail = document.querySelector("#inputEmail")
	const inputPass = document.querySelector("#inputPass")

	if (window.location.href == "/") {
		document.querySelector("#signupBtn").onclick = (event) => {
			window.location.href = "/signup.html"
			console.log("hi");
		}
	}

	document.querySelector("#submit").onclick = (event) => {
		console.log(inputEmail, inputPass);
		console.log("hi");
	}
};

rhit.main();
