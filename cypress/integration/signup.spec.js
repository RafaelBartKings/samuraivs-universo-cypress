import signupPage from '../support/pages/signup'

describe('cadastro', function () {
    context('quando o usário é novato', function () {
        const user = {
            name: 'Rafael Reis',
            email: 'rafael@samuraivs.com',
            password: 'pwd123'
        }

        before(function () {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('deve cadastrar um novo usuário com sucesso', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveTest('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        });
    });

    context('quando o email já existe', function() {
        const user = {
            name: 'Aline Reis',
            email: 'aline@samuraivs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(function() {
            cy.task('removeUser', user.email)
            .then(function (result) {
                console.log(result)
            })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            });
        });

        it('não deve cadastrar usuário', function () {  
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveTest('Email já cadastrado para outro usuário.')
        });
    });

    context('quando o email é incorreto', function () {
        const user = {
            name: 'Rafael Elizabeth Olsen',
            email: 'liza.yahoo.com',
            password: 'pwd123'
        }

        it('deve exibir mensagem de alerta', function () {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
            

        })
    })

    context('quando a senha é muito curta', function () {
        
        const passwords = ['1','2a','ab3','abc4','ab#c5']
        
        beforeEach(function () {
            signupPage.go()
        });

        passwords.forEach(function (p){
            it('não deve cadastrar com a senha : ' + p, function () {
                const user = {
                    name: 'Aline Reis',
                    email: 'json@gmail.com',
                    password: p
                }

                signupPage.form(user)
                signupPage.submit()
            });
        });

        afterEach(function () {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        });
    });

    context('quando não preencho nenhum dos campos', function () {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]

        before(function() {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach(function (alert) {
            it('deve exibir ' + alert.toLowerCase(), function () {
                signupPage.alertHaveText(alert)
            })
        })
    })
});