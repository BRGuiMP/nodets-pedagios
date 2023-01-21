import { Request, Response } from 'express';
import { Op } from 'sequelize';



import { TabelaCf, TabelaCte, TabelaRota } from '../models/Atua';


// OPERADORES DO OP
//[Op.gt]: 40, // > 40
//[Op.gte]: 40, // >= 40
//[Op.lt]: 40, // < 40
//[Op.lte]: 40, // <= 40
// GT = Greather Than
// E = Equal 
// LT = Lower Than
//[Op.between]: [40,70] // >= 40 E <= 70
//[Op.in]: [30,55] // 30 OU 55
//[Op.like]: '%a%'  //Ele procura no banco um nome que contenha o caracter 'a'
//[Op.like]: 'Pa%'  //Ele procura no banco um nome que comece com 'Pa'

/*  EXEMPLO DE CODIGO PARA PROCURA E USO COM OS OPERADORES ACIMA
export const home = async (req: Request, res: Response)=>{
    let users = await User.findAll({
        where:{
            name:{
                [Op.like]: '%a%'
            }
        }
    })
*/

/*
order: [
    ['name', 'DESC']   //LISTA COMO DESCRESCENTE
]

order: [
    ['name', 'ASC']    //LISTA COMO ACRESCENTE
]     
*/
// offset: 4,   //PULA OS ITENS -USADO JUNTO AO LIMIT PARA FAZER PAGINAÇÃO-
// limit: 2     //LIMITA A CONSULTA


export const home = async (req: Request, res: Response)=>{
    
    // CRIANDO NOVOS USUARIOS 
    // build + save    //Usado para quando quer manipular algum dado antes de salvar no banco, salva no banco apenas quando executa await user.save()
    /*const user = User.build({
        name: 'Fulaninho'
    })
    let idade = 50
    user.age = idade
    await user.save()
*/

    //create    //Cria o usuario direto no banco quando executado
    /*
    const user = await User.create({
        name: 'Ciclano',
        age: 39
    })
    */
   

    // FAZENDO UPDATE NOS USUARIOS JA CRIADOS
    /*  //Uma das formas de fazer update de dados, porem essa pode ser usada para fazer update em massa
    await User.update({name:'Ze Carioca', age: 99}, {
        where: {
            id: 4
        }
    })

    // 1. Dados a serem alterados
    // 2. Condição para encontrar o(s) item(ns)
    */
    /*  // Segundo modo de fazer update
    let results = await User.findAll({
        where:{
            id: 5
        }
    })
    if(results.length > 0){
        let usuario = results[0]

        usuario.name = 'Testando 123'
        usuario.age = 20

        await usuario.save()
    }
    */

    /*
    // DELETANDO OS USUARIOS DO BANCO
    // Primeiro forma de deletar um ou mais usuarios
    await User.destroy({
        where: {
            id: {
                [Op.gte]: 9
            }
        }
    })
    */
    /*
    // Segunda forma de deletar um usuario
    let results = await User.findAll({
        where:{
            id: 8
        }
    })
    if(results.length > 0){
        let usuario = results[0]
        await usuario.destroy()
    }
    */

    /* let users = await User.findAll({
        order: [['iduser', 'ASC']],
        include: [{
            model: Permission,
        }]})    // Pega todos os usuarios do banco
    
    let permissions = await Permission.findAll({order: [['idpermission', 'ASC']]}) */

    
    /*
    // PEGUEI TODOS OS DADOS DO SISTEMA, PERCORRI O ARRAY ASSOCIANDO OS DADOS DE CADA USUARIO A TROCADOR, E ALTERANDO O NOME PARA FICAR TODO MAIUSCULO NO BANCO
    for(let i in users){
        let trocador = users[i]
        trocador.name = trocador.name.toUpperCase()
        await trocador.save()
    }
    */

    // FORMAS DE ACHAR UM USUARIO NO BANCO
    // Utilizando o findAll(), conforme utilizado acima
    // Utilizando findOne()
    /*let usuario = await User.findOne({
        where: {
            id: 1
        }
    })
    if(usuario){
        console.log(`O usuario ${usuario.name} possui ${usuario.age} anos`)
    }
    else{
        console.log("Usuario não encontrado")
    }*/
    // Utilizando findByPk() -- Procura um usuario pelo ID
    /*let usuario = await User.findByPk(1)
    if(usuario){
        console.log(`O usuario ${usuario.name} possui ${usuario.age} anos`)
    }
    else{
        console.log("Usuario não encontrado")
    }*/
    // Procura um usuario, caso não ache, cria ele
    /*let [ usuario, created] = await User.findOrCreate({
        where: {name: 'BONIEKY'},
        defaults: {
            age: 80
        }
    })
    if(created){
        console.log("Usuario criado com sucesso")
    }
    else{
        console.log("Achamos o usuario")
    }
    console.log("Nome: ", usuario.name)
    */

    




    
    



    res.render('pages/home', {
        
    });
};


/* export const criandoUsuario = async (req: Request, res: Response) => {
       
    let { name, age, permission} = req.body;
    
    name = name.toUpperCase()

    if(name) {
        const newUser = User.build({ name });

        if(age) {
            newUser.age = parseInt(age);
        }

        if(permission){
            newUser.idpermission = parseInt(permission);
        }

        await newUser.save();
    }
    res.redirect('/')
} */


/* export const criandoCargo = async (req: Request, res: Response) => {
       
    let { name, descpermission, cargo } = req.body;
    
    name = name.toUpperCase()

    if(name) {
        const newPermission = Permission.build({ name, descpermission, cargo });

        

        await newPermission.save();
    }
    res.redirect('/')
} */


/* export let adiciona = async(req: Request, res: Response) => {
    let iduser = req.params.id

    let results = await User.findAll({where: {iduser}})
    if(results.length > 0){
        let usuario = results[0]
        usuario.age++
        await usuario.save()
    }

    res.redirect('/')
} */

/* export let subtrai = async(req: Request, res: Response) => {
    let iduser = req.params.id

    let results = await User.findAll({where: {iduser}})
    if(results.length > 0){
        let usuario = results[0]
        usuario.age--
        await usuario.save()
    }

    res.redirect('/')
} */


/* export let exclui = async(req: Request, res: Response) => {
    let iduser = req.params.id

    await User.destroy({where:{iduser}})

    res.redirect('/')
} */