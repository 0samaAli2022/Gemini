import { errorHandler, notFound } from "../middleware/errorHandler.js";

export default (app) => {
    app.use('*', notFound)
    app.use(errorHandler)
}