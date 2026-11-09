/* Magnolia's Garden — funcionalidades do template
   Edite o catálogo abaixo para personalizar os produtos da loja. */
const PRODUCTS = [
  { id: "vela-hibisco", name: "Vela aromática de hibisco", category: "velas", categoryLabel: "Velas aromáticas", price: 199, description: "Uma fragrância floral e levemente adocicada para criar uma atmosfera acolhedora, elegante e revigorante.", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85", badge: "Artesanal", featured: true },
  { id: "vela-rosas", name: "Vela aromática de rosas", category: "velas", categoryLabel: "Velas aromáticas", price: 19, description: "O clássico aroma de rosas em uma vela delicada. Um convite para deixar a casa ainda mais aconchegante.", image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=85", badge: "Queridinha", featured: true },
  { id: "vela-lavanda", name: "Vela aromática de lavanda", category: "velas", categoryLabel: "Velas aromáticas", price: 50, description: "Com fragrância suave e delicada, é perfeita para acompanhar momentos de descanso e autocuidado.", image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=900&q=85", badge: "", featured: true },
  { id: "cha-hibisco", name: "Chá de hibisco", category: "chas", categoryLabel: "Chás & infusões", price: 19, description: "Uma infusão de cor vibrante e sabor marcante para transformar sua pausa em um pequeno ritual.", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=85", badge: "Especial", featured: true },
  { id: "cha-maracuja", name: "Chá de maracujá", category: "chas", categoryLabel: "Chás & infusões", price: 19, description: "Uma opção delicada para acompanhar seus momentos de tranquilidade.", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85", badge: "", featured: false },
  { id: "cha-canela", name: "Chá de canela", category: "chas", categoryLabel: "Chás & infusões", price: 5, description: "Aroma envolvente e sabor aconchegante para uma pausa cheia de conforto.", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=85", badge: "", featured: false }
];

const money = value => Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let cart = readCart();
let toastTimer;

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("magnolia-cart") || "[]");
    return Array.isArray(saved) ? saved.filter(item => item && PRODUCTS.some(product => product.id === item.id) && Number(item.quantity) > 0) : [];
  } catch { return []; }
}
function saveCart() { localStorage.setItem("magnolia-cart", JSON.stringify(cart)); }
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function addToCart(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart(); renderCart(); showToast(`${product.name} foi adicionado ao carrinho.`);
}
function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  saveCart(); renderCart();
}
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart(); renderCart(); showToast("Produto removido do carrinho.");
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = $("#cart-count");
  if (countElement) countElement.textContent = count;
  const itemsElement = $("#cart-items");
  const emptyElement = $("#cart-empty");
  const footer = $("#drawer-footer");
  if (!itemsElement) return;
  const total = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(product => product.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  itemsElement.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(product => product.id === item.id);
    if (!product) return "";
    return `<article class="cart-line">
      <img src="${product.image}" alt="">
      <div class="cart-line-info"><a href="produto.html?id=${product.id}">${product.name}</a><strong>${money(product.price)}</strong>
        <div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Diminuir quantidade">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Aumentar quantidade">+</button></div>
      </div><button class="remove-item" data-remove="${product.id}" aria-label="Remover ${product.name}"><i class="bx bx-trash"></i></button>
    </article>`;
  }).join("");
  if (emptyElement) emptyElement.hidden = cart.length > 0;
  if (footer) footer.hidden = cart.length === 0;
  const totalElement = $("#cart-total");
  if (totalElement) totalElement.textContent = money(total);
}
function openCart() {
  $("#cart-drawer")?.classList.add("is-open");
  $("#cart-backdrop")?.classList.add("is-visible");
  $("#cart-drawer")?.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}
function closeCart() {
  $("#cart-drawer")?.classList.remove("is-open");
  $("#cart-backdrop")?.classList.remove("is-visible");
  $("#cart-drawer")?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}
