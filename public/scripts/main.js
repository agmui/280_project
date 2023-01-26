
var rhit = rhit || {};


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
