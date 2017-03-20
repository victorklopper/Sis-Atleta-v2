var pageClube = {
    clubes: []
    , atletas: []
    , database: firebase.database()
    , databaseRef: '/clubes/'
    , databaseAtletas: '/atletas/'
    , nomeClubeField: document.querySelector('#nome-clube-field')
    , siglaClubeField: document.querySelector('#sigla-clube-field')
    , idClubeField: document.querySelector('#idClube')
    , clubeBtn: document.querySelector('#salvar-clube-btn')
    , addClubeBtn: document.querySelector('#addClubeBtn'),
    tableClubes: document.querySelector('#table-clubes')
}
window.addEventListener('load', getClubes);

function abreModalClube(idClube) {
    if (idClube) {
        clubeSel = pageClube.clubes[idClube]
        pageClube.idClubeField.value = clubeSel.uid;
        pageClube.nomeClubeField.value = clubeSel.nomeclube;
        pageClube.siglaClubeField.value = clubeSel.siglaclube;
    }
    else {
        pageClube.idClubeField.value = null;
        pageClube.nomeClubeField.value = null;
        pageClube.siglaClubeField.value = null;
    }
    $('#modal-addclube').modal('open');
}

pageClube.addClubeBtn.addEventListener('click', function () {
    abreModalClube(null);
})
pageClube.clubeBtn.addEventListener('click', function () {
    var tempClube = {
        nomeclube: pageClube.nomeClubeField.value
        , siglaclube: pageClube.siglaClubeField.value
    }
    if (tempClube.nomeclube == "" || tempClube.siglaclube == "") {
        swal("Aviso!", "O nome e a sigla devem ser preenchidos!");
    }
    else {
        if (pageClube.idClubeField.value) {
            salvarAlteracoesClube(tempClube);
            $('#modal-addclube').modal('close');
        }
        else {
            novoClube(tempClube);
            $('#modal-addclube').modal('close');
        }
    }
})

function salvarAlteracoesClube(tempClube) {
    idClube = pageClube.idClubeField.value;
    tempClube.nomeclube = pageClube.nomeClubeField.value;
    tempClube.siglaclube = pageClube.siglaClubeField.value;
    pageClube.database.ref(pageClube.databaseRef + '/' + pageClube.idClubeField.value).update(tempClube).then(swal("", "Clube atualizado com sucesso", "success"));
    
    var clubesNaTela = document.querySelectorAll('.idDosClubes');
    clubesNaTela.forEach(function(clubeHtml){
        if(clubeHtml.id == idClube)
            {
                clubeHtml.querySelector('.nomeClubeTabela').innerHTML = pageClube.nomeClubeField.value;
                clubeHtml.querySelector('.siglaClubeTabela').innerHTML = pageClube.siglaClubeField.value;
            }
    })
}

function novoClube(clube) {
    var idClubeNovo = pageClube.database.ref(pageClube.databaseRef).push(clube)
    .then(function(clubeRef){
        clube.uid = clubeRef.key;
        preencheTabelaClube(clube);
    })
    .then(swal("", "Clube criado com sucesso", "success"));
}

function excluirClube(idClube) {
    pageClube.database.ref(pageClube.databaseRef + idClube).remove().then(swal("", "Clube removido com sucesso", "success"));
    pageClube.tableClubes.querySelector('#'+idClube).innerHTML = '';
}

function preencheTabelaClube(tempClube) {
    var html = '';
    html += '<tr class="idDosClubes" id="' + tempClube.uid + '">';
    html += '<td class="nomeClubeTabela">' + tempClube.nomeclube + '</a></td>';
    html += '<td class="siglaClubeTabela">' + tempClube.siglaclube + '</td>';
    html += '<td><a onclick="getAtletasByClube(\'' + tempClube.uid + '\')" href="#" class=ver-atletas>Ver Atletas</a></td>';
    html += '<td><a onclick="abreModalClube(\'' + tempClube.uid + '\')" href="#" class="editar-clube"><i class="material-icons">mode_edit</i></a>' + '&nbsp;&nbsp;' + '<a onclick="excluirClube(\'' + tempClube.uid + '\' )" href="#" class="excluir-clube"><i class="material-icons"><i class="material-icons">remove_circle</i></td>';
    html += '</tr>';
    $('#body-clube').append(html);
}

function getClubes() {
    pageClube.database.ref(pageClube.databaseRef).once('value').then(function (snapshot) {
        snapshot.forEach(function (clubeRef) {
            var tempClube = clubeRef.val();
            tempClube.uid = clubeRef.key;
            pageClube.clubes[clubeRef.key] = (tempClube);
            preencheTabelaClube(tempClube);
        });
    })
}

function getAtletasByClube(idClube) {
    $('#modal-veratletas').modal('open');
    var validador = false;
    pageClube.database.ref(pageClube.databaseRef).once('value').then(function (snapshot) {
        snapshot.forEach(function (clubeRef) {
            var tempClube = clubeRef.val();
            tempClube.uid = clubeRef.key;
            if (idClube == tempClube.uid) {
                //console.log(tempClube.nomeclube);
                pageClube.database.ref(pageClube.databaseAtletas).once('value').then(function (snapshot) {
                    snapshot.forEach(function (atletaRef) {
                        var tempAtletaClube = atletaRef.val();
                        if (tempClube.nomeclube == tempAtletaClube.clube) {
                            html = '';
                            html += '<tr id="' + tempAtletaClube.uid + '">';
                            html += '<td>' + tempAtletaClube.nome + '</td>';
                            html += '<td>' + tempAtletaClube.idade + '</td>';
                            html += '<td>' + tempAtletaClube.posicao + '</td>';
                            html += '<td>' + tempAtletaClube.categoria + '</td>';
                            html += '</tr>';
                            $('#body-atletas-clube').append(html);
                        }
                    });
                });
            }
        });
    });
}