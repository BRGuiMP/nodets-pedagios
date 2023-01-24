import { Request, Response } from 'express'
import { Op, Sequelize } from 'sequelize'



import { TabelaAgencia, TabelaCf, TabelaCte, TabelaRota } from '../models/Atua'
import { Usuario, Rota, Classificador, CteClassificado, CteClassificadoInstancePed } from '../models/Pedagio'




export const home = async (req: Request, res: Response)=>{
    let agencia = await TabelaAgencia.findAll({})


    res.render('pages/home', {
        agencia
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
    
    if(dashboardSelecionado=='dashboardGeral'){
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
                }
            }
        })

        for(let i = 0; i< agenciaTotal.length; i++){
            agenciaFila.push(agenciaTotal[i].cd_agencia)
        }
        for(let j = 0; j<agenciaTotal.length; j++){
            let result = await TabelaCte.count({
                where: {
                    dt_emissao: {
                        [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
                    },
                    cd_pessoa_usuario_cancelamento:{
                        [Op.is]: null
                    },
                    cd_agencia: {
                        [Op.eq]: agenciaFila[j]
                    }
                }
            })
            agenciaCount.push(result)
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
        }
        
    }

    
   

    let agencia = await TabelaAgencia.findAll({})    


    const total = agenciaFila.map((fila, index) => {
        return {
          cd_agencia: fila,
          nm_agencia: agenciaNm[index],
          count: agenciaCount[index]
        }
    })


    /* {{#total}}
                {
                    label: "{{nm_agencia}}",
                    data: [{{count}}],
                    backgroundColor: "rgba(255, 0, 0, .7)"
                },
                {{/total}} */

    res.render('pages/home', {
        agencia,
        totalEmissao,
        deEmissao,
        ateEmissao,
        totalEmissaoErrado,
        totalCtesErrados,
        total
    })
}