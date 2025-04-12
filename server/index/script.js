let transactions = [];

function addTransaction(type) {
  const desc = document.getElementById('description').value;
  const amt = document.getElementById('amount').value;

  if (!desc || !amt || isNaN(amt)) {
    alert("Please enter valid description and amount.");
    return;
  }

  const transaction = {
    id: Date.now(),
    description: desc,
    amount: parseFloat(amt),
    type: type
  };

  transactions.push(transaction);
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  updateUI();
}

function updateUI() {
  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  let income = 0, expense = 0;

  transactions.forEach(t => {
    const item = document.createElement('li');
    item.className = t.type;
    item.textContent = `${t.description} - $${t.amount.toFixed(2)} (${t.type})`;
    list.appendChild(item);

    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });

  document.getElementById('income').textContent = `Income: $${income.toFixed(2)}`;
  document.getElementById('expense').textContent = `Expenses: $${expense.toFixed(2)}`;
  document.getElementById('balance').textContent = `Balance: $${(income - expense).toFixed(2)}`;
}
