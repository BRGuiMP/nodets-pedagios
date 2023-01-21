import { Request, Response } from 'express';
import { Op } from 'sequelize';




import { TabelaCf, TabelaCte, TabelaRota } from '../models/Atua';
import { Usuario, Rota, Classificador, CteClassificado } from '../models/Pedagio';


export const classificador = async (req: Request, res: Response)=>{

    res.render('pages/classificacte', {
        
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
        attributes: ['cd_ctrc']
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
            foreignKey: 'cd_ctrc'
        },
        {
            model: TabelaRota,
            foreignKey: 'cd_rota',
            as: 'TabelaRota'
        },]
        
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
        ateEmissao
      })
    
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
        idRotaPed.push(result[0].idRota)
    }

    for(let i = 0; i<dadosCfAutomatico.length; i++){
        const newCteClassificado = CteClassificado.build({
            idRota: idRotaPed[i],
            idClassificacao: 1,
            dtCadastro: new Date(),
            descObs: 'Classificado Automaticamente',
            cd_ctrc: dadosCfAutomatico[i].TabelaCte.cd_ctrc,
            cd_agencia: dadosCfAutomatico[i].TabelaCte.cd_agencia,
            cd_pessoa_usuario_cancelamento: dadosCfAutomatico[i].TabelaCte.cd_pessoa_usuario_cancelamento,
            nr_ctrc: dadosCfAutomatico[i].TabelaCte.nr_ctrc,
            id_pedagio_cf: dadosCfAutomatico[i].id_pedagio
        })
        await newCteClassificado.save()
    } 

}



export let ctecorreto = async (req: Request, res: Response) => {
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
                nmRota: dados.TabelaRota.nm_rota,
                tpRota: 0,
                cd_rota: dados.TabelaRota.cd_rota
            })
            await newRota.save()
            const newRotaId = newRota.get('idRota');

            const newCteClassificado = CteClassificado.build({
                idRota: newRotaId,
                idClassificacao: 1,
                dtCadastro: new Date(),
                cd_ctrc: dados.TabelaCte.cd_ctrc,
                cd_agencia: dados.TabelaCte.cd_agencia,
                cd_pessoa_usuario_cancelamento: dados.TabelaCte.cd_pessoa_usuario_cancelamento,
                nr_ctrc: dados.TabelaCte.nr_ctrc,
                id_pedagio_cf: dados.id_pedagio
            })
            await newCteClassificado.save()
            
        }
        else{
            const newCteClassificado = CteClassificado.build({
                idRota: resultRotaPed.idRota,
                idClassificacao: 1,
                dtCadastro: new Date(),
                cd_ctrc: dados.TabelaCte.cd_ctrc,
                cd_agencia: dados.TabelaCte.cd_agencia,
                cd_pessoa_usuario_cancelamento: dados.TabelaCte.cd_pessoa_usuario_cancelamento,
                nr_ctrc: dados.TabelaCte.nr_ctrc,
                id_pedagio_cf: dados.id_pedagio
            })
            await newCteClassificado.save()
        }

        res.redirect(`/listagem?deEmissao=${deEmissao}&ateEmissao=${ateEmissao}`);
    }
}