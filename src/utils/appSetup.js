import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'

export default (app) => {
    app.use(morgan('dev'))
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(compression())
    app.use(express.json())
    app.use(cors())
    
}