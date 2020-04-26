window.onload = () => {
    const URL_BASE = "https://fcawebbook.herokuapp.com";
    let isNew = true;
    const frmSponsor = document.getElementById("frmSponsor");

    frmSponsor.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtSponsorId = document.getElementById("txtSponsorId").value;
        const txtName = document.getElementById("txtName").value;
        const txtLogo = document.getElementById("txtLogo").value;
        const txtCategory = document.getElementById("txtCategory").value;
        const txtLink = document.getElementById("txtLink").value;
        
        let response;
        if (isNew) {
            response = await fetch(`${URL_BASE}/sponsors`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtName}&logo=${txtLogo}&categoria=${txtCategory}&link=${txtLink}&active=1`
            });
            const newSponsorId = response.headers.get("Location");
            const newUrl = `${URL_BASE}/conferences/1/sponsors/${newSponsorId}`;
            const response2 = await fetch(newUrl, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            });
        } else {
            response = await fetch(`${URL_BASE}/sponsors/${txtSponsorId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&logo=${txtLogo}&categoria=${txtCategory}&link=${txtLink}&active=1`
            });
        }
        isNew = true;
        renderSponsors();
    })

    const renderSponsors = async () => {
        const tblSponsors = document.getElementById("tblSponsors");
        frmSponsor.reset();
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Sponsors</th></tr>
                <tr class='bg-info'>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Categoria</th>              
                    <th class="text-right">Ações</th>              
                </tr> 
            </thead><tbody>
        `;
        const response = await fetch(`${URL_BASE}/conferences/1/sponsors`);
        const sponsors = await response.json();
        let i = 1;
        for (const sponsor of sponsors) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${sponsor.nome}</td>
                    <td>${sponsor.categoria}</td>
                    <td class="text-right">
                        <a id='${sponsor.idSponsor}' type='button' class='edit'>
                            <i class="fas fa-edit"></i>
                        </a>
                        <a id='${sponsor.idSponsor}' type='button' class='remove'>
                            <i class="fas fa-trash-alt"></i>
                        </a>
                    </td>
                </tr>
            `;
            i++;
        }
        strHtml += '</tbody>';
        tblSponsors.innerHTML = strHtml;

        const btnEdit = document.getElementsByClassName("edit");
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false;
                for (const sponsor of sponsors) {
                    if (sponsor.idSponsor == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtSponsorId").value = sponsor.idSponsor;
                        document.getElementById("txtName").value = sponsor.nome;
                        document.getElementById("txtLogo").value = sponsor.logo;
                        document.getElementById("txtCategory").value = sponsor.categoria;
                        document.getElementById("txtLink").value = sponsor.link;
                    }
                }
            });
        }

        const btnDelete = document.getElementsByClassName("remove");
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", () => {
                Swal.fire({
                    title: 'Tem a certeza?',
                    text: "Não será possível reverter a remoção!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                }).then(async (result) => {
                    if (result.value) {
                        let sponsorId = btnDelete[i].getAttribute("id")
                        try {
                            const response = await fetch(`${URL_BASE}/conferences/1/sponsors/${sponsorId}`, {
                                method: "DELETE"
                            });
                            if (response.status == 204) {
                                swal('Removido!', 'O sponsor foi removido da Conferência.', 'success');
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            });
                        }
                        renderSponsors();
                    }
                });
            });
        }
    }
    renderSponsors();
}