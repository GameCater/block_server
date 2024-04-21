module.exports = {
    find: async (req, res) => {
        let model = req.Model;
        if (model && model.st_find) {
            let params = req.query;
            let data = await model.st_find(params);
            res.send(data);
        } else if (model) {
            let { page, pageSize, id } = req.query;
            if (page && pageSize) {
                let skip = (page - 1) * pageSize;
                let limit = pageSize;
                let data = await model.find().skip(skip).limit(limit);
                res.send(data);
            } else if (id) {
                let data = await model.findById(id);
                res.send(data);
            } else {
                let data = await model.find();            
                res.send(data);
            }
        } else {
            console.log("list request: unkown model");
        }
    },
    update: async (req, res) => {
        let model = req.Model;
        if (model && model.st_update) {
            let params = req.body;
            let data = await model.st_update(params);
            res.send(data);
        } else if (model) {
            let id = req.params.id;
            let content = req.body;
            if (id) {
                let data = await model.findByIdAndUpdate(id, content);
                res.send(data);
            } else {
                console.log("update request: invaild id");
            }
        } else {
            console.log("update request: unkown model");
        }
    },
    add: async (req, res) => {
        let model = req.Model;
        if (model && model.st_add) {
            let params = req.body;
            let data = await model.st_add(params);
            res.send(data);
        } else if (model) {
            let data = await model.create(req.body);
            res.send(data);
        } else {
            console.log("add request: unkown model");
        }
    },
    delete: async (req, res) => {
        let model = req.Model;
        if (model && model.st_delete) {
            let params = req.params;
            let data = await model.st_delete(params);
            res.send(data);
        } else if (model) {
            let id = req.params.id;
            if (id) {
                let data = await model.findByIdAndRemove(id);
                res.send(data);
            } else {
                console.log("delete request: invaild id");
            }
        } else {
            console.log("delete request: unkown model");
        }
    }
}