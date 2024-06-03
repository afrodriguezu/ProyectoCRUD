import {Router} from 'express'
import pool from '../database.js'
import multer from 'multer'
import path from 'path'

const router = Router();

const storage = multer.diskStorage({
    destination: 'src/public/uploads/',
    filename: (req, file, cb) => {                
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({storage})

router.get('/add', (req, res) => {
    res.render('productos/add')
});

router.post('/add', upload.single('file'), async(req, res) => {
    try {
        const {nombre, descripcion, precio, cantidad, talla} = req.body
        let newProduct = {}
        if(req.file){
            const file = req.file
            const imagen_original = file.originalname
            const imagen = file.filename
            newProduct = {nombre, descripcion, precio, cantidad, talla, imagen}
        }else{
            newProduct = {nombre, descripcion, precio, cantidad, talla}
        }
        await pool.query('INSERT INTO productos SET ?', [newProduct]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/list', async(req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM productos');
        res.render('productos/list', {productos: result})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/delete/:id', async(req, res) => {
    try {
        const {id} = req.params
        await pool.query('DELETE FROM productos WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/edit/:id', async(req, res) => {
    try {
        const {id} = req.params
        const [producto] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
        const productoEdit = producto[0]
        res.render('productos/edit', { producto: productoEdit})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/edit/:id', upload.single('file'), async(req, res) => {
    try {
        const {id} = req.params
        const {nombre, descripcion, precio, cantidad, talla} = req.body
        let editProducto = {}
        if(req.file){
            const file = req.file
            const imagen_original = file.originalname
            const imagen = file.filename
            editProducto = {nombre, descripcion, precio, cantidad, talla, imagen}
        }else{
            editProducto = {nombre, descripcion, precio, cantidad, talla}
        }
        await pool.query('UPDATE productos SET ? WHERE id = ?', [editProducto, id]);
        res.redirect('/list');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;