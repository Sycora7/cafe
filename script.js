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
}

function updateItemBorder(item) {
    let itemElement = document.querySelector(`input[data-item="${item}"]`).closest('.item');
    if (order[item] && order[item] > 0) {
        itemElement.style.border = '2px solid #03fc90';
    } else {
        itemElement.style.border = '1px solid #eee';
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


  const nameInput = document.getElementById("name");
  const orderHeader = document.querySelector(".whos-order");

  nameInput.addEventListener("input", () => {
    const name = nameInput.value.trim();
    if (name) {
      orderHeader.textContent = `${name}'s order`;
    } else {
      orderHeader.textContent = "your order";
    }
  });

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
            div.innerHTML = `<span>${names[item]} x${order[item]}</span><span>$${cost.toFixed(2)}</span>`;
            orderList.appendChild(div);
        }
    }
    
    if (!hasItems) {
        orderList.innerHTML = '<p>no items selected</p>';
    }

    if (total >= 100) {
        document.querySelector('.yummy-msg').innerHTML = 'um are u sure u wanna spend that much bro';
        document.querySelector('.yummy-msg').style.color = 'crimson';
    }
    
    totalSection.innerHTML = `<h3>total: $${total.toFixed(2)}</h3>`;
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
        statusText.style.color = 'aquamarine';
    }
    
    if (finalMessage) {
        finalMessage.textContent = 'enjoy your meal!';
        finalMessage.classList.add('success');
    }
}

window.addEventListener('load', function() {
    loadOrder();
    displayOrder();
    
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener("click", function() {
            updateQuantity(this.dataset.item, 1);
        });
    });
    
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener("click", function() {
            updateQuantity(this.dataset.item, -1);
        });
    });
    
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener("input", function() {
            let value = parseInt(this.value) || 0;
            if (validateInput(this.dataset.item, value)) {
                order[this.dataset.item] = value;
                updateItemBorder(this.dataset.item);
                saveOrder();
            } else {
                this.value = order[this.dataset.item] || 0;
            }
        });
    });
    
    let confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener("click", confirmOrder);
    }
    
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener("click", function() {
            selectPayment(this.dataset.method);
        });
    });
});