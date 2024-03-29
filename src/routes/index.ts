import { Router } from 'express'

import * as HomeController from '../controllers/homeController'
import * as ClassificaController from '../controllers/classificaController'
import * as SignupController from '../controllers/signupController';

const router = Router()

router.get('/signup', SignupController.cadastro)
router.post('/signup', SignupController.newCadastro)

router.get('/', HomeController.home)
router.post('/', HomeController.listagem)


router.get('/classificacte', ClassificaController.classificador)

router.get('/listagem', ClassificaController.listagem)
router.post('/listagem', ClassificaController.listagem)


router.post('/cte-correto/:id/:deEmissao/:ateEmissao/add', ClassificaController.cteCorreto)
router.post('/cte-errado/:id/:deEmissao/:ateEmissao/add', ClassificaController.cteErrado)
router.post('/cte-correto-sem-rota/:id/:deEmissao/:ateEmissao/add', ClassificaController.cteCorretoSemRota)

router.get('/salvaobs/:obs/:idCte', ClassificaController.salvaObs)

export default router