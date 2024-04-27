module.exports = {
    find: async (req, res, next) => {
        let model = req.Model;
        try {
            if (model.st_find) {
                let params = req.query;
                let data = await model.st_find(params);
                res.send(data);
            } 
            else {
                let { page, pageSize, id } = req.query;
                if (page && pageSize) {
                    let skip = (page - 1) * pageSize;
                    let limit = pageSize;
                    let data = await model.find().skip(skip).limit(limit);
                    res.send({ data, count: data.length });
                } else if (id) {
                    let data = await model.findById(id);
                    res.send(data);
                } else {
                    let data = await model.find();            
                    res.send(data);
                }
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
                res.send(data);
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
                res.send(data);
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
                res.send(data);
            }
        } catch (error) {
            next(error);
        }
    }
}