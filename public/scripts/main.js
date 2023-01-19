
var rhit = rhit || {};



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

rhit.main = function () {
	console.log("Ready");
};

rhit.main();
