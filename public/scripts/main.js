
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
		return this._ref.doc(itemId).delete()
	}
	queryItem(itemSubString) {

		// TODO: function on firebase to help with this
	}
	checkoutItem(itemId, userName) {
		const item = this._ref.doc(itemId)

		item.update({
			[rhit.FB_USER_CHECKED_OUT_TO]: username,
			[rhit.FB_CHECKOUT_DATE]: firebase.firestore.Timestamp.now(),
		}).then(() => {
			console.log("Document updated with ID: ", docRef.id)
		})
		.catch(function (error) {
			console.error("Error adding document: ", error)
		})
	}
	returnItem(itemId) {
		const item = this._ref.doc(itemId)
		item.update({
			[rhit.FB_USER_CHECKED_OUT_TO]: "",
		}).then(() => {
			console.log("Document updated with ID: ", docRef.id)
		})
		.catch(function (error) {
			console.error("Error adding document: ", error)
		})	
	}
}

rhit.Item = class {
	constructor(itemName) {
		this.itemName = itemName
		this.date = "01/01/2023"
		this.checkedOutTo = ""
		this.id = ""
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

	setId(newId) {
		this.id = newId
	}

	get Name() {
		return this.itemName
	}

	get Date() {
		return this.date
	}

	get checkedoutTo() {
		return this.checkedOutTo
	}

	get id() {
		return this.id
	}
}
rhit.User = class {
	constructor(username) {
		this.userName = username
	}

	editUser() {

	}
}

rhit.main = () => {
	console.log("Ready");
	rhit.Controller = new InventoryController();
}

rhit.main();
