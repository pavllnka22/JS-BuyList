
let products = [];
const savedProducts = localStorage.getItem("products");
if (savedProducts) {
    products = JSON.parse(savedProducts);
}else {
     products = [
  { name: "Печиво", count: 2, bought: false },
  { name: "Сир", count: 2, bought: true },
  { name: "Помідори", count: 5, bought: false }
];
}

function saveProducts(){
    localStorage.setItem("products", JSON.stringify(products));
}
 
const addButton = document.querySelector(".add-btn");
const addInput = document.querySelector(".add-input");
const plusButton = document.querySelector(".plus tooltip");
const minusButton = document.querySelector(".minus tooltip");
const deleteButton = document.querySelector(".delete-btn tooltip");
const boughtButton = document.querySelector(".bought-btn tooltip");

const div = document.createElement("div");
div.classList.add("plus", "minus", "delete-btn", "bought-btn", "tooltip");
const tooltipText = document.createElement("span");

const container = document.querySelector(".products-container");

function renderProducts() {
  container.innerHTML = ""; 

  for(let product of products){

    const productItem = document.createElement("div");
    productItem.className = "product-item";
     productItem.dataset.index = products.indexOf(product); 

    const productName = document.createElement("span");
    productName.className = product.bought ? "item-name-bought" : "item-name";
    productName.textContent = product.name;

    const productControls = document.createElement("div");
    productControls.className = "product-controls";

    if(!product.bought){

        const plusButton = document.createElement("button");
        plusButton.className = "plus";
        plusButton.setAttribute("data-tooltip", "Збільшити кількість товар");
        plusButton.classList.add("tooltip");
        plusButton.textContent = "+";

        const itemCount = document.createElement("span");
        itemCount.className = "count";
        itemCount.textContent = product.count;

        const minusButton = document.createElement("button");
        minusButton.className = "minus";
        minusButton.setAttribute("data-tooltip", "Зменшити кількість товару");
        minusButton.classList.add("tooltip");
        minusButton.textContent = "-";
        if (product.count <= 1) {
            minusButton.disabled = true; 
        }
        productControls.appendChild(minusButton);
        productControls.appendChild(itemCount);
        productControls.appendChild(plusButton);
    } else{
        const itemCount = document.createElement("span");
        itemCount.className = "count";
        itemCount.textContent = product.count;
        productControls.appendChild(itemCount);

    }
    const actions = document.createElement("div");
    actions.className = "product-actions";

    const boughtButton = document.createElement("button");
    boughtButton.className = "bought-btn";
    boughtButton.setAttribute("data-tooltip", "Змінити статус товару");
    boughtButton.classList.add("tooltip");
    boughtButton.textContent = product.bought ? "Не куплено" : "Куплено";
    actions.appendChild(boughtButton);

    if(!product.bought){
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "✖";
        deleteButton.setAttribute("data-tooltip", "Видалити товар");
        deleteButton.classList.add("tooltip");
        actions.appendChild(deleteButton);
    }
    productItem.appendChild(productName);
    productItem.appendChild(productControls);
    productItem.appendChild(actions);
    container.appendChild(productItem);

   productName.addEventListener("click", () => {
    if(product.bought) return;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = product.name;
    productItem.replaceChild(input, productName);
    input.focus();
    input.addEventListener("blur", () => {
   const newName = input.value.trim();
    const existingProduct = products.find(product => product.name.toLowerCase() === newName.toLowerCase());
    if(!existingProduct && newName!=""){
        const newName = input.value.trim();
        product.name = newName;
        renderProducts();
        updateSidebar();
    } else if (existingProduct) {
        showWarning(`Товар "${newName}" вже існує!`);
    } else {
        showWarning("Будь ласка, введіть назву товару!");
    }
    });
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            input.blur();
        }
    });
   });
  }
}
  saveProducts();
  renderProducts();
  updateSidebar();


   function showWarning(message) {
        window.alert(message);
    }
function confirmDelete(itemName){
    return window.confirm("Ви впевнені, що хочете видалити товар " + itemName + "?");
}
  addButton.addEventListener("click", () => {
    let itemName = addInput.value.trim();
    const existingProduct = products.find(product => product.name.toLowerCase() === itemName.toLowerCase());
    if(itemName && !existingProduct){
        products.push({name: itemName, count: 1, bought: false});
        addInput.value= "";
        addInput.focus();
        saveProducts();
        renderProducts();
        updateSidebar();
    }
    else if(existingProduct){
        showWarning(`Товар "${itemName}" вже існує!`);
    } else {
        showWarning("Будь ласка, введіть назву товару!");
    }
});
/*document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        addButton.click(); 
    }
});
*/
 container.addEventListener("click", (event) =>{
   const productItem = event.target.closest(".product-item");
   if (!productItem) return
   const countSpan = productItem.querySelector(".count");
   const minusButton = productItem.querySelector(".minus")
   const index = parseInt(productItem.dataset.index);
   const product = products[index];
   let count = parseInt(countSpan.textContent);

    if (event.target.classList.contains("plus")){
        let newCount = count + 1;
        countSpan.textContent = newCount;
        minusButton.disabled = false;
        minusButton.classList.remove("disabled");
        product.count=newCount;
        saveProducts();
        
    } else if (event.target.classList.contains("minus")) {
         if (count > 1) {
        count--;
        countSpan.textContent = count;
        
        if (count === 1) {
            minusButton.disabled = true;
            minusButton.classList.add("disabled");
        }
         product.count = count;
    }
    } else if (event.target.classList.contains("delete-btn")) {
        const productItem = event.target.closest(".product-item");
        const itemName = productItem.querySelector(".item-name").textContent;
        if(confirmDelete(itemName)){
            products.splice(products.indexOf(products.find(product => product.name === itemName)), 1);
            renderProducts();
            saveProducts();
            updateSidebar();
        }
    } else if (event.target.classList.contains("bought-btn")) {
        const itemName = productItem.querySelector(".item-name, .item-name-bought").textContent;
        const product = products.find(product => product.name === itemName);
       
        if (product) {
            product.bought = !product.bought;
        }
        renderProducts();
        saveProducts();
    }
    updateSidebar();

 })
 function updateSidebar() {
  const remainingDiv = document.getElementById("remaining");
  const alreadyBoughtDiv = document.getElementById("already-bought");
  const remainingCount = document.getElementById("remaining-count");
  const boughtCount = document.getElementById("bought-count");

  remainingDiv.innerHTML = "";
  alreadyBoughtDiv.innerHTML = "";

  let remaining = 0;
  let bought = 0;

  for (let product of products) {
    const productInfo = document.createElement("div");
    productInfo.className = product.bought ? "already-bought" : "remaining";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = product.name;

     const countSpan = document.createElement("span");
      countSpan.className = "amount-remain";
      countSpan.textContent = product.count;

      productInfo.appendChild(nameSpan);
      productInfo.appendChild(countSpan);

    if (product.bought) {
      alreadyBoughtDiv.appendChild(productInfo);
      bought++;
    } else {
      remainingDiv.appendChild(productInfo);
      remaining++;
    }
  }

  remainingCount.textContent = remaining;
  boughtCount.textContent = bought;
}
