document.addEventListener("DOMContentLoaded", function () {
    // Ensure the cart-area exists
    const cartArea = document.getElementById('cart-box');
    if (!cartArea) {
        console.error('cart-area element not found!');
        return; // Exit if cart-area does not exist
    }

    const preloader = document.getElementById("preloader");
    const minDuration = 2000;
    const startTime = Date.now();

    function hidePreloader() {
        preloader.style.transition = "opacity 0.5s ease-out";
        preloader.style.opacity = "0";
        setTimeout(() => { preloader.style.display = "none"; }, 500);
    }

    function checkPageLoad() {
        const elapsedTime = Date.now() - startTime;
        if (document.readyState === "complete") {
            if (elapsedTime >= minDuration) {
                hidePreloader();
            } else {
                setTimeout(hidePreloader, minDuration - elapsedTime);
            }
        } else {
            setTimeout(checkPageLoad, 500);
        }
    }

    setTimeout(checkPageLoad, minDuration);
   /** ---- Filter Logic ---- */
   const filterButton = document.getElementById('apply-filters');
   if (filterButton) {
       filterButton.addEventListener('click', function () {
           const selectedCategory = document.getElementById('category-filter').value.toLowerCase();
           const selectedTier = document.getElementById('pricing-filter').value.toLowerCase();
           const cards = document.querySelectorAll('.card');

           cards.forEach(card => {
               const cardCategory = card.getAttribute('data-type').toLowerCase();
               const cardTier = card.getAttribute('data-tier').toLowerCase();

               // Check if category and tier match or are set to "all"
               const matchesCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
               const matchesTier = selectedTier === 'all' || selectedTier === cardTier;

               card.style.display = matchesCategory && matchesTier ? 'block' : 'none';
           });
       });
   }


    /** ---- CART FUNCTIONALITY ---- */
    let selectedPackages = [];

    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const orderButton = document.querySelector('#order-form button');
  
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart")) {
            const card = event.target.closest('.card');
            if (!card) return;

            const packageName = card.querySelector("h2").textContent;
            let packagePrice;

            // Check for discounted price first
            const discountedPriceElement = card.querySelector(".discounted-price");
            if (discountedPriceElement) {
                packagePrice = parseFloat(discountedPriceElement.textContent.replace("₹", "").replace(",", ""));
            } else {
                const originalPriceElement = card.querySelector(".original-price");
                packagePrice = parseFloat(originalPriceElement.textContent.replace("₹", "").replace(",", ""));
            }

            // Toggle Add/Remove from Cart
            if (event.target.classList.contains("added")) {
                event.target.classList.remove("added");
                event.target.textContent = "Add to Cart";
                selectedPackages = selectedPackages.filter(pkg => pkg.name !== packageName);
            } else {
                event.target.classList.add("added");
                event.target.textContent = "Added to Cart ✔";
                selectedPackages.push({ name: packageName, price: packagePrice });
            }

            updateCart();
        }
    });

    function calculateTotalPrice() {
        return selectedPackages.reduce((total, pkg) => total + pkg.price, 0);
    }

    function updateCart() {
        cartItems.innerHTML = ''; // Clear cart
        selectedPackages.forEach(pkg => {
            const li = document.createElement('li');
            li.textContent = `${pkg.name} - ₹${pkg.price.toFixed(2)}`;
            cartItems.appendChild(li);
        });

        // Update Total Price
        const totalPrice = calculateTotalPrice();
        if (totalPriceElement) {
            totalPriceElement.textContent = `Total Price (GST included): ₹${totalPrice.toFixed(2)}`;
        }

        // Update hidden input fields
        document.getElementById("order-details").value = JSON.stringify(selectedPackages);
        document.getElementById("total-price-input").value = totalPrice.toFixed(2);

        // Enable submit button only if cart has items
        orderButton.disabled = selectedPackages.length === 0;

        // Update Cart Count in Navbar
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = selectedPackages.length;
        }
    }
