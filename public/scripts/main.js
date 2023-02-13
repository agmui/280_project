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

		this.shown = false;

		this._ref = firebase.firestore().collection(rhit.FB_INVENTORY)
		document.querySelector("#addItem").onclick = () => {
			const input = document.querySelector("#itemNameTextField").value
			this.addItem(input)
			this.closeModal()
		}
		document.querySelector("#openModalButton").onclick = () => {
			this.openModal()
		}
		document.querySelector("#xButton").onclick = () => {
			this.closeModal()
		}
		// document.querySelector("#delItem").onclick = () => {

		// }
		// document.querySelector("#editItem").onclick = () => {

		// }
		// document.querySelector("#checkOut").onclick = () => {
		// 	// this.checkoutItem("lI0WUOuyVDCnbB9ya4aP", "Mui San")
		// 	this.checkOutButtonClick()
		// }
		// document.querySelector("#return").onclick = () => {

		// }


	}
	toggleModal() {
		this.shown = !this.shown;
		if (this.shown) {
			this.openModal()
		} else {
			this.closeModal()
		}
	}

	closeModal() {
		this.shown = false;
		document.querySelector("#addItemModal").style.display = "none";
		document.querySelector("#itemNameTextField").value = ""
	}

	openModal() {
		this.shown = true;
		document.querySelector("#addItemModal").style.display = "block";
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

	// connect to button click
	checkOutButtonClick() {

		// TODO: get data from fields on html
		const searchName = document.querySelector("#searchTerm").value;

		this.queryItem(searchName).then((querySnapshot) => {



			//make new checkout container
			const newList = htmlToElement('<div id="checkoutContainer"></div>')

			//fill container with items in a loop
			querySnapshot.forEach((doc) => {
				newList.appendChild(htmlToElement(`<div>
														<div>
															<h5>${doc.data().name}</h5>
															<h6>${doc.data().userCheckedoutTo}</h6>
															<h6">${doc.data().checkoutDate}</h6> 
														</div>
													</div>`))
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.id, " => ", doc.data());
			});

			//remove old quotelistcontainer
			const oldList = document.querySelector("#checkoutContainer")
			oldList.removeAttribute("id");
			oldList.hidden = true
			//put in the new quotelistcontainer
			oldList.parentElement.appendChild(newList)
		})
	}

	checkoutItem(itemId, username) {
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
	constructor(uid, username, aboutUs, bio, fullName, imgUrl) {
		this.username = username
		this.uid = uid
		this.aboutUs = aboutUs
		this.bio = bio
		this.fullName = fullName
		this.imgUrl = imgUrl
	}

	get uid() {
		return this.uid
	}

	get username() {
		return this.userName
	}

	get fullName() {
		return this.fullName
	}

	get aboutUs() {
		return this.aboutUs
	}

	get imgUrl() {
		return this.imgUrl
	}

	setUid(id) {
		this.uid = id
	}

	setUsername(newUser) {
		this.username = newUser
	}

	setAboutUs(newAbout) {
		this.aboutUs = newAbout
	}

	setBio(newBio) {
		this.bio = newBio
	}

	setFullname(newName) {
		this.fullName = newName
	}

	setImgUrl(url) {
		this.imgUrl = url
	}
}

rhit.AuthManager = class {
	constructor() {
		this._user = null;
		this._name = ""
		this._photoUrl = ""
		this.fbUI = false
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user
			console.log('this._user :>> ', this._user);
			changeListener();
		});
	}
	signInWithRoseFire() {
		Rosefire.signIn("f628f4ae-8716-4f00-b72f-eccc3daa297e", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);
			this._name = rfUser.name
			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				if (error.code === 'auth/invalid-custom-token') {
					alert("The token you provided is not valid.");
				} else {
					console.log("signInWithCustomToken error", error.code, error.message);
				}
			});

		});
	}
	signupWithEmail() {
		firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
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
			window.location.href = "/signup.html"
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
		document.querySelector("#signupBtn").onclick = (event) => {
			window.location.href = "/signup.html"
		}
		document.querySelector("#submit").onclick = (event) => {
		}
		document.querySelector("#roseFireBtn").onclick = (event) => {
			rhit.authManager.signInWithRoseFire()
		}
		if (!rhit.authManager.fbUI)
			rhit.authManager.startFirebaseUI()
	}

}
rhit.SignupController = class {
	constructor() {
		// document.querySelector("#submit").onclick = (event) => {
		// 	console.log(inputEmail.value, inputPass.value);
		// 	rhit.authManager.signupWithEmail()
		// }
		// document.querySelector("#roseFireBtn").onclick = (event) => {
		// 	rhit.authManager.signInWithRoseFire()
		// }
		// if (!rhit.authManager.fbUI)
		// 	rhit.authManager.startFirebaseUI()
	}
}

rhit.UserController = class {
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
