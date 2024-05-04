const { wrap } = require("../../utils/response");

module.exports = {
    find: async (req, res, next) => {
        let model = req.Model;
        try {
            if (model.st_find) {
                let data = await model.st_find(req);
                res.send(data);
            }
            else {
                let response;
                let { page, pageSize } = req.query;
                let { id } = req.params;
                if (page && pageSize) {
                    let skip = (page - 1) * pageSize;
                    let limit = pageSize;
                    let total = await model.countDocuments();
                    let data = await model.find().skip(skip).limit(limit);
                    response = wrap(200, undefined, { data, total });
                } else if (id) {
                    let data = await model.findById(id);
                    response = wrap(200, undefined, { data });
                } else {
                    let data = await model.find();
                    let total = await model.countDocuments();
                    response = wrap(200, undefined, { data, total });
                }
                res.send(response);
            }
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        let model = req.Model;
        try {
            if (model.st_update) {
                let params = req.body;
                let data = await model.st_update(params);
                res.send(data);
            }
            else {
                let id = req.params.id;
                let content = req.body;
                let data = await model.findByIdAndUpdate(id, content);
                if (data) {
                    res.send(wrap(200, undefined, { data }));
                }
            }
        } catch (error) {
            next(error);
        }
    },
    add: async (req, res, next) => {
        let model = req.Model;
        try {
            if (model.st_add) {
                let params = req.body;
                let data = await model.st_add(params);
                res.send(data);
            }
            else {
                let data = await model.create(req.body);
                if (data) {
                    res.send(wrap(200, undefined, { data }));
                }
            }
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        let model = req.Model;
        try {
            if (model.st_delete) {
                let params = req.params;
                let data = await model.st_delete(params);
                res.send(data);
            }
            else {
                let id = req.params.id;
                let data = await model.findByIdAndRemove(id);
                if (data) {
                    res.send(wrap(200, undefined, { data }));
                }
            }
        } catch (error) {
            next(error);
        }
    }
}