var clientId = '';
var apiKey = '';
var scopes = 'https://www.googleapis.com/auth/gmail.modify';

// 1 Passo - Chama a função para seta o API Key
function carregarAPI() {

    gapi.client.setApiKey(apiKey);
    //verifica a a autorização do usuário
    window.setTimeout(verificaAutenticacao, 1);
}
//2 Passo - Verificando Autorização
function verificaAutenticacao() {

    gapi.auth.authorize({
	    //seu id
        client_id: clientId,
		//escopos, ou seja, o que você quer acessa
        scope: scopes,
		//imagina que já tenha sido autorizado...
        immediate: true
    }, function(authResult){
        //tem permissão? Sim :)
        if(authResult && !authResult.error) {
            //faz a sua bagaceira, moleque!
			loadGmailApi();
        }else{
		    //se não tem, chama a autenticação com immediate: false
            verificaAutenticacao2();
        }
    });
}

//2.1 Passo - Autenticação deu xabu e vei para cá
function verificaAutenticacao2(){
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
		//só muda isso!!!
        immediate: false
    });
}

//3 Passo - Tudo sussa, vamos dominar o mundo! ;)
function loadGmailApi() {
    //Por algum motivo só funciona assim, achei a solução depois de muuuuito fuçar na net
    gapi.client.setApiKey("");
	//nome da api, versão, função após o inicio
    gapi.client.load('gmail', 'v1',deleteLabels);
}


//LEBELS

//Listar
function getListLabels(){
    var request = gapi.client.gmail.users.labels.list({
        'userId': 'me'
    });
    request.execute(function(resp) {
        console.log(resp.labels)
    });
}

//Criar
function createLabels(){
    var request = gapi.client.gmail.users.labels.create({
        'userId': 'me',
         'resource': {
            'name': 'newLabelName',
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show'
        }
    });


    request.execute(function(resp) {
        console.log(resp)
        getListLabels();
    });
}


//Atualizar
function updateLabels(){
    var request = gapi.client.gmail.users.labels.update({
        'userId': 'me',
		//aqui você diz o id que deseja (na sua conta será um id diferente)
        'id': 'Label_39',
        'resource': {
            'id': 'Label_39',
            'name': 'newLabelName2',
            labelListVisibility: 'labelShow',
            messageListVisibility: 'show'
        }
    });


    request.execute(function(resp) {
        console.log(resp)
        getListLabels();
    });
}

//Deletar
function deleteLabels(){
    var request = gapi.client.gmail.users.labels.delete({
        'userId': 'me',
	    //aqui você diz o id que deseja (na sua conta será um id diferente)
        'id': 'Label_39'
    });

    request.execute(function(resp) {
        console.log(resp)
        getListLabels();
    });
}


//Até a próximo!

