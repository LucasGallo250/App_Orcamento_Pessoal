class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
		this.erro = 'Error...'
	}
	
	//No futuro é necessário ajustar esse validarDados pois não está funcionando para receber esses cálculos.
	validarDados(tipo) {

		if(tipo != 'filtro'){
            this.verificaValorVazio()
        }
		
		//Verificações correspondentes ao dia e aos valores numéricos no registro
        if(tipo != 'filtro'){
            if((Number.isNaN(this.dia) || Number.isNaN(this.valor)) || this.dia <= 0){
                this.erro = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
                return false
            }
        } else {
            if(parseInt(this.dia) <= 0 && this.dia != ''){
                this.erro = 'O dia não pode ser menor ou igual a 0, por favor corrija o problema.'
                return false
            }
        }

		
		switch(this.mes){
			
			case '02':
                //Cálculo do ano bissexto e validando
                if(this.ano % 4 === 0 && this.mes == '02'){
                    if(this.dia > 29){
                        this.erro = 'O ano inserido é bissexto, porém Fevereiro não pode ter mais de 29 dias. Por favor faça as alterações necessárias.'
                        return false
                    }  
                } else if(this.dia > 28){
                    this.erro = 'Fevereiro possui somente 28 dias. Por favor, faça a alteração nos valores'
                    return false
                }
                break
			
            case '04':
			case '06':
            case '09':
            case '11':
                if(this.dia > 30){
                    this.erro = 'O mês inserido possui somente 30 dias, por favor altere o valor.'
                    return false
                }
                break
            default:
                if(this.dia > 31){
                    this.erro = 'Você não pode inserir mais que 31 dias. Por favor, faça a alteração necessária'
                    return false
                }
                break
        }
		
		//FIM - validarDados()
	}

	
	verificaValorVazio() {
		for(let i in this) {	

			if((this[i] === '' || this[i] === undefined || this[i] === null) && i != 'descricao'){
                this.erro = 'Um campo está em branco, por favor verifique todos os campos e insira o valor necessário.'
                return false
            }
		}
		return true
	}

//FIM - Despesa()
} 


class Bd {
	
	constructor() {
		let id = localStorage.getItem('id')
		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}
	
	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}
	
	gravar(d) {
		//Se A descriçao estiver vazia, adicionaR 'Sem descrição' como valor
        if(d.descricao === ''){
            d.descricao = 'Sem Descrição'
        }

		d.valor = d.valor.toFixed(2)

		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}
	
	recuperarTodosRegistros() {
		let id = localStorage.getItem('id')
		//recuperar todas as despesas cadastradas em localStorage
		//array de despesas
		let despesas = Array()
		for (let i = 1; i <= id; i++) {
			//recuperar a despesa
			let despesa_recuperada = JSON.parse( localStorage.getItem(i) )
			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos vou pular esses índices
			if ( despesa_recuperada !== null ) {
				despesa_recuperada.id = i //aparecer o id para numeros dos resultados
				//adicionar despesa ao array
				despesas.push(despesa_recuperada)
			}
		}
		return despesas
	}

	//Filtrar na consulta
	filtraDespesa(despesa) {

		let despesasFiltradas = Array ()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas)
		//console.log(despesa)

		if(despesa.ano != ''){
			//console.log("filtro de ANO"  + despesa.ano);
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		if(despesa.mes != ''){
			//console.log("filtro de MES:" + despesa.mes);
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		if(despesa.dia != ''){
			//console.log("filtro de DIA:" + despesa.dia);
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		if(despesa.tipo != ''){
			//console.log("filtro de TIPO:" + despesa.tipo);
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		if(despesa.descricao != ''){
			//console.log("filtro de DESCRIÇÃO:" + despesa.descricao);
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		if(despesa.valor != ''){
			//console.log("filtro de VALOR:" + despesa.valor);
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	removerDespesa(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()
/* FIM - BD */

//Função executada para cadastrar a despesa e feedback visual
function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value,
		mes.value, 
		parseInt(dia.value), 
		tipo.value, 
		descricao.value, 
		parseFloat(valor.value) 
		)
	
	//esse é o problema (verificaValorVazio(), certo é validarDados() para receber os cálculos a cima.)
	if(despesa.verificaValorVazio()) {
		//botão para gravar (salvar)
		bd.gravar(despesa)
		modalSucesso()

		//ao efetuar o registro com sucesso e clicar em voltar, a ajustar é ter um formulário limpo
		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	} else {
		modalErro(despesa.erro)
	}
}

//Funções para feedback visual
function modalSucesso() {
	document.getElementById('moda_titulo').innerHTML = 'Registro Inserido com Sucesso:'
	document.getElementById('modal_titulo_div').className = 'modal-header text-success'
	document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'

	document.getElementById('modal_btn_voltar').innerHTML = 'Voltar'
	document.getElementById('modal_btn_voltar').className = 'btn btn-success'
	//dialog de sucesso
	//JQuery
	$('#modalRegistraDespesa').modal('show')
}

function modalErro(erro) {
	document.getElementById('moda_titulo').innerHTML = 'Erro na Inclusão do Registro:'
	document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
	//document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
	document.getElementById('modal_conteudo').innerHTML = erro

	document.getElementById('modal_btn_voltar').innerHTML = 'Voltar e Corrigir'
	document.getElementById('modal_btn_voltar').className = 'btn btn-danger'
	//dialog de erro
	//JQuery
	$('#modalRegistraDespesa').modal('show')
}

//Erro Consultas
function modalErroFiltro(erro) {
	document.getElementById('corModal').innerHTML = 'Erro no Filtro do Registro:'
	document.getElementById('modal_title').className = 'modal-header text-danger'
	document.getElementById('mensagemModal').innerHTML = erro

	document.getElementById('closeModal').innerHTML = 'Voltar e Corrigir'
	document.getElementById('closeModal').className = 'btn btn-danger'
	//dialog de erro no filtro
	//JQuery
	$('#modalErroFiltro').modal('show')
}


function carregaListaDespesas(despesas = Array(), filtro = false) {
	
	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() 
	}
	
	//selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	//receber um valor vazio ao filtrar
	listaDespesas.innerHTML = ''
	//percorrer o array despesas, listando cada despesa de forma dinâmica
	despesas.forEach( function(d) {
		
		//criando a linha (tr)
		let linha = listaDespesas.insertRow()

		//criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		//ajustar o tipo:
		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
			case '6': d.tipo = 'Moradia'
				break
		}
		linha.insertCell(1).innerHTML = d.tipo

		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = `R$ ${d.valor}`
		//console.log(d) //resultado para despesas

		//criar o botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger btn_exc'
		btn.innerHTML = '<i class="fas fa-trash"></i>'
		btn.id = `id_despesa_${d.id}`  
		
		btn.onclick = function() {
			let excluirDespesa = confirm(`Deseja realmente excluir a despesa de ${d.tipo}?`)
			if (excluirDespesa == true) {
				//remover a despesa
			let id = this.id.replace('id_despesa_', '')
			bd.removerDespesa(id)
			//automatico após remover as despesas
			window.location.reload()
			}
		}
		linha.insertCell(4).append(btn)
	})
}

//Função para receber o filtro da despesa
function pesquisarDespesa(){

	let ano = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	//Recuperando o value do campos
	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	
	let despesas_pos_filtro = bd.filtraDespesa(despesa)
	
	this.carregaListaDespesas(despesas_pos_filtro, true)
}

function limparFiltros(){
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

	ano.value = '' 
	mes.value = ''
	dia.value = ''
	tipo.value = ''
	descricao.value = ''
	valor.value = ''
}