// Cart Form Submission Handler
document.getElementById("order-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    formData.append("formType", "cart"); // Identify this as Cart Form

    const submitButton = form.querySelector("button");
    const responseMessage = document.getElementById("response-message");

    // Show wait message
    showWaitMessage();

    // Convert selectedPackages to a readable string with name and price
    const selectedPackagesString = selectedPackages.map(item => `${item.name}: ₹${item.price}`).join(", ");
    document.getElementById("order-details").value = selectedPackagesString;

    // Set total price
    document.getElementById("total-price-input").value = calculateTotalPrice().toFixed(2);

    // Trim email input
    const emailInput = document.getElementById("email");
    emailInput.value = emailInput.value.trim();

    // Convert FormData to a plain object
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    fetch("https://script.google.com/macros/s/AKfycbxmik4Xic5j8Vp8j0_nRP3YLORrGNWz3_zO2qSoo9PrYjvKnxjssErPkx4Fu_v4cemV3g/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(formObject) // ✅ Correctly formatted JSON body
    })
    .then(() => {
        showSuccessMessage(); // ✅ Show success message after order is processed
        console.log("Order submitted successfully.");
    })
    .catch(error => {
        hideWaitMessage(); // ✅ Remove wait message in case of an error
        console.error("Error:", error);
    });

    // Optionally, reset the form after submission



  
  // Show "Wait..." message while processing order
  function showWaitMessage() {
    const cartArea = document.getElementById("cart-box"); // Ensure cartArea exists
    if (!cartArea) return;
  
    const waitMessage = document.createElement('div');
    waitMessage.id = 'wait-message';
    waitMessage.textContent = "Wait...⏳ Your order is being processed.";
    waitMessage.style.color = 'red';
    waitMessage.style.marginLeft = '5rem';
    cartArea.appendChild(waitMessage);
  }
  
  // Hide the "Wait..." message
  function hideWaitMessage() {
    const waitMessage = document.getElementById('wait-message');
    if (waitMessage) {
      waitMessage.remove();
    }
  }
  
  // Show success message in green banner after processing the order
  function showSuccessMessage() {
    const cartArea = document.getElementById("cart-box"); // Ensure cartArea exists
    if (!cartArea) return;
  
    // Hide wait message if it exists
    hideWaitMessage();
  
    const Username = document.getElementById("username").value; // Assuming you have an element with this ID
    const successBanner = document.createElement('div');
    successBanner.id = 'success-banner';
    successBanner.textContent = `${Username}, your Order has been successfully processed!  Please check your email (including spam folder) for confirmation. I will contact you soon!..`;
    successBanner.style.backgroundColor = 'green';
    successBanner.style.color = 'white';
    successBanner.style.padding = '10px';
    successBanner.style.textAlign = 'center';
  
    cartArea.insertBefore(successBanner, cartArea.firstChild);
  
    // Hide success message after a few seconds and refresh the page
    setTimeout(() => {
      successBanner.style.display = 'none';
      location.reload();  // Refresh the page after 4 seconds
    }, 4000);
  }
  
});

    /** ---- FAQ CHATBOT HANDLER ---- */
    const faqLink = document.getElementById('faq-link');
    if (faqLink) {
        faqLink.addEventListener('click', function (event) {
            event.preventDefault();
            if (window.chatbase && typeof window.chatbase === 'function') {
                window.chatbase('open');
            }
        });
    }

    /** ---- Scroll To Top Button ---- */
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
        });
    }

    /** ---- Intersection Observer for Card Fade-in Animation ---- */
    const cards = document.querySelectorAll(".card");
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    cards.forEach(card => observer.observe(card));
});



function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hide Scroll Button when at Top
window.addEventListener('scroll', () => {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="ZYSyWgUFDQEiJemJHE2S6";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();

document.getElementById('faq-link').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
  
    // Check if Chatbase is initialized
    if (window.chatbase && typeof window.chatbase === 'function') {
        // Trigger the chat window to open
        window.chatbase('open');
    }
  });
  
