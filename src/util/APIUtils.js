import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};


export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/auth/user/me",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function getConsultationsForProfessorsCalendar(professorsId, calendarId) {
    return request({
        url: "http://localhost:8083/konsultacije/zaNastavnikovKalendar?jmbg=" + professorsId + "&idKalendara=" + calendarId,
        type: "GET",
        async: false,
        contentType: "application/json",
        processData: false // avoid the data being parsed to query string params
    });
}




// export function dodajKonsultaciju() {
//     return request({
//         url: API_BASE_URL + "konsultacije/add",
//         method: 'POST',
//         async: false,
//         data: JSON.stringify(self.kreirajKonsultacije()),
//         contentType: "application/json"


//     });
// }
// function kreirajKonsultacije() {
//     return {
//         'dogadjajPK': JSON.parse("{\"idKalendara\": " + 1 + "}"),
//         'datumIVremePocetka': self.datumIVremePocetka(),
//         'datumIVremeZavrsetka': self.datumIVremeZavrsetka(),
//         'mestoOdrzavanja': self.mestoOdrzavanja(),
//         'idTipaDogadjaja': tipDogadjaja,
//         'kapacitet': self.kapacitet(),
//         'brojZakazanih': 0
//     };
// };
// self.dodajKonsultaciju = function () {
//     $.ajax({
//         url: "http://localhost:8083/konsultacije/add",
//         method: "POST",
//         async: false,
//         data: JSON.stringify(self.kreirajKonsultacije()),
//         contentType: "application/json",
//         success: function (result, status, jqXHR) {
//             rootViewModel.poruka("Sistem je zapamtio konsultacije");
//             document.querySelector('#dijalogPoruka').open();
//             self.osveziKalendar();
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             rootViewModel.poruka("Sistem ne može da zapamti novi termin konsultacija");
//             document.querySelector('#dijalogPoruka').open();
//             console.log('Greska u funkciji login: ' + textStatus);
//         }
//     });

// };