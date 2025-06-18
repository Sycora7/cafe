let order = {};
let prices = {
    wings: 8.99, nachos: 7.49, mozzsticks: 6.99,
    burger: 12.99, pasta: 14.99, pizza: 16.99,
    cake: 5.99, icecream: 3.99
};
let names = {
    wings: "buffalo wings", nachos: "loaded nachos", mozzsticks: "mozzarella sticks",
    burger: "classic burger", pasta: "chicken alfredo", pizza: "margherita pizza",
    cake: "chocolate cake", icecream: "vanilla ice cream"
};

function updateQuantity(item, change) {
    if (!order[item]) order[item] = 0;
    order[item] += change;
    if (order[item] < 0) order[item] = 0;
    let input = document.querySelector(`input[data-item="${item}"]`);
    if (input) {
        input.value = order[item];
        updateItemBorder(item);
    }
    saveOrder();
    displayOrder();
}

function updateItemBorder(item) {
    let itemElement = document.querySelector(`input[data-item="${item}"]`);
    if (itemElement) {
        let parentItem = itemElement.closest('.item');
        if (parentItem) {
            if (order[item] && order[item] > 0) {
                parentItem.style.border = '2px solid green';
            } else {
                parentItem.style.border = '1px solid #eee';
            }
        }
    }
}

function saveOrder() {
    localStorage.setItem('cafeOrder', JSON.stringify(order));
}

function loadOrder() {
    let saved = localStorage.getItem('cafeOrder');
    if (saved) {
        order = JSON.parse(saved);
        for (let item in order) {
            let input = document.querySelector(`input[data-item="${item}"]`);
            if (input) {
                input.value = order[item];
                updateItemBorder(item);
            }
        }
    }
}

function validateInput(item, value) {
    if (value > 100) {
        showError("quantity too high! max 100 per item");
        return false;
    }
    return true;
}

function showError(message) {
    let errorMsg = document.getElementById('error-msg');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.opacity = '1';
        setTimeout(() => errorMsg.style.opacity = '0', 3000);
    }
}

function displayOrder() {
    let orderList = document.getElementById('order-list');
    let totalSection = document.getElementById('total-section');
    if (!orderList || !totalSection) return;
    
    let total = 0;
    let hasItems = false;
    orderList.innerHTML = '';
    
    for (let item in order) {
        if (order[item] > 0) {
            hasItems = true;
            let cost = order[item] * prices[item];
            total += cost;
            let div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `<span>${names[item]} x${order[item]}</span><span>${cost.toFixed(2)}</span>`;
            orderList.appendChild(div);
        }
    }
    
    if (!hasItems) {
        orderList.innerHTML = '<p>no items selected</p>';
    }
    
    totalSection.innerHTML = `<h3>total: ${total.toFixed(2)}</h3>`;
    
    let yummyMsg = document.querySelector('.yummy-msg');
    if (yummyMsg) {
        if (total > 100) {
            yummyMsg.textContent = "are u sure ur order's getting expensive buddy";
            yummyMsg.style.color = 'crimson';
        } else {
            yummyMsg.textContent = "yummy!";
            yummyMsg.style.color = '#03fcad';
        }
    }
}

function confirmOrder() {
    let paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
        paymentSection.classList.add('show');
    }
}

function selectPayment(method) {
    let statusText = document.getElementById('payment-status');
    let finalMessage = document.getElementById('final-message');
    
    if (statusText) {
        statusText.textContent = 'payment processed';
        statusText.style.color = 'green';
    }
    
    if (finalMessage) {
        finalMessage.textContent = 'enjoy your meal!';
        finalMessage.classList.add('success');
    }
}

function updateOrderTitle() {
    let nameInput = document.getElementById('name');
    let orderTitle = document.querySelector('.whos-order');
    if (nameInput && orderTitle) {
        let name = nameInput.value.trim();
        if (name) {
            orderTitle.textContent = name + "'s order";
        } else {
            orderTitle.textContent = "your order";
        }
    }
}

window.addEventListener('load', function() {
    loadOrder();
    displayOrder();
    
    const plusButtons = document.querySelectorAll('.plus-btn');
    if (plusButtons.length > 0) {
        plusButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                updateQuantity(this.dataset.item, 1);
            });
        });
    }
    
    const minusButtons = document.querySelectorAll('.minus-btn');
    if (minusButtons.length > 0) {
        minusButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                updateQuantity(this.dataset.item, -1);
            });
        });
    }
    
    const qtyInputs = document.querySelectorAll('.qty-input');
    if (qtyInputs.length > 0) {
        qtyInputs.forEach(input => {
            input.addEventListener("input", function() {
                let value = parseInt(this.value) || 0;
                if (validateInput(this.dataset.item, value)) {
                    order[this.dataset.item] = value;
                    updateItemBorder(this.dataset.item);
                    saveOrder();
                    displayOrder();
                } else {
                    this.value = order[this.dataset.item] || 0;
                }
            });
        });
    }
    
    let confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener("click", confirmOrder);
    }
    
    const paymentButtons = document.querySelectorAll('.payment-btn');
    if (paymentButtons.length > 0) {
        paymentButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                selectPayment(this.dataset.method);
            });
        });
    }
    
    let nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener("input", updateOrderTitle);
    }
});
