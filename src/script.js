document.addEventListener("DOMContentLoaded", () => {
    fetch('https://jsonplaceholder.typicode.com/photos?_limit=20')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("albumTableBody");
            const recordIdsDiv = document.getElementById("recordIds");
            let recordIdsText = "<h2>ID de los registros:</h2><p>";

            data.forEach(photo => {
                addRowToTable(photo);
                recordIdsText += `${photo.id}, `;
            });

            recordIdsText = recordIdsText.slice(0, -2) + "</p>";
            recordIdsDiv.innerHTML = recordIdsText;
        })
        .catch(error => console.error("Error al obtener los datos:", error));
});

function addRowToTable(photo) {
    const tableBody = document.getElementById("albumTableBody");
    const row = document.createElement("tr");
    row.dataset.title = photo.title; // Store title for easy checking later
    row.dataset.id = photo.id;      // Store ID for easy deletion later

    row.innerHTML = `
        <td>${photo.albumId}</td>
        <td>${photo.title}</td>
        <td><img src="${photo.url}" alt="Imagen del álbum" width="100"></td>  <td><button class="delete-btn">Eliminar</button></td> `;

    // Add event listener to the delete button *after* it's added to the DOM
    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => deleteEntry(photo.id, row));

    tableBody.appendChild(row);
}

function deleteEntry(id, row) {
    fetch(`https://jsonplaceholder.typicode.com/photos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log(`Registro ${id} eliminado correctamente.`);
            row.remove(); // Directly remove the row

            // Actualizar la lista de IDs
            actualizarListaIds();

        } else {
            console.error(`Error al eliminar el registro ${id}`);
        }
    })
    .catch(error => console.error("Error en la petición de eliminación:", error));
}

document.getElementById("addEntry").addEventListener("click", () => {
    const tableBody = document.getElementById("albumTableBody");
    const newTitle = "José Antonio Serrano García";

    // More efficient check for existing entry using querySelector
    if (tableBody.querySelector(`tr[data-title="${newTitle}"]`)) {
        alert("El registro ya existe en la tabla.");
        return;
    }

    const newEntry = {
        albumId: 1,
        thumbnailUrl: null, // Removed unnecessary id and thumbnailUrl
        title: newTitle,
        url: "https://cursos.com/wp-content/uploads/2021/04/academia-tokio-school.jpg" // Removed unnecessary id and thumbnailUrl
    };

    fetch('https://jsonplaceholder.typicode.com/photos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEntry)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Nueva entrada añadida:", data);
        addRowToTable(data); // Add the new row with the data *including the ID from the server

        // Actualizar la lista de IDs
        actualizarListaIds();
    })
    .catch(error => console.error("Error al añadir la nueva entrada:", error));
});


function actualizarListaIds() {
    const tableBody = document.getElementById("albumTableBody");
    const recordIdsDiv = document.getElementById("recordIds");
    let recordIdsText = "<h2>ID de los registros:</h2><p>";

    // Obtener los IDs de las filas actuales
    const rows = tableBody.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const id = row.dataset.id;
        recordIdsText += `${id}, `;
    }

    recordIdsText = recordIdsText.slice(0, -2) + "</p>";
    recordIdsDiv.innerHTML = recordIdsText;
}