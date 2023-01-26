
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


rhit.Controller = class {
	constructor() {
	}
	addItem(itemName) {
		// TODO: add firebaase
	}
	deleteItem(itemName) {
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
	getItem(itemName){

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
	rhit.Controller = new Controller();
};

rhit.main();
