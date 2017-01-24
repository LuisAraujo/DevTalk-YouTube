var scopes = 'https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send';

// 1 Passo - Chama a função para setar o APIKey
function carregarAPI() {
    console.log(clientId, ap)
    gapi.client.setApiKey(apiKey);
    //verifica a autorização do usuário
    window.setTimeout(verificaAutenticacao, 1);
}

//2 Passo - Verificando Autorização
function verificaAutenticacao() {

    gapi.auth.authorize({
        //seu id
        client_id: clientId,
        //escopos, ou seja, o que você quer acessar
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

//2.1 Passo - Autenticação deu xabu e veio para cá
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
    gapi.client.load('gmail', 'v1', getListThreads);
}

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



//MENSAGENS

//veja a lista aqui => https://support.google.com/mail/answer/7190?hl=en
var listquery = Object();
listquery.de = "from: luisaraujo.ifba@gmail.com";
listquery.para = "to: luisaraujo.ifba@gmail.com";
listquery.assunto = "subject: mestrado";
listquery.tempo = "after:2017/01/03";
listquery.tempo1 = "before:2013/01/30";

//Listar
function getListEmails(){
    userId = 'me'
    query = listquery.tempo1;

    var request = gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'q': query,
        'maxResults': 20
        //'labelIds': "Label_43"
    });

    request.execute(function(resp) {
        console.log(resp)
        getListLabels();
    });

}




//Listar
function getListEmails1(){
    userId = 'me'

    var request = gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'maxResults': 20,
        'labelIds': 'Label_43',
        'includeSpamTrash': true
    });

    request.execute(function(resp) {
        console.log(resp)

    });

}


//Listar todos
function getListEmails2(){
    userId = 'me'
    query = listquery.assunto;

    var request = gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'q': query
    });
    function showListEmails(request, result){
        request.execute(function(resp){
            result = resp.messages;
            console.log(result);
            var nextPageToken = resp.nextPageToken;
            if(nextPageToken){
                request = gapi.client.gmail.users.messages.list({
                    'userId': userId,
                    'pageToken': nextPageToken,
                    'q': query
                });

                showListEmails(request, result);
            }
        });
    }
    showListEmails(request, []);

}


//CRIAR
//escopo https://www.googleapis.com/auth/gmail.send
function sendEmails(){

    function getDataFormat(){
        d = new Date();
        locale = "en-us",
            date =  d.toLocaleString(locale, {weekday: 'short'})+", "+d.getDate()+" "+d.toLocaleString(locale, { month: 'short'})+" "+ d.getFullYear();
        date+=  " "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" "+new Date(d.getTime() + (d.getTimezoneOffset() * 60000)).toString().split(" ")[5].split("T")[1];
        return d;
    }

    //RFC 5322 formatted String
    //http://wesmorgan.blogspot.com.br/2012/07/understanding-email-headers-part-ii.html
    email = 'Subject: Email de Teste2 \r\n';
    email += 'To: luisaraujo.ifba@gmail.com \r\n';
    email += 'From: luisaraujo.ifba@gmail.com \r\n';
    email += 'Date: '+getDataFormat()+'\r\n';
    email += '\Message-ID: \<1234@gmail.com\> \r\n';
    email += 'Isso é um teste! \r\n';

    //var base64EncodedEmail = Base64.encodeURI(email);

    var request = gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
        }
    });

    request.execute(function(resp) {
        console.log(resp)

    });
}

//ATUALIZAR
function updateEmail(){
    var request = gapi.client.gmail.users.messages.modify({
        'userId': 'me',
        'id': '159cd7960a6ad876',
        //'addLabelIds': ['Label_43']
        'removeLabelIds': ['Label_43']
    });
    request.execute(function(resp) {
        console.log(resp);
    });
}

//BUSCAR
function getEmail(){
    var request = gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': '159cd7960a6ad876'
    });
    request.execute(function(resp) {
        console.log(getBody(resp.payload));
    });

    //https://github.com/sitepoint-editors
    function getBody(message) {
        var encodedBody = '';
        if(typeof message.parts === 'undefined')
        {
            encodedBody = message.body.data;
        }
        else
        {
            encodedBody = getHTMLPart(message.parts);
        }
        encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        return decodeURIComponent(escape(window.atob(encodedBody)));
    }
}




//PARA O LIXO
function trashEmail(){
    var request = gapi.client.gmail.users.messages.trash({
        'userId': 'me',
        'id': '159cd7960a6ad876'
    });
    request.execute(function(resp) {
        console.log(resp);
    });
}


//DELETAR
// escopo https://mail.google.com/
function deleteEmail(){
    var request = gapi.client.gmail.users.messages.delete({
        'userId': 'me',
        'id': '159cd83664301fb8'
    });
    request.execute(function(resp) {
        console.log(resp);
    });
}
//159cd85794a37ba6


//TRHEAD

//Listar todos
function getListThreads(){
    userId = 'me'
    query = "is:unread";

    var request = gapi.client.gmail.users.threads.list({
        'userId': 'me',
        'q': query
    });

    function showListThereads(request, result){
        request.execute(function(resp){
            console.log(resp);
            var nextPageToken = resp.nextPageToken;
            if(nextPageToken){
                request = gapi.client.gmail.users.threads.list({
                    'userId': userId,
                    'pageToken': nextPageToken,
                    'q': query
                });

                showListThereads(request, result);
            }
        });
    }
    showListThereads(request, []);

}


//BUSCAR
function getThread(){
    userId = 'me';
    query = listquery.de;

    var request = gapi.client.gmail.users.threads.get({
        'userId': 'me',
        'id': '159cd85794a37ba6'
    });

    request.execute(function(resp) {
        console.log(resp);
    });
}


//ATUALIZAR
function updateThread(){
    var request = gapi.client.gmail.users.threads.modify({
        'userId': 'me',
        'id': '159cd85794a37ba6',
        'addLabelIds': ['Label_43']
        //'removeLabelIds': ['Label_43']
    });
    request.execute(function(resp) {
        console.log(resp);
    });
}

//PARA O LIXO
function trashThread(){
    var request = gapi.client.gmail.users.threads.trash({
        'userId': 'me',
        'id': '159cd85794a37ba6'
    });
    request.execute(function(resp) {
        console.log(resp);
    });
}


//DELETAR
function deleteThread(){
    var request = gapi.client.gmail.users.threads.delete({
        'userId': 'me',
        'id': '159cd85794a37ba6'
    });
    request.execute(function(resp) {
        console.log(resp);
    });
}
//159cd85794a37ba6
