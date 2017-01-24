var scopes = 'https://mail.google.com/ https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send';

// 1 Passo - Chama a função para setar o APIKey
function carregarAPI() {
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
    gapi.client.load('gmail', 'v1', function(){
        databaseApp.gmailAtivo = true;
    });
}

//Pega as threads não lidas e armazena em databaseApp.listThreads
function getEmaislUnRead(request, result){
    request.execute(function(resp){

        for(var i=0; i<resp.threads.length; i++){
            threads = new Object();
            threads.id = resp.threads[i].id;
            threads.id = resp.threads[i].id;
            databaseApp.listThreads.push(threads);
        }

        var nextPageToken = resp.nextPageToken;
        if(nextPageToken){
            request = gapi.client.gmail.users.threads.list({
                'userId': 'me',
                'pageToken': nextPageToken,
                'q': query
            });

            getEmaislUnRead(request, result);
        }else{
            artyom.say("Você tem" + databaseApp.listThreads.length+" emails não lidos na caixa de entrada!");
        }
    });
}

//Pega os dados dos e-mail não lidos e armazena em databaseApp.listEmail.
//Fala toda a lista de e-mails não lidos (Remetente e Assunto)
function sayEmailsUnRead(request){
    request.execute(function(resp) {
        var from = getOnlyName(getHeader(resp.messages[0].payload.headers, 'From'));
        var assunto = getHeader(resp.messages[0].payload.headers, 'Subject');
        artyom.say("Um email de "+from);
        artyom.say("Assunto "+assunto);
        
        email = new Object();
        email.id = resp.messages[0].id;
        email.from = from;
        email.subject = assunto;
        databaseApp.listEmail.push(email);
    });
}


//Ler um email específico
function openEmail(id){
   artyom.say("Abrindo e-mail!")
   window.open('https://mail.google.com/mail/u/0/#inbox/'+id, '_blank');

}

//Função para pegar apenas o nome do contato na string de formato "Contato <contato@gmail.com>"
function getOnlyName(from){
    return from.split("<")[0];
}

//****FUNÇÔES DE SITEPOINT
// Disponível em: https://github.com/sitepoint-editors [GITHUB] :)
//getBody
//getHTMLPart
//getHeards

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

function getHTMLPart(arr) {
    for(var x = 0; x <= arr.length; x++)
    {
        if(typeof arr[x].parts === 'undefined')
        {
            if(arr[x].mimeType === 'text/html')
            {
                return arr[x].body.data;
            }
        }
        else
        {
            return getHTMLPart(arr[x].parts);
        }
    }
    return '';
}

function getHeader(headers, index) {
    var header = '';
    $.each(headers, function(){
        if(this.name === index){
            header = this.value;
        }
    });
    return header;
}










