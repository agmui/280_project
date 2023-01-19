
var rhit = rhit || {};


rhit.Controller = class {
	constructor() {
		this.Inventory = {}
		this.Users = {}
	}
	addItem(itemName) {
		this.Inventory[itemName] = new rhit.Item(itemName)
	}
	deleteItem(itemName) {
		delete this.Inventory[itemName]
	}
	queryItem(itemSubString) {

	}
	checkoutItem(itemName, userName) {

	}
	returnItem(itemName) {
		// Set firebase checkedOutTo to empty string 
	}
	getUser(userName) {

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
