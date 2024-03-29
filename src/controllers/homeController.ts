import { Request, Response } from 'express'
import { Op, Sequelize } from 'sequelize'



import { TabelaAgencia, TabelaCf, TabelaCte, TabelaRota } from '../models/Atua'
import { Usuario, Rota, Classificador, CteClassificado, CteClassificadoInstancePed } from '../models/Pedagio'
import { creatMenuObject } from '../helpers/createMenuObsect'



export const home = async (req: Request, res: Response)=>{
    let agencia = await TabelaAgencia.findAll({
        where: {
            id_ativo:{
                [Op.eq]: 1
            }
        }
    })

    agencia.sort((a, b) => {
        if (a.nm_agencia < b.nm_agencia) {
          return -1;
        }
        if (a.nm_agencia > b.nm_agencia) {
          return 1;
        }
        return 0;
    })

    res.render('pages/home', {
        agencia,
        menu: creatMenuObject('home')
    })
}

export const listagem = async (req: Request, res: Response) => {
    let {deEmissao, ateEmissao, dashboardSelecionado, unidade} = req.body
    
    let totalEmissao
    let totalEmissaoErrado
    let todosCtesErrados
    let agenciaCount:number[] = []
    let agenciaNm:string[] = []
    let agenciaFila = []
    let agenciaTotal
    let verificador = false
    let rando1:number[] = []
    let rando2:number[] = []
    let rando3:number[] = []
    let agenciaNmAuxiliar:string[] = []
    
    if(dashboardSelecionado=='dashboardGeral'){
        verificador = true
        totalEmissao = await TabelaCte.count({
            where:{
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                cd_pessoa_usuario_cancelamento:{
                    [Op.is]: null
                }
            } 
        })
        totalEmissaoErrado = await CteClassificado.count({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idclassificacao: {
                    [Op.eq]: 3
                }
            }
        })
        todosCtesErrados = await CteClassificado.findAll({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idclassificacao: {
                    [Op.eq]: 3
                }
            }
        })
    }
    else if(dashboardSelecionado=='dashboardUnidade') {
        verificador = true
        totalEmissao = await TabelaCte.count({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                cd_pessoa_usuario_cancelamento:{
                    [Op.is]: null
                },
                cd_agencia: {
                    [Op.eq]: unidade
                }
            }
        })
        totalEmissaoErrado = await CteClassificado.count({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idclassificacao: {
                    [Op.eq]: 3
                },
                cd_agencia: {
                    [Op.eq]: unidade
                }
            }
        })
        todosCtesErrados = await CteClassificado.findAll({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idclassificacao: {
                    [Op.eq]: 3
                },
                cd_agencia: {
                    [Op.eq]: unidade
                }
            }
        })
    }
    else{ //dashboardRanking
        agenciaTotal = await CteClassificado.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('cd_agencia')), 'cd_agencia']
            ],
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                cd_pessoa_usuario_cancelamento:{
                    [Op.is]: null
                },
                idclassificacao: {
                    [Op.eq]: 3
                }
            }
        })

        for(let i = 0; i< agenciaTotal.length; i++){
            agenciaFila.push(agenciaTotal[i].cd_agencia)
            let randomico = Math.floor(Math.random() * 256)
            rando1.push(randomico)
        }
        for(let j = 0; j<agenciaTotal.length; j++){
            let result = await CteClassificado.count({
                where: {
                    dt_emissao: {
                        [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                    },
                    cd_pessoa_usuario_cancelamento:{
                        [Op.is]: null
                    },
                    cd_agencia: {
                        [Op.eq]: agenciaFila[j]
                    },
                    idclassificacao: {
                        [Op.eq]: 3
                    }
                }
            })
            agenciaCount.push(result)
            let randomico = Math.floor(Math.random() * 256)
            rando2.push(randomico)
        }
        for(let k = 0; k<agenciaTotal.length; k++){
            let result = await TabelaAgencia.findAll({
                attributes: ['nm_agencia'],
                where: {
                    cd_agencia: {
                        [Op.eq]: agenciaFila[k]
                    }
                }
            })
            agenciaNm.push(result[0].nm_agencia)
            let randomico = Math.floor(Math.random() * 256)
            rando3.push(randomico)
        }
        todosCtesErrados = await CteClassificado.findAll({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idclassificacao: {
                    [Op.eq]: 3
                }
            }
        })
        
    }

    let agencia = await TabelaAgencia.findAll({
        where: {
            id_ativo:{
                [Op.eq]: 1
            }
        }
    })

    agencia.sort((a, b) => {
        if (a.nm_agencia < b.nm_agencia) {
          return -1;
        }
        if (a.nm_agencia > b.nm_agencia) {
          return 1;
        }
        return 0;
    })

    let total = agenciaFila.map((fila, index) => {
        return {
          cd_agencia: fila,
          nm_agencia: agenciaNm[index],
          count: agenciaCount[index],
          rando1: rando1[index],
          rando2: rando2[index],
          rando3: rando3[index]
        }
    })

    total.sort(function(a, b) {
        return b.count - a.count;
    })

    for(let i = 0; i<todosCtesErrados.length; i++){
        let result = await TabelaAgencia.findAll({
            where: {
                cd_agencia:{
                    [Op.eq]: todosCtesErrados[i].cd_agencia
                }
                
            }
        })
        agenciaNmAuxiliar.push(result[0].nm_agencia)
    }

    let dados = todosCtesErrados.map((dadosCte, index) => {
        return {
            dadosCte,
            nm_agencia: agenciaNmAuxiliar[index]
        }
    })
    
    res.render('pages/home', {
        dados,
        agencia,
        totalEmissao,
        deEmissao,
        ateEmissao,
        totalEmissaoErrado,
        todosCtesErrados,
        total,
        verificador,
        menu: creatMenuObject('home')
    })
}