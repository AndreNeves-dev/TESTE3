const API_URL = 'http://localhost:3000';

const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateSection = document.querySelector('#update-section');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
const updateProductPrice = document.querySelector('#update-price');
const searchBtn = document.querySelector('#search-btn');
const searchId = document.querySelector('#search-id');
const searchResult = document.querySelector('#search-result');
const cancelUpdate = document.querySelector('#cancel-update');

// Busca todos os produtos e renderiza a lista
async function fetchProducts() {
  const response = await fetch(`${API_URL}/products`);
  const products = await response.json();

  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.className = 'product-item';
    li.innerHTML = `
      <div class="product-info">
        <span class="product-name">${product.name}</span>
        <span class="product-description">${product.description || 'Sem descrição'}</span>
        <span class="product-price">R$ ${parseFloat(product.price).toFixed(2)}</span>
        <span class="product-id">ID: ${product.id}</span>
      </div>
      <div class="product-actions"></div>
    `;

    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Atualizar';
    updateButton.className = 'btn btn-warning';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductDescription.value = product.description || '';
      updateProductPrice.value = product.price;
      updateSection.style.display = 'block';
      updateSection.scrollIntoView({ behavior: 'smooth' });
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Deletar';
    deleteButton.className = 'btn btn-danger';
    deleteButton.addEventListener('click', async () => {
      if (confirm('Tem certeza que deseja deletar este produto?')) {
        await deleteProduct(product.id);
        await fetchProducts();
      }
    });

    li.querySelector('.product-actions').appendChild(updateButton);
    li.querySelector('.product-actions').appendChild(deleteButton);
    productList.appendChild(li);
  });
}

// Adicionar produto
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const description = addProductForm.elements['description'].value;
  const price = addProductForm.elements['price'].value;
  await addProduct(name, description, price);
  addProductForm.reset();
  await fetchProducts();
});

async function addProduct(name, description, price) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
  return response.json();
}

// Atualizar produto
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const description = updateProductDescription.value;
  const price = updateProductPrice.value;
  await updateProduct(id, name, description, price);
  updateProductForm.reset();
  updateSection.style.display = 'none';
  await fetchProducts();
});

async function updateProduct(id, name, description, price) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price })
  });
  return response.json();
}

// Cancelar atualização
cancelUpdate.addEventListener('click', () => {
  updateProductForm.reset();
  updateSection.style.display = 'none';
});

// Deletar produto
async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

// Consultar produto por ID
searchBtn.addEventListener('click', async () => {
  const id = searchId.value;
  if (!id) {
    searchResult.innerHTML = '<p class="error">Por favor, insira um ID válido.</p>';
    return;
  }
  const response = await fetch(`${API_URL}/products/${id}`);
  const data = await response.json();

  if (!data || data.length === 0) {
    searchResult.innerHTML = '<p class="error">Produto não encontrado.</p>';
    return;
  }

  const product = Array.isArray(data) ? data[0] : data;
  searchResult.innerHTML = `
    <div class="search-product-card">
      <p><strong>ID:</strong> ${product.id}</p>
      <p><strong>Nome:</strong> ${product.name}</p>
      <p><strong>Descrição:</strong> ${product.description || 'Sem descrição'}</p>
      <p><strong>Preço:</strong> R$ ${parseFloat(product.price).toFixed(2)}</p>
    </div>
  `;
});

fetchProducts();
