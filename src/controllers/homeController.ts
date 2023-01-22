import { Request, Response } from 'express'
import { Op } from 'sequelize'



import { TabelaAgencia, TabelaCf, TabelaCte, TabelaRota } from '../models/Atua'
import { Usuario, Rota, Classificador, CteClassificado } from '../models/Pedagio'




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

    }

    let agencia = await TabelaAgencia.findAll({})

    
    res.render('pages/home', {
        agencia,
        totalEmissao,
        deEmissao,
        ateEmissao,
        totalEmissaoErrado
    })
}