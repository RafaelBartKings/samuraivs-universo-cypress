

describe('dashboard', function () {

    context('quando o cliente faz o agendamento no app mobile', function () {
        
        const data = {
            customer:{
                name: 'Nikki Sixx',
                email: 'sixx@motleycure.com',
                password: 'pwd123',
                is_provider: false
            },
            provider: {
                name:'Ramon Valdes',
                email: 'ramon@televisa.com',
                password: 'pwd123',
                is_provider: true
            }
        }

        before(function (){
            cy.postUser(data.provider)
            cy.postUser(data.customer)

            cy.apiLogin(data.customer)
            cy.log('Conseguimos pegar o token ' + Cypress.env('apiToken'))

            cy.setProviderId(data.provider.email)
        });
        
        it('o mesmo deve ser exibido no dashboard', function () {
            cy.log('O Id do ramon é ' + Cypress.env('providerId'))
            cy.createAppointment()
        });
    });
});

Cypress.Commands.add('createAppointment', function () {
    let today = new Date();

    today.setDate(today.getDate() + 1)
    cy.log(today.getDate())
});

Cypress.Commands.add('setProviderId', function(providerEmail){

    cy.request({
        method: 'GET',
        url: 'http://localhost:3333/providers',
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then(function (response) {
        expect(response.status).to.eq(200)
        console.log(response.body)

        const providerList = response.body

        providerList.forEach(function(provider){
            if(provider.email === providerEmail){
                Cypress.env('providerId', provider.id)
            }
        });
    });
});

Cypress.Commands.add('apiLogin', function(user){
    const payload = {
        email: user.email,
        password: user.password      
    }

    cy.request({
        method: 'POST', 
        url: 'http://localhost:3333/sessions',
        body: payload
    }).then(function(response){
        expect(response.status).to.eq(200)

        Cypress.env('apiToken', response.body.token)
    })

});