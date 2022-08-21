//create variable to hold database connection
let db;

//connect Indexed DB database and set it to version 1
const request = indexedDB.open("budget", 1);

//if database change occurs, create new object store
request.onupgradeneeded = function (event) {
	const db = event.target.result;

	db.createObjectStore("new_transaction", { autoIncrement: true });
};
//upon a successful creation of database in indexedDB, save a reference in global variable
request.onsuccess = function(event) {
        db = event.target.result;
        if (navigator.online){
                //if internet is back, save transactions to remote database
                saveTransaction();
        }
}
request.onerror = function(event) {
        console.log(event.target.errorCode);
}
//if no internet connection...
function saveRecord(record) {
	//open new transaction with read/write permissions
	const transaction = db.transaction(["new_transaction"], "readwrite");
	//access object store
	const budgetObjectStore = transaction.objectStore("new_pizza");
	//add record to the store
	budgetObjectStore.add(record);
}


function uploadTransaction() {
        //open a transaction
        const transaction = db.transaction(['new_transaction'], 'readwrite');
        //access Object Store
        const budgetObjectStore = transaction.objectStore('new_transaction');
        //get all records from this store
        const getAll = pizzaObjectStore.getAll();
        //if there is data in store in the indexed db, send it to the remotedatabase
        getAll.onsuccess = function() {
                if (getAll.result.length > 0) {
                        fetch('/api/transaction/bulk', {
                                method: "POST",
                                body: JSON.stringify(getAll.result),
                                headers:{
                                        Accept: "application/json, text/plain, */*",
                                        "Content-Type": "application/json",
                                }
                        })
                        .then(response => response.json())
                        .then(serverResponse => {
                                if (serverResponse.message) {
                                        throw new Error(serverResponse);
                                }
                                //clear the indexed db database after sending all of its data
                                const transaction = db.transaction(['new_transaction'], 'readwrite');
                                const budgetObjectStore = transaction.objectStore('new_transaction');
                                budgetObjectStore.clear();
                                console.log('App online. Transactions saved')
                        })
                        .catch(err => {console.log(err)});
                }
        };
}

//listen for app coming back online
window.addEventListener("online", uploadTransaction);
