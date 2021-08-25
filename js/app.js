let nom, ape, tel, dir, email, cod;

$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyBLkhHtrH2MtsXwFKcypOIk7EYeTiBfcf8",
        authDomain: "ao-2021.firebaseapp.com",
        projectId: "ao-2021",
        storageBucket: "ao-2021.appspot.com",
        messagingSenderId: "314957333359",
        appId: "1:314957333359:web:8993979acf9c2aeb9b9e9a",
        measurementId: "G-BLEXP6V4WJ"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    // Validacion de inputs
    $('input').on({
        keydown: function(e) {

            // Se captura el id del input
            idSelector = $(this).attr('id');

            // Se programa que los campos nombre y apellido reciban solo letras
            if(idSelector == 'inputNom' || idSelector == 'inputNom') {

                if (!validarInputLetras(e)) e.preventDefault();
            }

            // Se programa que el campo teléfono reciban solo números
            if(idSelector == 'inputTel') {

                if (!validarInputNum(e)) e.preventDefault();
            }

            // Se programa que el campo email no acepte espacios en blanco
            if(idSelector == 'inputEmail') {
                if (!validarEspacios(e)) e.preventDefault();
            }

        },
        blur: function() {

            idSelector = '#'+idSelector;

            if (idSelector !== undefined) {

                // Validando los valores ingresados
                if(idSelector == '#inputNom' || idSelector == '#inputrApe' || idSelector == '#inputTel' || idSelector == '#inputDir') {

                    // Se captura el value del input
                    valor = $(idSelector).val();
                    if(validarLongCaract(valor, idSelector)){
                        // Se guardan los valores de los inputs
                        nom = $('#inputNom').val();
                        ape = $('#inputApe').val();
                        dir = $('#inputDir').val();
                        tel = $('#inputTel').val();
                        cod = $('#prefix-cod').find(":selected").text();
                    }
                }

                if(idSelector == '#inputEmail') {
                    let ptr = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/gm;

                    let value = $('#inputEmail').val();

                    if(ptr.test(value)) {
                        $('#inputEmail').removeClass('is-invalid');
                        email = $('#inputEmail').val();
                        return true;
                    }
                    else {
                        $('#inputEmail').addClass('is-invalid');
                        return false;
                    }
                }
            }
        }
    });

    $('#btnEnviar').click(function () {

        $.getScript('//cdn.jsdelivr.net/npm/sweetalert2@11', function () {

            if (verificarCamposForm('#form1')) {
                // Se ejecuta cuando ningun campo esta vacío
                promesa = Swal.fire({
                    title: '¿Estás seguro de enviar los datos?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4CD964',
                    cancelButtonColor: '#6A3CF0',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Sí, enviar los datos!',
                });

                promesa.then((result) => {

                    if (result.value == true) {

                        const user = {
                            nom,
                            ape,
                            cod,
                            tel,
                            email,
                            dir
                        }

                        saveRegistro(user);
                    }
                });
            } else {
                // Se ejecuta cuando existe algun campo vacío
                descargarSweetAlertErrorCampos('#errorEnvio');
            }
        });

    });

});

const saveRegistro = (user) => {

    const db = firebase.firestore();

    db.collection("registro").add({
        user
    })
    .then((docRef) => {
        mjsOk();
    })
    .catch((error) => {
        msjError();
    });
}


const mjsOk = () => {
    // Datos enviados con exito
    Swal.fire({
        icon: 'success',
        title: '¡Registro Finalizado!',
        text: `Gracias por unirte ${nom.charAt(0).toUpperCase() + nom.slice(1).toLowerCase()} ${ape.charAt(0).toUpperCase() + ape.slice(1).toLowerCase()}. Pronto nos comunicaremos contigo!`,
    });
}

const msjError = () => {
    // ocurrio un  problema al enviar los datos
    Swal.fire({
        icon: 'error',
        title: 'Error inesperado...',
        text: `Su registro no ha sido procesado. Intente más tarde.`,
    });
}

// validaciones
// Valida la longitud del campo
function validarLongCaract(value, selector) {
    let max = $(selector).attr('maxlength');
    let min = $(selector).attr('minlength');

    if(value.length >= min && value.length <=max) {
        $(selector).removeClass('is-invalid');
        return true;
    }else {
        $(selector).addClass('is-invalid');
        return false;
    }
}

// Acepta solo letras
function validarInputLetras(e) {
	let code = e.keyCode != 0 ? e.keyCode : e.charCode;
	if (code == 8 || code == 9 || code == 18)
		// backspace, tab, enter y alt.
		return true;

	if (code >= 65 && code <= 90) {
		String.fromCharCode(code);
		return true;
	} else return false;
}

// solo acepta numeros
function validarInputNum(e) {
	let code = e.keyCode != 0 ? e.keyCode : e.charCode;
	if (code == 8 || code == 9)
		// backspace && tab.
		return true;

	if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105)) {
		String.fromCharCode(code);
		return true;
	} else return false;
}

// solo no acepta espacios
function validarEspacios(e) {
	let code = e.keyCode != 0 ? e.keyCode : e.charCode;
	if (code == 32) return false;
	else return true;
}

// Verifica que no existan campos vacios en formularios
function verificarCamposForm(id){
    // se verifican cuantos campos tiene el formulario
    // la ultima posicion corresonde al boton de envío
    for (let i = 0; i < $(id)[0].length - 1; i++) {
        let campo = $(id)[0][i];
        let value = $(campo).val();
        let select = $(campo).attr('id');
        select = '#'+select;

        if(value == "" || value == null || $(select).hasClass('is-invalid')) {
            return false;
        }
    }
    return true;
}

function descargarSweetAlertErrorCampos(selector) {
    // Se descarga el script sweet alert para mostrar un alerta personalizada
    $.getScript("//cdn.jsdelivr.net/npm/sweetalert2@11")
        .done(function() {
            Swal.fire({
                icon: 'error',
                title: 'ERROR...',
                text: 'Verifique y complete la información para continuar con el registro.',
            })
        })
        .fail(function() {
            // Si la descarga del script falla se muestra una alerta en el div correspondiente
            if($(selector).children().length == 0) {
                $(selector).append(`
                    <div id="errorEnvio">
                        <div class="alert alert-danger d-flex align-items-center mx-auto w-75" role="alert">
                            <i class="bi bi-exclamation-square-fill fs-4"></i>
                            <p class="ps-2">
                                Algo salió mal...<span class="fw-bold"> Verifique y complete la información para continuar con el registro.
                            </p>
                        </div>
                    </div>
                `).fadeIn('slow').fadeOut(9000);
            }else $(selector).fadeIn().fadeOut(10500);
    });
}
