import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Where } from 'sequelize/types/utils';
import { creatMenuObject } from '../helpers/createMenuObsect';




import { TabelaCidade, TabelaCf, TabelaCte, TabelaRota, TabelaAgencia } from '../models/Atua';
import { Usuario, Rota, Classificador, CteClassificado } from '../models/Pedagio';


export const classificador = async (req: Request, res: Response)=>{

    res.render('pages/classificacte', {
        menu: creatMenuObject('classificador')
    });
}


export const listagem = async(req: Request, res: Response)=>{
    
    let {deEmissao, ateEmissao} = req.body   

    if(deEmissao == undefined && ateEmissao == undefined){
        let dados = req.query; 
        deEmissao = dados.deEmissao
        ateEmissao = dados.ateEmissao
        
    }

    //Pega o numero dos ctes ja classificados no sistema
    let resultCteBDPed = await CteClassificado.findAll({
        attributes: ['cd_ctrc'],
        where: {
            idclassificacao:{
                [Op.ne]: null
            }
        }
    })
    let nrCte = []
    for(let i = 0; i< resultCteBDPed.length; i++){
        nrCte.push(resultCteBDPed[i].cd_ctrc)
    }

    //Pega o ID das rotas ja cadastradas no Banco
    let resultRotaPed = await Rota.findAll({
        attributes: ['cd_rota']
    })
    let nrRota = []
    for(let i = 0; i < resultRotaPed.length; i++){
        nrRota.push(resultRotaPed[i].cd_rota)
    }
    
    //Pega os dados dos Ctes ainda nao classificados no Banco
    let dadosCf = await TabelaCf.findAll({
        where: {
            dt_emissao: {
                [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
            },
            id_pedagio: {
                [Op.notIn]: [-1,2]
            },
            cd_ctrc: {
                [Op.notIn]: nrCte
            },
            cd_rota: {
                [Op.notIn]: nrRota
            }            
        },
        include: [
        {
            model: TabelaCte,
            foreignKey: 'cd_ctrc',
            include: [
                {
                    model: TabelaAgencia,
                    foreignKey: 'cd_agencia',
                    as: 'TabelaAgencia'
                },
                {
                    model: TabelaCidade,
                    foreignKey: 'cd_cidade_origem',
                    as: 'TabelaCidadeOrigem'
                },
                {
                    model: TabelaCidade,
                    foreignKey: 'cd_cidade_destino',
                    as: 'TabelaCidadeDestino'
                }
            ]
        },
        {
            model: TabelaRota,
            foreignKey: 'cd_rota',
            as: 'TabelaRota'
        }]        
    })

    

    //Pega os Ctes que ainda não foram classificados, porem o ID Rota ja tenha cadastro
    let dadosCfAutomatico = await TabelaCf.findAll({
        where: {
            dt_emissao: {
                [Op.between]: [new Date(deEmissao), new Date(ateEmissao)]
            },
            id_pedagio: {
                [Op.notIn]: [-1,2]
            },
            cd_ctrc: {
                [Op.notIn]: nrCte
            },
            cd_rota: {
                [Op.in]: nrRota
            }
        },
        include: [
        {
            model: TabelaCte,
            foreignKey: 'cd_ctrc'
        },
        {
            model: TabelaRota,
            foreignKey: 'cd_rota',
            as: 'TabelaRota'
        },]       
    })   
    
    salvaCteAutomatico(dadosCfAutomatico)

    res.render('pages/classificacte', {
        dadosCf,
        deEmissao,
        ateEmissao,
        menu: creatMenuObject('classificador')
      })  
}

export const cteCorreto = async (req: Request, res: Response) => {
    let idCte = req.params.id
    let deEmissao = req.params.deEmissao
    let ateEmissao = req.params.ateEmissao

    let result = await TabelaCf.findAll({
        where: {
            cd_ctrc: {
                [Op.eq]: idCte
            }
        },
        include: [
        {
            model: TabelaCte,
            foreignKey: 'cd_ctrc'
        },
        {
            model: TabelaRota,
            foreignKey: 'cd_rota',
            as: 'TabelaRota'
        },]
    })

    let resultCteClassificado = await CteClassificado.findAll({
        where: {
            cd_ctrc: {
                [Op.eq]: idCte
            }
        }
    })

    if(result.length > 0){
        let dados = result[0]

        let rotaPed = await Rota.findAll({
            where: {
                cd_rota: {
                    [Op.eq]: dados.TabelaRota.cd_rota
                }
            }
        })
        let resultRotaPed = rotaPed[0];

        if(rotaPed.length == 0){
            const newRota = Rota.build({
                nmrota: dados.TabelaRota.nm_rota,
                tprota: 0,
                cd_rota: dados.TabelaRota.cd_rota
            })
            await newRota.save()
            const newRotaId = newRota.get('idrota');

            if(resultCteClassificado.length>0){

                let dadosClassificado = resultCteClassificado[0]

                dadosClassificado.idrota = newRotaId
                dadosClassificado.idclassificacao = 1
                dadosClassificado.dtcadastro = new Date()
                dadosClassificado.cd_ctrc = dados.TabelaCte.cd_ctrc
                dadosClassificado.dt_emissao = dados.dt_emissao
                dadosClassificado.cd_agencia = dados.TabelaCte.cd_agencia
                dadosClassificado.cd_pessoa_usuario_cancelamento = dados.TabelaCte.cd_pessoa_usuario_cancelamento
                dadosClassificado.nr_ctrc = dados.TabelaCte.nr_ctrc
                dadosClassificado.id_pedagio_cf = dados.id_pedagio

                dadosClassificado.save()
            }
            else{
                const newCteClassificado = CteClassificado.build({
                    idrota: newRotaId,
                    idclassificacao: 1,
                    dtcadastro: new Date(),
                    cd_ctrc: dados.TabelaCte.cd_ctrc,
                    dt_emissao: dados.dt_emissao,
                    cd_agencia: dados.TabelaCte.cd_agencia,
                    cd_pessoa_usuario_cancelamento: dados.TabelaCte.cd_pessoa_usuario_cancelamento,
                    nr_ctrc: dados.TabelaCte.nr_ctrc,
                    id_pedagio_cf: dados.id_pedagio
                })
                await newCteClassificado.save() 
            }
                       
        }
        /* else{ //ACREDITO Q NUNCA ENTRE NO SENAO AQUI, POR QUE SE TIVER ROTA CADASTRADA, VAI IR PARA CLASSIFICAÇÃO AUTOMATICA
            const newCteClassificado = CteClassificado.build({
                idRota: resultRotaPed.idRota,
                idClassificacao: 1,
                dtCadastro: new Date(),
                cd_ctrc: dados.TabelaCte.cd_ctrc,
                dt_emissao: dados.dt_emissao,
                cd_agencia: dados.TabelaCte.cd_agencia,
                cd_pessoa_usuario_cancelamento: dados.TabelaCte.cd_pessoa_usuario_cancelamento,
                nr_ctrc: dados.TabelaCte.nr_ctrc,
                id_pedagio_cf: dados.id_pedagio
            })
            await newCteClassificado.save()
        } */

        res.redirect(`/listagem?deEmissao=${deEmissao}&ateEmissao=${ateEmissao}`);
    }
}

export const cteErrado =async (req: Request, res: Response) => {
    let idCte = req.params.id
    let deEmissao = req.params.deEmissao
    let ateEmissao = req.params.ateEmissao

    let result = await TabelaCf.findAll({
        where: {
            cd_ctrc: {
                [Op.eq]: idCte
            }
        },
        include: [
        {
            model: TabelaCte,
            foreignKey: 'cd_ctrc'
        },
        {
            model: TabelaRota,
            foreignKey: 'cd_rota',
            as: 'TabelaRota'
        },]
    })

    let resultCteClassificado = await CteClassificado.findAll({
        where: {
            cd_ctrc: {
                [Op.eq]: idCte
            }
        }
    })

    if(result.length > 0){
        let dados = result[0]

        if(resultCteClassificado.length>0){
            let dadosClassificado = resultCteClassificado[0]

            dadosClassificado.idclassificacao = 3
            dadosClassificado.dtcadastro = new Date()
            dadosClassificado.cd_ctrc = dados.TabelaCte.cd_ctrc
            dadosClassificado.dt_emissao = dados.dt_emissao
            dadosClassificado.cd_agencia = dados.TabelaCte.cd_agencia
            dadosClassificado.cd_pessoa_usuario_cancelamento = dados.TabelaCte.cd_pessoa_usuario_cancelamento
            dadosClassificado.nr_ctrc = dados.TabelaCte.nr_ctrc
            dadosClassificado.id_pedagio_cf = dados.id_pedagio

            dadosClassificado.save()
        }
        else{
            const newCteClassificado = CteClassificado.build({
                idclassificacao: 3,
                dtcadastro: new Date(),
                cd_ctrc: dados.TabelaCte.cd_ctrc,
                dt_emissao: dados.dt_emissao,
                cd_agencia: dados.TabelaCte.cd_agencia,
                cd_pessoa_usuario_cancelamento: dados.TabelaCte.cd_pessoa_usuario_cancelamento,
                nr_ctrc: dados.TabelaCte.nr_ctrc,
                id_pedagio_cf: dados.id_pedagio
            })
            await newCteClassificado.save()
        }
        
    }

    res.redirect(`/listagem?deEmissao=${deEmissao}&ateEmissao=${ateEmissao}`);
}

export const cteCorretoSemRota = async (req: Request, res: Response) => {
    let idCte = req.params.id
    let deEmissao = req.params.deEmissao
    let ateEmissao = req.params.ateEmissao

    let result = await TabelaCf.findAll({
        where: {
            cd_ctrc: {
                [Op.eq]: idCte
            }
        },
        include: [
        {
            model: TabelaCte,
            foreignKey: 'cd_ctrc'
        },
        {
            model: TabelaRota,
            foreignKey: 'cd_rota',
            as: 'TabelaRota'
        },]
    })

    let resultCteClassificado = await CteClassificado.findAll({
        where: {
            cd_ctrc: {
                [Op.eq]: idCte
            }
        }
    })

    if(result.length > 0){
        let dados = result[0]

        if(resultCteClassificado.length>0){
            let dadosClassificado = resultCteClassificado[0]

            dadosClassificado.idclassificacao = 2
            dadosClassificado.dtcadastro = new Date()
            dadosClassificado.cd_ctrc = dados.TabelaCte.cd_ctrc
            dadosClassificado.dt_emissao = dados.dt_emissao
            dadosClassificado.cd_agencia = dados.TabelaCte.cd_agencia
            dadosClassificado.cd_pessoa_usuario_cancelamento = dados.TabelaCte.cd_pessoa_usuario_cancelamento
            dadosClassificado.nr_ctrc = dados.TabelaCte.nr_ctrc
            dadosClassificado.id_pedagio_cf = dados.id_pedagio

            dadosClassificado.save()
        }
        else{
            const newCteClassificado = CteClassificado.build({
                idclassificacao: 2,
                dtcadastro: new Date(),
                cd_ctrc: dados.TabelaCte.cd_ctrc,
                dt_emissao: dados.dt_emissao,
                cd_agencia: dados.TabelaCte.cd_agencia,
                cd_pessoa_usuario_cancelamento: dados.TabelaCte.cd_pessoa_usuario_cancelamento,
                nr_ctrc: dados.TabelaCte.nr_ctrc,
                id_pedagio_cf: dados.id_pedagio
            })
            await newCteClassificado.save()
        }
        
    }

    res.redirect(`/listagem?deEmissao=${deEmissao}&ateEmissao=${ateEmissao}`);
}

export const salvaObs = async (req: Request, res: Response) => {
    let {obs, idCte} = req.params

    const result = await CteClassificado.findAll({
        where: {
            cd_ctrc: {
                [Op.eq]: idCte
            }                
        }
    })

    if(result.length > 0){
        let dados = result[0]
        dados.descobs= obs;
        dados.cd_ctrc = parseInt(idCte)
        await dados.save()
    }
    else{
        const newObservacao = CteClassificado.build({
            descobs: obs,
            cd_ctrc: idCte
        })
        await newObservacao.save()
    }  
}


async function salvaCteAutomatico(dadosCfAutomatico:any){
    let idRotaPed=[]
    
    for(let j = 0; j<dadosCfAutomatico.length; j++){
        let result = await Rota.findAll({
            where:{
                cd_rota: {
                    [Op.eq]: dadosCfAutomatico[j].cd_rota
                }
            }
        })
        idRotaPed.push(result[0].idrota)
    }

    for(let i = 0; i<dadosCfAutomatico.length; i++){
        const newCteClassificado = CteClassificado.build({
            idrota: idRotaPed[i],
            idclassificacao: 1,
            dtcadastro: new Date(),
            descobs: 'Classificado Automaticamente',
            cd_ctrc: dadosCfAutomatico[i].TabelaCte.cd_ctrc,
            dt_emissao: dadosCfAutomatico[i].dt_emissao,
            cd_agencia: dadosCfAutomatico[i].TabelaCte.cd_agencia,
            cd_pessoa_usuario_cancelamento: dadosCfAutomatico[i].TabelaCte.cd_pessoa_usuario_cancelamento,
            nr_ctrc: dadosCfAutomatico[i].TabelaCte.nr_ctrc,
            id_pedagio_cf: dadosCfAutomatico[i].id_pedagio
        })
        await newCteClassificado.save()
    }
}