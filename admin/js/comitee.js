window.onload = () => {
    const URL_BASE = "https://fcawebbook.herokuapp.com";
    let isNew = true;
    const frmComitee = document.getElementById("frmComitee");
    let members = [
        {
            idMember: 1,
            name: "John Doe",
            cargo: "Important",
            bio: "Some random information"
        },
        {
            idMember: 2,
            name: "Another Guy",
            cargo: "More Important",
            bio: "Some other random information"
        },
    ];    

    frmComitee.addEventListener("submit", async (event) => {
        event.preventDefault();
        const txtName = document.getElementById("txtName").value;
        const txtJob = document.getElementById("txtJob").value;
        const txtBio = document.getElementById("txtBio").value;
        const newMemberId = document.getElementById("txtMemberId").value;

        let response;
        if (isNew) {
            // Just to have the code here in the future...
            // responseInsert = await fetch(`${URL_BASE}/comitee`, {
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     method: "POST",
            //     body: `nome=${txtName}&cargo=${txtJob}&bio=${txtBio}&active=1`
            // });
            // const newMemberId = responseInsert.headers.get("Location");
            // const newUrl = `${URL_BASE}/conferences/1/comitee/${newMemberId}`;
            // const responseAssociate = await fetch(newUrl, {
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     method: "POST"
            // });

            members.push({
                idMember: members.length + 1,
                name: txtName,
                cargo: txtJob,
                bio: txtBio
            });
        } else {
            response = await fetch(`${URL_BASE}/comitee/${newMemberId}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtName}&cargo=${txtJob}&bio=${txtBio}&active=1`
            });
        }
        isNew = true;
        frmComitee.reset();
        renderComitee();
    });

    const renderComitee = async () => {
        const tblComitee = document.getElementById("tblComitee");
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

        // The endpoint do not exists, yet. So we just simulate some things here...
        // const response = await fetch(`${URL_BASE}/conferences/1/comitee`);
        // const members = await response.json();
        let i = 1;

        for (const member of members) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${member.name}</td>
                    <td>${member.cargo}</td>
                    <td>
                        <a id='${member.idMember}' type='button' class='edit'>
                            <i class="fas fa-edit"></i>
                        </a>
                        <a id='${member.idMember}' type='button' class='remove'>
                            <i class="fas fa-trash-alt"></i>
                        </a>
                    </td>
                </tr>
            
            `
            i++;
        }

        strHtml += `</tbody>`
        tblComitee.innerHTML = strHtml;

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
                        let memberId = iconsDelete[i].getAttribute("id");
                        try {
                            const response = await fetch(`${URL_BASE}/conferences/1/comitee/${memberId}`, {
                                method: 'DELETE'
                            });
                            const isRemoved = await response.json();
                            swal.fire(
                                'Remoção de Membro do Comitee',
                                isRemoved.message.pt,
                                (isRemoved.success) ? 'success' : 'error'
                            );
                            isNew = true;
                            frmSpeaker.reset();
                            renderComitee();
                        } catch (err) {
                            swal.fire({
                                type: 'error',
                                title: 'Remoção de Membro do Comitee',
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
                for (const member of members) {
                    if (member.idMember == btnEdit[i].getAttribute("id")) {
                        document.getElementById("txtMemberId").value = member.idMember;
                        document.getElementById("txtName").value = member.name;
                        document.getElementById("txtJob").value = member.cargo;
                        document.getElementById("txtBio").value = member.bio;
                    }
                }
            });
        };
    };

    renderComitee();
}