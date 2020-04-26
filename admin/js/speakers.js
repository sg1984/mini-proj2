window.onload = () => {
    const URL_BASE = "https://fcawebbook.herokuapp.com";
    let isNew = true;
    const frmSpeaker = document.getElementById("frmSpeaker");

    frmSpeaker.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtName = document.getElementById("txtName").value;
        const txtJob = document.getElementById("txtJob").value;
        const txtPhoto = document.getElementById("txtPhoto").value;
        const txtFacebook = document.getElementById("txtFacebook").value;
        const txtTwitter = document.getElementById("txtTwitter").value;
        const txtLinkedin = document.getElementById("txtLinkedin").value;
        const txtBio = document.getElementById("txtBio").value;
        const txtSpeakerId = document.getElementById("txtSpeakerId").value;

        let response;
        if (isNew) {
            responseInsert = await fetch(`${URL_BASE}/speakers`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&facebook=${txtFacebook}&twitter=${txtTwitter}&linkedin=${txtLinkedin}&bio=${txtBio}&active=1`
            });
            const newSpeakerId = responseInsert.headers.get("Location");
            const newSpeaker = await responseInsert.json();
            const newUrl = `${URL_BASE}/conferences/1/speakers/${newSpeakerId}`;
            const responseAssociate = await fetch(newUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            });
        } else {
            response = await fetch(`${URL_BASE}/speakers/${txtSpeakerId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&cargo=${txtJob}&foto=${txtPhoto}&facebook=${txtFacebook}&twitter=${txtTwitter}&linkedin=${txtLinkedin}&bio=${txtBio}&active=1`
            });
        }
        isNew = true;
        frmSpeaker.reset();
        renderSpeakers();
    });

    const renderSpeakers = async () => {
        const tblSpeakers = document.getElementById("tblSpeakers");
        let strHtml = `
            <thead>
                <tr>
                    <th class='w-100 text-center bg-warning' colspan='4'>
                        Lista de Oradores
                    </th>
                </tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome</th>
                    <th class='w-38'>Cargo</th>
                    <th class='w-10'>Ações</th>
                </tr>
            </thead>
            <tbody>
        `;
        const response = await fetch(`${URL_BASE}/conferences/1/speakers`);
        const speakers = await response.json();
        let i = 1;

        for (const speaker of speakers) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${speaker.nome}</td>
                    <td>${speaker.cargo}</td>
                    <td>
                        <a id='${speaker.idSpeaker}' type='button' class='edit'>
                            <i class="fas fa-edit"></i>
                        </a>
                        <a id='${speaker.idSpeaker}' type='button' class='remove'>
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
                        let speakerId = iconsDelete[i].getAttribute("id");
                        try {
                            const response = await fetch(`${URL_BASE}/conferences/1/speakers/${speakerId}`, {
                                method: 'DELETE'
                            });
                            const isRemoved = await response.json();
                            swal.fire(
                                'Remoção de Orador',
                                isRemoved.message.pt,
                                (isRemoved.success) ? 'success' : 'error'
                            );
                            isNew = true;
                            frmSpeaker.reset();
                            renderSpeakers();
                        } catch (err) {
                            swal.fire({
                                type: 'error',
                                title: 'Remoção de Orador',
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
                for (const speaker of speakers) {
                    if (speaker.idSpeaker == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtSpeakerId").value = speaker.idSpeaker;
                        document.getElementById("txtName").value = speaker.nome;
                        document.getElementById("txtJob").value = speaker.cargo;
                        document.getElementById("txtPhoto").value = speaker.foto;
                        document.getElementById("txtFacebook").value = speaker.facebook;
                        document.getElementById("txtTwitter").value = speaker.twitter;
                        document.getElementById("txtLinkedin").value = speaker.linkedin;
                        document.getElementById("txtBio").value = speaker.bio;
                    }
                }
            });
        };
    };

    renderSpeakers();
}