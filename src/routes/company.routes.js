import {Router, request} from 'express'
const router = Router()

router.get('/company', (request, response) => {
    response.render('general/company')
});

export default router