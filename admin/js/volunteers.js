window.onload = () => {
    const URL_BASE = "https://fcawebbook.herokuapp.com";
    let isNew = true;
    const frmVolunteer = document.getElementById("frmVolunteer");
    let volunteers = [
        {
            idVolunteer: 1,
            name: "John Doe",
            email: "john@email.com",
            info: "Some random information"
        },
        {
            idVolunteer: 2,
            name: "Another Guy",
            email: "another@email.com",
            info: "Some other random information"
        },
    ];


    frmVolunteer.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtName = document.getElementById("txtName").value;
        const txtEmail = document.getElementById("txtEmail").value;
        const txtInfo = document.getElementById("txtInfo").value;
        const txtVolunteerId = document.getElementById("txtVolunteerId").value;

        let response;
        if (isNew) {
            // Just to have the code here in the future...
            // responseInsert = await fetch(`${URL_BASE}/volunteers`, {
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     method: "POST",
            //     body: `nome=${txtName}&email=${txtEmail}&txtInfo=${txtInfo}&active=1`
            // });
            // const newVolunteerId = responseInsert.headers.get("Location");
            // const newUrl = `${URL_BASE}/conferences/1/volunteers/${newVolunteerId}`;
            // const responseAssociate = await fetch(newUrl, {
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     method: "POST"
            // });

            volunteers.push({
                idVolunteer: volunteers.length + 1,
                name: txtName,
                email: txtEmail,
                info: txtInfo
            });
        } else {
            response = await fetch(`${URL_BASE}/volunteers/${txtVolunteerId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&email=${txtEmail}&txtInfo=${txtInfo}&active=1`
            });
        }
        isNew = true;
        frmVolunteer.reset();
        renderVolunteers();
    });

    const renderVolunteers = async () => {
        const tblSpeakers = document.getElementById("tblVolunteers");
        let strHtml = `
            <thead>
                <tr>
                    <th class='w-100 text-center bg-warning' colspan='4'>
                        Lista de Voluntários
                    </th>
                </tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome</th>
                    <th class='w-38'>Email</th>
                    <th class='w-10'>Ações</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        // The endpoint do not exists, yet. So we just simulate some things here...
        // const response = await fetch(`${URL_BASE}/conferences/1/volunteers`);
        // const volunteers = await response.json();
        let i = 1;
        for (const volunteer of volunteers) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${volunteer.name}</td>
                    <td>${volunteer.email}</td>
                    <td>
                        <a id='${volunteer.idVolunteer}' type='button' class='edit'>
                            <i class="fas fa-edit"></i>
                        </a>
                        <a id='${volunteer.idVolunteer}' type='button' class='remove'>
                            <i class="fas fa-trash-alt"></i>
                        </a>
                    </td>
                </tr>
            
            `
            i++;
        }

        strHtml += `</tbody>`
        tblSpeakers.innerHTML = strHtml;

        const iconsDelete = document.getElementsByClassName('remove');
        for (let i = 0; i < iconsDelete.length; i++) {
            iconsDelete[i].addEventListener("click", () => {
                swal.fire({
                    title: "Tem a certeza?",
                    text: "Não será possível reverter a remoção!",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                }).then(async (result) => {
                    if (result.value) {
                        let volunteerId = iconsDelete[i].getAttribute("id");
                        try {
                            const response = await fetch(`${URL_BASE}/conferences/1/volunteers/${volunteerId}`, {
                                method: 'DELETE'
                            });
                            const isRemoved = await response.json();
                            swal.fire(
                                'Remoção de Voluntário',
                                isRemoved.message.pt,
                                (isRemoved.success) ? 'success' : 'error'
                            );
                            isNew = true;
                            frmVolunteer.reset();
                            renderVolunteers();
                        } catch (err) {
                            swal.fire({
                                type: 'error',
                                title: 'Remoção de Voluntário',
                                text: err
                            })
                        }
                    }
                });
            });
        }
        
        const btnEdit = document.getElementsByClassName("edit");
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false;
                for (const volunteer of volunteers) {
                    if (volunteer.idVolunteer == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtVolunteerId").value = volunteer.idVolunteer;
                        document.getElementById("txtName").value = volunteer.name;
                        document.getElementById("txtEmail").value = volunteer.email;
                        document.getElementById("txtInfo").value = volunteer.info;
                    }
                }
            });
        };
    };

    renderVolunteers();
}