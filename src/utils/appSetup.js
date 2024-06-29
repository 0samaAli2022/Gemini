import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'

export default (app) => {
    app.use(morgan('dev'))
    app.use(compression())
    app.use(express.json())
    app.use(cors())
    
}