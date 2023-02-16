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
rhit.FB_BIO = "bio"
rhit.FB_FULL_NAME = "fullName"
rhit.FB_IMAGE_URL = "imgUrl"

rhit.FB_KEY_NAME = "username";
rhit.FB_KEY_PHOTO_URL = "imgUrl";



rhit.authManager = null
rhit.userManager = null


function htmlToElement(html) {
	var template = document.createElement('template')
	html = html.trim()
	template.innerHTML = html
	return template.content.firstChild
}

rhit.InventoryController = class {
	constructor() {

		// Get the input field
		var input = document.getElementById("searchField");

		// Execute a function when the user releases a key on the keyboard
		input.addEventListener("keyup", function (event) {
			// Number 13 is the "Enter" key on the keyboard
			if (event.key === 'Enter') {
				// Cancel the default action, if needed
				event.preventDefault();
				// Trigger the button element with a click
				document.getElementById("searchButton").click();
			}
		});

		// Select the node that will be observed for mutations
		const targetNode = document.getElementById('containerParent');

		// Options for the observer (which mutations to observe)
		const config = { attributes: false, childList: true, subtree: true };

		// Callback function to execute when mutations are observed
		const callback = (mutationList, observer) => {
			for (const mutation of mutationList) {
				if (mutation.type === 'childList') {
					console.log('A child node has been added or removed.');
					this.setupListeners()
				}
			}
		};

		// Create an observer instance linked to the callback function
		const observer = new MutationObserver(callback);

		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);




		this._ref = firebase.firestore().collection(rhit.FB_INVENTORY)

		// add item Buttons
		document.querySelector("#addItem").onclick = () => {
			const input = document.querySelector("#itemNameTextField").value.trim()
			if (input == "") return;
			this.addItem(input)
			document.querySelector("#itemNameTextField").value = ""
			this.closeModal("#addItemModal")


			const searchName = document.querySelector("#searchField").value.trim();
			if (searchName == "") return;
			this.fillList()
		}

		// Add Item
		document.querySelector("#openModalButton").onclick = () => {
			this.openModal("#addItemModal")
		}
		document.querySelector("#xButton").onclick = () => {
			document.querySelector("#itemNameTextField").value = ""
			this.closeModal("#addItemModal")
		}


		// Delete Item
		document.querySelector("#xButtonDelete").onclick = () => {
			this.closeModal("#deleteItemModal")
		}

		document.querySelector("#cancelDelete").onclick = () => {
			this.closeModal("#deleteItemModal")
		}

		document.querySelector("#confirmDelete").onclick = () => {
			this.closeModal("#deleteItemModal")
			var uid = document.querySelector("#deleteItemModal").dataset.itemid
			this.deleteItem(uid)

			this.fillList()
		}

		// Edit Item
		document.querySelector("#xEditButton").onclick = () => {
			this.closeModal("#editItemModal")
		}

		document.querySelector("#editItem").onclick = () => {
			const input = document.querySelector("#editNameTextField").value.trim()
			if (input == "") return;
			this.closeModal("#editItemModal")
			const uid = document.querySelector("#editItemModal").dataset.itemid
			this.editItem(uid, input)

			this.fillList()
		}


		// Return Item
		document.querySelector("#xButtonReturn").onclick = () => {
			this.closeModal("#returnItemModal")
		}

		document.querySelector("#cancelReturn").onclick = () => {
			this.closeModal("#returnItemModal")
		}

		document.querySelector("#confirmReturn").onclick = () => {
			this.closeModal("#returnItemModal")
			var uid = document.querySelector("#returnItemModal").dataset.itemid
			this.returnItem(uid)

			this.fillList()
		}

		// Checkout Item
		document.querySelector("#xButtonCheckout").onclick = () => {
			this.closeModal("#checkoutItemModal")
		}

		document.querySelector("#cancelCheckout").onclick = () => {
			this.closeModal("#checkoutItemModal")
		}

		document.querySelector("#confirmCheckout").onclick = () => {
			this.closeModal("#checkoutItemModal")
			var uid = document.querySelector("#checkoutItemModal").dataset.itemid
			this.checkoutItem(uid)

			this.fillList()
		}

		// Search
		document.querySelector("#searchButton").onclick = () => {
			this.fillList()
		}

	}

	closeModal(idName) {
		document.querySelector(idName).style.display = "none";
	}

	openModal(idName) {
		document.querySelector(idName).style.display = "block";
	}


	addItem(itemName) {

		this._ref.add({
			[rhit.FB_ITEM_NAME]: itemName,
			[rhit.FB_USER_CHECKED_OUT_TO]: rhit.authManager.getAdmin(),
			[rhit.FB_CHECKOUT_DATE]: firebase.firestore.Timestamp.now(),
		})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id)
			})
			.catch(function (error) {
				console.error("Error adding document: ", error)
			})
	}

	editItem(itemId, newName) {
		const userRef = this._ref.doc(itemId)
		return userRef.update({
			[rhit.FB_ITEM_NAME]: newName
		})
			.then(() => {
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
		return this._ref.where(rhit.FB_ITEM_NAME, "==", itemSubString) //.limit(50)
			.get()
			.then((querySnapshot) => {
				console.log("This query is of length", querySnapshot.size);
				return querySnapshot


				// querySnapshot.forEach((doc) => {

				// 	// doc.data() is never undefined for query doc snapshots
				// 	console.log(doc.id, " => ", doc.data());
				// });
			})
			.catch((error) => {
				console.log("Error getting documents: ", error);
			});
	}

	contentFill(newList, searchName) {
		return this.queryItem(searchName).then((querySnapshot) => {
			newList.appendChild(htmlToElement(`
				<div class="flex items-center">
					<div class="w-1/4 font-bold text-lg text-gray-600">Item Name</div>
					<div class="w-1/4 font-bold text-lg text-gray-600">Checked Out Date</div>
					<div class="w-1/4 font-bold text-lg text-gray-600">User Checked Out</div>
				</div>
				<hr class="my-4 border-gray-300" />`))

			//fill container with items in a loop
			querySnapshot.forEach((doc) => {
				let data = doc.data()
				let amIRenter = false;

				let username = ""

				if (data.userCheckedoutTo) {
					// Currently checked in
					data.userCheckedoutTo.get()
						.then(res => {
							username = res.data().username
							console.log('rhit.authManager.uid == res.id :>> ', rhit.authManager.uid == res.id);
							amIRenter = (rhit.authManager.uid == res.id)
							let style = "none"
							if (amIRenter) style = "block";
							if (res.id != 'V7NqMe2BDOManY4kYQaZIkdhTTu1') {
								// console.log('username :>> ', username);
								newList.appendChild(htmlToElement(`
									<hr class="my-4 border-gray-300" />`))
								newList.appendChild(htmlToElement(`
									<div class="flex items-center mt-4">
										<!-- Checked Out Item -->
										<div class="w-1/4 text-lg text-gray-800">${data.name}</div>
										<div class="w-1/4 text-lg text-gray-800">${data.checkoutDate.toDate().toDateString()}</div>
										<div class="w-1/4 text-lg text-gray-800">${username}</div>
										<div class="w-1/8 flex justify-center">
											<button data-uniqueid="${doc.id}" data-itemname="${data.name}" id="checkInButton" style="display: ${style};">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
													stroke="currentColor" class="w-6 h-6">
													<path stroke-linecap="round" stroke-linejoin="round"
														d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
												</svg>
					
											</button>
										</div>
										<div class="w-1/8 flex justify-center">
											<button data-uniqueid="${doc.id}" data-itemname="${data.name}" id="editButton">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
													stroke="currentColor" class="w-6 h-6">
													<path stroke-linecap="round" stroke-linejoin="round"
														d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
												</svg>
											</button>
											<button data-uniqueid="${doc.id}" data-itemname="${data.name}" id="deleteButton">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
													stroke="currentColor" class="w-6 h-6">
													<path stroke-linecap="round" stroke-linejoin="round"
														d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
												</svg>
											</button>
										</div>
									</div>`))
							} else {
								newList.appendChild(htmlToElement(`
									<hr class="my-4 border-gray-300" />`))
								newList.appendChild(htmlToElement(`
									<div class="flex items-center mt-4">
										<div class="w-1/4 text-lg text-gray-800">${data.name}</div>
										<div class="w-1/4 text-lg text-gray-800">In Inventory</div>
										<div class="w-1/4 text-lg text-gray-800">&nbsp;</div>
										<div class="w-1/8 flex justify-center">
											<button data-uniqueid="${doc.id}" data-itemname="${data.name}" id="checkOutButton">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
													stroke="currentColor" class="w-6 h-6">
													<path stroke-linecap="round" stroke-linejoin="round"
														d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
												</svg>
				
											</button>
										</div>
										<div class="w-1/8 flex justify-center">
											<button data-uniqueid="${doc.id}" data-itemname="${data.name}" id="editButton">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
													stroke="currentColor" class="w-6 h-6">
													<path stroke-linecap="round" stroke-linejoin="round"
														d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
												</svg>
											</button>
											<button data-uniqueid="${doc.id}" data-itemname="${data.name}" id="deleteButton">
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
													stroke="currentColor" class="w-6 h-6">
													<path stroke-linecap="round" stroke-linejoin="round"
														d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
												</svg>
											</button>
										</div>
									</div>`))

							}

						})
						.catch(err => console.error(err));
				}

			})

		})
	}


	fillList() {
		const searchName = document.querySelector("#searchField").value.trim();

		//make new checkout container
		const newList = htmlToElement('<div id="invItemContainer" class="w-full max-w-3xl rounded-lg bg-white shadow-lg p-6"></div>')

		this.contentFill(newList, searchName).then(() => {

			//remove old quotelistcontainer
			const oldList = document.querySelector("#invItemContainer")
			oldList.removeAttribute("id");
			oldList.hidden = true
			//put in the new quotelistcontainer
			oldList.parentElement.appendChild(newList)

			this.setupListeners()

		})
	}

	setupListeners() {
		const deleteButtons = document.querySelectorAll("#deleteButton")
		deleteButtons.forEach(element => {
			element.onclick = () => {
				document.querySelector("#areYouSureDelete").innerHTML = `Are you sure you want to delete ${element.dataset.itemname}?`
				document.querySelector("#deleteItemModal").dataset.itemid = element.dataset.uniqueid
				this.openModal("#deleteItemModal")


			}
		});

		const editButtons = document.querySelectorAll("#editButton")
		editButtons.forEach(element => {
			element.onclick = () => {
				document.querySelector("#editNameTextField").placeholder = `${element.dataset.itemname}`
				document.querySelector("#editItemModal").dataset.itemid = element.dataset.uniqueid
				this.openModal("#editItemModal")
			}
		});

		const returnButtons = document.querySelectorAll("#checkInButton")
		returnButtons.forEach(element => {
			element.onclick = () => {
				document.querySelector("#areYouSureReturn").innerHTML = `Are you sure you want to return ${element.dataset.itemname}?`
				document.querySelector("#returnItemModal").dataset.itemid = element.dataset.uniqueid
				this.openModal("#returnItemModal")
			}
		});

		const checkoutButtons = document.querySelectorAll("#checkOutButton")
		checkoutButtons.forEach(element => {
			element.onclick = () => {
				document.querySelector("#areYouSureCheckout").innerHTML = `Are you sure you want to checkout ${element.dataset.itemname}?`
				document.querySelector("#checkoutItemModal").dataset.itemid = element.dataset.uniqueid
				this.openModal("#checkoutItemModal")
			}
		});
	}


	checkoutItem(itemId) {
		const item = this._ref.doc(itemId)

		item.update({
			[rhit.FB_USER_CHECKED_OUT_TO]: rhit.authManager.getUser(),
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
			[rhit.FB_USER_CHECKED_OUT_TO]: rhit.authManager.getAdmin(),
		}).then(() => {
			console.log("Document updated with ID: ", docRef.id)
		})
			.catch(function (error) {
				console.error("Error adding document: ", error)
			})
	}
}

rhit.AuthManager = class {
	constructor() {
		this._ref = firebase.firestore().collection(rhit.FB_USERS)
		this._user = null;
		this._username = "rick"
		this.fbUI = false
	}

	getAdmin() {
		return this._ref.doc("V7NqMe2BDOManY4kYQaZIkdhTTu1")
	}

	getUser() {
		return this._ref.doc(this.uid)
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			if (user != null) {//checked if logged in
				this._user = user
				this._ref.doc(user.uid).get().then((doc) => {
					if (doc.exists) {
						console.log("user data:", doc.data());
					} else {
						console.log("New user");
						this._ref.doc(user.uid).set({
							username: (user.displayName) ? user.displayName : this._username,
							email: user.email,
							aboutUs: false,
							bio: "Never gona give you up",
							firstname: "",
							lastname: "",
							imgUrl: (user.photoURL != null) ? user.photoURL : "",
							role: ""
						});
					}
				})
			}
			changeListener();
		});
	}

	signInWithRoseFire() {
		document.getElementById("loginEmail").value = ""
		document.getElementById("loginPassword").value = ""
		Rosefire.signIn("f628f4ae-8716-4f00-b72f-eccc3daa297e", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);
			this._username = rfUser.name
			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				if (error.code === 'auth/invalid-custom-token') {
					alert("The token you provided is not valid.");
				} else {
					console.log("signInWithCustomToken error", error.code, error.message);
				}
			});

		});
	}

	signInWithEmail(email, password) {
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				//   var user = userCredential.user;
				console.log("signed IN with email");
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(error);
			});
	}

	sendEmailVerification() {
		// [START auth_send_email_verification]
		firebase.auth().currentUser.sendEmailVerification()
			.then(() => {
				// Email verification sent!
				// ...
			});
		// [END auth_send_email_verification]
	}

	sendPasswordReset() {
		const email = "sam@example.com";
		// [START auth_send_password_reset]
		firebase.auth().sendPasswordResetEmail(email)
			.then(() => {
				// Password reset email sent!
				// ..
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				// ..
			});
		// [END auth_send_password_reset]
	}

	registerWithEmail(email, password) {
		console.log('email, password :>> ', email, password);
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// let user = userCredential.user
				console.log("signed UP with email");

			})
			.catch((error) => {
				let errorCode = error.errorCode
				let errorMsg = error.message
				console.log(error);
			})
	}

	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}

	startFirebaseUI() {
		this.fbUI = true
		// FirebaseUI config.
		var uiConfig = {
			signInSuccessUrl: '/',
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				// firebase.auth.EmailAuthProvider.PROVIDER_ID,
				// firebase.auth.PhoneAuthProvider.PROVIDER_ID,
				// firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
			],
		};

		// Initialize the FirebaseUI Widget using Firebase.
		const ui = new firebaseui.auth.AuthUI(firebase.auth());
		// The start method will wait until the DOM is loaded.
		ui.start('#firebaseui-auth-container', uiConfig);
	}

	get uid() {
		return this._user.uid
	}

	getUserFromId(uid) {
		const user = this._ref.where(firebase.firestore.FieldPath.documentId(), '==', uid).get().then((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				return doc.data()[rhit.FB_USERNAME]
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch((error) => {
			console.log("Error getting document:", error);
		});

	}

	get isSignedIn() {
		return !!this._user;
	}
}


rhit.createUserObjectIfNeeded = function () {
	return new Promise((resolve, reject) => {
		// resolve()

		//Check if a User might be new
		if (!rhit.authManager.isSignedIn) {
			console.log("No user. So no User check Needed");
			resolve(false)
			return;
		}
		if (!document.querySelector("#loginPage")) {
			console.log("Not on  login page. So no User check needed");
			resolve(false)
			return;
		}
		//Call addNewUser Maybe
		console.log("Checking user");
		rhit.fbUserManager.addNewUserMaybe(
			rhit.fbAuthManager.uid,
			rhit.fbAuthManager.name,
			rhit.fbAuthManager.photoUrl
		).then((isUserNew) => {
			resolve(isUserNew)
		})


	})
}
rhit.UserManager = class {
	constructor() {
		this._collectionRef = firebase.firestore().collection("Users");
		this._document = null;
		this._unsubscribe = null;
		console.log("created user manager");
	}
	addNewUserMaybe(uid, name, photoUrl) {
		const userRef = this._collectionRef.doc(uid)
		return userRef.get().then((doc) => {
			if (doc.exists) {
				console.log("doc data:", doc.data());
				//Do nothing
				return false;
			} else {
				console.log("creating this user");
				// Add a new document in collection "cities"
				return userRef.set({
					[rhit.FB_KEY_NAME]: name,
					[rhit.FB_KEY_PHOTO_URL]: photoUrl,
				})
					.then(() => {
						console.log("Document successfully written!");
						return true;
					})
					.catch((error) => {
						console.error("Error writing document: ", error);
					});
			}
		}).catch((error) => {
			console.log("error getting doc:", error);
		})

	}
	beginListening(uid, changeListener) {
		const userRef = this._collectionRef.doc(uid)
		this._unsubscribe = userRef.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Dcoumeht data:", doc.data());
				this._document = doc
				changeListener()
			} else {
				console.log("No User!");
			}
		})

	}
	stopListening() { this._unsubscribe(); }
	get isListening() {
		return !!this._unsubscribe
	}
	updatePhotoUrl(photoUrl) {
		const userRef = this._collectionRef.doc(rhit.fbAuthManager.uid)
		userRef.update({
			[rhit.FB_KEY_PHOTO_URL]: photoUrl,
		})
			.then(() => {
				console.log("Document successfully updated!")
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}

	updateName(name) {
		const userRef = this._collectionRef.doc(rhit.authManager.uid)
		// FIXME:
		return userRef.update({
			[rhit.FB_KEY_NAME]: name,
		})
			.then(() => {
				console.log("Document successfully updated!")
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
	}
	get name() { return this._document.get(rhit.FB_KEY_NAME); }
	get photoUrl() { return this._document.get(rhit.FB_KEY_PHOTO_URL); }
}



rhit.IndexController = class {
	constructor() {
		if (rhit.authManager.isSignedIn) {
			document.querySelector("#signupBtn").style.display = "none"
			document.querySelector("#loginBtn").style.display = "none"
			document.querySelector("#editAccBtn").style.display = "block"
			document.querySelector("#signoutBtn").style.display = "block"
		} else if (!rhit.authManager.isSignedIn) {
			document.querySelector("#signupBtn").style.display = "block"
			document.querySelector("#loginBtn").style.display = "block"
			document.querySelector("#editAccBtn").style.display = "none"
			document.querySelector("#signoutBtn").style.display = "none"
		}
		document.querySelector("#signupBtn").onclick = (event) => {
			window.location.href = "/login.html?signin=true"
		}
		document.querySelector("#loginBtn").onclick = (event) => {
			window.location.href = "/login.html"
		}
		document.querySelector("#editAccBtn").onclick = (event) => {
			window.location.href = "/user.html"
		}
		document.querySelector("#signoutBtn").onclick = (event) => {
			rhit.authManager.signOut()
			// window.location.href = "/index.html"
		}
	}

}
rhit.AboutUsController = class {

	constructor() {
		this._ref = firebase.firestore().collection(rhit.FB_USERS)

		this.people = []
		this.displayMembers()
	}

	// removeAboutUs(memberUsername) {

	// }

	queryMembers() {
		return this._ref.where(rhit.FB_ABOUT_US_BOOL, "==", true) //.limit(50)
			.get()
			.then((querySnapshot) => {
				// console.log("This query is of length", querySnapshot.size);
				return querySnapshot


				// querySnapshot.forEach((doc) => {

				// 	// doc.data() is never undefined for query doc snapshots
				// 	console.log(doc.id, " => ", doc.data());
				// });
			})
			.catch((error) => {
				console.log("Error getting documents: ", error);
			});
	}

	displayMembers() {

		this.queryMembers().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				this.people.push(doc.data())
			});
			const demo = [
				{
					id: "1",
					firstname: "Tonyo",
					lastname: "Delapena",
					role: "Boss",
					picture: "https://fancytailwind.com/static/profile8-34d5f5980ca5030c155a2ffbb50b5802.jpg",
					description: "Harum iusto exercitationem assumenda quas nostrum perspiciatis quos iste sit reprehenderit, libero quae aperiam sapiente delectus, porro tempore minus repellendus ratione distinctio!",
					facebookURL: "#link",
					twitterURL: "#link",
					linkedinURL: "#link",
					youtubeURL: "#link",
					member: true
				},
				{
					id: "2",
					firstname: "asdf",
					lastname: "Librals",
					role: "Designer",
					picture: "https://fancytailwind.com/static/profile14-e9ac6c7d68a78a1cbbf29458acacc95a.jpg",
					description: "Harum iusto exercitationem assumenda quas nostrum perspiciatis quos iste sit reprehenderit, libero quae aperiam sapiente delectus, porro tempore minus repellendus ratione distinctio!",
					facebookURL: "#link",
					twitterURL: "#link",
					linkedinURL: "#link",
					youtubeURL: "#link",
					member: false
				},
				{
					id: "3",
					firstname: "aaa",
					lastname: "Librals",
					role: "Designer",
					picture: "https://fancytailwind.com/static/profile14-e9ac6c7d68a78a1cbbf29458acacc95a.jpg",
					description: "Harum iusto exercitationem assumenda quas nostrum perspiciatis quos iste sit reprehenderit, libero quae aperiam sapiente delectus, porro tempore minus repellendus ratione distinctio!",
					facebookURL: "#link",
					twitterURL: "#link",
					linkedinURL: "#link",
					youtubeURL: "#link",
					member: false
				}
			]
		}).then(() => {
			let profile = ""
			this.people.map((person, index) => {
				profile = //FIXME: hover:brightness not working
					`<li key=${person.lastname + person.firstname} class="w-12 h-12 rounded-full overflow-hidden filter saturate-0 hover:brightness-125">
						<button id="btn${person.lastname + person.firstname}" class="w-full h-full">
							<img src=${person.imgUrl} alt="" class="object-cover" />
						</button>
					</li>`
				document.getElementById("displayMembers").insertAdjacentHTML('beforeend', profile)
				document.getElementById("btn" + person.lastname + person.firstname).onclick = () => { this.changeDescription(index) }
			})
			this.changeDescription(0);
		})
	}

	changeDescription(index) {
		let person = this.people[index]
		// let person = demo[index]
		document.getElementById("role").innerHTML = person.role
		document.getElementById("memberPicture").src = person.imgUrl
		document.getElementById("firstname").innerHTML = person.firstname
		document.getElementById("lastname").innerHTML = person.lastname
		document.getElementById("description").innerHTML = person.bio
		document.getElementById("facebook").href = person.facebookURL
		document.getElementById("twitter").href = person.twitterURL
		document.getElementById("linkedin").href = person.linkedinURL
		document.getElementById("youtube").href = person.youtubeURL
	}

}
rhit.CompController = class {

}
rhit.ContactController = class {

}
rhit.DonateController = class {

}
rhit.LoginController = class {
	constructor() {
		// document.querySelector("#signupBtn").onclick = (event) => {
		// 	window.location.href = "/signup.html"
		// }
		// document.querySelector("#submit").onclick = (event) => {
		// }

		document.querySelector("#roseFireBtn").onclick = (event) => {
			rhit.authManager.signInWithRoseFire()
		}
		document.querySelector("#roseFireBtn2").onclick = (event) => {
			rhit.authManager.signInWithRoseFire()
		}

		if (!rhit.authManager.fbUI)
			rhit.authManager.startFirebaseUI()

		document.querySelector("#loginSubmitBtn").onclick = (event) => {
			let email = document.getElementById("loginEmail").value
			let pass = document.getElementById("loginPassword").value
			rhit.authManager.signInWithEmail(email, pass)
		}

		document.querySelector('#registerSubmitBtn').onclick = (event) => {
			let username = document.getElementById('registerUsername').value
			let email = document.getElementById('registerEmail').value
			let password = document.getElementById('registerPass').value
			let confirmPass = document.getElementById('registerConfirmPass').value
			rhit.authManager.registerWithEmail(email, password)
		}
	}
}

