
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
		document.querySelector("addItem").onclick = () => {
			
		}
		document.querySelector("delItem").onclick = () => {
			
		}
		document.querySelector("editItem").onclick = () => {
			
		}
		document.querySelector("checkOut").onclick = () => {
			
		}
		document.querySelector("return").onclick = () => {
			
		}
	}
	addItem(itemName) {
		this._ref.add({
			[rhit.FB_ITEM_NAME]: itemName,
			[rhit.FB_USER_CHECKED_OUT_TO]: "",
			[rhit.FB_CHECKOUT_DATE]: firebase.firestore.Timestamp.now(),
		})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id)
			})
			.catch(function (error) {
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

rhit.IndexController = class {
	constructor() {
		document.querySelector("#signupBtn").onclick = (event) => {
			window.location.href = "/signup.html"
		}
		document.querySelector("#loginBtn").onclick = (event) => {
			window.location.href = "/login.html"
		}
		document.querySelector("#editAccBtn").onclick = (event) => {
			window.location.href = "/" //TODO
		}
	}

}
rhit.AboutUsController = class {

}
rhit.CompController = class {

}
rhit.ContactController = class {

}
rhit.DonateController = class {

}
rhit.LoginController = class {
	constructor() {
		document.querySelector("#signupBtn").onclick = (event) => {
			window.location.href = "/signup.html"
		}
		document.querySelector("#submit").onclick = (event) => {
			firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
				let errorCode = error.errorCode
				let errorMsg = error.message
			})
		}
		// FirebaseUI config.==================================== 
		var uiConfig = {
			signInSuccessUrl: '/',
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
			],
		};

		// Initialize the FirebaseUI Widget using Firebase.
		const ui = new firebaseui.auth.AuthUI(firebase.auth());
		// The start method will wait until the DOM is loaded.
		ui.start('#firebaseui-auth-container', uiConfig);		
		// FirebaseUI config.==================================== 
	}

}
rhit.SignupController = class {
	constructor() {
		document.querySelector("#submit").onclick = (event) => {
			console.log(inputEmail.value, inputPass.value);
			firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
				let errorCode = error.errorCode
				let errorMsg = error.message
			})
		}
	}
}
rhit.UserController = class {

}

rhit.main = function () {
	console.log("Ready");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			let displayName = user.displayName

			// document.querySelector("#signoutBtn").onclick = (event) => {
			// 	console.log("signout");
			// }
		} else {

		}
	})

	const inputEmail = document.querySelector("#inputEmail")
	const inputPass = document.querySelector("#inputPass")

	switch (window.location.pathname) {
		case "/aboutUs.html":
			new rhit.AboutUsController()
			break;
		case "/competition.html":
			new rhit.CompController()
			break;
		case "/contact.html":
			new rhit.ContactController()
			break;
		case "/donate.html":
			new rhit.DonateController()
			break;
		case "/":
		case "/index.html":
			new rhit.IndexController()
			break;
		case "/inventorySys.html":
			new rhit.InventoryController()
			break;
		case "/login.html":
			new rhit.LoginController()
			break;
		case "/signup.html":
			new rhit.SignupController()
			break;
		case "/user.html":
			new rhit.UserController()
			break;
		default:
			console.error("idk wut page")
	}
};

rhit.main();
