function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

firebase.auth().onAuthStateChanged(user => {
    if (user){
        findTransactions(user);
    }
})

function register() {
    window.location.href = "../register/register.html";
}

function newTransaction() {
    window.location.href = "../transaction/transaction.html";
}

function findTransactions(user) {
    showLoading();
    firebase.firestore()
        .collection('transactions')
        .where('user.uid', '==', user.uid)
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {
            hideLoading();
            const transactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao recuperar transacoes');
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById('transactions');

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);
        li.id = transaction.uid;
        li.addEventListener('click', () => {
            window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
        })

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Remover";
        deleteButton.classList.add('outline', 'danger');
        deleteButton.addEventListener('click', event => {
            event.stopPropagation();
            askRemoveTransaction(transaction);
        })
        li.appendChild(deleteButton);

        const date = document.createElement('p');
        date.innerHTML = formatDate(transaction.date);
        li.appendChild(date);

        const NDS = document.createElement('p');
        NDS.innerHTML = transaction.NDS;
        li.appendChild(NDS);

        if (transaction.description) {
            const description = document.createElement('p');
            description.innerHTML = transaction.description;
            li.appendChild(description);
        }

        const teste = document.createElement('p');
        teste.innerHTML = transaction.teste;
        li.appendChild(teste);

        const type = document.createElement('p');
        type.innerHTML = transaction.transactionUnid;
        li.appendChild(type);


        orderedList.appendChild(li);
    });
}

function askRemoveTransaction(transaction) {
    const shouldRemove = confirm('Deseja remover a transaçao?');
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}

function removeTransaction(transaction) {
    showLoading();

    firebase.firestore()
        .collection("transactions")
        .doc(transaction.uid)
        .delete()
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao remover transaçao');
        })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}
