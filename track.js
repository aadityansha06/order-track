let cancelInfoHTML = `
    <p>If you wish to cancel your order, you can do so within <strong>2 days</strong> via:<br>
    replying to the <a href="mailto: pkumariverma42@gmail.com?subject=Issue%20related%20to%20Orders%20and%20it's%20tracking%20or%20canceling" target="_blank" style="  color: red;
    text-decoration: none;
    font-weight: bold;">Email</a>  you received <br> or<br> sending a message on the <a href="https://t.me/aadityansha">telegram.</a></p>
    <p>Orders are typically delivered within <strong>5-10 days</strong> based on your preference.</p>
    <br>
    <a href="hire.html">Back</a><br><br>
    <a href="index.html">main-page</a>
`;
var input = document.getElementById("orderId");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("track").click();
  }
});
function fetchOrderDetails() {
    let orderId = document.getElementById("orderId").value.trim();
    if (!orderId) {
       
        let load =  document.getElementById("loading");
        load.style.display="block";
        load.style.marginTop="2rem";
        load.style.color="rgba(255,0,0,0.9)"
        load.innerHTML="Please enter a valid Order ID🙁";

        return;
    }
    

    resetOrderDetails(); // Reset UI before fetching new details

    document.getElementById("loading").style.display = "block";
    document.getElementById("loading").style.color="white";
    document.getElementById("loading").innerHTML="Wait...⏳ Your order is being fetched";
    document.getElementById("orderDetails").style.display = "none";
    document.getElementById("progressBar").style.display = "none";

    fetch(`https://script.google.com/macros/s/AKfycbxXZ38uVTgnjiNbguD3OgfkL3GlYLVgqFhPH4ZJGkb1-PZ6hKiPyTKDYZvE1S-PEG0v/exec?orderId=${orderId}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loading").style.display = "none";

            if (data.success) {
                document.getElementById("customerName").innerText = data.name;
                document.getElementById("orderDate").innerText = new Date(data.date).toLocaleString();

                let orderInfo = document.getElementById("orderInfo");
                orderInfo.innerHTML = "";
                data.details.forEach(item => {
                    let li = document.createElement("li");
                    li.textContent = `${item.name} - ${item.price}`;
                    orderInfo.appendChild(li);
                });
                document.getElementById("total").innerText = data.price;

                document.getElementById("orderDetails").style.display = "block";
                document.getElementById("progressBar").style.display = "flex";

                // Update the info section dynamically
                let infoElement = document.getElementById("info");
                if (data.status == 0) {
                    infoElement.innerHTML = `<h4>😊 Please be patient; it takes a while to update the order.</h4>`;
                }else if(data.status==5){

                    infoElement.innerHTML =`<h4 style="color:green;">Congrats! 🎉 Your project is live and ready to go! Thanks for choosing me-looking forward to working with you again soon!`;
                
                    console.log('Data status:', data.status); // Check the exact value of the status

                }

                else {
                    infoElement.innerHTML = cancelInfoHTML; // Restore original cancellation message
                }

                // Update progress bar based on order status
                updateProgressBar(data.status);
            } else {
                       let load =  document.getElementById("loading");
                       load.style.display="block";
                       load.style.marginTop="2rem";
                       load.style.color="rgba(255,0,0,0.9)"
                       load.innerHTML="Sorry! Order id  is incorrect 😔, Please re-check";
               
            }
        })
        .catch(error => {
            console.error("Error fetching order details:", error);
            alert("Failed to fetch order details. Please try again later.");
            document.getElementById("loading").style.display = "none";
        });
}


function resetOrderDetails() {
    // Reset order details
    document.getElementById("customerName").innerText = "";
    document.getElementById("orderDate").innerText = "";
    document.getElementById("orderInfo").innerHTML = "";
    document.getElementById("total").innerText = "";
    document.getElementById("loading").innerHTML="";
    // Reset Progress Bar and Steps
    let steps = document.querySelectorAll(".step");
    let progressLine = document.getElementById("progressLine");
    
    // Hide the progress bar and clear the active steps
    progressLine.style.width = "0%";
    steps.forEach(step => {
        step.classList.remove("active");
    });

    // Make sure the progress line is visible initially
    progressLine.style.display = "block";
}

function updateProgressBar(status) {
    let steps = document.querySelectorAll(".step");
    let progressLine = document.querySelector(".progress-line");

    let isMobile = window.innerWidth <= 768; // Check if screen width is below 768px

    steps.forEach((step, index) => {
        setTimeout(() => {
            if (index < status) {
                step.classList.add("active");
                if (isMobile) {
                    // For mobile, animate the height of the progress line
                    let progressHeight = ((index / (steps.length - 1)) * 100);
                    progressLine.style.height = `${progressHeight}%`;
                } else {
                    // For desktop, animate the width of the progress line
                    let progressWidth = ((index / (steps.length - 1)) * 100);
                    progressLine.style.width = `${progressWidth}%`;
                }
            }
        }, index * 500); // Add delay for animation
    });
}

// Ensure the layout updates on window resize
window.addEventListener("resize", () => {
    let activeSteps = document.querySelectorAll(".step.active").length;
    updateProgressBar(activeSteps);
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
  
