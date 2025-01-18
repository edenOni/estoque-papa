function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

        function findTransactionByUid(uid) {
            showLoading();
        
            firebase.firestore()
                .collection("transactions")
                .doc(uid)
                .get()
                .then(doc => {
                    hideLoading();
                    if (doc.exists) {
                        fillTransactionScreen(doc.data());
                        toggleSaveButtonDisable();
                    } else {
                        alert("Documento nao encontrado");
                        window.location.href = "../home/home.html";
                    }
                })
                .catch(() => {
                    hideLoading();
                    alert("Erro ao recuperar documento");
                    window.location.href = "../home/home.html";
                });
        }

        function fillTransactionScreen(transaction) {
            if (transaction.type == "expense") {
                form.typeExpense().checked = true;
            } else {
                form.typeIncome().checked = true;
            }
        
            form.date().value = transaction.date;
            form.transactionDesc().value = transaction.description;
            form.transactionNDS().value = transaction.NDS;
            form.transactionTeste().value = transaction.teste;
            form.unid().value = transaction.transactionUnid;
        }

function saveTransaction() {
    const transaction = createTransaction();

    if (isNewTransaction()) {
        save(transaction);
    } else {
        update(transaction);
    }
}

        function save(transaction) {
            showLoading();
        
            firebase.firestore()
                .collection('transactions')
                .add(transaction)
                .then(() => {
                    hideLoading();
                    window.location.href = "../home/home.html";
                })
                .catch(() => {
                    hideLoading();
                    alert('Erro ao salvar transaçao');
                })
        }

        function update(transaction) {
            showLoading();
            firebase.firestore()
                .collection("transactions")
                .doc(getTransactionUid())
                .update(transaction)
                .then(() => {
                    hideLoading();
                    window.location.href = "../home/home.html";
                })
                .catch(() => {
                    hideLoading();
                    alert('Erro ao atualizar transaçao');
                });
        }

function createTransaction() {
    return {
        type: form.typeExpense().checked ? "expense" : "income",
        NDS: form.transactionNDS().value,
        date: form.date().value,
        description: form.transactionDesc().value,
        teste: form.transactionTeste().value,
        transactionUnid: form.unid().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    };
}

function OnchageNDS() {
    const transactionNDS = form.transactionNDS().value;
    form.transactionDescRequiredError().style.display = !transactionNDS ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";

    toggleSaveButtonDisable();
}

function OnchageDesc() {
    const transactionDesc = form.transactionDesc().value;
    form.transactionDescRequiredError().style.display = !transactionDesc ? "block" : "none";

    toggleSaveButtonDisable();
}


function OnchageTeste() {
    const transactionTeste = form.transactionTeste().value;
    form.transactionDescRequiredError().style.display = !transactionTeste ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeTransactionUnid() {
    const unid = form.unid().value;
    form.unidRequiredError().style.display = !unid ? "block" : "none";

    form.unidLessOrEqualToZeroError().style.display = unid <= 0 ? "block" : "none";

    toggleSaveButtonDisable();
}

function toggleSaveButtonDisable() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }

    const transactionNDS = form.transactionNDS().value;
    if (!transactionNDS) {
        return false;
    }

    const transactionTeste = form.transactionTeste().value;
    if (!transactionTeste) {
        return false;
    }

    const transactionDesc = form.transactionDesc().value;
    if (!transactionDesc) {
        return false;
    }

    const unid = form.unid().value;
    if (!unid || unid <= 0) {
        return false;
    }

    return true;
}

const form = {
    transactionNDS: () => document.getElementById('TransactionNDS'),
    transactionDescRequiredError: () => document.getElementById('Desc-required-error'),
    date: () => document.getElementById('date'),
    dateRequiredError: () => document.getElementById('date-required-error'),
    saveButton: () => document.getElementById('save-button'),
    transactionDesc: () => document.getElementById('Transaction-Desc'),
    transactionDescRequiredError: () => document.getElementById('Desc-required-error'),
    transactionTeste: () => document.getElementById('TransactionTeste'),
    transactionDescRequiredError: () => document.getElementById('Desc-required-error'),
    typeExpense: () => document.getElementById('expense'),
    typeIncome: () => document.getElementById('income'),
    unid: () => document.getElementById('Unid'),
    unidRequiredError: () => document.getElementById('Unid-required-error'),
    unidLessOrEqualToZeroError: () => document.getElementById('Unid-less-or-equal-to-zero-error')
}