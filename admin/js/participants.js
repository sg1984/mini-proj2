window.onload = () => {
    const URL_BASE = "https://fcawebbook.herokuapp.com";

    const renderParticipants = async () => {
        const tblParticipants = document.getElementById("tblParticipants");
        let strHtml = `
            <thead>
                <tr>
                    <th class='w-100 text-center bg-warning' colspan='4'>
                        Lista de Participantes
                    </th>
                </tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-50'>Nome</th>
                    <th class='w-38'>E-mail</th>
                    <th class='w-10'>Ações</th>
                </tr>
            </thead>
            <tbody>
        `;
        const response = await fetch(`${URL_BASE}/conferences/1/participants`);
        const participants = await response.json();
        let i = 1;

        for (const participant of participants) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${participant.nomeParticipante}</td>
                    <td>${participant.idParticipant}</td>
                    <td>
                        <a id='${participant.idParticipant}' type='button' class='remove'>
                            <i class="fas fa-trash-alt"></i>
                        </a>
                    </td>
                </tr>
            
            `
            i++;
        }

        strHtml += `</tbody>`
        tblParticipants.innerHTML = strHtml;

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
                        let participantId = iconsDelete[i].getAttribute("id");
                        try {
                            const response = await fetch(`${URL_BASE}/conferences/1/participants/${participantId}`, {
                                method: 'DELETE'
                            });
                            const isRemoved = await response.json();
                            swal.fire(
                                'Remoção de Instrição',
                                isRemoved.message.pt,
                                (isRemoved.success) ? 'success' : 'error'
                            );
                            renderParticipants();
                        } catch (err) {
                            swal.fire({
                                type: 'error',
                                title: 'Remoção de instrição',
                                text: err
                            })
                        }                        
                    }
                });
            });
        }    
    };

    renderParticipants();
}