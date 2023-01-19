
var rhit = rhit || {};

function addItem(itemName) {
	
}
function deleteItem(itemName) {
	
}
function queryItem(itemSubString){

}
function checkoutItem(itemName, userName) {

}
function returnItem(itemName, userName) {

}
function getUser(userName) {

}

rhit.Controller = class {
	constructor () {

	}
}

rhit.Item = class {
	constructor() {
		this.itemName = ""
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

	editUser () {

	}
}

rhit.main = function () {
	console.log("Ready");
};

rhit.main();
