const productID = localStorage.getItem("productID");
document.addEventListener("DOMContentLoaded", function () {
    
 
    if (productID) {
        fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
            .then(response => response.json())
            .then(data => {
                const product = data;  // Guardar el producto en una variable
                console.log(product); // Verificar los productos
                showData(product);  // Mostrar el producto
                fetchRatings();  // Cargar y mostrar las calificaciones
            })
            .catch(error => console.error('Error al cargar el producto:', error));
    } else {
        console.error('No se ha encontrado un productID en el almacenamiento local.');
    }
});

function showData(product) {
    const container = document.getElementById("container");
    container.innerHTML = ''; // Limpiar el contenedor antes de mostrar los nuevos productos
   
    if (product) {
        const formattedCost = formatNumber(product.cost);  // Formatear el costo

        const productInfoHTML = `
        <div class="container mt-4">
            <!-- Nombre de la categoría -->
            <div class="row">
            <div class="col-12">
                <h3><strong>${product.category}</strong></h3>
            </div>
            </div>

            <div class="row">
            <!-- Columna de imágenes -->
            <div class="col-md-8 d-flex flex-column justify-content-between">
                <!-- Imagen grande del producto -->
                <div class="row mb-4">
                <div class="col-12">
                    <img src="${product.images[0]}" class="img-fluid w-100 rounded" alt="${product.name}">
                </div>
                </div>
                <!-- Mosaico de imágenes adicionales -->
                <div class="row">
                <div class="col-4">
                    <img src="${product.images[1]}" class="rounded img-fluid" alt="${product.name}">
                </div>
                <div class="col-4">
                    <img src="${product.images[2]}" class="rounded img-fluid" alt="${product.name}">
                </div>
                <div class="col-4">
                    <img src="${product.images[3]}" class="rounded img-fluid" alt="${product.name}">
                </div>
                </div>
            </div>
            
            <!-- Columna de información del producto -->
            <div class="col-md-4 d-flex flex-column justify-content-between">
                <div class="row mb-4">
                <div class="col-12">
                    <h2><strong>${product.name}</strong></h2>
                    <p>${product.description}</p>
                    <h4>Precio: ${product.currency} ${formattedCost}</h4>
                    <p>Cantidad de vendidos: ${product.soldCount}</p>
                </div>  
                </div>
                
                <!-- Productos relacionados -->
                <div class="row">
                <h4 class="text-center">Productos relacionados</h4>
                ${product.relatedProducts.map(related => `
                    <div class="col-6 text-center cursor-pointer" onclick="setProductID(${related.id})">
                    <img src="${related.image}" class="img-fluid w-75" alt="${related.name}">
                    <p>${related.name}</p>
                    </div>
                `).join('')}
                </div>
            </div>
            </div>
        </div>
        <!-- Sección de calificaciones -->
                    <div class="container mt-4" id="ratings-container">
                    <h4>Calificaciones de los usuarios</h4>
                    <div id="ratings"></div>
                </div> 
        <!-- Formulario para realizar una calificación -->
        <div class="container mt-4">
            <h4>Deja tu calificación</h4>
            <form id="rating-form">
                <div class="mb-3">
                    <label for="rating-text" class="form-label">Comentario</label>
                    <textarea id="rating-text" class="form-control" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label for="rating-score" class="form-label">Puntuación</label>
                    <select id="rating-score" class="form-select">
                        <option value="1">1 estrella</option>
                        <option value="2">2 estrellas</option>
                        <option value="3">3 estrellas</option>
                        <option value="4">4 estrellas</option>
                        <option value="5">5 estrellas</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
        </div>
        `;

        container.innerHTML = productInfoHTML;
    }
}

function fetchRatings() {
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
        .then(response => response.json())
        .then(data => {
            const ratingsContainer = document.getElementById('ratings');
            data.forEach(comentario => {
                const divComentario = document.createElement('div');
                divComentario.classList.add('ratings-row');

                // Crear el nombre del usuario
                const userElement = document.createElement('h5');
                userElement.textContent = comentario.user;
                divComentario.appendChild(userElement);

                // Crear las estrellas usando Font Awesome
                const calificacion = Math.round(comentario.score);
                for (let i = 0; i < 5; i++) {
                    const estrella = document.createElement('span');
                    estrella.classList.add('fa', 'fa-star');
                    if (i < calificacion) {
                        estrella.classList.add('checked');
                    }
                    divComentario.appendChild(estrella);
                }

                // Crear el comentario
                const comentarioElement = document.createElement('p');
                comentarioElement.textContent = comentario.description;
                divComentario.appendChild(comentarioElement);
                

                ratingsContainer.appendChild(divComentario);
            });
        })
        .catch(error => console.error('Error al cargar las calificaciones:', error));
}

function formatNumber(num) {
    return num.toLocaleString('es-ES');
}