function productCard(product) {
  return `<article class="product-card">
    <a class="product-image-wrap" href="produto.html?id=${product.id}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      <span class="quick-view">Ver detalhes <i class="bx bx-right-arrow-alt"></i></span>
    </a>
    <div class="product-info"><span class="product-category">${product.categoryLabel}</span><h3><a href="produto.html?id=${product.id}">${product.name}</a></h3><p>${product.description}</p><div class="product-card-bottom"><strong>${money(product.price)}</strong><button class="add-button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho"><i class="bx bx-plus"></i><span>Adicionar</span></button></div></div>
  </article>`;
}
function renderProducts() {
  const grid = $("#products-grid");
  if (!grid) return;
  const pageCategory = document.body.dataset.category;
  const search = ($("#catalog-search")?.value || new URLSearchParams(location.search).get("q") || "").trim().toLocaleLowerCase("pt-BR");
  const selectedCategories = $$('input[name="category"]:checked').map(input => input.value);
  const selectedPrices = $$('input[name="price"]:checked').map(input => input.value);
  let results = PRODUCTS.filter(product => {
    const matchesCategory = pageCategory ? product.category === pageCategory : (!selectedCategories.length || selectedCategories.includes(product.category));
    const matchesPrice = !selectedPrices.length || selectedPrices.some(range => {
      const [min, max] = range.split("-").map(Number);
      return product.price >= min && product.price <= max;
    });
    const matchesSearch = !search || `${product.name} ${product.description} ${product.categoryLabel}`.toLocaleLowerCase("pt-BR").includes(search);
    return matchesCategory && matchesPrice && matchesSearch;
  });
  const sort = $("#sort-select")?.value || "featured";
  if (sort === "price-asc") results.sort((a,b) => a.price-b.price);
  if (sort === "price-desc") results.sort((a,b) => b.price-a.price);
  if (sort === "name") results.sort((a,b) => a.name.localeCompare(b.name, "pt-BR"));
  if (sort === "newest") results.reverse();
  if (sort === "featured") results.sort((a,b) => Number(b.featured)-Number(a.featured));
  grid.innerHTML = results.map(productCard).join("");
  const count = $("#results-count");
  if (count) count.textContent = `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
  const empty = $("#empty-state");
  if (empty) empty.hidden = results.length > 0;
  grid.hidden = results.length === 0;
}
function setupCatalog() {
  if (!$("#products-grid")) return;
  const category = document.body.dataset.category;
  if (category) {
    const info = {
      velas: ["Velas aromáticas", "A luz suave de uma vela, o perfume que transforma o ambiente e um instante só seu."],
      chas: ["Chás & infusões", "Pequenas pausas, sabores acolhedores e momentos para respirar."],
      decoracao: ["Decoração", "Detalhes que dão personalidade e aconchego aos seus espaços."],
      vintage: ["Achados vintage", "Peças com charme, memória e histórias para continuar contando."]
    }[category];
    if (info) {
      document.title = `${info[0]} | Magnolia's Garden`;
      if ($("#category-title")) $("#category-title").textContent = info[0];
      if ($("#category-description")) $("#category-description").textContent = info[1];
      if ($("#category-heading")) $("#category-heading").textContent = `Nossa seleção de ${info[0].toLocaleLowerCase("pt-BR")}`;
    }
  }
  $("#catalog-search")?.addEventListener("input", renderProducts);
  $("#sort-select")?.addEventListener("change", renderProducts);
  $$('input[name="category"], input[name="price"]').forEach(input => input.addEventListener("change", renderProducts));
  $("#clear-filters")?.addEventListener("click", clearFilters);
  $("#reset-empty")?.addEventListener("click", clearFilters);
  const query = new URLSearchParams(location.search).get("q");
  if (query && $("#catalog-search")) $("#catalog-search").value = query;
  renderProducts();
}
function clearFilters() {
  $$('input[type="checkbox"]').forEach(input => input.checked = false);
  if ($("#catalog-search")) $("#catalog-search").value = "";
  if ($("#sort-select")) $("#sort-select").value = "featured";
  renderProducts();
}
function setupProductPage() {
  const target = $("#product-detail");
  if (!target) return;
  const id = new URLSearchParams(location.search).get("id");
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) {
    target.innerHTML = `<div class="not-found"><span class="eyebrow">OPS, NÃO ENCONTRAMOS</span><h1>Esse encanto não está por aqui.</h1><a class="button button-primary" href="index.html">Voltar para a loja</a></div>`;
    return;
  }
  document.title = `${product.name} | Magnolia's Garden`;
  target.innerHTML = `<a class="back-link" href="${product.category}.html"><i class="bx bx-left-arrow-alt"></i> Voltar para ${product.categoryLabel.toLocaleLowerCase("pt-BR")}</a>
    <div class="product-detail-grid"><div class="detail-image"><img src="${product.image}" alt="${product.name}"></div><div class="detail-copy"><span class="eyebrow">${product.categoryLabel}</span><h1>${product.name}</h1><strong class="detail-price">${money(product.price)}</strong><p>${product.description}</p><p class="detail-note"><i class="bx bx-leaf"></i> Um pequeno detalhe para deixar seus momentos mais especiais.</p><button class="button button-primary" data-add="${product.id}">Adicionar ao carrinho <i class="bx bx-shopping-bag"></i></button><div class="detail-benefits"><span><i class="bx bx-package"></i> Informações de envio sob consulta</span><span><i class="bx bx-heart"></i> Escolhido com carinho</span></div></div></div>`;
}
function setupNavigation() {
  $("#mobile-toggle")?.addEventListener("click", () => {
    const nav = $("#nav-menu");
    const isOpen = nav?.classList.toggle("is-open");
    $("#mobile-toggle")?.setAttribute("aria-expanded", String(Boolean(isOpen)));
    $("#mobile-toggle i")?.classList.toggle("bx-menu", !isOpen);
    $("#mobile-toggle i")?.classList.toggle("bx-x", Boolean(isOpen));
  });
  $("#nav-menu")?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => $("#nav-menu").classList.remove("is-open")));
  $("#search-toggle")?.addEventListener("click", () => {
    const bar = $("#search-form");
    bar?.classList.toggle("is-open");
    if (bar?.classList.contains("is-open")) $("#search-input")?.focus();
  });
  $("#search-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const query = $("#search-input")?.value.trim();
    if (query) location.href = `index.html?${new URLSearchParams({q: query}).toString()}#colecao`;
  });
  $$("[data-open-cart]").forEach(button => button.addEventListener("click", openCart));
  $("#close-cart")?.addEventListener("click", closeCart);
  $("#cart-backdrop")?.addEventListener("click", closeCart);
  $("#continue-shopping")?.addEventListener("click", closeCart);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
}
function setupNewsletter() {
  $("#newsletter-form")?.addEventListener("submit", event => {
    event.preventDefault();
    const message = $("#newsletter-message");
    if (message) message.textContent = "Cadastro demonstrativo realizado! Conecte um serviço de e-mail para receber inscrições.";
    $("#newsletter-email").value = "";
  });
}
document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) addToCart(add.dataset.add);
  const quantity = event.target.closest("[data-quantity]");
  if (quantity) changeQuantity(quantity.dataset.quantity, Number(quantity.dataset.change));
  const remove = event.target.closest("[data-remove]");
  if (remove) removeFromCart(remove.dataset.remove);
});
$("#checkout-button")?.addEventListener("click", () => showToast("Checkout demonstrativo. Integre um meio de pagamento para receber pedidos."));
$("#current-year") && ($("#current-year").textContent = new Date().getFullYear());
setupNavigation();
setupCatalog();
setupProductPage();
setupNewsletter();
renderCart();