rhit.UserController = class {
	//TODO: check if user is login before going to other pages
	constructor() {
		document.querySelector("#changeName").onclick = (event) => {
			const inputName = document.querySelector("#input").value
			rhit.userManager.updateName(inputName)//.then(() => {
			// TODO: put like a indicator you updated the name or something
			// })
		}
		document.querySelector("#uploadPic").onclick = (event) => {
			console.log("you presse upload photo");
			document.querySelector("#inputFile").click()
		}
		document.querySelector("#inputFile").addEventListener("change", (event) => {
			console.log("you selected a file");
			const file = event.target.files[0]
			console.log(`Recived file named ${file.name}`);
			const storageRef = firebase.storage().ref().child(rhit.authManager.uid)
			storageRef.put(file).then((uploadTaskSnapshot) => {
				console.log("the file has been uploaded!");
				storageRef.getDownloadURL().then((downloadURL) => {
					rhit.userManager.updatePhotoUrl(downloadURL);
				})
			})
			console.log("uploading the file");
		})

	}

}

rhit.main = function () {
	console.log("Ready");

	// TODO:
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			let displayName = user.displayName
			// document.querySelector("#signoutBtn").onclick = (event) => {
			// 	console.log("signout");
			// }
		} else {

		}
	})

	rhit.authManager = new this.AuthManager()
	rhit.userManager = new this.UserManager()

	const pname = window.location.pathname
	rhit.authManager.beginListening(() => {
		console.log("is signed in = ", rhit.authManager.isSignedIn);

		if (rhit.authManager.isSignedIn) {
			const invButtons = document.querySelectorAll("#inventoryOpenButton")
			invButtons.forEach(element => {
				element.style.display = "block";
			});

			const loginButtons = document.querySelectorAll("#loginOpenButton")
			loginButtons.forEach(element => {
				element.style.display = "none";
			});

			const userButtons = document.querySelectorAll("#userOpenButton")
			userButtons.forEach(element => {
				element.style.display = "block";
			});
		}

		// Check if new user is needed
		rhit.createUserObjectIfNeeded().then((isUserNew) => {
			console.log('isUserNew :>> ', isUserNew);
			if (isUserNew) {
				window.location.href = "/profile.html"
				return;
			}
			// check for redirects
			console.log("in login.html", pname == "/login.html", "signed in:", rhit.authManager.isSignedIn);
			if ((pname == "/login.html" || pname == "/signup.html") && rhit.authManager.isSignedIn) {
				window.location.href = "/index.html"
			}
			// init pages
			switch (pname) {
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
		})

	})


};

rhit.main();
