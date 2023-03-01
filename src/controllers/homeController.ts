import { Request, Response } from 'express'
import { Op, Sequelize } from 'sequelize'



import { TabelaAgencia, TabelaCf, TabelaCte, TabelaRota } from '../models/Atua'
import { Usuario, Rota, Classificador, CteClassificado, CteClassificadoInstancePed } from '../models/Pedagio'
import { creatMenuObject } from '../helpers/createMenuObsect'



export const home = async (req: Request, res: Response)=>{
    let agencia = await TabelaAgencia.findAll({})


    res.render('pages/home', {
        agencia,
        menu: creatMenuObject('home')
    })
}

export const listagem = async (req: Request, res: Response) => {
    let {deEmissao, ateEmissao, dashboardSelecionado, unidade} = req.body
    
    let totalEmissao
    let totalEmissaoErrado
    let totalCtesErrados
    let agenciaCount:any = []
    let agenciaNm:any = []
    let agenciaFila = []
    let agenciaTotal
    let verificador = false
    let rando1:any = []
    let rando2:any = []
    let rando3:any = []
    
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
                idClassificacao: {
                    [Op.eq]: 3
                }
            }
        })
        totalCtesErrados = await CteClassificado.findAll({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idClassificacao: {
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
                idClassificacao: {
                    [Op.eq]: 3
                },
                cd_agencia: {
                    [Op.eq]: unidade
                }
            }
        })
        totalCtesErrados = await CteClassificado.findAll({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idClassificacao: {
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
                idClassificacao: {
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
                    idClassificacao: {
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
        totalCtesErrados = await CteClassificado.findAll({
            where: {
                dt_emissao: {
                    [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                },
                idClassificacao: {
                    [Op.eq]: 3
                }
            }
        })
        
    }

    
   

    let agencia = await TabelaAgencia.findAll({})    


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
    
    res.render('pages/home', {
        agencia,
        totalEmissao,
        deEmissao,
        ateEmissao,
        totalEmissaoErrado,
        totalCtesErrados,
        total,
        verificador,
        menu: creatMenuObject('home')
    })
}