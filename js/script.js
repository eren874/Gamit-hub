document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Zenith Pro 15.6 Laptop", price: 68500, image: "images/zen.jpg", description: "High-performance laptop with 16GB RAM, 512GB SSD, and dedicated graphics for productivity and light gaming.", featured: true },
        { id: 2, name: "Orion X1 Flagship Smartphone", price: 52700, image: "images/orion.jpg", description: "Latest AI-powered camera system, stunning 120Hz OLED display, and 256GB internal storage.", featured: true },
        { id: 3, name: "AuraSound Elite NC Headphones", price: 9850, image: "images/hed.jpg", description: "Premium over-ear wireless headphones featuring active noise cancellation (ANC) and up to 30-hour battery life.", featured: true },
        { id: 4, name: "ChronoFit Active Smartwatch", price: 7490, image: "images/watch.jpg", description: "Your ultimate health and fitness companion with advanced tracking, vibrant AMOLED display, built-in GPS, and 7-day battery life.", featured: true },
        { id: 5, name: "Phantom X Gaming Console - Next Gen", price: 32000, image: "images/thom.jpg", description: "Immerse yourself in next-generation gaming with 8K support, ray tracing, and an ultra-fast custom SSD for near-instant load times.", featured: false },
        { id: 6, name: "ClearView 27 4K UHD Monitor", price: 21500, image: "images/mon.jpg", description: "Professional-grade 27-inch IPS monitor with stunning 4K UHD (3840x2160) resolution and 99% sRGB color accuracy for creative work.", featured: false },
        { id: 7, name: "Typemaster K87 Mechanical Keyboard", price: 4250, image: "images/key.jpg", description: "Compact Tenkeyless (TKL) mechanical keyboard with durable tactile switches, customizable RGB backlighting, and a detachable USB-C cable.", featured: false },
        { id: 8, name: "DataGuard 1TB Rugged Portable SSD", price: 6800, image: "images/dh.jpg", description: "Ultra-durable and fast portable SSD with 1TB capacity, USB-C connectivity, IP65 water/dust resistance, and shockproof design.", featured: false },
        { id: 9, name: "ConnectMax C1080p Pro Webcam", price: 2990, image: "images/wrk.jpg", description: "Full HD 1080p webcam delivering crystal-clear video quality with autofocus, wide-angle lens, and built-in dual noise-reducing microphones.", featured: false },
        { id: 10, name: "VoltBoost 20000mAh Power Bank Duo", price: 2150, image: "images/bnk.jpg", description: "High-capacity 20000mAh power bank with dual USB-A outputs and a USB-C Power Delivery (PD) port for fast charging multiple devices on the go.", featured: false },
        { id: 11, name: "AcousticPod Pro TWS Earbuds", price: 12890, image: "images/pod.jpg", description: "Premium true wireless stereo earbuds with adaptive EQ, spatial audio, and MagSafe compatible charging case.", featured: false },
        { id: 12, name: "LuminaView P40 Portable Projector", price: 16500, image: "images/proj.jpg", description: "Compact Full HD (1080p) LED projector with built-in battery, Wi-Fi connectivity, and seamless screen mirroring.", featured: false }
    ];

    const originalProductsOrder = [...products];
    let cart = JSON.parse(localStorage.getItem('gamitHubCart')) || [];

    const formatPrice = (price) => `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const updateCartCount = () => {
        const cartCountElements = document.querySelectorAll('#cart-count');
        if (cartCountElements.length > 0) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElements.forEach(el => el.textContent = totalItems);
        }
        const checkoutCartCount = document.getElementById('checkout-cart-count');
         if (checkoutCartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            checkoutCartCount.textContent = totalItems;
        }
    };

    const saveCart = () => {
        localStorage.setItem('gamitHubCart', JSON.stringify(cart));
        updateCartCount();
    };

    const renderProducts = (containerId, productListToRender) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = ''; 
        let delay = 0; 
        productListToRender.forEach(product => {
            const productCardHTML = `
                <div class="col-md-6 col-lg-4 col-xl-3 mb-4 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay="${delay}">
                    <div class="card product-card">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text price">${formatPrice(product.price)}</p>
                            <p class="card-text small">${product.description.substring(0, 70)}...</p>
                            <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCardHTML;
            delay += 50; 
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            });
        });
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();

        const toastLiveExample = document.getElementById('liveToast');
        if (toastLiveExample) {
            const toastBody = toastLiveExample.querySelector('.toast-body');
            if (toastBody) {
                toastBody.textContent = `${product.name} has been added to your cart!`;
            }
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        } else {
            alert(`${product.name} added to cart!`);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (newQuantity > 0) {
                cartItem.quantity = newQuantity;
            } else {
                removeFromCart(productId); 
                return; 
            }
        }
        saveCart();
        renderCartPage(); 
        renderCheckoutOrderSummary(); 
    };

    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCartPage(); 
        renderCheckoutOrderSummary(); 
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const renderCartPage = () => {
        const cartContainer = document.getElementById('cart-items-container');
        const cartSummaryContainer = document.getElementById('cart-summary');
        if (!cartContainer || !cartSummaryContainer) return; 
        cartContainer.innerHTML = ''; 
        cartSummaryContainer.innerHTML = '';

        if (cart.length === 0) {
            cartContainer.innerHTML = `<div class="alert alert-info empty-cart-message" role="alert">Your cart is empty. <a href="products.html" class="alert-link">Start shopping!</a></div>`;
            cartSummaryContainer.innerHTML = `<a href="checkout.html" class="btn btn-primary mt-3 disabled w-100">Proceed to Checkout</a>`;
            return;
        }

        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item">
                    <div class="cart-item-content">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details-and-actions">
                            <div class="cart-item-details">
                                <h5>${item.name}</h5>
                                <p class="text-muted">Price: ${formatPrice(item.price)}</p>
                                <p class="fw-bold">Subtotal: ${formatPrice(item.price * item.quantity)}</p>
                            </div>
                            <div class="cart-item-actions">
                                <button class="btn btn-outline-secondary btn-sm decrease-qty-btn" data-id="${item.id}">-</button>
                                <input type="number" class="form-control form-control-sm quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="btn btn-outline-secondary btn-sm increase-qty-btn" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-remove-action">
                        <button class="btn btn-danger btn-sm remove-from-cart-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += cartItemHTML;
        });

        const totalAmount = calculateTotal();
        cartSummaryContainer.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="d-flex justify-content-between">
                <h4>Subtotal:</h4>
                <h4>${formatPrice(totalAmount)}</h4>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <h4>Total:</h4>
                <h4><strong>${formatPrice(totalAmount)}</strong></h4>
            </div>
            <a href="checkout.html" class="btn btn-primary mt-3 ${cart.length === 0 ? 'disabled' : ''} w-100">Proceed to Checkout</a>
        `;

        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', e => removeFromCart(parseInt(e.currentTarget.dataset.id)));
        });
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', e => updateQuantity(parseInt(e.target.dataset.id), parseInt(e.target.value)));
            input.addEventListener('blur', e => { 
                if(!e.target.value || parseInt(e.target.value) < 1) { 
                    e.target.value = 1;
                    updateQuantity(parseInt(e.target.dataset.id), 1);
                }
            });
        });
        document.querySelectorAll('.increase-qty-btn').forEach(button => {
            button.addEventListener('click', e => {
                const id = parseInt(e.currentTarget.dataset.id);
                const input = e.currentTarget.closest('.cart-item-actions').querySelector(`.quantity-input[data-id='${id}']`);
                input.value = parseInt(input.value) + 1;
                updateQuantity(id, parseInt(input.value));
            });
        });
        document.querySelectorAll('.decrease-qty-btn').forEach(button => {
            button.addEventListener('click', e => {
                const id = parseInt(e.currentTarget.dataset.id);
                const input = e.currentTarget.closest('.cart-item-actions').querySelector(`.quantity-input[data-id='${id}']`);
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    updateQuantity(id, parseInt(input.value));
                } else {
                    removeFromCart(id); 
                }
            });
        });
    };

    const renderCheckoutOrderSummary = () => {
        const summaryContainer = document.getElementById('checkout-order-summary');
        if (!summaryContainer) return; 
        summaryContainer.innerHTML = '';
        let subtotal = 0;
        const checkoutFormButton = document.getElementById('checkout-form')?.querySelector('button[type="submit"]');
        if (cart.length === 0 && window.location.pathname.includes('checkout.html')) {
             summaryContainer.innerHTML = `<li class="list-group-item">Your cart is empty. <a href="products.html">Shop now</a> to proceed.</li>`;
             if(checkoutFormButton) checkoutFormButton.classList.add('disabled');
             return;
        } else {
             if(checkoutFormButton) checkoutFormButton.classList.remove('disabled');
        }
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const listItem = `
                <li class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                        <h6 class="my-0">${item.name} (x${item.quantity})</h6>
                        <small class="text-muted">${item.description.substring(0,30)}...</small>
                    </div>
                    <span class="text-muted">${formatPrice(itemTotal)}</span>
                </li>
            `;
            summaryContainer.innerHTML += listItem;
        });
        const total = subtotal; 
        summaryContainer.innerHTML += `
            <li class="list-group-item d-flex justify-content-between bg-light">
                <span class="fw-bold">Total (PHP)</span>
                <strong class="fw-bold">${formatPrice(total)}</strong>
            </li>
        `;
    };

    const handleCheckoutForm = () => {
        const form = document.getElementById('checkout-form');
        if (!form) return;
        const paymentMethodRadios = form.querySelectorAll('input[name="paymentMethod"]');
        const cardDetailsDiv = document.getElementById('simulated-card-details');
        const cardInputs = cardDetailsDiv.querySelectorAll('input');
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.id === 'card' && this.checked) {
                    cardDetailsDiv.classList.remove('d-none');
                    cardInputs.forEach(input => input.required = true);
                } else {
                    cardDetailsDiv.classList.add('d-none');
                    cardInputs.forEach(input => input.required = false);
                }
            });
        });
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
            } else {
                form.classList.add('was-validated'); 
                document.getElementById('order-success-message').classList.remove('d-none');
                cart = []; 
                saveCart(); 
                renderCheckoutOrderSummary(); 
                form.reset();
                form.classList.remove('was-validated');
                cardDetailsDiv.classList.add('d-none'); 
                cardInputs.forEach(input => input.required = false);
                document.getElementById('cod').checked = true; 
                setTimeout(() => {
                     document.getElementById('order-success-message').classList.add('d-none');
                }, 5000);
            }
        }, false);
    };

    const handleContactForm = () => {
        const form = document.getElementById('contact-form');
        if(!form) return;
        form.addEventListener('submit', event => {
            event.preventDefault();
            let isValid = true;
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            if (isValid) {
                document.getElementById('contact-success-message').classList.remove('d-none');
                form.reset();
                setTimeout(() => {
                    document.getElementById('contact-success-message').classList.add('d-none');
                }, 4000);
            }
        });
    };

    const setCurrentYear = () => {
        const yearSpans = document.querySelectorAll('#current-year');
        if (yearSpans.length > 0) {
            yearSpans.forEach(span => span.textContent = new Date().getFullYear());
        }
    };

    const handleProductSort = () => {
        const sortOptions = document.querySelectorAll('.sort-option');
        const dropdownButton = document.getElementById('sortProductsDropdown');

        sortOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const sortBy = this.dataset.sort;
                let sortedProducts = [...products]; 

                switch(sortBy) {
                    case 'price-asc':
                        sortedProducts.sort((a, b) => a.price - b.price);
                        dropdownButton.textContent = 'Sort by: Price: Low to High';
                        break;
                    case 'price-desc':
                        sortedProducts.sort((a, b) => b.price - a.price);
                        dropdownButton.textContent = 'Sort by: Price: High to Low';
                        break;
                    case 'name-asc':
                        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                        dropdownButton.textContent = 'Sort by: Name: A to Z';
                        break;
                    case 'name-desc':
                        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                        dropdownButton.textContent = 'Sort by: Name: Z to A';
                        break;
                    default: 
                        sortedProducts = [...originalProductsOrder]; 
                        dropdownButton.textContent = 'Sort by: Default';
                        break;
                }
                renderProducts('product-list-container', sortedProducts);
            });
        });
    };

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (currentPage === 'index.html') {
        renderProducts('featured-products-container', products.filter(p => p.featured));
    }
    if (currentPage === 'products.html') {
        renderProducts('product-list-container', [...originalProductsOrder]); 
        handleProductSort(); 
    }
    if (currentPage === 'cart.html') {
        renderCartPage();
    }
    if (currentPage === 'checkout.html') {
        if (cart.length === 0) { 
             window.location.href = 'cart.html';
             return; 
        }
        renderCheckoutOrderSummary();
        handleCheckoutForm();
    }
    if (currentPage === 'contact.html') {
        handleContactForm();
    }
    updateCartCount(); 
    setCurrentYear(); 
});