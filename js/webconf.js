window.onload = () => {
    const URL_BASE = "https://fcawebbook.herokuapp.com";
    const btnRegister = document.getElementById("btnRegister");
    btnRegister.addEventListener("click", () => {
        swal.fire({
            title: "Inscrição na WebConference",
            html:
                '<input id="txtName" class="swal2-input" placeholder="name">' + 
                '<input id="txtEmail" class="swal2-input" placeholder="e-mail">',
            showCancelButton: true,
            confirmButtonText: "Inscrever",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const name = document.getElementById('txtName').value;
                const email = document.getElementById('txtEmail').value;

                try {
                    const response = await fetch(`${URL_BASE}/conferences/1/participants/${email}`, {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: "POST",
                        body: `nomeparticipant=${name}`
                    });
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                }
                catch (error) {
                    swal.fire('Erro', `Pedido falhou: ${error}`, 'error');
                }
            },
            allowOutsideClick: () => !swal.isLoading()
        })
        .then(result => {
            if (result.value) {
                if (!result.value.err_code) {
                    swal.fire({title: "Inscrição feita com sucesso!"});
                } else {
                    swal.fire({title: `${result.value.err_message}`});
                }
            }
        });
    });

    (async () => {
        const renderSpeakers = document.getElementById("renderSpeakers");
        let txtSpeakers = "";
        const responseSpeakers = await fetch(`${URL_BASE}/conferences/1/speakers`);
        const speakers = await responseSpeakers.json();

        for (const speaker of speakers) {
            txtSpeakers += `
            <div class="col-sm-4">
                <div class="team-member">
                    <img class="mx-auto rounded-circle viewSpeaker" id="${speaker.idSpeaker}" src="${speaker.foto}" alt="">
                    <h4>${speaker.nome}</h4>
                    <p class="text-muted"> ${speaker.cargo}</p>
                    <ul class="list-inline social-buttons">`
                        if (speaker.twitter !== null && speaker.twitter !== "") {
                            txtSpeakers += `
                                <li class="list-inline-item">
                                    <a href="${speaker.twitter}" target="_blank">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                </li>`
                        }
                        if (speaker.facebook !== null && speaker.facebook !== "") {
                            txtSpeakers += `
                                <li class="list-inline-item">
                                    <a href="${speaker.facebook}" target="_blank">
                                        <i class="fab fa-facebook"></i>
                                    </a>
                                </li>`
                        }
                        if (speaker.linkedin !== null && speaker.linkedin !== "") {
                            txtSpeakers += `
                                <li class="list-inline-item">
                                    <a href="${speaker.linkedin}" target="_blank">
                                        <i class="fab fa-linkedin"></i>
                                    </a>
                                </li>`
                        }
            txtSpeakers += `
                    </ul>
                </div>
            </div>
            `
        }
        renderSpeakers.innerHTML = txtSpeakers;
        const btnView = document.getElementsByClassName("viewSpeaker");
        for (let i = 0; i < btnView.length; i++) {
            btnView[i].addEventListener("click", () => {
                for (const speaker of speakers) {
                    if (speaker.idSpeaker == btnView[i].getAttribute("id")) {
                        swal.fire({
                            title: speaker.name,
                            text: speaker.bio,
                            imageUrl: speaker.foto,
                            imageWidth: 400,
                            imageHeight: 400,
                            imageAlt: 'Foto do Orador',
                            animation: false
                        });
                    }
                }
            });
        }

        const renderSponsors = document.getElementById("renderSponsors");
        let txtSponsors = "";
        const responseSponsors = await fetch(`${URL_BASE}/conferences/1/sponsors`);
        const sponsors = await responseSponsors.json();
        for (const sponsor of sponsors) {
            txtSponsors += `
            <div class="col-md-3 col-sm-6">
                <a href="${sponsor.link}" target="_blank">
                    <img class="img-fluid d-block mx-auto" src="${sponsor.logo}" alt="${sponsor.nome}">
                </a>
            </div>
            `
        }
        renderSponsors.innerHTML = txtSponsors;
    })();

    const contactForm = document.getElementById("contactForm");
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const response = await fetch(`${URL_BASE}/contacts/emails`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `email=${email}&name=${name}&subject=${message}`
        })
        .then (response => {
            const result = response.json();
            if (result.value.success) {
                swal.fire(
                    'Envio de mensagem',
                    result.value.message.pt,
                    'success'
                    );    
            } else {
                swal.fire(
                    'Erro',
                    'Não foi possível enviar a mensagem, favor tentar novamente!',
                    'error'
                    );    
            }
        })
        .catch(error => {
            swal.fire(
                'Erro',
                `Envio da mensagem falhou. Motivo: ${error}`,
                'error'
                );
        });        
    });

    const btnLogin = document.getElementById("btnLogin");
    btnLogin.addEventListener("click", () => {
        swal.fire({
            title: "Acesso à área de gestão da WebConference",
            html:
                '<input id="email" type="text" class="swal2-input" placeholder="email">' + 
                '<input id="password" type="password" class="swal2-input" placeholder="pass">',
            showCancelButton: true,
            confirmButtonText: "Entrar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                // The login endpoint is not working correctly, so we are mocking the acceptance here. 
                // DON'T DO THIS AT HOME, WE ARE PROFESSIONALS AND WE KNOW WHAT WE ARE DOING HERE... KIND OF
                sessionStorage.token = email;
                window.location.replace("admin/html/participants.html");

                try {
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;            
                    const response = await fetch(`${URL_BASE}/signin`, {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        method: "POST",
                        body: `email=${email}&password=${password}`
                    });
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                }
                catch (error) {
                    swal.fire('Erro', `Pedido falhou: ${error}`, 'error');
                }
            },
            allowOutsideClick: () => !swal.isLoading()
        })
        .then(result => {
            if (result.value) {
                if (!result.value.success) {
                    sessionStorage.token = email;
                    window.location.replace("admin/html/participants.html")
                } else {
                    swal.fire({title: `${result.value.message.pt}`});
                }
            }
        });
    });
}

function myMap () {
    const porto = new google.maps.LatLng(41.14961, -8.61099);
    const mapProp = {
        center: porto,
        zoom: 12,
        scrollweheel: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    const map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    const infoWindow = new google.maps.InfoWindow({
        content: "É aqui a WebConference!"
    });
    const marker = new google.maps.Marker({
        position: porto,
        map: map,
        title: "WebConference"
    });
    marker.addListener('click', function (){
        infoWindow.open(map, marker);
    });
}